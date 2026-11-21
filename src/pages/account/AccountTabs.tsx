import { useEffect, useState } from 'react'
import { Heart, MapPin, Package, User as UserIcon } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import type { Locale } from '@/i18n/types'
import { shopT } from '@/i18n/shopStrings'
import { useAuth } from '@/lib/auth/AuthContext'
import { useFavorites } from '@/lib/favorites/useFavorites'
import {
  listMyOrders,
  CustomerOrder,
  orderStatusLabel,
  orderSummaryLine,
} from '@/lib/account/orders'
import {
  SavedAddress,
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  NewAddress,
} from '@/lib/account/addresses'
import {
  fetchProfile,
  saveProfile,
  updateAccount,
  changeOwnPassword,
  ProfileData,
} from '@/lib/account/profile'
import { catalogRepository, formatPrice } from '@/data/repository'
import { getErrorMessage } from '@/lib/pocketbase/errors'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type Tab = 'orders' | 'addresses' | 'favorites' | 'profile'

const TABS: { id: Tab; icon: typeof Package }[] = [
  { id: 'orders', icon: Package },
  { id: 'addresses', icon: MapPin },
  { id: 'favorites', icon: Heart },
  { id: 'profile', icon: UserIcon },
]

/** Abas da área do cliente logado: pedidos, endereços, favoritos e dados. */
export default function AccountTabs() {
  const { locale } = useLocale()
  const t = (key: string, vars?: Record<string, string>) => shopT(locale, key, vars)
  const { user } = useAuth()

  const [tab, setTab] = useState<Tab>('orders')
  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      <nav aria-label={t('account.title')} className="flex flex-row flex-wrap gap-2 lg:flex-col">
        {TABS.map(({ id, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            aria-current={tab === id}
            className={cn(
              'inline-flex items-center gap-2 rounded-md border px-4 py-2.5 text-left text-sm transition-colors',
              tab === id
                ? 'border-primary/50 bg-primary/10 font-medium text-foreground'
                : 'border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground',
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {t(`account.tab.${id}`)}
          </button>
        ))}
      </nav>

      <section className="min-w-0">
        {tab === 'orders' && <OrdersTab locale={locale} />}
        {tab === 'addresses' && <AddressesTab />}
        {tab === 'favorites' && <FavoritesTab />}
        {tab === 'profile' && user && <ProfileTab />}
      </section>
    </div>
  )
}

/* ------------------------------- Pedidos ------------------------------- */

function OrdersTab({ locale }: { locale: Locale }) {
  const t = (key: string, vars?: Record<string, string>) => shopT(locale, key, vars)
  const [orders, setOrders] = useState<CustomerOrder[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    listMyOrders()
      .then((rows) => !cancelled && setOrders(rows))
      .catch((err) => !cancelled && setError(getErrorMessage(err)))
    return () => {
      cancelled = true
    }
  }, [])

  if (error) return <p className="text-sm text-destructive">{error}</p>
  if (!orders) return <p className="text-sm text-muted-foreground">{t('account.loading')}</p>
  if (!orders.length) return <EmptyState text={t('account.noOrders')} />

  return (
    <ul className="space-y-4">
      {orders.map((order) => (
        <li key={order.id} className="rounded-lg border border-border/60 bg-card p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-serif text-lg text-foreground">{order.code}</p>
            <span
              className={cn(
                'rounded-full border px-2.5 py-0.5 text-[11px] uppercase tracking-wider',
                order.status === 'canceled'
                  ? 'border-destructive/40 text-destructive'
                  : 'border-primary/40 text-primary',
              )}
            >
              {orderStatusLabel(locale, order.status)}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {new Date(order.created).toLocaleDateString(
              locale === 'pt-br' ? 'pt-BR' : locale === 'es' ? 'es-ES' : 'en-GB',
            )}
            {' · '}
            {orderSummaryLine(order, locale)}
          </p>
          <p className="mt-2 text-sm font-medium text-foreground">
            {formatPrice(order.total, locale)}
          </p>
        </li>
      ))}
    </ul>
  )
}

/* ------------------------------ Endereços ------------------------------ */

const EMPTY_ADDRESS: NewAddress = {
  isDefault: false,
  label: '',
  postcode: '',
  street: '',
  number: '',
  complement: '',
  district: '',
  city: '',
  state: '',
  country: 'Brasil',
}

function AddressesTab() {
  const { locale } = useLocale()
  const t = (key: string, vars?: Record<string, string>) => shopT(locale, key, vars)
  const [list, setList] = useState<SavedAddress[] | null>(null)
  const [editing, setEditing] = useState<SavedAddress | null>(null)
  const [draft, setDraft] = useState<NewAddress>(EMPTY_ADDRESS)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function reload() {
    try {
      setList(await listAddresses())
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }
  useEffect(() => {
    reload()
  }, [])

  async function run(action: () => Promise<unknown>) {
    setBusy(true)
    setError(null)
    try {
      await action()
      setShowForm(false)
      setEditing(null)
      setDraft(EMPTY_ADDRESS)
      await reload()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const fields: { key: keyof NewAddress; labelKey: string }[] = [
    { key: 'label', labelKey: 'account.addressLabel' },
    { key: 'postcode', labelKey: 'account.addressPostcode' },
    { key: 'street', labelKey: 'account.addressStreet' },
    { key: 'number', labelKey: 'account.addressNumber' },
    { key: 'complement', labelKey: 'account.addressComplement' },
    { key: 'district', labelKey: 'account.addressDistrict' },
    { key: 'city', labelKey: 'account.addressCity' },
    { key: 'state', labelKey: 'account.addressState' },
  ]

  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          setEditing(null)
          setDraft(EMPTY_ADDRESS)
          setShowForm(true)
        }}
      >
        {t('account.addressNew')}
      </Button>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {!list && <p className="text-sm text-muted-foreground">{t('account.loading')}</p>}
      {list && !list.length && !showForm && <EmptyState text={t('account.noAddresses')} />}

      <ul className="space-y-3">
        {list?.map((addr) => (
          <li key={addr.id} className="rounded-lg border border-border/60 bg-card p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-serif text-lg text-foreground">
                {addr.label || addr.city}
                {addr.isDefault && (
                  <span className="ml-2 rounded-full border border-primary/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-primary">
                    {t('account.addressDefault')}
                  </span>
                )}
              </p>
              <div className="flex gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(addr)
                    setDraft({ ...addr })
                    setShowForm(true)
                  }}
                  className="text-primary hover:opacity-70"
                >
                  {t('account.edit')}
                </button>
                <button
                  type="button"
                  onClick={() => run(() => deleteAddress(addr.id))}
                  className="text-destructive hover:opacity-70"
                >
                  {t('account.delete')}
                </button>
              </div>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {addr.street}, {addr.number}
              {addr.complement ? ` · ${addr.complement}` : ''} · {addr.district} · {addr.city} —{' '}
              {addr.state} · {addr.postcode}
            </p>
            {!addr.isDefault && (
              <button
                type="button"
                onClick={() => run(() => setDefaultAddress(addr.id))}
                className="mt-2 text-xs text-muted-foreground transition-colors hover:text-primary"
              >
                {t('account.addressMakeDefault')}
              </button>
            )}
          </li>
        ))}
      </ul>

      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            run(() => (editing ? updateAddress(editing.id, draft) : createAddress(draft)))
          }}
          className="space-y-3 rounded-lg border border-primary/30 bg-card p-5"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map(({ key, labelKey }) => (
              <div key={key} className="space-y-1">
                <Label htmlFor={`addr-${key}`} className="text-xs text-muted-foreground">
                  {t(labelKey)}
                </Label>
                <Input
                  id={`addr-${key}`}
                  value={String(draft[key] ?? '')}
                  onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                  className="bg-background"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2 pt-1">
            <Button type="submit" disabled={busy} className="bg-primary hover:bg-primary/90">
              {editing ? t('account.save') : t('account.addressNew')}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
              {t('account.cancel')}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

/* ------------------------------ Favoritos ------------------------------ */

function FavoritesTab() {
  const { locale } = useLocale()
  const t = (key: string, vars?: Record<string, string>) => shopT(locale, key, vars)
  const { favorites, ready, toggle } = useFavorites()

  const items = catalogRepository.listProducts().filter((p) => favorites.has(p.slug))

  if (!ready) return <p className="text-sm text-muted-foreground">{t('account.loading')}</p>
  if (!items.length) return <EmptyState text={t('account.noFavorites')} />

  return (
    <ul className="space-y-3">
      {items.map((p) => (
        <li
          key={p.id}
          className="flex items-center gap-4 rounded-lg border border-border/60 bg-card p-4"
        >
          <img
            src={p.images[0]}
            alt=""
            className="h-16 w-16 shrink-0 rounded-md object-cover"
            loading="lazy"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-serif text-base text-foreground">{p.name[locale]}</p>
            <p className="text-xs text-muted-foreground">
              {formatPrice(p.illustrativePrice, locale)}
            </p>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={() => toggle(p.slug)}>
            <Heart className="mr-1.5 h-3.5 w-3.5 fill-current text-destructive" aria-hidden />
            {t('account.favoriteRemove')}
          </Button>
        </li>
      ))}
    </ul>
  )
}

/* ---------------------------- Dados pessoais --------------------------- */

function ProfileTab() {
  const { locale } = useLocale()
  const t = (key: string, vars?: Record<string, string>) => shopT(locale, key, vars)
  const { user } = useAuth()

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [status, setStatus] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!user) return
    fetchProfile()
      .then((p) => {
        setProfile(p)
        setName(user.name || '')
        setPhone(p?.phone ?? '')
      })
      .catch(() => {
        setProfile(null)
        setName(user.name || '')
      })
  }, [user])

  async function submitProfile(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setStatus(null)
    try {
      await updateAccount(name)
      await saveProfile({
        phone,
        cpf: profile?.cpf ?? '',
        marketingOptIn: profile?.marketingOptIn ?? false,
      })
      setStatus({ kind: 'ok', text: t('account.saved') })
    } catch (err) {
      setStatus({ kind: 'err', text: getErrorMessage(err) })
    } finally {
      setBusy(false)
    }
  }

  async function submitPassword(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setStatus(null)
    try {
      await changeOwnPassword(oldPassword, newPassword)
      setOldPassword('')
      setNewPassword('')
      setStatus({ kind: 'ok', text: t('account.passwordChanged') })
    } catch (err) {
      setStatus({ kind: 'err', text: getErrorMessage(err) })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={submitProfile}
        className="space-y-4 rounded-lg border border-border/60 bg-card p-6"
      >
        <h3 className="font-serif text-xl text-foreground">{t('account.profileTitle')}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="profile-name" className="text-xs text-muted-foreground">
              {t('account.name')}
            </Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="profile-phone" className="text-xs text-muted-foreground">
              {t('account.phone')}
            </Label>
            <Input
              id="profile-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-background"
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">{t('account.email')}</Label>
          <p className="text-sm text-foreground">{user?.email}</p>
        </div>
        <Button type="submit" disabled={busy} className="bg-primary hover:bg-primary/90">
          {t('account.save')}
        </Button>
      </form>

      <form
        onSubmit={submitPassword}
        className="space-y-4 rounded-lg border border-border/60 bg-card p-6"
      >
        <h3 className="font-serif text-xl text-foreground">{t('account.passwordTitle')}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="old-password" className="text-xs text-muted-foreground">
              {t('account.oldPassword')}
            </Label>
            <Input
              id="old-password"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="bg-background"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="new-password" className="text-xs text-muted-foreground">
              {t('account.newPassword')}
            </Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="bg-background"
            />
          </div>
        </div>
        <Button type="submit" disabled={busy} className="bg-primary hover:bg-primary/90">
          {t('account.changePassword')}
        </Button>
      </form>

      {status && (
        <p
          className={cn('text-sm', status.kind === 'ok' ? 'text-primary' : 'text-destructive')}
          role="status"
        >
          {status.text}
        </p>
      )}
    </div>
  )
}

/* ------------------------------- Helpers ------------------------------- */

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border/60 bg-card/50 px-6 py-12 text-center text-sm text-muted-foreground">
      {text}
    </div>
  )
}
