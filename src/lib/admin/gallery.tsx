import pb from '@/lib/pocketbase/client'
import { refreshCatalog } from '@/lib/admin/service'
import { getErrorMessage } from '@/lib/pocketbase/errors'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useLocale } from '@/i18n/LocaleContext'
import { shopT } from '@/i18n/shopStrings'
import { ArrowLeft, ArrowRight, Star, X } from 'lucide-react'

const MAX_GALLERY_FILES = 10

/** Uma entrada da galeria do formulário: foto nova (upload) ou já gravada. */
type GalleryEntry =
  | { kind: 'file'; id: string; file: File; previewUrl: string }
  | { kind: 'remote'; id: string; url: string; fileName?: string }

/** Estado da galeria repassado ao pai a cada mudança. */
export type GalleryState = {
  /** Novos arquivos a enviar, na ordem em que aparecem na galeria. */
  files: File[]
  /** Nomes dos arquivos já gravados que continuam na galeria. */
  keptNames: string[]
  /** URLs de imagem gravadas no campo `images`, na ordem escolhida. */
  urls: string[]
}

/**
 * Salva a sequência de fotos no campo `galleryFiles` (migração 0008):
 * remove os arquivos gravados e reenvia tudo na ordem escolhida no
 * formulário. Retorna os nomes finais (com o sufixo aleatório do PB).
 */
export async function saveProductGallery(
  productId: string,
  existingNames: string[],
  newFiles: File[],
): Promise<string[]> {
  // PocketBase: "galleryFiles-" apaga arquivos pelo nome; um multipart com
  // "galleryFiles" + File[] substitui o campo inteiro — por isso removemos
  // tudo e reenviamos na ordem do formulário.
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
 * URLs no campo `images` (mesma ordem) + refresh do catálogo da loja.
 */
export async function saveGalleryState(productId: string, state: GalleryState): Promise<void> {
  try {
    await saveProductGallery(productId, state.keptNames, state.files)
    await pb.collection('products').update(productId, { images: state.urls })
    await refreshCatalog()
  } catch (err) {
    throw new Error(getErrorMessage(err))
  }
}

/** URL de um arquivo já gravado em `galleryFiles`. */
export function galleryFileUrl(fileName: string): string {
  return pb.files.getURL(
    { id: 'x', collectionId: 'products' } as unknown as Parameters<typeof pb.files.getURL>[0],
    fileName,
  )
}

/**
 * Formulário de galeria do produto: até 10 fotos, por upload de arquivo ou
 * URL, com miniaturas, reordenação (mover para frente/trás) e remoção
 * individual. A PRIMEIRA foto da sequência é a foto principal (capa do card
 * na vitrine) — marcada com estrela.
 */
export function AdminProductGallery({
  existingNames,
  existingUrls,
  onChange,
  onNotify,
}: {
  /** Nomes dos arquivos já gravados no campo `galleryFiles` (ordem atual). */
  existingNames: string[]
  /** URLs de imagem gravadas no campo `images` (ordem atual). */
  existingUrls: string[]
  /** Chamado quando a galeria muda, para o pai montar o payload de salvamento. */
  onChange: (value: GalleryState) => void
  /** Notificação de erro/aviso (ex.: limite de 10 fotos). */
  onNotify: (message: string | null) => void
}) {
  const { locale } = useLocale()
  const t = (key: string) => shopT(locale, key)

  const [entries, setEntries] = useState<GalleryEntry[]>(() => [
    ...existingNames.map<GalleryEntry>((name) => ({
      kind: 'remote',
      id: `file:${name}`,
      url: galleryFileUrl(name),
      fileName: name,
    })),
    ...existingUrls.filter(Boolean).map<GalleryEntry>((url) => ({
      kind: 'remote',
      id: `url:${url}`,
      url,
    })),
  ])

  function commit(next: GalleryEntry[]) {
    setEntries(next)
    onChange({
      files: next.filter((e) => e.kind === 'file').map((e) => (e as { file: File }).file),
      keptNames: next
        .filter((e) => e.kind === 'remote' && e.fileName)
        .map((e) => e.fileName as string),
      urls: next.filter((e) => e.kind === 'remote' && !e.fileName).map((e) => e.url),
    })
  }

  function move(index: number, delta: number) {
    const target = index + delta
    if (target < 0 || target >= entries.length) return
    const next = [...entries]
    const [item] = next.splice(index, 1)
    next.splice(target, 0, item)
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
    const url = input?.value.trim()
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
      <Label htmlFor="prod-gallery-file" className="text-xs text-muted-foreground">
        {t('admin.productGallery')} — {t('admin.productImageFile')}
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
      <div className="flex items-end gap-2">
        <div className="flex-1 space-y-1">
          <Label htmlFor="prod-gallery-url" className="text-xs text-muted-foreground">
            {t('admin.productGallery')} — {t('admin.productImageUrl')}
          </Label>
          <Input
            id="prod-gallery-url"
            type="url"
            placeholder="https://…"
            className="bg-background"
          />
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addUrl}>
          {t('admin.galleryAddUrl')}
        </Button>
      </div>
      <p className="text-[11px] italic text-muted-foreground/70">{t('admin.galleryHint')}</p>

      {entries.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {entries.map((entry, i) => (
            <li
              key={entry.id}
              className="relative overflow-hidden rounded-md border border-border/60 bg-secondary/30"
            >
              <img
                src={entry.kind === 'file' ? entry.previewUrl : entry.url}
                alt={`${t('admin.productGallery')} ${i + 1}`}
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
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={i === 0}
                    onClick={() => move(i, -1)}
                    aria-label={t('admin.galleryMoveBack')}
                    title={t('admin.galleryMoveBack')}
                    className="h-7 w-7 p-0"
                  >
                    <ArrowLeft className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={i === entries.length - 1}
                    onClick={() => move(i, 1)}
                    aria-label={t('admin.galleryMoveForward')}
                    title={t('admin.galleryMoveForward')}
                    className="h-7 w-7 p-0"
                  >
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(i)}
                  aria-label={t('admin.galleryRemove')}
                  title={t('admin.galleryRemove')}
                  className="h-7 w-7 p-0 text-destructive"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
