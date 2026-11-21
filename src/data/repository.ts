import { CatalogCategory, CatalogKit, CatalogProduct, PurposeTag } from './types'
import { categories } from './categories'
import { products } from './products'
import { kits } from './kits'
import { sensations } from './sensations'
import { Locale } from '@/i18n/types'

/**
 * Repositório central do catálogo. Único ponto de acesso aos dados —
 * telas nunca importam os arrays crus. A interface está desenhada para
 * que, no futuro, uma implementação Shopify/Nuvemshop a satisfaça sem
 * alterar os componentes.
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
}

class StaticCatalogRepository implements CatalogRepository {
  listCategories(): CatalogCategory[] {
    return [...categories].sort((a, b) => a.order - b.order)
  }

  getCategoryBySlug(slug: string): CatalogCategory | undefined {
    return categories.find((c) => c.slug === slug)
  }

  getCategory(id: CatalogCategory['id']): CatalogCategory | undefined {
    return categories.find((c) => c.id === id)
  }

  listProducts(): CatalogProduct[] {
    return products
  }

  getProductBySlug(slug: string): CatalogProduct | undefined {
    return products.find((p) => p.slug === slug)
  }

  getProduct(id: string): CatalogProduct | undefined {
    return products.find((p) => p.id === id)
  }

  listProductsByCategory(categoryId: CatalogCategory['id']): CatalogProduct[] {
    return products.filter((p) => p.category === categoryId)
  }

  listKits(): CatalogKit[] {
    return kits
  }

  getKitBySlug(slug: string): CatalogKit | undefined {
    return kits.find((k) => k.slug === slug)
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

    return products.filter((product) => {
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
    const sameCategory = products.filter(
      (p) => p.category === product.category && p.id !== product.id,
    )
    const complementary = products.filter(
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

export { categories, products, kits, sensations }

export function formatPrice(value: number, locale: Locale): string {
  const intlLocale = locale === 'pt-br' ? 'pt-BR' : locale === 'es' ? 'es-ES' : 'en-GB'
  return new Intl.NumberFormat(intlLocale, {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}
