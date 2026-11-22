import pb from '@/lib/pocketbase/client'
import { refreshCatalog } from '@/lib/admin/service'
import { THUMB_SIZE } from '@/lib/shop/thumbnails'
import { getErrorMessage } from '@/lib/pocketbase/errors'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useCallback, useRef, useState } from 'react'
import { useLocale } from '@/i18n/LocaleContext'
import { shopT } from '@/i18n/shopStrings'
import { GripVertical, Plus, Star, Trash2 } from 'lucide-react'

export const MAX_GALLERY_FILES = 10

/**
 * Tamanho de miniatura usado nas URIs de arquivo gravadas (galeria do admin
 * e cards da loja). O valor tem de existir na lista `thumbs` do campo de
 * arquivo `galleryFiles`/`imageFile` da coleção `products` (migração 0009) —
 * sem isso o PocketBase ignora o parâmetro.
 */
export const GALLERY_THUMB_SIZE = THUMB_SIZE

/** Uma entrada da galeria do formulário: foto nova (upload) ou já gravada. */
export type GalleryEntry =
  | { kind: 'file'; id: string; file: File; previewUrl: string }
  | { kind: 'remote'; id: string; url: string; fileName?: string }

/**
 * Estado da galeria repassado ao pai a cada mudança (para montar o payload
 * de salvamento).
 */
export type GalleryState = {
  /** Novos arquivos a enviar, na ordem em que aparecem na galeria. */
  files: File[]
  /** Nomes dos arquivos já gravados que continuam na galeria. */
  keptNames: string[]
  /**
   * Sequência completa a gravar no campo `images` (json): para cada slot da
   * galeria, `file:<nome>` quando é arquivo (novo ou já gravado) — o marcador
   * ancora cada arquivo em uma posição exata da sequência — ou a URL
   * externa como está. A PRIMEIRA posição é a capa do produto.
   */
  markers: string[]
}

/**
 * URL de um arquivo já gravado em `galleryFiles` (coleção products).
 * Exige o id REAL do registro: `/api/files/<coleção>/<id-do-produto>/<arquivo>`.
 * Com `thumb`, pede a miniatura do PocketBase (ex.: `300x300`) — o campo de
 * arquivo precisa ter o tamanho em Thumbs (migração 0009); para formatos sem
 * suporte o PocketBase cai no original automaticamente.
 */
export function galleryFileUrl(recordId: string, fileName: string, thumb?: string): string {
  return pb.files.getURL(
    { id: recordId, collectionId: 'products' } as unknown as Parameters<typeof pb.files.getURL>[0],
    fileName,
    thumb ? { thumb } : undefined,
  )
}

/**
 * Envia os arquivos novos do formulário para o campo `galleryFiles`.
 *
 * PocketBase substitui o campo inteiro quando um multipart traz
 * "galleryFiles", e "galleryFiles-" apaga arquivos pelo nome — por isso a
 * rotina remove TODOS os arquivos gravados e reenvia a lista completa
 * (os mantidos + os novos) na ordem definida no formulário. Retorna os
 * nomes finais (com o sufixo aleatório do PB).
 */
export async function saveProductGallery(
  productId: string,
  existingNames: string[],
  newFiles: File[],
): Promise<string[]> {
  if (existingNames.length > 0) {
    await pb.collection('products').update(productId, { 'galleryFiles-': existingNames })
  }
  if (newFiles.length > 0) {
    const form = new FormData()
    for (const f of newFiles) {
      form.append('galleryFiles', f, f.name)
    }
    await pb.collection('products').update(productId, form)
  }
  const rec = await pb.collection('products').getOne(productId)
  return ((rec as unknown as { galleryFiles?: string[] }).galleryFiles ?? []).filter(Boolean)
}

/**
 * Salva a galeria completa do produto: arquivos na sequência escolhida +
 * marcadores `file:`/URLs no campo `images` (mesma ordem — a primeira é a
 * capa) + refresh do catálogo da loja.
 */
export async function saveGalleryState(productId: string, state: GalleryState): Promise<void> {
  try {
    await saveProductGallery(productId, state.keptNames, state.files)
    await pb.collection('products').update(productId, { images: state.markers })
    await refreshCatalog()
  } catch (err) {
    throw new Error(getErrorMessage(err))
  }
}

/** Caminho relativo do CDN quando a URL vem sem domínio (só a query). */
function resolveImageUrl(url: string): string {
  if (!url) return url
  if (url.startsWith('http') || url.startsWith('/') || url.startsWith('blob:')) return url
  return `https://img.usecurling.com/p/${url}`
}

