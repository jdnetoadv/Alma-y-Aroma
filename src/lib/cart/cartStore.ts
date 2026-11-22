import pb from '@/lib/pocketbase/client'
import { CatalogProduct } from '@/data/types'
import { thumbUrlOr } from '@/lib/shop/thumbnails'

/**
 * Carrinho de compras — Etapa 3.
 * Persistência local (localStorage) + sincronização para o backend quando
 * o visitante está logado (coleção `carts`). Sem dependência externa.
 */

export interface CartItem {
  productId: string
  slug: string
  name: string
  image: string
  unitPrice: number
  quantity: number
  variation?: string
  maxStock: number
}

export interface CartTotals {
  subtotal: number
  discount: number
  shipping: number
  total: number
  freeShipping: boolean
}

export interface AppliedCoupon {
  code: string
  kind: 'percent' | 'fixed'
  value: number
  minSubtotal: number
}

const STORAGE_KEY = 'aya_cart_v1'
export const FREE_SHIPPING_MIN = 199 // frete grátis a partir de R$ 199 (BRL)
export const FLAT_SHIPPING = 24.9 // estimativa demonstrativa, identificada como tal

interface CartState {
  items: CartItem[]
  coupon: AppliedCoupon | null
  hydrated: boolean
}

let state: CartState = { items: [], coupon: null, hydrated: false }
const listeners = new Set<() => void>()

function load(): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { items: [], coupon: null, hydrated: true }
    const parsed = JSON.parse(raw) as { items?: CartItem[]; coupon?: AppliedCoupon | null }
    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      coupon: parsed.coupon ?? null,
      hydrated: true,
    }
  } catch {
    return { items: [], coupon: null, hydrated: true }
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: state.items, coupon: state.coupon }))
  } catch {
    // armazenamento indisponível (modo privado): carrinho só em memória
  }
}

function emit() {
  listeners.forEach((l) => l())
}

function computeTotals(s: CartState, shipping: number | null): CartTotals {
  const subtotal = s.items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0)
  let discount = 0
  if (s.coupon && subtotal >= s.coupon.minSubtotal) {
    discount =
      s.coupon.kind === 'percent'
        ? (subtotal * s.coupon.value) / 100
        : Math.min(s.coupon.value, subtotal)
  }
  const afterDiscount = subtotal - discount
  const freeByValue = afterDiscount >= FREE_SHIPPING_MIN
  const effectiveShipping = shipping === null ? (freeByValue ? 0 : FLAT_SHIPPING) : shipping
  return {
    subtotal,
    discount,
    shipping: s.items.length ? effectiveShipping : 0,
    total: afterDiscount + (s.items.length ? effectiveShipping : 0),
    freeShipping: freeByValue,
  }
}

export const cartStore = {
  getState(): CartState {
    if (!state.hydrated) state = load()
    return state
  },

  subscribe(l: () => void): () => void {
    listeners.add(l)
    return () => listeners.delete(l)
  },

  /** Adiciona item (mescla por produto+variação) respeitando o estoque. */
  addItem(product: CatalogProduct, quantity: number, variation?: string) {
    const s = cartStore.getState()
    const key = (i: CartItem) => i.productId + (i.variation ?? '')
    const incomingKey = product.id + (variation ?? '')
    const existing = s.items.find((i) => key(i) === incomingKey)
    const maxStock = Math.max(1, (product as unknown as { stock?: number }).stock ?? 99)
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, maxStock)
    } else {
      s.items.push({
        productId: product.id,
        slug: product.slug,
        name: product.name['pt-br'],
        image: thumbUrlOr(product.images[0]),
        unitPrice: (product as unknown as { price?: number }).price ?? product.illustrativePrice,
        quantity: Math.min(quantity, maxStock),
        variation,
        maxStock,
      })
    }
    persist()
    emit()
  },

  updateQuantity(productId: string, variation: string | undefined, quantity: number) {
    const s = cartStore.getState()
    const item = s.items.find(
      (i) => i.productId === productId && (i.variation ?? '') === (variation ?? ''),
    )
    if (!item) return
    if (quantity <= 0) {
      s.items = s.items.filter((i) => i !== item)
    } else {
      item.quantity = Math.min(quantity, item.maxStock)
    }
    persist()
    emit()
  },

  removeItem(productId: string, variation?: string) {
    const s = cartStore.getState()
    s.items = s.items.filter(
      (i) => !(i.productId === productId && (i.variation ?? '') === (variation ?? '')),
    )
    if (!s.items.length) s.coupon = null
    persist()
    emit()
  },

  clear() {
    state = { items: [], coupon: null, hydrated: true }
    persist()
    emit()
  },

  setCoupon(coupon: AppliedCoupon | null) {
    state.coupon = coupon
    persist()
    emit()
  },

  /** Tota com frete explícito (null = usa estimativa demonstrativa local). */
  totals(shipping: number | null = null): CartTotals {
    return computeTotals(cartStore.getState(), shipping)
  },
}

/** Consulta a coleção `coupons` no backend. Null quando não existe/inválido. */
export async function validateCoupon(
  code: string,
  locale: string,
): Promise<{ ok: true; coupon: AppliedCoupon } | { ok: false; message: string }> {
  const normalized = code.trim().toUpperCase()
  if (!normalized) return { ok: false, message: messages[locale]?.empty ?? messages['pt-br'].empty }
  try {
    const rec = await pb
      .collection('coupons')
      .getFirstListItem(`code="${normalized}" && active=true`)
    const minSubtotal = rec.minSubtotal ?? 0
    return {
      ok: true,
      coupon: {
        code: normalized,
        kind: rec.kind,
        value: rec.value,
        minSubtotal,
      },
    }
  } catch {
    return {
      ok: false,
      message: messages[locale]?.invalid ?? messages['pt-br'].invalid,
    }
  }
}

const messages: Record<string, { empty: string; invalid: string }> = {
  'pt-br': { empty: 'Digite um cupom.', invalid: 'Cupom inválido ou expirado.' },
  es: { empty: 'Escribe un cupón.', invalid: 'Cupón inválido o expirado.' },
  'en-gb': { empty: 'Enter a coupon code.', invalid: 'Invalid or expired coupon.' },
}
