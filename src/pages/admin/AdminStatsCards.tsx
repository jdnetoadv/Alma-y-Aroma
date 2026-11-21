import { useEffect, useState } from 'react'
import { useLocale } from '@/i18n/LocaleContext'
import { shopT } from '@/i18n/shopStrings'
import { useAdminSession } from '@/lib/admin/useAdminSession'
import { loadAdminStats, AdminStats } from '@/lib/admin/service'
import { formatPrice } from '@/data/repository'
import { Package, ShoppingCart, TrendingUp, Receipt, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

/** Indicadores do topo do painel admin. */
export default function AdminStatsCards() {
  const { locale } = useLocale()
  const t = (key: string, vars?: Record<string, string>) => shopT(locale, key, vars)
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    loadAdminStats()
      .then((s) => !cancelled && setStats(s))
      .catch((err) => !cancelled && setError(err?.message ?? String(err)))
    return () => {
      cancelled = true
    }
  }, [])

  if (error) return <p className="text-sm text-destructive">{error}</p>
  if (!stats)
    return (
      <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        {t('account.loading')}
      </div>
    )

  const cards: { icon: typeof Package; label: string; value: string }[] = [
    { icon: Package, label: t('admin.statProducts'), value: String(stats.productCount) },
    { icon: ShoppingCart, label: t('admin.statOrders'), value: String(stats.orderCount) },
    { icon: TrendingUp, label: t('admin.statRevenue'), value: formatPrice(stats.revenue, locale) },
    {
      icon: Receipt,
      label: t('admin.statAvgTicket'),
      value: formatPrice(stats.avgTicket, locale),
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ icon: Icon, label, value }) => (
        <Card key={label} className="border-border/60 bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
              {label}
            </CardTitle>
            <Icon className="h-4 w-4 text-primary" aria-hidden />
          </CardHeader>
          <CardContent>
            <p className="font-serif text-2xl text-foreground">{value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
