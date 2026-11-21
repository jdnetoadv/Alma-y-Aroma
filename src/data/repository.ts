import { CatalogCategory, CatalogKit, CatalogProduct, PurposeTag } from './types'
import { categories as fallbackCategories } from './categories'
import { products as fallbackProducts } from './products'
import { kits as fallbackKits } from './kits'
import { sensations } from './sensations'
import { Locale } from '@/i18n/types'
import { loadCatalogFromBackend } from './backendCatalog'
import { useEffect, useState } from 'react'
import type { CatalogCategoryRecord, CatalogProductRecord } from './backendCatalog'

/**
 * Repositório central do catálogo. Único ponto de acesso aos dados —
 * telas nunca importam os arrays crus. Fonte primária: backend PocketBase
 * (Etapa 3); fallback: conteúdo demonstrativo local (Etapa 2).
 */
export interface CatalogRepository {
  listCategories(): CatalogCategory[]
  getCategoryBySlug(slug: string): CatalogCategory | undefined
  getCategory(id: CatalogCategory['id']): CatalogCategory | undefined
  listProducts(): CatalogProduct[]
  getProductBySlug(slug: string): CatalogProduct | undefined
  getProduct(id: string): CatalogProduct | undefined
  listProductsByCategory(categoryId: CatalogCategory['id']): CatalogProduct[]
  listKits(): CatalogKit[]
  getKitBySlug(slug: string): CatalogKit | undefined
  getKitProducts(kit: CatalogKit): CatalogProduct[]
  search(query: string, locale: Locale): CatalogProduct[]
  listBySensation(purpose: PurposeTag): CatalogProduct[]
  /** Produtos relacionados: mesma categoria + complementares (kits/sensação) */
  listRelated(product: CatalogProduct, limit?: number): CatalogProduct[]
  /** Troca a fonte de dados (backend → UI). */
  hydrate(cats: CatalogCategoryRecord[], prods: CatalogProductRecord[]): void
  /** Reverte para o fallback demonstrativo local. */
  reset(): void
  /** true quando os dados vieram do backend (não do fallback demonstrativo) */
  readonly source: 'backend' | 'local'
}

class StaticCatalogRepository implements CatalogRepository {
  private cats: CatalogCategory[] = fallbackCategories
  private prods: CatalogProduct[] = fallbackProducts
  source: 'backend' | 'local' = 'local'

  /** Troca a fonte de dados (backend → UI). Arrays congelados, imutáveis. */
  hydrate(cats: CatalogCategoryRecord[], prods: CatalogProductRecord[]) {
    this.cats = cats as unknown as CatalogCategory[]
    this.prods = prods as unknown as CatalogProduct[]
    this.source = 'backend'
  }

  /** Reverte para o fallback demonstrativo. */
  reset() {
    this.cats = fallbackCategories
    this.prods = fallbackProducts
    this.source = 'local'
  }

  listCategories(): CatalogCategory[] {
    return [...this.cats].sort((a, b) => a.order - b.order)
  }

  getCategoryBySlug(slug: string): CatalogCategory | undefined {
    return this.cats.find((c) => c.slug === slug)
  }

  getCategory(id: CatalogCategory['id']): CatalogCategory | undefined {
    return this.cats.find((c) => c.id === id)
  }

  listProducts(): CatalogProduct[] {
    return this.prods
  }

  getProductBySlug(slug: string): CatalogProduct | undefined {
    return this.prods.find((p) => p.slug === slug)
  }

  getProduct(id: string): CatalogProduct | undefined {
    return this.prods.find((p) => p.id === id)
  }

  listProductsByCategory(categoryId: CatalogCategory['id']): CatalogProduct[] {
    return this.prods.filter((p) => p.category === categoryId)
  }

  listKits(): CatalogKit[] {
    return fallbackKits
  }

  getKitBySlug(slug: string): CatalogKit | undefined {
    return fallbackKits.find((k) => k.slug === slug)
  }

  getKitProducts(kit: CatalogKit): CatalogProduct[] {
    return kit.productIds
      .map((id) => this.getProduct(id))
      .filter((p): p is CatalogProduct => Boolean(p))
  }

  search(query: string, locale: Locale): CatalogProduct[] {
    const normalizedQuery = this.normalize(query)
    if (!normalizedQuery) return []
    const terms = normalizedQuery.split(/\s+/).filter(Boolean)

    return this.prods.filter((product) => {
      const haystack = this.normalize(
        [
          product.name[locale],
          product.name['pt-br'], // nomes verbatim sempre pesquisáveis
          product.category,
          product.productType[locale],
          product.productType['pt-br'],
          product.scentFamily,
          product.sku,
          product.shortDescription[locale],
          product.longDescription[locale],
          ...product.tags,
          ...product.purposes,
        ].join(' '),
      )
      return terms.every((term) => haystack.includes(term))
    })
  }

  listBySensation(purpose: PurposeTag): CatalogProduct[] {
    const sensation = sensations.find((s) => s.id === purpose)
    if (!sensation) return []
    return sensation.productIds
      .map((id) => this.getProduct(id))
      .filter((p): p is CatalogProduct => Boolean(p))
  }

  listRelated(product: CatalogProduct, limit = 4): CatalogProduct[] {
    const sameCategory = this.prods.filter(
      (p) => p.category === product.category && p.id !== product.id,
    )
    const complementary = this.prods.filter(
      (p) =>
        p.category !== product.category &&
        (p.purposes.some((purpose) => product.purposes.includes(purpose)) ||
          product.tags.some((tag) => p.tags.includes(tag))),
    )
    return [...sameCategory, ...complementary].slice(0, limit)
  }

  private normalize(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
  }
}

export const catalogRepository: CatalogRepository = new StaticCatalogRepository()

export {
  fallbackCategories as categories,
  fallbackProducts as products,
  fallbackKits as kits,
  sensations,
}

/** Busca textual do catálogo (nome, categoria, tipo, família, tags, palavras-chave). */
export const searchCatalog = (query: string, locale: Locale): CatalogProduct[] =>
  catalogRepository.search(query, locale)

export function formatPrice(value: number, locale: Locale): string {
  const intlLocale = locale === 'pt-br' ? 'pt-BR' : locale === 'es' ? 'es-ES' : 'en-GB'
  return new Intl.NumberFormat(intlLocale, {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Carrega o catálogo do backend uma única vez por sessão de página.
 * Em caso de falha (backend fora, coleções ausentes), mantém o fallback.
 */
export function useCatalogReady(): boolean {
  const [ready, setReady] = useState(catalogRepository.source === 'backend')

  useEffect(() => {
    let cancelled = false
    loadCatalogFromBackend()
      .then((result) => {
        if (cancelled) return
        catalogRepository.hydrate(
          result.categories as unknown as CatalogCategoryRecord[],
          result.products as unknown as CatalogProductRecord[],
        )
        setReady(true)
      })
      .catch(() => {
        // Backend indisponível ou coleções ainda não criadas: fallback local.
      })
    return () => {
      cancelled = true
    }
  }, [])

  return ready
}
