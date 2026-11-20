import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { DEFAULT_LOCALE, LOCALES, Locale, TranslationDictionary } from './types'
import { ptBR } from './pt-br'
import { es } from './es'
import { enGB } from './en-gb'

const dictionaries: Record<Locale, TranslationDictionary> = {
  'pt-br': ptBR,
  es,
  'en-gb': enGB,
}

const STORAGE_KEY = 'alma_y_aroma_locale'

interface LocaleContextValue {
  locale: Locale
  setLocale: (newLocale: Locale) => void
  t: (key: keyof TranslationDictionary) => string
  locales: typeof LOCALES
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function extractLocaleFromPath(pathname: string): Locale | null {
  const parts = pathname.split('/').filter(Boolean)
  const first = parts[0]?.toLowerCase()
  if (first === 'pt-br' || first === 'es' || first === 'en-gb') {
    return first as Locale
  }
  return null
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()

  // Initialize from URL first, then localStorage, then default
  const [currentLocale, setCurrentLocale] = useState<Locale>(() => {
    const fromPath = extractLocaleFromPath(location.pathname)
    if (fromPath) return fromPath

    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
      if (stored && (stored === 'pt-br' || stored === 'es' || stored === 'en-gb')) {
        return stored
      }
    } catch {
      // Ignore storage errors
    }
    return DEFAULT_LOCALE
  })

  // Sync state with path changes
  useEffect(() => {
    const fromPath = extractLocaleFromPath(location.pathname)
    if (fromPath && fromPath !== currentLocale) {
      setCurrentLocale(fromPath)
      try {
        localStorage.setItem(STORAGE_KEY, fromPath)
      } catch {
        // Ignore storage errors
      }
    }
  }, [location.pathname, currentLocale])

  // Update HTML lang attribute
  useEffect(() => {
    const meta = LOCALES[currentLocale]
    if (meta) {
      document.documentElement.lang = meta.htmlLang
    }
  }, [currentLocale])

  const changeLocale = (nextLocale: Locale) => {
    if (nextLocale === currentLocale) return

    setCurrentLocale(nextLocale)
    try {
      localStorage.setItem(STORAGE_KEY, nextLocale)
    } catch {
      // Ignore storage errors
    }

    // Preserve the current path and hash
    const parts = location.pathname.split('/').filter(Boolean)
    const existingIsLocale = parts[0] === 'pt-br' || parts[0] === 'es' || parts[0] === 'en-gb'
    const remaining = existingIsLocale ? parts.slice(1).join('/') : parts.join('/')
    const nextPath = `/${nextLocale}${remaining ? `/${remaining}` : ''}${location.hash || ''}`

    navigate(nextPath, { replace: false })
  }

  const t = useMemo(() => {
    const dict = dictionaries[currentLocale] || dictionaries[DEFAULT_LOCALE]
    return (key: keyof TranslationDictionary): string => {
      const value = dict[key]
      if (value !== undefined) return value
      // Fallback to default locale
      const fallback = dictionaries[DEFAULT_LOCALE][key]
      return fallback !== undefined ? fallback : (key as string)
    }
  }, [currentLocale])

  const value = useMemo(
    () => ({
      locale: currentLocale,
      setLocale: changeLocale,
      t,
      locales: LOCALES,
    }),
    [currentLocale, t],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return ctx
}