/** Nomes dos arquivos já gravados de um produto (campo file multi `galleryFiles`). */
function savedGalleryFiles(product: { galleryFiles?: string | string[] }): string[] {
  const raw = product.galleryFiles
  if (!raw) return []
  const list = Array.isArray(raw) ? raw : [raw]
  return list.filter((n) => typeof n === 'string' && n.length > 0)
}

/**
 * Lê a sequência gravada de volta (edição): as entradas do registro, na
 * ordem exata em que estão em `images` — marcadores `file:<nome>` viram
 * arquivos gravados, itens restantes viram URLs externas. Arquivos salvos
 * que não estão (ainda) referenciados em `images` vão ao fim (produtos
 * legados que só tinham `galleryFiles`/`imageFile`).
 *
 * `thumb`: quando informado (ex.: `300x300`), as URLs de arquivos gravados
 * apontam para a miniatura do PocketBase (a UI só exibe as entradas — o
 * marcador gravado continua usando o NOME do arquivo, não a URL).
 */
export function loadGalleryEntries(
  record: {
    /** Id REAL do registro em edição — necessário para as URLs de arquivo. */
    id?: string
    galleryFiles?: string | string[]
    imageFile?: string
  },
  images: unknown,
  thumb?: string,
): GalleryEntry[] {
  const saved = savedGalleryFiles(record)
  if (record.imageFile && !saved.includes(record.imageFile)) {
    saved.push(record.imageFile)
  }
  // Sem id de registro não há como montar URL de arquivo do PocketBase
  // (só acontece fora da edição, quando não há arquivos gravados).
  const fileUrl = (name: string): string =>
    record.id ? galleryFileUrl(record.id, name, thumb) : ''
  const list = Array.isArray(images) ? (images as unknown[]) : []
  const entries: GalleryEntry[] = []
  const usedFiles = new Set<string>()

  for (const item of list) {
    if (typeof item !== 'string' || item === '') continue
    if (item.startsWith('file:')) {
      const name = item.slice(5)
      if (saved.includes(name) && !usedFiles.has(name)) {
        usedFiles.add(name)
        entries.push({
          kind: 'remote',
          id: `file:${name}`,
          url: fileUrl(name),
          fileName: name,
        })
      }
      continue
    }
    entries.push({ kind: 'remote', id: `url:${item}`, url: resolveImageUrl(item) })
  }

  for (const name of saved) {
    if (!usedFiles.has(name)) {
      entries.push({
        kind: 'remote',
        id: `file:${name}`,
        url: fileUrl(name),
        fileName: name,
      })
    }
  }
  return entries
}

/**
 * Formulário de galeria do produto: até 10 fotos, por upload de arquivo ou
 * URL, com miniaturas, REORDENAÇÃO por arrastar (drag-and-drop HTML5) e
 * remoção individual. A PRIMEIRA foto da sequência é a foto principal
 * (capa do card na vitrine) — marcada com estrela.
 *
 * As miniaturas de arquivos gravados usam a versão 300x300 do PocketBase
 * (não o original, que pode ter vários MB); uploads novos usam blob local.
 */
