import pb from '@/lib/pocketbase/client'
import { CatalogProduct } from '@/data/types'
import { Locale } from '@/i18n/types'

/**
 * Favoritos — Etapa 4. Cada usuário guarda a LISTA DE SLUGS dos produtos
 * que amou (coleção `favorites`, 1 registro por produto, regra user =
 * @request.auth.id). O coração aparece nos cards e na página do produto.
 */

export interface FavoriteRecord {
  id: string
  productSlug: string
}

/** Slugs favoritados do usuário logado (lista vazia quando deslogado). */
export async function fetchFavoriteSlugs(): Promise<Set<string>> {
  if (!pb.authStore.isValid) return new Set()
  try {
    const recs = await pb.collection('favorites').getFullList({ sort: '-created' })
    return new Set(recs.map((r) => r.productSlug))
  } catch {
    return new Set()
  }
}

export async function addFavorite(slug: string): Promise<void> {
  await pb.collection('favorites').create({ productSlug: slug })
}

export async function removeFavorite(slug: string): Promise<void> {
  const rec = await pb.collection('favorites').getFirstListItem(`productSlug="${slug}"`)
  await pb.collection('favorites').delete(rec.id)
}

export function productLabel(p: CatalogProduct, locale: Locale): string {
  return p.name[locale] ?? p.name['pt-br']
}
