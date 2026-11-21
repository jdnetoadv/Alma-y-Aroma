import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useLocale } from '@/i18n/LocaleContext'
import { shopT } from '@/i18n/shopStrings'
import { useAuth } from '@/lib/auth/AuthContext'
import { CatalogBreadcrumb, CollectionHeader } from '@/components/catalog/CatalogShared'
import AccountAuthForms from './account/AccountAuthForms'
import AccountTabs from './account/AccountTabs'

/**
 * Área do cliente — Etapa 4. Deslogado: login, cadastro e recuperação de
 * senha (coleção `users`). Logado: abas de pedidos, endereços, favoritos
 * e dados pessoais.
 */
export default function AccountPage() {
  const { locale } = useLocale()
  const t = (key: string, vars?: Record<string, string>) => shopT(locale, key, vars)
  const { user, ready, logout } = useAuth()

  // Sessão vencida/expirada após carregamento: volta ao login.
  useEffect(() => {
    // nada — gatilho de re-render vem do próprio useAuth
  }, [])

  const loggedOut = ready && !user

  return (
    <div className="min-h-screen">
      <CatalogBreadcrumb
        className="mx-auto max-w-6xl px-4 pt-6 sm:px-6"
        items={[{ label: t('account.title') }]}
      />
      <CollectionHeader
        badge={t('account.demoBadge')}
        title={t('account.title')}
        description={t('account.subtitle')}
      />

      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6" id="account-tabs">
        {!ready ? (
          <p className="py-12 text-center text-sm text-muted-foreground">{t('account.loading')}</p>
        ) : loggedOut ? (
          <AccountAuthForms />
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between gap-4">
              <Link
                to={`/${locale}/loja`}
                className="text-xs uppercase tracking-[0.2em] text-primary transition-opacity hover:opacity-70"
              >
                {t('cart.continueShopping')}
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className="text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-destructive"
              >
                {t('account.logout')}
              </button>
            </div>
            <AccountTabs />
          </>
        )}
      </div>
    </div>
  )
}
