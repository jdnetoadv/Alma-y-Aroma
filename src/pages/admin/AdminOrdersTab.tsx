import { useEffect, useState } from 'react'
import { useLocale } from '@/i18n/LocaleContext'
import { shopT } from '@/i18n/shopStrings'
import {
  listAllOrders,
  updateOrderStatus,
  updateOrderFulfillment,
  CustomerOrder,
  SupplierShipment,
  FULFILLMENT_STATUS,
  orderStatusLabel,
  orderSummaryLine,
  STATUS_ORDER,
} from '@/lib/account/orders'
import pb from '@/lib/pocketbase/client'
import { listAdminCatalogProducts } from '@/lib/admin/catalogAdmin'
import { getErrorMessage } from '@/lib/pocketbase/errors'
import { formatPrice } from '@/data/repository'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

/**
 * Aba de pedidos do painel admin — lista todos, atualiza status geral e
 * coordena o fulfillment manual (dropshipping): itens agrupados por
 * fornecedor, com status e código de rastreamento de cada entrega. O
 * encaminhamento ao fornecedor é manual e externo ao app; nada é enviado
 * automaticamente.
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

  if (error && !orders) return <p className="text-sm text-destructive">{error}</p>
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
            {orderSummaryLine(order, locale)}
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
          <OrderFulfillment order={order} onChanged={reload} onError={setError} />
        </div>
      ))}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

/** Itens do pedido agrupados por fornecedor, com status e rastreio por grupo. */
function OrderFulfillment({
  order,
  onChanged,
  onError,
}: {
  order: CustomerOrder
  onChanged: () => Promise<void> | void
  onError: (msg: string) => void
}) {
  const { locale } = useLocale()
  const t = (key: string, vars?: Record<string, string>) => shopT(locale, key, vars)
  const [suppliers, setSuppliers] = useState<Record<string, string> | null>(null)
  const [supplierNames, setSupplierNames] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let alive = true
    // productId -> supplierId (relação da coleção products), depois
    // supplierId -> nome de exibição (tradeName || legalName || slug).
    listAdminCatalogProducts()
      .then(async (products) => {
        if (!alive) return
        const map: Record<string, string> = {}
        for (const p of products) map[p.id] = p.supplierId ?? ''
        setSuppliers(map)
        const supplierIds = [...new Set(Object.values(map).filter((s) => s !== ''))]
        if (!supplierIds.length) return
        const recs = await pb.collection('suppliers').getFullList()
        if (!alive) return
        const names: Record<string, string> = {}
        for (const s of recs) {
          names[s.id] = s.tradeName || s.legalName || s.slug || s.id
        }
        setSupplierNames(names)
      })
      .catch((err) => onError(getErrorMessage(err)))
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const groups = new Map<string, { name: string; lines: typeof order.items }>()
  for (const item of order.items) {
    const supplierId = suppliers?.[item.productId] ?? ''
    const group = groups.get(supplierId) ?? { name: '', lines: [] }
    group.lines.push(item)
    groups.set(supplierId, group)
  }
  async function saveShipment(supplierId: string, shipment: SupplierShipment) {
    setBusy(true)
    onError(null)
    try {
      const rest = order.supplierShipments.filter((s) => s.supplierId !== supplierId)
      await updateOrderFulfillment(order.id, [...rest, shipment])
      await onChanged()
    } catch (err) {
      onError(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mt-4 rounded-md border border-border/60 bg-muted/30 p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {t('admin.fulfillment.bySupplier')}
      </p>
      {suppliers === null ? (
        <p className="mt-2 text-xs text-muted-foreground">{t('account.loading')}</p>
      ) : (
        <div className="mt-3 space-y-4">
          {[...groups.entries()].map(([supplierId, group]) => (
            <SupplierGroup
              key={supplierId || 'none'}
              supplierId={supplierId}
              supplierName={supplierNames[supplierId] ?? ''}
              lines={group.lines}
              shipment={order.supplierShipments.find((s) => s.supplierId === supplierId) ?? null}
              busy={busy}
              onSave={saveShipment}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function SupplierGroup({
  supplierId,
  supplierName,
  lines,
  shipment,
  busy,
  onSave,
}: {
  supplierId: string
  supplierName: string
  lines: CustomerOrder['items']
  shipment: SupplierShipment | null
  busy: boolean
  onSave: (supplierId: string, shipment: SupplierShipment) => Promise<void>
}) {
  const { locale } = useLocale()
  const t = (key: string, vars?: Record<string, string>) => shopT(locale, key, vars)
  const [status, setStatus] = useState(shipment?.status ?? 'awaiting_supplier')
  const [tracking, setTracking] = useState(shipment?.trackingCode ?? '')
  // Re-sincroniza os campos quando o pedido é recarregado após salvar.
  useEffect(() => {
    setStatus(shipment?.status ?? 'awaiting_supplier')
    setTracking(shipment?.trackingCode ?? '')
  }, [shipment?.status, shipment?.trackingCode])

  return (
    <div className="rounded-md border border-border/60 bg-card p-3">
      <p className="text-xs font-medium text-foreground">
        {supplierId ? supplierName || supplierId : t('admin.fulfillment.noSupplier')}
      </p>
      <ul className="mt-2 space-y-1">
        {lines.map((line, idx) => (
          <li key={`${line.productId}-${idx}`} className="text-xs text-muted-foreground">
            {line.name}
            {line.variation ? ` — ${line.variation}` : ''} · {t('admin.fulfillment.quantity')}{' '}
            {line.quantity}
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Label
          htmlFor={`fs-${order_shipment_key(supplierId)}`}
          className="text-xs text-muted-foreground"
        >
          {t('admin.fulfillment.status')}
        </Label>
        <select
          id={`fs-${order_shipment_key(supplierId)}`}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {FULFILLMENT_STATUS.split(',').map((s) => (
            <option key={s} value={s}>
              {t(`admin.fulfillment.${s}`)}
            </option>
          ))}
        </select>
        <Input
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          placeholder={t('admin.fulfillment.trackingCode')}
          className="h-8 w-44 text-xs"
        />
        <Button
          type="button"
          size="sm"
          disabled={busy}
          onClick={() =>
            onSave(supplierId, {
              supplierId,
              status,
              trackingCode: tracking,
              updatedAt: new Date().toISOString(),
            })
          }
        >
          {t('admin.fulfillment.saveShipment')}
        </Button>
      </div>
    </div>
  )
}

/** id estável para inputs de grupo (vazio para "sem fornecedor") */
function order_shipment_key(supplierId: string): string {
  return supplierId || 'none'
}
