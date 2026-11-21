import { useSyncExternalStore } from 'react'
import { cartStore, CartTotals } from './cartStore'

/** Assina o carrinho com useSyncExternalStore (re-render em qualquer mudança). */
export function useCart() {
  const state = useSyncExternalStore(cartStore.subscribe, cartStore.getState)
  const totals: CartTotals = cartStore.totals()
  return { ...state, totals, store: cartStore }
}
