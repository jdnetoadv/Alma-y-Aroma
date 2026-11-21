import { useState } from 'react'
import { ShieldCheck, KeyRound } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import { shopT } from '@/i18n/shopStrings'
import { useAdminSession } from '@/lib/admin/useAdminSession'
import { changeOwnPassword } from '@/lib/account/profile'
import { getErrorMessage } from '@/lib/pocketbase/errors'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

/**
 * Login do painel admin — Etapa 4. Mesma coleção `users` + verificação na
 * coleção `admins` (useAdminSession). Ao entrar, oferece imediatamente a
 * troca da senha de demonstração (pendência de segurança declarada).
 */
export default function AdminLoginPage({ onSuccess }: { onSuccess: () => void }) {
  const { locale } = useLocale()
  const t = (key: string, vars?: Record<string, string>) => shopT(locale, key, vars)
  const { login } = useAdminSession()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const ok = await login(email.trim(), password)
      if (!ok) {
        setError(t('admin.loginDenied'))
        return
      }
      onSuccess()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-lg border border-border/60 bg-card p-8">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-6 w-6 text-primary" aria-hidden />
        <h2 className="font-serif text-2xl text-foreground">{t('admin.loginTitle')}</h2>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{t('admin.loginHint')}</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="admin-email" className="text-xs text-muted-foreground">
            {t('account.email')}
          </Label>
          <Input
            id="admin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="bg-background"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="admin-password" className="text-xs text-muted-foreground">
            {t('account.password')}
          </Label>
          <Input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="bg-background"
          />
        </div>
        {error && (
          <p className="text-xs text-destructive" role="alert">
            {error}
          </p>
        )}
        <Button
          type="submit"
          disabled={busy}
          className="h-11 w-full bg-primary hover:bg-primary/90"
        >
          {t('admin.loginTitle')}
        </Button>
      </form>

      <p className="mt-4 flex items-start gap-2 rounded-md border border-primary/30 bg-primary/5 p-3 text-[11px] leading-relaxed text-muted-foreground">
        <KeyRound className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
        {t('admin.demoAccountNote')}
      </p>
    </div>
  )
}
