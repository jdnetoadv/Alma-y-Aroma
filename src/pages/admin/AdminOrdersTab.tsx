import { useEffect, useState } from 'react'
import { useLocale } from '@/i18n/LocaleContext'
import { shopT } from '@/i18n/shopStrings'
import {
  listAllOrders,
  updateOrderStatus,
  CustomerOrder,
  orderStatusLabel,
  STATUS_ORDER,
} from '@/lib/account/orders'
import { getErrorMessage } from '@/lib/pocketbase/errors'
import { formatPrice } from '@/data/repository'
import { Label } from '@/components/ui/label'

/**
 * Aba de pedidos do painel admin — lista todos e atualiza status.
 */
export default function AdminOrdersTab() {
  const { locale } = useLocale()
  const t = (key: string, vars?: Record<string, string>) => shopT(locale, key, vars)
  const [orders, setOrders] = useState<CustomerOrder[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)

  async function reload() {
    try {
      setOrders(await listAllOrders())
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }
  useEffect(() => {
    reload()
  }, [])

  async function changeStatus(id: string, status: string) {
    setSavingId(id)
    setError(null)
    try {
      await updateOrderStatus(id, status, undefined)
      await reload()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSavingId(null)
    }
  }

  if (error) return <p className="text-sm text-destructive">{error}</p>
  if (!orders) return <p className="text-sm text-muted-foreground">{t('account.loading')}</p>
  if (!orders.length) return <p className="text-sm text-muted-foreground">{t('admin.noOrders')}</p>

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <div key={order.id} className="rounded-lg border border-border/60 bg-card p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-serif text-lg text-foreground">{order.code}</p>
            <span className="text-sm font-medium text-foreground">
              {formatPrice(order.total, locale)}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {new Date(order.created).toLocaleDateString(
              locale === 'pt-br' ? 'pt-BR' : locale === 'es' ? 'es-ES' : 'en-GB',
            )}
            {' · '}
            {orderSummaryCount(order)}
          </p>
          {order.addressSummary && (
            <p className="mt-1 text-xs text-muted-foreground">{order.addressSummary}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Label htmlFor={`status-${order.id}`} className="text-xs text-muted-foreground">
              {t('admin.orderStatus')}
            </Label>
            <select
              id={`status-${order.id}`}
              value={order.status}
              onChange={(e) => changeStatus(order.id, e.target.value)}
              disabled={savingId === order.id}
              className="rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {STATUS_ORDER.split(',').map((s) => (
                <option key={s} value={s}>
                  {orderStatusLabel(locale, s)}
                </option>
              ))}
            </select>
            {savingId === order.id && (
              <span className="text-xs text-muted-foreground">{t('account.loading')}</span>
            )}
          </div>
        </div>
      ))}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

function orderSummaryCount(order: CustomerOrder): string {
  return order.items.reduce((acc, i) => acc + i.quantity, 0).toString()
}

export { orderSummaryCount }
