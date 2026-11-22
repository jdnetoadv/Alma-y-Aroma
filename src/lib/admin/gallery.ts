import pb from '@/lib/pocketbase/client'

/**
 * Galeria de fotos do produto (painel admin → loja).
 *
 * Modelo de persistência (coleção `products`):
 * - `galleryFiles`: campo file (até 10 arquivos) — fotos enviadas por upload;
 * - `images` (json, array de URLs): fotos externas + marcadores `file:<nome>`
 *   que ancoram CADA arquivo da galeria em uma posição exata da sequência;
 * - `imageFile` (arquivo único, legado da migração 0007): usado pela loja
 *   apenas como fallback de capa quando a galeria nova está vazia.
 *
 * A sequência que o admin definiu no painel é gravada exatamente em
 * `images`: URLs como estão e, para cada upload, o marcador `file:<nome>`.
 * A loja (backendCatalog.toUiProduct) resolve os marcadores de volta para
 * URLs reais dos arquivos, na ordem definida — a primeira é a capa.
 */

export const MAX_GALLERY_PHOTOS = 10

export interface GalleryEntry {
  /** Chave única da entrada dentro do formulário. */
  key: string
  /** URL para exibição (blob: para arquivos ainda não salvos). */
  preview: string
  /** Arquivo escolhido, quando a entrada é um upload pendente. */
  file: File | null
  /**
   * Nome do arquivo já salvo no backend (registro `galleryFiles`) —
   * presente nas entradas carregadas de um produto existente.
   */
  savedName: string | null
  /** URL externa, quando a entrada é uma foto por URL. */
  url: string
}

/** Constrói uma entrada a partir de um arquivo novo (upload pendente). */
export function entryFromFile(file: File): GalleryEntry {
  return {
    key: crypto.randomUUID(),
    preview: URL.createObjectURL(file),
    file,
    savedName: null,
    url: '',
  }
}

/** Constrói uma entrada a partir de uma URL externa. */
export function entryFromUrl(url: string): GalleryEntry {
  return { key: crypto.randomUUID(), preview: url, file: null, savedName: null, url }
}

/** Constrói uma entrada a partir de um arquivo já salvo no backend. */
export function entryFromSaved(
  record: { id: string; collectionId: string },
  savedName: string,
): GalleryEntry {
  return {
    key: crypto.randomUUID(),
    preview: pb.files.getURL(record, savedName),
    file: null,
    savedName,
    url: '',
  }
}

/** Lista os arquivos salvos (galleryFiles) de um produto, na ordem gravada. */
export function savedGalleryFiles(product: { galleryFiles?: string | string[] }): string[] {
  const raw = product.galleryFiles
  if (!raw) return []
  const list = Array.isArray(raw) ? raw : [raw]
  return list.filter((n) => typeof n === 'string' && n.length > 0)
}

/** Resolve a URL de exibição de uma foto por URL (aceita caminho relativo do CDN). */
export function resolveImageUrl(url: string): string {
  if (!url) return ''
  if (url.startsWith('http') || url.startsWith('/') || url.startsWith('blob:')) return url
  return `https://img.usecurling.com/p/${url}`
}

/**
 * Sequência final a gravar em `images` (e ordem de upload dos arquivos):
 * primeiro os arquivos novos, depois os já salvos — marcados como
 * `file:<nome>` — e por fim as URLs. O admin definiu essa ordem com os
 * botões de mover; aqui ela apenas é serializada.
 */
export function serializeGallery(entries: GalleryEntry[]): { uploads: File[]; markers: string[] } {
  const uploads: File[] = []
  const markers: string[] = []
  for (const e of entries) {
    if (e.file) {
      uploads.push(e.file)
      markers.push(`file:${e.file.name}`)
    } else if (e.savedName) {
      markers.push(`file:${e.savedName}`)
    } else if (e.url) {
      markers.push(resolveImageUrl(e.url))
    }
  }
  return { uploads, markers }
}

/**
 * Lê a sequência gravada de volta (edição): as entradas do registro —
 * arquivos salvos e URLs — na ordem em que estão em `images`.
 */
export function loadGalleryEntries(
  record: { id: string; collectionId: string; galleryFiles?: string | string[] },
  images: unknown,
): GalleryEntry[] {
  const saved = savedGalleryFiles(record)
  const list = Array.isArray(images) ? (images as unknown[]) : []
  const entries: GalleryEntry[] = []
  const usedFiles = new Set<string>()

  for (const item of list) {
    if (typeof item !== 'string' || item === '') continue
    if (item.startsWith('file:')) {
      const name = item.slice(5)
      if (saved.includes(name) && !usedFiles.has(name)) {
        usedFiles.add(name)
        entries.push(entryFromSaved(record, name))
      }
      continue
    }
    entries.push(entryFromUrl(resolveImageUrl(item)))
  }

  // Arquivos salvos que não estão (ainda) referenciados em `images` vão ao
  // fim — ex. produto legado que só tinha `galleryFiles`/`imageFile`.
  for (const name of saved) {
    if (!usedFiles.has(name)) entries.push(entryFromSaved(record, name))
  }
  return entries
}