export function AdminProductGallery({
  product,
  onChange,
  onNotify,
}: {
  /** Produto em edição (carrega as fotos já salvas) — ausente na criação. */
  product?: {
    id?: string
    galleryFiles?: string | string[]
    imageFile?: string
    images?: unknown
  }
  /** Chamado quando a galeria muda, para o pai montar o payload de salvamento. */
  onChange: (value: GalleryState) => void
  /** Notificação de erro/aviso (ex.: limite de 10 fotos). */
  onNotify: (message: string | null) => void
}) {
  const { locale } = useLocale()
  const t = (key: string) => shopT(locale, key)

  const [entries, setEntries] = useState<GalleryEntry[]>(() =>
    product
      ? loadGalleryEntries(
          {
            id: product.id,
            galleryFiles: product.galleryFiles,
            imageFile: product.imageFile,
          },
          product.images,
          GALLERY_THUMB_SIZE,
        )
      : [],
  )
  /** Índice do item sendo arrastado (e da posição sob o cursor). */
  const dragIndex = useRef<number | null>(null)
  const [dragOver, setDragOver] = useState<number | null>(null)

  const commit = useCallback(
    (next: GalleryEntry[]) => {
      setEntries(next)
      onChange({
        files: next.filter((e) => e.kind === 'file').map((e) => (e as { file: File }).file),
        keptNames: next
          .filter((e) => e.kind === 'remote' && 'fileName' in e && e.fileName)
          .map((e) => (e as { fileName: string }).fileName),
        markers: next.map((e) =>
          e.kind === 'file'
            ? `file:${e.file.name}`
            : 'fileName' in e && e.fileName
              ? `file:${e.fileName}`
              : e.url,
        ),
      })
    },
    [onChange],
  )

  /** Reordena: move o item arrastado para a posição do alvo. */
  function reorder(from: number, to: number) {
    if (from === to || from < 0 || to < 0 || from >= entries.length || to >= entries.length) return
    const next = [...entries]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    commit(next)
  }

  function remove(index: number) {
    commit(entries.filter((_, i) => i !== index))
  }

  function addFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const room = MAX_GALLERY_FILES - entries.length
    if (room <= 0) {
      onNotify(t('admin.galleryLimitReached'))
      return
    }
    const accepted = Array.from(files).slice(0, room)
    if (accepted.length < files.length) {
      onNotify(t('admin.galleryLimitReached'))
    }
    const added: GalleryEntry[] = accepted.map((file, i) => ({
      kind: 'file',
      id: `new:${Date.now()}:${i}:${file.name}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }))
    commit([...entries, ...added])
  }

  function addUrl() {
    const input = document.getElementById('prod-gallery-url') as HTMLInputElement | null
    const url = (input?.value ?? '').trim()
    if (!url) return
    if (entries.length >= MAX_GALLERY_FILES) {
      onNotify(t('admin.galleryLimitReached'))
      return
    }
    if (input) input.value = ''
    commit([...entries, { kind: 'remote', id: `url:${Date.now()}:${url}`, url }])
  }

  return (
    <div className="space-y-2">
      <div className="flex items-end gap-2">
        <div className="flex-1 space-y-1">
          <Label htmlFor="prod-gallery-file" className="text-xs text-muted-foreground">
            {t('admin.productGallery')}
          </Label>
          <input
            id="prod-gallery-file"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(e) => {
              addFiles(e.target.files)
              e.target.value = ''
            }}
            className="block w-full text-xs text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-xs file:text-foreground"
          />
        </div>
        <div className="flex items-end gap-2">
          <div className="space-y-1">
            <Label htmlFor="prod-gallery-url" className="text-xs text-muted-foreground">
              {t('admin.galleryAddUrl')}
            </Label>
            <Input
              id="prod-gallery-url"
              type="url"
              placeholder="https://…"
              className="w-48 bg-background"
            />
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addUrl}>
            <Plus className="mr-1 h-3 w-3" />
            {t('admin.galleryAddUrl')}
          </Button>
        </div>
        <p className="pb-1 text-[11px] italic text-muted-foreground/70">{t('admin.galleryHint')}</p>
      </div>

      {entries.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {entries.map((entry, i) => (
            <li
              key={entry.id}
              draggable
              onDragStart={(e) => {
                dragIndex.current = i
                e.dataTransfer.effectAllowed = 'move'
                try {
                  e.dataTransfer.setData('text/plain', String(i))
                } catch {
                  /* alguns navegadores exigem setData; ignorar falha */
                }
              }}
              onDragOver={(e) => {
                e.preventDefault()
                e.dataTransfer.dropEffect = 'move'
                setDragOver(i)
              }}
              onDragLeave={() => setDragOver((cur) => (cur === i ? null : cur))}
              onDrop={(e) => {
                e.preventDefault()
                const from = dragIndex.current
                dragIndex.current = null
                setDragOver(null)
                if (from !== null) reorder(from, i)
              }}
              onDragEnd={() => {
                dragIndex.current = null
                setDragOver(null)
              }}
              className={
                'relative cursor-grab overflow-hidden rounded-md border bg-secondary/30 transition-colors active:cursor-grabbing ' +
                (dragOver === i && dragIndex.current !== null
                  ? 'border-primary ring-1 ring-primary/40'
                  : 'border-border/60')
              }
            >
              <img
                src={entry.kind === 'file' ? entry.previewUrl : entry.url}
                alt={`${t('admin.productGallery')} ${i + 1}`}
                loading="lazy"
                className="aspect-square w-full object-cover"
              />
              {i === 0 && (
                <span className="absolute left-1 top-1 flex items-center gap-1 rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
                  <Star className="h-3 w-3" />
                  {t('admin.galleryMain')}
                </span>
              )}
              <span className="absolute right-1 top-1 rounded-full bg-background/80 px-1.5 text-[10px] text-muted-foreground">
                {i + 1}/{entries.length}
              </span>
              <div className="flex items-center justify-between gap-1 p-1">
                <span
                  className="flex h-7 w-7 items-center justify-center text-muted-foreground"
                  title={t('admin.galleryDragHint')}
                  aria-label={t('admin.galleryDragHint')}
                >
                  <GripVertical className="h-3.5 w-3.5" />
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(i)}
                  aria-label={t('admin.galleryRemove')}
                  title={t('admin.galleryRemove')}
                  className="h-7 w-7 p-0 text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
