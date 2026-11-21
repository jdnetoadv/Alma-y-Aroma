import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { CatalogProduct } from '@/data/types'

/** Item do carrinho — guarda o essencial para sobreviver sem o catálogo em memória. */
export interface CartItem {
  productId: string
  slug: string
  name: string
  image: string
  unitPrice: number
  quantity: number
  variation?: string
}

interface CartContextValue {
  items: CartItem[]
  addItem: (product: CatalogProduct, quantity?: number, variation?: string) => void
  removeItem: (productId: string, variation?: string) => void
  updateQuantity: (productId: string, variation: string | undefined, quantity: number) => void
  clear: () => void
  subtotal: number
  itemCount: number
}

const STORAGE_KEY = 'aya_cart_v1'

const CartContext = createContext<CartContextValue | null>(null)

function sameItem(a: CartItem, productId: string, variation?: string) {
  return a.productId === productId && (a.variation ?? '') === (variation ?? '')
}

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as CartItem[]) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => load())

  // Persistência local: o carrinho sobrevive à navegação e ao refresh (pedido 3).
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* armazenamento indisponível — o carrinho vive só em memória */
    }
  }, [items])

  const addItem = useCallback((product: CatalogProduct, quantity = 1, variation?: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => sameItem(i, product.id, variation))
      if (existing) {
        return prev.map((i) =>
          sameItem(i, product.id, variation)
            ? { ...i, quantity: Math.min(99, i.quantity + quantity) }
            : i,
        )
      }
      return [
        ...prev,
        {
          productId: product.id,
          slug: product.slug,
          name: product.name['pt-br'],
          image: product.images[0],
          unitPrice: product.illustrativePrice,
          quantity: Math.max(1, quantity),
          variation,
        },
      ]
    })
  }, [])

  const removeItem = useCallback((productId: string, variation?: string) => {
    setItems((prev) => prev.filter((i) => !sameItem(i, productId, variation)))
  }, [])

  const updateQuantity = useCallback(
    (productId: string, variation: string | undefined, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId, variation)
        return
      }
      setItems((prev) =>
        prev.map((i) =>
          sameItem(i, productId, variation) ? { ...i, quantity: Math.min(99, quantity) } : i,
        ),
      )
    },
    [removeItem],
  )

  const clear = useCallback(() => setItems([]), [])

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
    return { items, addItem, removeItem, updateQuantity, clear, subtotal, itemCount }
  }, [items, addItem, removeItem, updateQuantity, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart deve ser usado dentro de CartProvider')
  return ctx
}
