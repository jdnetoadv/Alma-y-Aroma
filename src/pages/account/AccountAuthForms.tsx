import { useState } from 'react'
import { User, Lock, Mail, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/lib/auth/AuthContext'
import { useLocale } from '@/i18n/LocaleContext'
import { shopT } from '@/i18n/shopStrings'
import { getErrorMessage } from '@/lib/pocketbase/errors'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BrandSeal } from '@/components/common/BrandSeal'

/**
 * Formulários de acesso da área do cliente — Etapa 4. Login, cadastro
 * (nome, e-mail, senha) e recuperação de senha contra a coleção `users`.
 */
export default function AccountAuthForms() {
  const { user, login, signup, logout, requestPasswordReset } = useAuth()
  const { locale } = useLocale()
  const t = (key: string, vars?: Record<string, string>) => shopT(locale, key, vars)

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [lgpd, setLgpd] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setNotice(null)
    setBusy(true)
    try {
      if (mode === 'login') {
        await login(email.trim(), password)
      } else if (mode === 'signup') {
        if (password.length < 8) {
          setError(
            locale === 'pt-br'
              ? 'A senha precisa ter ao menos 8 caracteres.'
              : locale === 'es'
                ? 'La contraseña necesita al menos 8 caracteres.'
                : 'The password needs at least 8 characters.',
          )
          return
        }
        if (password !== confirm) {
          setError(t('account.passwordMismatch'))
          return
        }
        await signup(name.trim(), email.trim(), password, lgpd)
      } else {
        await requestPasswordReset(email.trim())
        setNotice(t('account.forgotSent'))
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  // Logado: convite simples para abrir a área do cliente. (vinho/dourado do banner)
  if (user) {
    return (
      <div className="relative overflow-hidden rounded-lg border border-gold/30 bg-wine-deep p-8 text-center shadow-[0_8px_30px_rgba(59,23,21,0.35)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(208,120,50,0.18),transparent_70%)]"
        />
        <div className="relative">
          {/* Selo circular da marca (vinho/dourado), discreto */}
          <BrandSeal title="Alma y Aroma" className="mx-auto mb-5 h-16 w-16 opacity-90" />
          <p className="font-serif text-2xl text-cream">
            {t('account.welcome', { name: user.name || user.email })}
          </p>
          <Button asChild className="mt-6 bg-gold text-wine-deep hover:bg-gold-hover">
            <a href="#account-tabs">{t('account.title')}</a>
          </Button>
          <button
            type="button"
            onClick={() => logout()}
            className="mt-4 block w-full text-xs uppercase tracking-[0.2em] text-cream/60 transition-colors hover:text-gold-light"
          >
            {t('account.logout')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative mx-auto max-w-md overflow-hidden rounded-lg border border-gold/30 bg-wine-deep p-8 shadow-[0_8px_30px_rgba(59,23,21,0.35)]">
      {/* Atmosfera quente do banner: halo âmbar no topo + filete dourado na base */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(208,120,50,0.18),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"
      />
      <div className="relative">
        {/* Selo circular da marca (vinho/dourado), discreto */}
        <BrandSeal title="Alma y Aroma" className="mb-6 h-16 w-16 opacity-90" />
        <h2 className="font-serif text-2xl text-cream">
          {mode === 'signup'
            ? t('account.signup')
            : mode === 'forgot'
              ? t('account.forgot')
              : t('account.login')}
        </h2>
        <p className="mt-2 text-sm text-cream/70">{t('account.loginRequired')}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === 'signup' && (
            <div className="space-y-1.5">
              <Label htmlFor="acc-name" className="text-xs text-cream/60">
                {t('account.name')}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-cream/50" />
                <Input
                  id="acc-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  className="border-cream/25 bg-wine/40 pl-9 text-cream placeholder:text-cream/40 focus-visible:ring-gold"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="acc-email" className="text-xs text-cream/60">
              {t('account.email')}
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-cream/50" />
              <Input
                id="acc-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="border-cream/25 bg-wine/40 pl-9 text-cream placeholder:text-cream/40 focus-visible:ring-gold"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div className="space-y-1.5">
              <Label htmlFor="acc-password" className="text-xs text-cream/60">
                {t('account.password')}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-cream/50" />
                <Input
                  id="acc-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  className="border-cream/25 bg-wine/40 pl-9 text-cream placeholder:text-cream/40 focus-visible:ring-gold"
                />
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div className="space-y-1.5">
              <Label htmlFor="acc-confirm" className="text-xs text-cream/60">
                {t('account.confirmPassword')}
              </Label>
              <Input
                id="acc-confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
                className="border-cream/25 bg-wine/40 text-cream placeholder:text-cream/40 focus-visible:ring-gold"
              />
            </div>
          )}

          {mode === 'signup' && (
            <label className="flex cursor-pointer items-start gap-2 pt-1 text-xs leading-relaxed text-cream/70">
              <input
                type="checkbox"
                checked={lgpd}
                onChange={(e) => setLgpd(e.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 accent-gold"
                required
              />
              <span>{t('account.lgpdConsent')}</span>
            </label>
          )}

          {error && (
            <p className="text-xs text-red-300" role="alert">
              {error}
            </p>
          )}
          {notice && (
            <p className="text-xs text-gold-light" role="status">
              {notice}
            </p>
          )}

          <Button
            type="submit"
            disabled={busy}
            className="h-11 w-full bg-gold text-wine-deep hover:bg-gold-hover"
          >
            <ShieldCheck className="mr-2 h-4 w-4" aria-hidden />
            {mode === 'signup'
              ? t('account.signup')
              : mode === 'forgot'
                ? t('account.forgot')
                : t('account.login')}
          </Button>
        </form>

        <div className="mt-6 space-y-2 border-t border-gold/20 pt-4 text-center text-xs">
          {mode !== 'signup' && (
            <button
              type="button"
              onClick={() => setMode('signup')}
              className="block w-full text-gold-light transition-opacity hover:opacity-70"
            >
              {t('account.modeSignup')}
            </button>
          )}
          {mode !== 'login' && (
            <button
              type="button"
              onClick={() => setMode('login')}
              className="block w-full text-cream/60 transition-colors hover:text-cream"
            >
              {t('account.modeLogin')}
            </button>
          )}
          {mode !== 'forgot' && (
            <button
              type="button"
              onClick={() => setMode('forgot')}
              className="block w-full text-cream/60 transition-colors hover:text-cream"
            >
              {t('account.forgot')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
