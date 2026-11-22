import pb from '@/lib/pocketbase/client'

/**
 * Miniaturas do PocketBase para as imagens de listagem da loja (cards,
 * busca, favoritos). As URLs de arquivo do PocketBase ganham o parâmetro
 * `?thumb=300x300` — o campo de arquivo tem o tamanho em Thumbs (migração
 * 0009) e o thumb é gerado lazily no primeiro acesso; se falhar, o
 * PocketBase serve o original. URLs externas/CDN não têm thumb — voltam
 * como estão.
 */

/** Tamanho de miniatura usado em thumbnails pequenos (cards, admin). */
export const THUMB_SIZE = '300x300'

/** Prefixo comum das URLs de arquivo do PocketBase. */
const PB_FILES_PREFIX = '/api/files/'

/**
 * URL de MINIATURA (`?thumb=300x300`) de uma imagem de listagem.
 * - URL de arquivo do PocketBase → recebe o parâmetro thumb (o campo do
 *   schema tem o tamanho em Thumbs desde a migração 0009; o thumb é gerado
 *   lazily no primeiro acesso e, se falhar, o PocketBase serve o original).
 * - URL externa/CDN (inclui os placeholders do catálogo local) → devolvida
 *   como está, pois o parâmetro não se aplica.
 */
export function thumbUrl(src: string): string {
  if (!src) return src
  const i = src.indexOf(PB_FILES_PREFIX)
  if (i === -1) return src
  const start = i + PB_FILES_PREFIX.length
  return `${src.slice(0, start)}${src.slice(start)}?thumb=${THUMB_SIZE}`
}

/** Igual a thumbUrl() mas aceita undefined (produto sem imagem). */
export function thumbUrlOr(src: string | undefined): string | undefined {
  return src ? thumbUrl(src) : src
}
