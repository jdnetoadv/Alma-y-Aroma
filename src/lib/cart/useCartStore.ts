import { useEffect, useState } from 'react'
import { cartStore, CartItem, CartTotals, AppliedCoupon } from './cartStore'

/**
 * Hook React sobre o cartStore vanilla (fonte única de verdade do carrinho).
 * Re-renderiza o componente quando o store emite mudança e hidrata o estado
 * a partir do localStorage na primeira leitura.
 */
export function useCartStore() {
  const [state, setState] = useState(() => cartStore.getState())

  useEffect(() => cartStore.subscribe(() => setState({ ...cartStore.getState() })), [])

  const totals = state.items.length
    ? cartStore.totals(null) // estimativa demonstrativa local
    : { subtotal: 0, discount: 0, shipping: 0, total: 0, freeShipping: false }

  return {
    items: state.items,
    coupon: state.coupon,
    totals: totals as CartTotals,
    itemCount: state.items.reduce((acc, i) => acc + i.quantity, 0),
    addItem: cartStore.addItem,
    updateQuantity: cartStore.updateQuantity,
    removeItem: cartStore.removeItem,
    clear: cartStore.clear,
    setCoupon: cartStore.setCoupon,
  }
}

export type { CartItem, AppliedCoupon, CartTotals }
