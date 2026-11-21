import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CatalogProduct, ProductVariation } from '@/data/types'

/**
 * Carrinho da Etapa 3 — persistido em localStorage, sobrevive à navegação
 * e ao recarregamento. Nenhum dado sensível é guardado: só o essencial
 * para exibir os itens e calcular os totais.
 */

export interface CartItem {
  productId: string
  slug: string
  name: string
  image: string
  unitPrice: number
  quantity: number
  variation?: string
}

export interface AppliedCoupon {
  code: string
  kind: 'percent' | 'fixed'
  value: number
  discount: number
}

export interface CartTotals {
  subtotal: number
  discount: number
  shipping: number
  total: number
}

export const FREE_SHIPPING_MIN = 299
export const FLAT_SHIPPING = 24.9

interface CartState {
  items: CartItem[]
  coupon: AppliedCoupon | null
  addItem: (product: CatalogProduct, quantity?: number, variation?: ProductVariation) => void
  removeItem: (productId: string, variation?: string) => void
  setQuantity: (productId: string, variation: string | undefined, quantity: number) => void
  applyCoupon: (coupon: AppliedCoupon) => void
  clearCoupon: () => void
  clearCart: () => void
}

function variationLabel(v?: ProductVariation): string | undefined {
  return v?.values?.['pt-br']
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      coupon: null,

      addItem: (product, quantity = 1, variation) =>
        set((state) => {
          const label = variationLabel(variation)
          const key = `${product.id}:${label ?? ''}`
          const existing = state.items.find((i) => `${i.productId}:${i.variation ?? ''}` === key)
          if (existing) {
            return {
              items: state.items.map((i) =>
                `${i.productId}:${i.variation ?? ''}` === key
                  ? { ...i, quantity: Math.min(99, i.quantity + quantity) }
                  : i,
              ),
            }
          }
          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                slug: product.slug,
                name: product.name['pt-br'],
                image: product.images[0] ?? '',
                unitPrice: product.illustrativePrice,
                quantity: Math.max(1, quantity),
                variation: label,
              },
            ],
          }
        }),

      removeItem: (productId, variation) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && (i.variation ?? '') === (variation ?? '')),
          ),
        })),

      setQuantity: (productId, variation, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter(
                  (i) => !(i.productId === productId && (i.variation ?? '') === (variation ?? '')),
                )
              : state.items.map((i) =>
                  i.productId === productId && (i.variation ?? '') === (variation ?? '')
                    ? { ...i, quantity: Math.min(99, quantity) }
                    : i,
                ),
        })),

      applyCoupon: (coupon) => set({ coupon }),
      clearCoupon: () => set({ coupon: null }),
      clearCart: () => set({ items: [], coupon: null }),
    }),
    { name: 'aya-cart-v1' },
  ),
)

import pb from '@/lib/pocketbase/client'

/** Valida o cupom contra o banco (coleção `coupons`). */
export async function validateCoupon(
  code: string,
  subtotal: number,
): Promise<{ ok: true; coupon: AppliedCoupon } | { ok: false; error: 'invalid' | 'empty' }> {
  const trimmed = code.trim().toUpperCase()
  if (!trimmed) return { ok: false, error: 'empty' }
  try {
    const rec = await pb.collection('coupons').getFirstListItem(`code="${trimmed}" && active=true`)
    const min = rec.minSubtotal ?? 0
    if (subtotal < min) return { ok: false, error: 'invalid' }
    const discount =
      rec.kind === 'percent'
        ? Math.round(subtotal * (rec.value / 100) * 100) / 100
        : Math.min(rec.value, subtotal)
    return {
      ok: true,
      coupon: { code: trimmed, kind: rec.kind, value: rec.value, discount },
    }
  } catch {
    return { ok: false, error: 'invalid' }
  }
}
