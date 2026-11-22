import pb from '@/lib/pocketbase/client'
import { CatalogCategoryRecord, CatalogProductRecord } from '@/data/backendCatalog'
import { CurrencyCode } from '@/data/types'
import { Locale } from '@/i18n/types'

/**
 * Serviços do painel admin — Etapa 4. Todas as operações passam pelas
 * regras da API do PocketBase (@collection.admins.user ?= @request.auth.id);
 * nada de credenciais no cliente — o login é o mesmo authWithPassword do
 * `users`, e o backend decide pela coleção `admins`.
 */

export interface AdminStats {
  orderCount: number
  productCount: number
  revenue: number
  avgTicket: number
}

export async function loadAdminStats(): Promise<AdminStats> {
  const orders = await pb.collection('orders').getFullList({ sort: '-created' })
  const products = await pb.collection('products').getFullList({ filter: 'active=true' })
  const revenue = orders.reduce((acc, o) => acc + Number(o.total ?? 0), 0)
  return {
    orderCount: orders.length,
    productCount: products.length,
    revenue,
    avgTicket: orders.length ? revenue / orders.length : 0,
  }
}

export interface AdminProduct {
  id: string
  slug: string
  sku: string
  categoryId: string
  name: Record<Locale, string>
  shortDescription: Record<Locale, string>
  longDescription: Record<Locale, string>
  images: string[]
  imageFile?: string
  variations: { kind: string; label: string; values: string[] }[]
  productType: Record<Locale, string>
  scentFamily: string
  tags: string[]
  purposes: string[]
  price: number
  compareAtPrice: number | null
  currency: CurrencyCode
  weightGrams: number | null
  lengthCm: number | null
  widthCm: number | null
  heightCm: number | null
  stock: number
  featured: boolean
  isNew: boolean
  demonstrative: boolean
  active: boolean
}

export async function listAdminProducts(): Promise<AdminProduct[]> {
  const recs = await pb.collection('products').getFullList({ sort: 'slug' })
  return recs.map((r) => r as unknown as AdminProduct)
}

export async function updateProduct(
  id: string,
  patch: Partial<
    Pick<
      AdminProduct,
      | 'price'
      | 'compareAtPrice'
      | 'currency'
      | 'weightGrams'
      | 'lengthCm'
      | 'widthCm'
      | 'heightCm'
      | 'stock'
      | 'featured'
      | 'active'
    >
  >,
): Promise<void> {
  await pb.collection('products').update(id, patch)
}

export interface ProductWriteData {
  slug: string
  categoryId: string
  name: Record<Locale, string>
  shortDescription: Record<Locale, string>
  longDescription: Record<Locale, string>
  price: number
  stock: number
  active: boolean
  featured?: boolean
  images?: string[]
  imageFile?: File | null
}

function productPayload(data: ProductWriteData): Record<string, unknown> {
  return {
    slug: data.slug,
    categoryId: data.categoryId,
    name: data.name,
    shortDescription: data.shortDescription,
    longDescription: data.longDescription,
    images: data.images ?? [],
    price: data.price,
    stock: data.stock,
    active: data.active,
    featured: data.featured ?? false,
    currency: 'BRL',
  }
}

function productFormData(payload: Record<string, unknown>, imageFile: File): FormData {
  // Upload de arquivo: multipart, com os campos JSON serializados.
  const form = new FormData()
  for (const [key, value] of Object.entries(payload)) {
    form.append(
      key,
      typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value),
    )
  }
  form.append('imageFile', imageFile)
  return form
}

export async function createProduct(data: ProductWriteData): Promise<void> {
  const payload = {
    ...productPayload(data),
    sku: data.slug.toUpperCase().replaceAll('-', '').slice(0, 12),
    variations: [],
    productType: data.name,
    scentFamily: '',
    tags: [],
    purposes: [],
    isNew: false,
    demonstrative: false,
  }
  if (!data.imageFile) {
    await pb.collection('products').create(payload)
    return
  }
  await pb.collection('products').create(productFormData(payload, data.imageFile))
}

