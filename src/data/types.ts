import { Locale } from '@/i18n/types'

/**
 * Camada de dados central do catálogo ALMA Y AROMA.
 *
 * Todos os dados são DEMONSTRATIVOS: preços ilustrativos em reais (BRL),
 * dados técnicos configuráveis (não definitivos) e nenhuma compra real.
 * A arquitetura (repositório atrás de interface) está pronta para, no futuro,
 * ser substituída por um adaptador Shopify/Nuvemshop sem tocar nas telas.
 */

export type ProductCategory =
  | 'aromas-essencias'
  | 'incensos-defumacao'
  | 'velas-aromaticas'
  | 'difusores-aromatizadores'
  | 'meditacao-relaxamento'
  | 'decoracao-zen'
  | 'kits-presentes'

export type ScentFamily = 'floral-herbal' | 'woody' | 'citrus-fresh' | 'amber-warm' | 'resinous'

export type PurposeTag = 'relaxar' | 'meditar' | 'renovar' | 'acolher' | 'presentear'

export type ProductVariationKind = 'aroma' | 'tamanho' | 'formato' | 'kit'

export interface LocalizedText {
  'pt-br': string
  es: string
  'en-gb': string
}

export interface ProductVariation {
  kind: ProductVariationKind
  values: string[]
}

export interface ProductTechnical {
  brand: LocalizedText
  composition: LocalizedText
  weight: LocalizedText
  dimensions: LocalizedText
  contents: LocalizedText
  origin: LocalizedText
  usage: LocalizedText
  care: LocalizedText
  sku: string
}

export interface CatalogProduct {
  id: string
  sku: string
  slug: string
  category: ProductCategory
  name: LocalizedText
  shortDescription: LocalizedText
  longDescription: LocalizedText
  /** Preço ilustrativo em reais — produto demonstrativo, não comercial */
  illustrativePrice: number
  /** Preço vigente (o "preço novo"). No fallback local equivale a illustrativePrice. */
  price?: number
  /** Preço antigo riscado, exibido quando maior que `price` (promoção). */
  compareAtPrice?: number
  currency: 'BRL'
  images: string[]
  variations: ProductVariation[]
  scentFamily: ScentFamily
  /** Tipo de produto (vela, incenso, difusor...) para busca e filtros */
  productType: LocalizedText
  tags: string[]
  purposes: PurposeTag[]
  featured?: boolean
  isNew?: boolean
  status: 'demo'
  isDemonstrative: true
  technical: ProductTechnical
}

export interface CatalogCategory {
  id: ProductCategory
  slug: string
  title: LocalizedText
  description: LocalizedText
  longDescription: LocalizedText
  heroImage: string
  cardImage: string
  /** Ordem no menu e na home */
  order: number
}

export interface CatalogKit {
  id: string
  slug: string
  name: LocalizedText
  experience: LocalizedText
  detail: LocalizedText
  price: number
  currency: 'BRL'
  image: string
  productIds: string[]
  featured?: boolean
  isDemonstrative: true
}

/** Moedas dos mercados configuráveis no admin (sem conversão automática). */
export type CurrencyCode = 'BRL' | 'EUR' | 'GBP'

export interface SensationNavigationItem {
  id: PurposeTag
  labelKey: 'ritual.relax' | 'ritual.meditate' | 'ritual.renew' | 'ritual.nest' | 'ritual.gift'
  titleKey: string
  image: string
  productIds: string[]
}

export const DEMO_LOCALE_HINT: Locale = 'pt-br'
