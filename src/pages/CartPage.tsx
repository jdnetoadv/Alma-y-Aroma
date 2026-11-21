import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, Tag, Truck, ShieldCheck, ArrowRight } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import { shopT } from '@/i18n/shopStrings'
import { useCartStore } from '@/lib/cart/useCartStore'
import { AppliedCoupon } from '@/lib/cart/cartStore'
import { validateCoupon } from '@/lib/cart/cartStore'
import { formatPrice } from '@/data/repository'
import { CatalogBreadcrumb, CollectionHeader } from '@/components/catalog/CatalogShared'
import { FREE_SHIPPING_MIN } from '@/lib/cart/cartStore'
import { isValidBrazilianPostcode, quoteShipping } from '@/lib/shipping'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

/**
 * Carrinho — Etapa 3. Itens, quantidade, cupom (coleção `coupons`) e
 * estimativa ilustrativa de frete (shipping.ts). Sem pagamento: o botão
 * final leva ao checkout.
 */
export default function CartPage() {
  const { locale } = useLocale()
  const t = (key: string, vars?: Record<string, string>) => shopT(locale, key, vars)
  const navigate = useNavigate()
  const { items, coupon, totals, updateQuantity, removeItem, setCoupon } = useCartStore()

  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState<string | null>(null)
  const [couponBusy, setCouponBusy] = useState(false)
  const [postcode, setPostcode] = useState('')
  const [postcodeError, setPostcodeError] = useState<string | null>(null)
  const [quotes, setQuotes] = useState<ReturnType<typeof quoteShipping>>([])

  const localePrefix = `/${locale}`
  const missingForFree = useMemo(
    () => Math.max(0, FREE_SHIPPING_MIN - (totals.subtotal - totals.discount)),
    [totals.subtotal, totals.discount],
  )

  async function handleApplyCoupon() {
    setCouponBusy(true)
    setCouponError(null)
    const result: { ok: boolean; coupon?: AppliedCoupon; message?: string } = await validateCoupon(
      couponInput,
      locale,
    )
    setCouponBusy(false)
    if (result.ok) {
      setCoupon(result.coupon)
      setCouponInput('')
      setCouponError(null)
    } else {
      setCouponError(result.message ?? t('cart.couponInvalid'))
    }
  }

  function handleCalculateShipping() {
    if (!isValidBrazilianPostcode(postcode)) {
      setPostcodeError(t('cart.shippingInvalidCep'))
      setQuotes([])
      return
    }
    setPostcodeError(null)
    const count = items.reduce((acc, i) => acc + i.quantity, 0)
    setQuotes(quoteShipping(postcode, count))
  }

  if (!items.length) {
    return (
      <div className="min-h-screen">
        <CatalogBreadcrumb
          className="mx-auto max-w-6xl px-4 pt-6 sm:px-6"
          items={[{ label: t('cart.title') }]}
        />
        <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
          <h1 className="font-serif text-4xl text-foreground">{t('cart.title')}</h1>
          <p className="mt-4 text-muted-foreground">{t('cart.empty')}</p>
          <Button asChild className="mt-8 bg-primary hover:bg-primary/90">
            <Link to={`${localePrefix}/loja`}>{t('cart.emptyCta')}</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <CatalogBreadcrumb
        className="mx-auto max-w-6xl px-4 pt-6 sm:px-6"
        items={[{ label: t('cart.title') }]}
      />
      <CollectionHeader badge={t('cart.demoBadge')} title={t('cart.title')} description="" />

      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* Lista de itens */}
          <section aria-label={t('cart.title')}>
            <ul className="divide-y divide-border/40">
              {items.map((item) => (
                <li
                  key={item.productId + (item.variation ?? '')}
                  className="flex gap-4 py-6 sm:gap-6"
                >
                  <Link
                    to={`${localePrefix}/produto/${item.slug}`}
                    className="h-24 w-24 shrink-0 overflow-hidden rounded-md border border-border/50 bg-secondary/40 sm:h-28 sm:w-28"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      to={`${localePrefix}/produto/${item.slug}`}
                      className="font-serif text-lg leading-snug text-foreground hover:text-primary"
                    >
                      {item.name}
                    </Link>
                    {item.variation && (
                      <p className="mt-0.5 text-xs text-muted-foreground">{item.variation}</p>
                    )}
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatPrice(item.unitPrice, locale)}
                    </p>

                    <div className="mt-auto flex flex-wrap items-center gap-4 pt-3">
                      <div className="inline-flex items-center rounded-md border border-border">
                        <button
                          type="button"
                          className="px-2.5 py-1.5 text-muted-foreground hover:text-foreground"
                          onClick={() =>
                            updateQuantity(item.productId, item.variation, item.quantity - 1)
                          }
                          aria-label={t('cart.decrease')}
                        >
                          <Minus className="h-3.5 w-3.5" aria-hidden />
                        </button>
                        <span className="w-9 text-center text-sm" aria-live="polite">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="px-2.5 py-1.5 text-muted-foreground hover:text-foreground disabled:opacity-40"
                          onClick={() =>
                            updateQuantity(item.productId, item.variation, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.maxStock}
                          aria-label={t('cart.increase')}
                        >
                          <Plus className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId, item.variation)}
                        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-destructive"
                        aria-label={t('cart.remove')}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        {t('cart.remove')}
                      </button>
                      <span className="ml-auto text-sm font-medium text-foreground">
                        {formatPrice(item.unitPrice * item.quantity, locale)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <Link
              to={`${localePrefix}/loja`}
              className="mt-2 inline-block text-sm uppercase tracking-[0.2em] text-primary transition-opacity hover:opacity-70"
            >
              {t('cart.continueShopping')}
            </Link>
          </section>

          {/* Resumo */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-border/60 bg-card p-6">
              <h2 className="font-serif text-2xl text-foreground">{t('checkout.summary')}</h2>

              {/* Cupom */}
              <div className="mt-5">
                {coupon ? (
                  <div className="flex items-center justify-between rounded-md border border-primary/40 bg-primary/10 px-3 py-2">
                    <span className="flex items-center gap-2 text-sm text-foreground">
                      <Tag className="h-3.5 w-3.5 text-primary" aria-hidden />
                      {coupon.code}
                      {coupon.kind === 'percent' ? ` (−${coupon.value}%)` : ''}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCoupon(null)}
                      className="text-xs text-muted-foreground hover:text-destructive"
                    >
                      {t('cart.couponRemove')}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="coupon" className="text-xs text-muted-foreground">
                      {t('cart.couponPlaceholder')}
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="coupon"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        placeholder={t('cart.couponPlaceholder')}
                        className="bg-background"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleApplyCoupon}
                        disabled={couponBusy || !couponInput.trim()}
                      >
                        {t('cart.couponApply')}
                      </Button>
                    </div>
                    {couponError && (
                      <p className="text-xs text-destructive" role="alert">
                        {couponError}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Frete */}
              <div className="mt-5 border-t border-border/40 pt-5">
                <p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  <Truck className="h-3.5 w-3.5" aria-hidden />
                  {t('cart.shippingTitle')}
                </p>
                <div className="flex gap-2">
                  <Input
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCalculateShipping()}
                    placeholder={t('cart.shippingPlaceholder')}
                    inputMode="numeric"
                    className="bg-background"
                    aria-label={t('cart.shippingTitle')}
                  />
                  <Button type="button" variant="outline" onClick={handleCalculateShipping}>
                    {t('cart.shippingCalculate')}
                  </Button>
                </div>
                {postcodeError && (
                  <p className="mt-2 text-xs text-destructive" role="alert">
                    {postcodeError}
                  </p>
                )}
                {quotes.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {quotes.map((q) => (
                      <li
                        key={q.id}
                        className="flex items-center justify-between gap-2 rounded-md border border-border/50 bg-background/60 px-3 py-2 text-xs"
                      >
                        <span className="text-foreground/90">{q.label[locale]}</span>
                        <span className="whitespace-nowrap text-muted-foreground">
                          {formatPrice(q.price, locale)} · {q.days[locale]}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-2 text-[11px] italic text-muted-foreground/70">
                  {t('cart.shippingDemoNote')}
                </p>
              </div>

              {/* Totais */}
              <dl className="mt-5 space-y-2 border-t border-border/40 pt-5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{t('cart.subtotal')}</dt>
                  <dd className="text-foreground">{formatPrice(totals.subtotal, locale)}</dd>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">{t('cart.discount')}</dt>
                    <dd className="text-primary">−{formatPrice(totals.discount, locale)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{t('cart.shipping')}</dt>
                  <dd className="text-foreground">
                    {totals.freeShipping ? (
                      <span className="text-primary">0</span>
                    ) : (
                      formatPrice(totals.shipping, locale)
                    )}
                  </dd>
                </div>
                <div
                  className={cn(
                    'flex justify-between border-t border-border/40 pt-3 text-base font-medium',
                  )}
                >
                  <dt className="text-foreground">{t('cart.total')}</dt>
                  <dd className="text-foreground">{formatPrice(totals.total, locale)}</dd>
                </div>
              </dl>

              <p className="mt-3 text-xs text-muted-foreground/80">
                {totals.freeShipping
                  ? t('cart.freeShippingReached')
                  : t('cart.freeShippingMissing', {
                      value: formatPrice(missingForFree, locale),
                    })}
              </p>

              <Button asChild className="mt-6 h-12 w-full bg-primary text-base hover:bg-primary/90">
                <Link to={`${localePrefix}/checkout`}>
                  {t('cart.checkout')}
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/70">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                {t('checkout.demoWarning')}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
