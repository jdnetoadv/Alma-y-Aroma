import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, Truck, CreditCard, Check, ShieldCheck } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import { shopT } from '@/i18n/shopStrings'
import { useCartStore } from '@/lib/cart/useCartStore'
import { PaymentMethod, createDemoOrder, DemoOrderResult } from '@/lib/orders'
import {
  AddressInput,
  shippingQuotes,
  isValidBrazilianPostcode,
  quoteShipping,
  ShippingQuote,
} from '@/lib/shipping'
import { formatPrice } from '@/data/repository'
import { CatalogBreadcrumb } from '@/components/catalog/CatalogShared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

/**
 * Checkout — Etapa 3. Endereço, modalidade de frete e escolha INFORMATIVA de
 * pagamento. Nenhuma cobrança real: o pedido é criado via orders.ts como
 * demonstração (isDemonstration: true, status demo_*).
 */
export default function CheckoutPage() {
  const { locale } = useLocale()
  const t = (key: string, vars?: Record<string, string>) => shopT(locale, key, vars)
  const navigate = useNavigate()
  const { items, coupon, totals, clear } = useCartStore()
  const localePrefix = `/${locale}`

  const [form, setForm] = useState({
    name: '',
    postcode: '',
    street: '',
    number: '',
    complement: '',
    district: '',
    city: '',
    state: '',
  })
  const [selectedQuote, setSelectedQuote] = useState<ShippingQuote | null>(null)
  const [payment, setPayment] = useState<PaymentMethod>('pix')
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [placed, setPlaced] = useState<DemoOrderResult | null>(null)

  const quotes = useMemo(
    () =>
      isValidBrazilianPostcode(form.postcode) ? quoteShipping(form.postcode, items.length) : [],
    [form.postcode, items.length],
  )

  const shippingCost = selectedQuote?.price ?? totals.shipping
  const orderTotals = useMemo(() => {
    const afterDiscount = totals.subtotal - totals.discount
    const freeByValue = afterDiscount >= 199
    return {
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: items.length ? (freeByValue ? 0 : shippingCost) : 0,
      total: afterDiscount + (items.length ? (freeByValue ? 0 : shippingCost) : 0),
    }
  }, [totals, shippingCost, items.length])

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const required: (keyof typeof form)[] = [
      'name',
      'postcode',
      'street',
      'number',
      'district',
      'city',
      'state',
    ]
    if (required.some((k) => !form[k].trim())) {
      setError(t('checkout.fieldRequired'))
      return
    }
    if (!isValidBrazilianPostcode(form.postcode)) {
      setError(t('checkout.invalidCep'))
      return
    }
    if (!selectedQuote) {
      setError(t('checkout.shippingTitle'))
      return
    }
    if (!consent) {
      setError(t('checkout.consent'))
      return
    }

    const address: AddressInput = {
      postcode: form.postcode.trim(),
      street: form.street.trim(),
      number: form.number.trim(),
      complement: form.complement.trim() || undefined,
      district: form.district.trim(),
      city: form.city.trim(),
      state: form.state.trim().toUpperCase(),
      country: 'BR',
    }

    setBusy(true)
    try {
      const result = await createDemoOrder({
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          unitPrice: i.unitPrice,
          quantity: i.quantity,
          variation: i.variation,
        })),
        totals: orderTotals,
        coupon,
        address,
        shippingQuoteId: selectedQuote.id,
        paymentMethod: payment,
        currency: 'BRL',
        locale,
      })
      setPlaced(result)
      clear()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  // ─── Confirmação ───
  if (placed) {
    return (
      <div className="min-h-screen">
        <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
            <Check className="h-8 w-8 text-primary" aria-hidden />
          </span>
          <h1 className="mt-6 font-serif text-4xl text-foreground">{t('order.successTitle')}</h1>
          <p className="mt-3 text-muted-foreground">{t('order.successSubtitle')}</p>

          <div className="mt-8 rounded-lg border border-border/60 bg-card p-6 text-left">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t('order.code')}</dt>
                <dd className="font-medium text-foreground">{placed.code}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t('order.status')}</dt>
                <dd className="text-foreground">
                  {shopT(locale, `order.status.${placed.status}`)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t('cart.total')}</dt>
                <dd className="text-foreground">{formatPrice(placed.total, locale)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t('checkout.paymentTitle')}</dt>
                <dd className="text-foreground">
                  {placed.paymentMethod === 'pix'
                    ? t('checkout.paymentPix')
                    : placed.paymentMethod === 'international_card'
                      ? t('checkout.paymentIntl')
                      : t('checkout.paymentCredit')}
                </dd>
              </div>
            </dl>
            <p className="mt-5 flex items-start gap-2 border-t border-border/40 pt-4 text-xs italic text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              {t('order.demoNote')}
            </p>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link to={`${localePrefix}/loja`}>{t('order.continue')}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to={`${localePrefix}`}>{t('breadcrumb.home')}</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ─── Carrinho vazio ───
  if (!items.length) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-serif text-4xl text-foreground">{t('checkout.title')}</h1>
        <p className="mt-4 text-muted-foreground">{t('cart.empty')}</p>
        <Button asChild className="mt-8 bg-primary hover:bg-primary/90">
          <Link to={`${localePrefix}/loja`}>{t('cart.emptyCta')}</Link>
        </Button>
      </div>
    )
  }

  const paymentOptions: { id: PaymentMethod; label: string; desc: string }[] = [
    { id: 'pix', label: t('checkout.paymentPix'), desc: t('checkout.paymentPixDesc') },
    {
      id: 'credit_card',
      label: t('checkout.paymentCredit'),
      desc: t('checkout.paymentCreditDesc'),
    },
    {
      id: 'international_card',
      label: t('checkout.paymentIntl'),
      desc: t('checkout.paymentIntlDesc'),
    },
  ]

  return (
    <div className="min-h-screen">
      <CatalogBreadcrumb
        className="mx-auto max-w-6xl px-4 pt-6 sm:px-6"
        items={[
          { label: t('cart.title'), to: `${localePrefix}/carrinho` },
          { label: t('checkout.title') },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6">
        <h1 className="font-serif text-4xl text-foreground sm:text-5xl">{t('checkout.title')}</h1>
        <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" aria-hidden />
          {t('checkout.demoWarning')}
        </p>

        <form onSubmit={handleSubmit} className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-10">
            {/* Endereço */}
            <section aria-labelledby="addr-title">
              <h2
                id="addr-title"
                className="flex items-center gap-2 font-serif text-2xl text-foreground"
              >
                <MapPin className="h-5 w-5 text-primary/80" aria-hidden />
                {t('checkout.addressTitle')}
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-6">
                <Field label={t('checkout.name')} className="sm:col-span-6">
                  <Input
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    required
                    autoComplete="name"
                    className="bg-background"
                  />
                </Field>
                <Field label={t('checkout.postcode')} className="sm:col-span-2">
                  <Input
                    value={form.postcode}
                    onChange={(e) => set('postcode', e.target.value)}
                    placeholder="01001-000"
                    inputMode="numeric"
                    required
                    autoComplete="postal-code"
                    className="bg-background"
                  />
                </Field>
                <Field label={t('checkout.street')} className="sm:col-span-4">
                  <Input
                    value={form.street}
                    onChange={(e) => set('street', e.target.value)}
                    required
                    autoComplete="address-line1"
                    className="bg-background"
                  />
                </Field>
                <Field label={t('checkout.number')} className="sm:col-span-2">
                  <Input
                    value={form.number}
                    onChange={(e) => set('number', e.target.value)}
                    required
                    className="bg-background"
                  />
                </Field>
                <Field label={t('checkout.complement')} className="sm:col-span-4">
                  <Input
                    value={form.complement}
                    onChange={(e) => set('complement', e.target.value)}
                    className="bg-background"
                  />
                </Field>
                <Field label={t('checkout.district')} className="sm:col-span-3">
                  <Input
                    value={form.district}
                    onChange={(e) => set('district', e.target.value)}
                    required
                    className="bg-background"
                  />
                </Field>
                <Field label={t('checkout.city')} className="sm:col-span-2">
                  <Input
                    value={form.city}
                    onChange={(e) => set('city', e.target.value)}
                    required
                    autoComplete="address-level2"
                    className="bg-background"
                  />
                </Field>
                <Field label={t('checkout.state')} className="sm:col-span-1">
                  <Input
                    value={form.state}
                    onChange={(e) => set('state', e.target.value)}
                    maxLength={2}
                    required
                    className="bg-background uppercase"
                  />
                </Field>
              </div>
            </section>

            {/* Frete */}
            <section aria-labelledby="ship-title">
              <h2
                id="ship-title"
                className="flex items-center gap-2 font-serif text-2xl text-foreground"
              >
                <Truck className="h-5 w-5 text-primary/80" aria-hidden />
                {t('checkout.shippingTitle')}
              </h2>
              {quotes.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">{t('cart.shippingInvalidCep')}</p>
              ) : (
                <div className="mt-4 space-y-2">
                  {quotes.map((q) => (
                    <label
                      key={q.id}
                      className={cn(
                        'flex cursor-pointer items-center justify-between gap-3 rounded-md border px-4 py-3 text-sm transition-colors',
                        selectedQuote?.id === q.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border/60 hover:border-primary/40',
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          checked={selectedQuote?.id === q.id}
                          onChange={() => setSelectedQuote(q)}
                          className="accent-[hsl(var(--primary))]"
                        />
                        <span>
                          <span className="block text-foreground">{q.label[locale]}</span>
                          <span className="block text-xs text-muted-foreground">
                            {q.days[locale]}
                          </span>
                        </span>
                      </span>
                      <span className="font-medium text-foreground">
                        {formatPrice(q.price, locale)}
                      </span>
                    </label>
                  ))}
                  <p className="text-[11px] italic text-muted-foreground/70">
                    {t('cart.shippingDemoNote')}
                  </p>
                </div>
              )}
            </section>

            {/* Pagamento (informativo) */}
            <section aria-labelledby="pay-title">
              <h2
                id="pay-title"
                className="flex items-center gap-2 font-serif text-2xl text-foreground"
              >
                <CreditCard className="h-5 w-5 text-primary/80" aria-hidden />
                {t('checkout.paymentTitle')}
              </h2>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {paymentOptions.map((opt) => (
                  <label
                    key={opt.id}
                    className={cn(
                      'flex cursor-pointer flex-col gap-1 rounded-md border px-4 py-3 text-sm transition-colors',
                      payment === opt.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border/60 hover:border-primary/40',
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="payment"
                        checked={payment === opt.id}
                        onChange={() => setPayment(opt.id)}
                        className="accent-[hsl(var(--primary))]"
                      />
                      <span className="text-foreground">{opt.label}</span>
                    </span>
                    <span className="text-xs text-muted-foreground">{opt.desc}</span>
                  </label>
                ))}
              </div>
              <p className="mt-3 rounded-md border border-dashed border-primary/40 bg-primary/5 px-4 py-3 text-xs text-muted-foreground">
                {t('checkout.demoWarning')}
              </p>
            </section>

            {/* Consentimento LGPD */}
            <label className="flex items-start gap-3 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 accent-[hsl(var(--primary))]"
              />
              {t('checkout.consent')}
            </label>

            {error && (
              <p
                className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                role="alert"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={busy}
              className="h-12 w-full bg-primary text-base hover:bg-primary/90 sm:w-auto sm:px-10"
            >
              {busy ? t('checkout.processing') : t('checkout.placeOrder')}
            </Button>
          </div>

          {/* Resumo lateral */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-border/60 bg-card p-6">
              <h2 className="font-serif text-2xl text-foreground">{t('checkout.summary')}</h2>
              <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
                {items.map((i) => (
                  <li key={i.productId + (i.variation ?? '')} className="flex items-center gap-3">
                    <img
                      src={i.image}
                      alt=""
                      className="h-12 w-12 shrink-0 rounded-sm object-cover"
                      loading="lazy"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-foreground">{i.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {i.quantity} × {formatPrice(i.unitPrice, locale)}
                      </span>
                    </span>
                    <span className="text-sm text-foreground">
                      {formatPrice(i.unitPrice * i.quantity, locale)}
                    </span>
                  </li>
                ))}
              </ul>
              <dl className="mt-5 space-y-2 border-t border-border/40 pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{t('cart.subtotal')}</dt>
                  <dd className="text-foreground">{formatPrice(orderTotals.subtotal, locale)}</dd>
                </div>
                {orderTotals.discount > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">
                      {t('cart.discount')}
                      {coupon ? ` · ${coupon.code}` : ''}
                    </dt>
                    <dd className="text-primary">−{formatPrice(orderTotals.discount, locale)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{t('cart.shipping')}</dt>
                  <dd className="text-foreground">
                    {selectedQuote ? formatPrice(orderTotals.shipping, locale) : '—'}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-border/40 pt-3 text-base font-medium">
                  <dt className="text-foreground">{t('cart.total')}</dt>
                  <dd className="text-foreground">
                    {selectedQuote ? formatPrice(orderTotals.total, locale) : '—'}
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </form>
      </div>
    </div>
  )
}

function Field({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  )
}
