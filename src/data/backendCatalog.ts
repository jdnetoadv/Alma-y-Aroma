import pb from '@/lib/pocketbase/client'
import { Locale } from '@/i18n/types'
import type { CurrencyCode } from '@/data/types'

export type ProductSort = 'featured' | 'newest' | 'priceAsc' | 'priceDesc' | 'name'

export interface CatalogCategoryRecord {
  id: string
  slug: string
  title: Record<Locale, string>
  description: Record<Locale, string>
  heroImage: string
  sortOrder: number
  active: boolean
}

export interface CatalogProductRecord {
  id: string
  slug: string
  sku: string
  categoryId: string
  name: Record<Locale, string>
  shortDescription: Record<Locale, string>
  longDescription: Record<Locale, string>
  images: string[]
  variations: { kind: string; label: string; values: string[] }[]
  productType: Record<Locale, string>
  scentFamily: string
  tags: string[]
  purposes: string[]
  price: number
  compareAtPrice?: number
  currency: CurrencyCode
  stock: number
  featured: boolean
  isNew: boolean
  demonstrative: boolean
  active: boolean
}

const IMAGE_BASE = 'https://img.usecurling.com/p/'

/** Imagens remotas gravadas sem domínio (só a query do CDN) recebem o base. */
function resolveImage(src: string): string {
  if (!src) return src
  if (src.startsWith('http') || src.startsWith('/')) return src
  return `${IMAGE_BASE}${src}`
}

/** Converte a coleção `categories` no formato CatalogCategory da UI. */
function toUiCategory(r: CatalogCategoryRecord) {
  return {
    id: r.slug,
    slug: r.slug,
    title: r.title,
    description: r.description,
    heroImage: resolveImage(r.heroImage),
    order: r.sortOrder,
  }
}

function toUiProduct(r: CatalogProductRecord) {
  return {
    id: r.slug,
    slug: r.slug,
    sku: r.sku,
    category: r.categoryId,
    name: r.name,
    shortDescription: r.shortDescription,
    longDescription: r.longDescription,
    images: r.images.map(resolveImage),
    variations: r.variations,
    scentFamily: r.scentFamily,
    productType: r.productType,
    tags: r.tags,
    purposes: r.purposes,
    // Preço vigente: o campo `price` da UI é o preço NOVO; `compareAtPrice`
    // (quando maior) sai riscado ao lado com a % de economia.
    price: r.price,
    illustrativePrice: r.price,
    compareAtPrice: r.compareAtPrice,
    currency: r.currency,
    stock: r.stock,
    isNew: r.isNew,
    featured: r.featured,
    isDemonstrative: r.demonstrative,
    status: r.demonstrative ? 'demo' : 'active',
    technical: undefined,
  }
}

/**
 * Carrega o catálogo do backend PocketBase com fallback para o conteúdo
 * demonstrativo local (Etapa 2). A UI nunca fica vazia se o backend falhar.
 */
export async function loadCatalogFromBackend(): Promise<{
  categories: ReturnType<typeof toUiCategory>[]
  products: ReturnType<typeof toUiProduct>[]
}> {
  const [cats, prods] = await Promise.all([
    pb.collection('categories').getFullList({
      sort: 'sortOrder',
      filter: 'active=true',
    }),
    pb.collection('products').getFullList({
      sort: '-featured,slug',
      filter: 'active=true',
    }),
  ])

  return {
    categories: cats.map((c) => toUiCategory(c as unknown as CatalogCategoryRecord)),
    products: prods.map((p) => toUiProduct(p as unknown as CatalogProductRecord)),
  }
}
