import { useCallback, useEffect, useState } from 'react'
import pb from '@/lib/pocketbase/client'
import { fetchFavoriteSlugs, addFavorite, removeFavorite } from '@/lib/favorites'

/**
 * Hook global de favoritos — Etapa 4. Uma única instância por sessão de
 * página compartilhada via módulo: cards e página de produto leem/escrevem
 * no mesmo Set de slugs, e o backend persiste em `favorites`.
 */
const listeners = new Set<(s: Set<string>) => void>()
let slugs = new Set<string>()
let loaded = false

function emit() {
  listeners.forEach((l) => l(new Set(slugs)))
}

async function reload(): Promise<void> {
  slugs = await fetchFavoriteSlugs()
  loaded = true
  emit()
}

export function useFavorites() {
  const [current, setCurrent] = useState<Set<string>>(() => new Set(slugs))
  const [ready, setReady] = useState(loaded)

  useEffect(() => {
    const listener = (s: Set<string>) => setCurrent(new Set(s))
    listeners.add(listener)
    if (!loaded) {
      reload()
        .catch(() => setReady(true))
        .finally(() => setReady(true))
    }
    const onChange = () => {
      loaded = false
      slugs = new Set()
      setCurrent(new Set())
    }
    const unsubscribe = pb.authStore.onChange(onChange)
    return () => {
      listeners.delete(listener)
      unsubscribe()
    }
  }, [])

  const toggle = useCallback(async (slug: string) => {
    if (!pb.authStore.isValid) return false
    if (slugs.has(slug)) {
      slugs.delete(slug)
      emit()
      try {
        await removeFavorite(slug)
      } catch {
        slugs.add(slug)
        emit()
        return false
      }
      return true
    }
    slugs.add(slug)
    emit()
    try {
      await addFavorite(slug)
      return true
    } catch {
      slugs.delete(slug)
      emit()
      return false
    }
  }, [])

  const isFavorite = useCallback((slug: string) => current.has(slug), [current])

  return { favorites: current, ready, toggle, isFavorite }
}
