import { useState } from 'react'
import { ShieldCheck, LogOut, Loader2 } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import { shopT } from '@/i18n/shopStrings'
import { useAdminSession } from '@/lib/admin/useAdminSession'
import { changeOwnPassword } from '@/lib/account/profile'
import { getErrorMessage } from '@/lib/pocketbase/errors'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AdminLoginPage from './AdminLoginPage'
import AdminStatsCards from './AdminStatsCards'
import AdminProductsTab from './AdminProductsTab'
import AdminCategoriesTab from './AdminCategoriesTab'
import AdminOrdersTab from './AdminOrdersTab'
import AdminCouponsTab from './AdminCouponsTab'

type AdminTab = 'products' | 'categories' | 'orders' | 'coupons'

/**
 * Painel administrativo — Etapa 4. Protegido por useAdminSession (coleção
 * `admins`); sem sessão válida mostra o AdminLoginPage. Oferece a troca da
 * senha de demonstração logo após o primeiro acesso.
 */
export default function AdminDashboard() {
  const { locale } = useLocale()
  const t = (key: string, vars?: Record<string, string>) => shopT(locale, key, vars)
  const { checking, isAdmin, logout } = useAdminSession()
  const [tab, setTab] = useState<AdminTab>('products')
  const [showPasswordForm, setShowPasswordForm] = useState(true)

  if (checking) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        {t('account.loading')}
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto w-full max-w-md">
          <AdminLoginPage onSuccess={() => setShowPasswordForm(true)} />
        </div>
      </div>
    )
  }

  const tabs: { id: AdminTab; label: string }[] = [
    { id: 'products', label: t('admin.tabProducts') },
    { id: 'categories', label: t('admin.tabCategories') },
    { id: 'orders', label: t('admin.tabOrders') },
    { id: 'coupons', label: t('admin.tabCoupons') },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-primary" aria-hidden />
          <h1 className="font-serif text-2xl text-foreground">{t('admin.title')}</h1>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={logout}
          className="gap-1.5 text-muted-foreground hover:text-destructive"
        >
          <LogOut className="h-3.5 w-3.5" aria-hidden />
          {t('account.logout')}
        </Button>
      </div>

      <div className="mt-6">
        <AdminStatsCards />
      </div>

      {showPasswordForm && <DemoPasswordForm onDismiss={() => setShowPasswordForm(false)} />}

      <nav className="mt-8 flex flex-wrap gap-2 border-b border-border/60 pb-3">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={
              tab === id
                ? 'rounded-full bg-primary px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-primary-foreground'
                : 'rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:bg-muted'
            }
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-6">
        {tab === 'products' && <AdminProductsTab />}
        {tab === 'categories' && <AdminCategoriesTab />}
        {tab === 'orders' && <AdminOrdersTab />}
        {tab === 'coupons' && <AdminCouponsTab />}
      </div>
    </div>
  )
}

/** Troca imediata da senha de demonstração (pendência de segurança). */
function DemoPasswordForm({ onDismiss }: { onDismiss: () => void }) {
  const { locale } = useLocale()
  const t = (key: string) => shopT(locale, key)
  const [oldPw, setOldPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (newPw !== confirm) {
      setError(t('admin.passwordMismatch'))
      return
    }
    setBusy(true)
    setError(null)
    try {
      await changeOwnPassword(oldPw, newPw)
      setMessage(t('admin.passwordChanged'))
      setOldPw('')
      setNewPw('')
      setConfirm('')
      onDismiss()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mt-6 rounded-lg border border-primary/40 bg-primary/5 p-5">
      <p className="text-sm font-medium text-foreground">{t('admin.demoPasswordTitle')}</p>
      <p className="mt-1 text-xs text-muted-foreground">{t('admin.demoPasswordHint')}</p>
      <form onSubmit={handleSubmit} className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="space-y-1">
          <Label htmlFor="demo-old" className="text-xs text-muted-foreground">
            {t('account.currentPassword')}
          </Label>
          <Input
            id="demo-old"
            type="password"
            value={oldPw}
            onChange={(e) => setOldPw(e.target.value)}
            required
            autoComplete="current-password"
            className="bg-background"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="demo-new" className="text-xs text-muted-foreground">
            {t('admin.newPassword')}
          </Label>
          <Input
            id="demo-new"
            type="password"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            required
            autoComplete="new-password"
            className="bg-background"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="demo-confirm" className="text-xs text-muted-foreground">
            {t('admin.confirmPassword')}
          </Label>
          <Input
            id="demo-confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            autoComplete="new-password"
            className="bg-background"
          />
        </div>
        <div className="flex items-center gap-3 sm:col-span-3">
          <Button type="submit" disabled={busy} className="bg-primary hover:bg-primary/90">
            {t('account.save')}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onDismiss}
            className="text-muted-foreground"
          >
            {t('account.cancel')}
          </Button>
          {busy && (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" aria-hidden />
          )}
          {error && (
            <p className="text-xs text-destructive" role="alert">
              {error}
            </p>
          )}
          {message && <p className="text-xs text-primary">{message}</p>}
        </div>
      </form>
    </div>
  )
}
