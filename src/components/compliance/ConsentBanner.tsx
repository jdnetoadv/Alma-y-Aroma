import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Locale } from '@/i18n/types'
import { shopT } from '@/i18n/shopStrings'
import { Button } from '@/components/ui/button'

const CONSENT_STORAGE_KEY = 'alma_y_aroma_cookie_consent'

type ConsentChoice = 'accepted' | 'rejected'

export function readConsentChoice(): ConsentChoice | null {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY)
    if (raw === 'accepted' || raw === 'rejected') return raw
    return null
  } catch {
    return null
  }
}

/**
 * Banner de consentimento LGPD/GDPR (Etapa 4).
 * Aparece na primeira visita; grava a escolha em localStorage e não reaparece
 * após aceitar ou recusar. Discreto, no estilo da marca.
 */
export function ConsentBanner({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(false)
  const t = (key: string) => shopT(locale, key)

  useEffect(() => {
    if (readConsentChoice() === null) {
      setVisible(true)
    }
  }, [])

  const decide = (choice: ConsentChoice) => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, choice)
    } catch {
      // mesmo sem storage não reabrimos nesta sessão
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t('consent.title')}
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-border/60 bg-card/95 px-5 py-4 shadow-lg backdrop-blur sm:px-8 sm:py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="font-serif text-sm font-medium tracking-wide text-foreground">
              {t('consent.title')}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {t('consent.body')}{' '}
              <Link
                to={`/${locale}/cookies`}
                className="underline underline-offset-2 hover:text-foreground"
              >
                {t('consent.more')}
              </Link>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => decide('rejected')}>
              {t('consent.reject')}
            </Button>
            <Button size="sm" onClick={() => decide('accepted')}>
              {t('consent.accept')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
