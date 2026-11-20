import React from 'react'
import { Navigate } from 'react-router-dom'
import { DEFAULT_LOCALE, Locale } from '@/i18n/types'

const STORAGE_KEY = 'alma_y_aroma_locale'

export function RootRedirect() {
  let targetLocale: Locale = DEFAULT_LOCALE

  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (stored && (stored === 'pt-br' || stored === 'es' || stored === 'en-gb')) {
      targetLocale = stored
    }
  } catch {
    // Ignore storage issues
  }

  return <Navigate to={`/${targetLocale}/`} replace />
}
