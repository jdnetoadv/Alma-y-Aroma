/**
 * Aba PRECIFICAÇÃO do admin — Etapa 5. Calcula preço sugerido a partir de
 * custo de aquisição, frete do fornecedor, impostos estimados, taxas de
 * pagamento, custos operacionais variáveis, comissão e margem desejada.
 * Exibe margem estimada de cada produto e ALERTA quando o preço de venda
 * não cobre os custos. Alíquotas são ESTIMATIVAS editáveis — nunca valores
 * tributários definitivos.
 */
import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Calculator } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import { shopT } from '@/i18n/shopStrings'
import { formatPrice } from '@/data/repository'
import { getErrorMessage } from '@/lib/pocketbase/errors'
import { listAdminCatalogProducts, AdminCatalogProduct } from '@/lib/admin/catalogAdmin'
import { computePricing, computeMargin, PricingInputs } from '@/lib/admin/pricing'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { updateProduct } from '@/lib/admin/service'

const DEFAULT_INPUTS: Omit<PricingInputs, 'acquisitionCost' | 'supplierFreight'> = {
  estimatedTaxes: 0,
  paymentFeePct: 0,
  variableCosts: 0,
  commissionPct: 0,
  targetMarginPct: 30,
}

export default function AdminPricingTab() {
  const { locale } = useLocale()
  const t = (key: string, vars?: Record<string, string | number>) =>
    shopT(locale, key, vars as Record<string, string>)
  const [products, setProducts] = useState<AdminCatalogProduct[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [params, setParams] = useState(DEFAULT_INPUTS)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    listAdminCatalogProducts()
      .then((list) => {
        setProducts(list)
        setSelectedId(list[0]?.id ?? null)
      })
      .catch((err) => setError(getErrorMessage(err)))
  }, [])

  const selected = products?.find((p) => p.id === selectedId) ?? null

  const result = useMemo(() => {
    if (!selected) return null
    // Per-produto: usa estimativas salvas no produto quando existirem.
    const productParams = selected
      ? {
          estimatedTaxes: selected.estimatedTaxes ?? params.estimatedTaxes,
          paymentFeePct: selected.paymentFeesPct ?? params.paymentFeePct,
          variableCosts: selected.variableCosts ?? params.variableCosts,
          commissionPct: selected.commissionPct ?? params.commissionPct,
          targetMarginPct: params.targetMarginPct,
          acquisitionCost: selected.costPrice ?? 0,
          supplierFreight: selected.supplierFreight ?? 0,
        }
      : null
    return productParams ? computePricing(productParams) : null
  }, [selected, params])

  const marginOf = (p: AdminCatalogProduct) => {
    if (p.costPrice == null) return null
    return computeMargin(
      {
        estimatedTaxes: p.estimatedTaxes ?? params.estimatedTaxes,
        paymentFeePct: p.paymentFeesPct ?? params.paymentFeePct,
        variableCosts: p.variableCosts ?? params.variableCosts,
        commissionPct: p.commissionPct ?? params.commissionPct,
        acquisitionCost: p.costPrice,
        supplierFreight: p.supplierFreight ?? 0,
      },
      p.price,
    )
  }

  async function applySuggested() {
    if (!selected || !result) return
    setSavingId(selected.id)
    setMessage(null)
    try {
      await updateProduct(selected.id, { price: result.suggestedPrice })
      setMessage(t('admin.pricing.applied'))
      const fresh = await listAdminCatalogProducts()
      setProducts(fresh)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSavingId(null)
    }
  }

  if (error && !products) {
    return <p className="text-sm text-destructive">{error}</p>
  }
  if (!products) {
    return <p className="text-sm text-muted-foreground">{t('account.loading')}</p>
  }
  if (!products.length) {
    return <p className="text-sm text-muted-foreground">{t('admin.pricing.noProducts')}</p>
  }

  const fmt = (v: number) => formatPrice(v, locale)

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border/60 bg-card p-5">
        <div className="flex items-center gap-2">
          <Calculator className="h-4 w-4 text-primary" aria-hidden />
          <p className="text-sm font-medium text-foreground">{t('admin.pricing.title')}</p>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{t('admin.pricing.disclaimer')}</p>

        {/* Parâmetros estimados — editáveis */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {(
            [
              ['estimatedTaxes', 'admin.pricing.taxes', 'currency'],
              ['paymentFeePct', 'admin.pricing.paymentFee', 'percent'],
              ['variableCosts', 'admin.pricing.variableCosts', 'currency'],
              ['commissionPct', 'admin.pricing.commission', 'percent'],
              ['targetMarginPct', 'admin.pricing.targetMargin', 'percent'],
            ] as const
          ).map(([field, key, kind]) => (
            <div key={field} className="space-y-1">
              <Label htmlFor={`pricing-${field}`} className="text-xs text-muted-foreground">
                {t(key)}
              </Label>
              <Input
                id={`pricing-${field}`}
                type="number"
                min={0}
                step={kind === 'percent' ? '0.5' : '0.01'}
                value={params[field]}
                onChange={(e) =>
                  setParams((prev) => ({ ...prev, [field]: Number(e.target.value) || 0 }))
                }
                className="bg-background"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Seletor de produto + cálculo */}
      <div className="rounded-lg border border-border/60 bg-card p-5">
        <div className="space-y-1">
          <Label htmlFor="pricing-product" className="text-xs text-muted-foreground">
            {t('admin.pricing.pickProduct')}
          </Label>
          <select
            id="pricing-product"
            value={selectedId ?? ''}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full max-w-lg rounded-md border border-border bg-background px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {(p.name['pt-br'] || p.slug) + (p.sku ? ` · ${p.sku}` : '')}
              </option>
            ))}
          </select>
        </div>

        {selected && result && (
          <div className="mt-4 space-y-3">
            <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <PricingStat
                label={t('admin.pricing.acquisitionCost')}
                value={fmt(selected.costPrice ?? 0)}
              />
              <PricingStat
                label={t('admin.pricing.supplierFreight')}
                value={fmt(selected.supplierFreight ?? 0)}
              />
              <PricingStat label={t('admin.pricing.fixedTotal')} value={fmt(result.fixedCosts)} />
              <PricingStat
                label={t('admin.pricing.suggestedPrice')}
                value={fmt(result.suggestedPrice)}
                highlight
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {t('admin.pricing.estimatedMarginLine', {
                margin: fmt(result.marginAmount),
                pct: result.marginPct,
              })}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                size="sm"
                onClick={applySuggested}
                disabled={savingId === selected.id}
                className="bg-primary hover:bg-primary/90"
              >
                {t('admin.pricing.apply')}
              </Button>
              {savingId === selected.id && (
                <span className="text-xs text-muted-foreground">{t('account.loading')}</span>
              )}
              {message && <p className="text-xs text-primary">{message}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Margem estimada por produto + alerta de preço abaixo do custo */}
      <div className="rounded-lg border border-border/60 bg-card p-5">
        <p className="text-sm font-medium text-foreground">{t('admin.pricing.marginListTitle')}</p>
        <div className="mt-3 space-y-2">
          {products.map((p) => {
            const margin = marginOf(p)
            return (
              <div
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border/40 px-3 py-2 text-sm"
              >
                <span className="text-foreground">{p.name['pt-br'] || p.slug}</span>
                {margin == null ? (
                  <span className="text-xs text-muted-foreground">{t('admin.pricing.noCost')}</span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {t('admin.pricing.marginPctLabel', { pct: margin.marginPct })}
                    </span>
                    {margin.belowCost && (
                      <span
                        className="flex items-center gap-1 rounded bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive"
                        role="alert"
                      >
                        <AlertTriangle className="h-3 w-3" aria-hidden />
                        {t('admin.pricing.belowCostAlert')}
                      </span>
                    )}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function PricingStat({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div
      className={
        'rounded-md border border-border/40 p-3 ' +
        (highlight ? 'bg-primary/5 border-primary/40' : 'bg-background')
      }
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-serif text-lg text-foreground">{value}</p>
    </div>
  )
}
