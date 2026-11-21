/**
 * Produtos do catálogo vistos pelo ADMIN (Etapa 5) — campos de fornecedor,
 * custo e mercados habilitados. Lê a coleção `products` (regras admin).
 * Fonte central: a UI de vitrines NÃO duplica — lê via catalogRepository.
 */
import pb from '@/lib/pocketbase/client'
import { CurrencyCode } from '@/data/types'
import { Locale } from '@/i18n/types'

export interface AdminCatalogProduct {
  id: string
  slug: string
  sku: string
  categoryId: string
  name: Record<Locale, string>
  price: number
  currency: CurrencyCode
  costPrice: number | null
  supplierId: string
  supplierFreight: number | null
  estimatedTaxes: number | null
  variableCosts: number | null
  paymentFeesPct: number | null
  commissionPct: number | null
  enabledCountries: string[]
  demonstrative: boolean
  active: boolean
}

/** Carrega TODOS os produtos para uso admin (mesmo inativos/draft). */
export async function listAdminCatalogProducts(): Promise<AdminCatalogProduct[]> {
  const recs = await pb.collection('products').getFullList({ sort: 'slug' })
  return recs.map((r) => {
    const rec = r as unknown as Record<string, unknown>
    const supplier = rec.supplier
    return {
      id: String(r.id),
      slug: String(rec.slug ?? ''),
      sku: String(rec.sku ?? ''),
      categoryId: String(rec.categoryId ?? ''),
      name: (rec.name ?? {}) as Record<Locale, string>,
      price: Number(rec.price ?? 0),
      currency: (rec.currency ?? 'BRL') as CurrencyCode,
      costPrice: rec.costPrice != null ? Number(rec.costPrice) : null,
      supplierId: Array.isArray(supplier) ? String(supplier[0] ?? '') : String(supplier ?? ''),
      supplierFreight: rec.supplierFreight != null ? Number(rec.supplierFreight) : null,
      estimatedTaxes: rec.estimatedTaxes != null ? Number(rec.estimatedTaxes) : null,
      variableCosts: rec.variableCosts != null ? Number(rec.variableCosts) : null,
      paymentFeesPct: rec.paymentFeesPct != null ? Number(rec.paymentFeesPct) : null,
      commissionPct: rec.commissionPct != null ? Number(rec.commissionPct) : null,
      enabledCountries: Array.isArray(rec.enabledCountries) ? rec.enabledCountries.map(String) : [],
      demonstrative: Boolean(rec.demonstrative),
      active: Boolean(rec.active),
    }
  })
}