/**
 * Edição completa de um produto existente (mesmo payload da criação, mas
 * update — nunca cria registro novo). Novo upload substitui o arquivo
 * anterior do campo imageFile.
 */
export async function updateProductFull(id: string, data: ProductWriteData): Promise<void> {
  const payload = productPayload(data)
  if (!data.imageFile) {
    await pb.collection('products').update(id, payload)
    return
  }
  await pb.collection('products').update(id, productFormData(payload, data.imageFile))
}

export interface AdminCategory {
  id: string
  slug: string
  title: Record<Locale, string>
  description: Record<Locale, string>
  heroImage: string
  sortOrder: number
  active: boolean
}

export async function listAdminCategories(): Promise<AdminCategory[]> {
  const recs = await pb.collection('categories').getFullList({ sort: 'sortOrder' })
  return recs.map((r) => r as unknown as AdminCategory)
}

export async function createCategory(data: {
  slug: string
  title: string
  description?: string
  sortOrder?: number
}): Promise<void> {
  const title = { 'pt-br': data.title, es: data.title, 'en-gb': data.title }
  await pb.collection('categories').create({
    slug: data.slug,
    title,
    description: {
      'pt-br': data.description ?? '',
      es: data.description ?? '',
      'en-gb': data.description ?? '',
    },
    heroImage: '',
    sortOrder: data.sortOrder ?? 99,
    active: true,
  })
}

export async function updateCategory(
  id: string,
  patch: Partial<Pick<AdminCategory, 'sortOrder' | 'active' | 'title'>>,
): Promise<void> {
  await pb.collection('categories').update(id, patch)
}

export async function deleteCategory(id: string): Promise<void> {
  await pb.collection('categories').delete(id)
}

export interface AdminCoupon {
  id: string
  code: string
  kind: 'percent' | 'fixed'
  value: number
  minSubtotal: number
  active: boolean
}

export async function listAdminCoupons(): Promise<AdminCoupon[]> {
  const recs = await pb.collection('coupons').getFullList({ sort: 'code' })
  return recs.map((r) => r as unknown as AdminCoupon)
}

export async function createCoupon(data: {
  code: string
  kind: 'percent' | 'fixed'
  value: number
  minSubtotal: number
}): Promise<void> {
  await pb.collection('coupons').create({
    code: data.code.toUpperCase(),
    kind: data.kind,
    value: data.value,
    minSubtotal: data.minSubtotal,
    active: true,
  })
}

export async function updateCoupon(
  id: string,
  patch: Partial<Pick<AdminCoupon, 'active' | 'value' | 'minSubtotal'>>,
) {
  await pb.collection('coupons').update(id, patch)
}

export async function deleteCoupon(id: string): Promise<void> {
  await pb.collection('coupons').delete(id)
}

/** Recarrega o catálogo da UI após uma edição do admin (repositório vivo). */
export async function refreshCatalog(): Promise<void> {
  const { loadCatalogFromBackend } = await import('@/data/backendCatalog')
  const { catalogRepository } = await import('@/data/repository')
  const result = await loadCatalogFromBackend()
  catalogRepository.hydrate(
    result.categories as unknown as CatalogCategoryRecord[],
    result.products as unknown as CatalogProductRecord[],
  )
}

export function isAdminAuthenticated(): boolean {
  return pb.authStore.isValid && Boolean(pb.authStore.record?.id)
}

/** true quando o usuário autenticado está vinculado à coleção `admins`. */
export async function checkIsAdmin(): Promise<boolean> {
  if (!pb.authStore.isValid || !pb.authStore.record?.id) return false
  try {
    const rec = await pb.collection('admins').getFirstListItem(`user="${pb.authStore.record.id}"`)
    return Boolean(rec?.id)
  } catch {
    return false
  }
}

export async function adminLogin(email: string, password: string) {
  await pb.collection('users').authWithPassword(email, password)
}
