import pb from '@/lib/pocketbase/client'
import { Locale } from '@/i18n/types'
import { formatPrice } from '@/data/repository'

/**
 * Histórico de pedidos — Etapa 4. Lê a coleção `orders` com a regra
 * user = @request.auth.id || admin (list/view já publicadas na migração 0002).
 */

export interface OrderItemLine {
  productId: string
  name: string
  unitPrice: number
  quantity: number
  variation: string | null
  lineTotal: number
}

/**
 * Etapa 5 — dropshipping manual: uma entrada por fornecedor em
 * `orders.supplierShipments` (JSON). O encaminhamento ao fornecedor é
 * manual (fora do app); aqui registramos status e código de rastreamento.
 */
export interface SupplierShipment {
  supplierId: string
  status: string
  trackingCode: string
  updatedAt: string
}

export interface CustomerOrder {
  id: string
  code: string
  status: string
  total: number
  subtotal: number
  discount: number
  shipping: number
  couponCode: string
  paymentMethod: string
  trackingCode: string
  isDemonstration: boolean
  created: string
  addressSummary: string
  items: OrderItemLine[]
  fulfillmentStatus: string
  supplierShipments: SupplierShipment[]
}

const STATUS_ORDER =
  'demo_pending_pix,demo_pending_card,demo_confirmed,paid,shipped,delivered,canceled'

const FULFILLMENT_STATUS =
  'awaiting_supplier,supplier_confirmed,processing,shipped,delivered'

export async function listMyOrders(): Promise<CustomerOrder[]> {
  if (!pb.authStore.isValid) return []
  const recs = await pb.collection('orders').getFullList({
    sort: '-created',
    filter: `user="${pb.authStore.record?.id ?? ''}"`,
  })
  return recs.map(mapOrder)
}

export async function updateOrderFulfillment(
  id: string,
  supplierShipments: SupplierShipment[],
  fulfillmentStatus?: string,
): Promise<void> {
  await pb.collection('orders').update(id, {
    supplierShipments,
    ...(fulfillmentStatus ? { fulfillmentStatus } : {}),
  })
}

export async function listAllOrders(): Promise<CustomerOrder[]> {
  const recs = await pb.collection('orders').getFullList({ sort: '-created' })
  return recs.map(mapOrder)
}

export async function updateOrderStatus(id: string, status: string, trackingCode: string) {
  await pb.collection('orders').update(id, {
    status,
    ...(trackingCode !== undefined ? { trackingCode } : {}),
  })
}

function mapOrder(r: Record<string, unknown>): CustomerOrder {
  let items: OrderItemLine[] = []
  try {
    const raw = r.items
    items = Array.isArray(raw) ? raw : JSON.parse(String(raw ?? '[]'))
  } catch {
    items = []
  }
  let shipments: SupplierShipment[] = []
  try {
    const rawSh = r.supplierShipments
    shipments = Array.isArray(rawSh) ? rawSh : JSON.parse(String(rawSh ?? '[]'))
  } catch {
    shipments = []
  }
  return {
    id: String(r.id),
    code: String(r.code ?? ''),
    status: String(r.status ?? ''),
    total: Number(r.total ?? 0),
    subtotal: Number(r.subtotal ?? 0),
    discount: Number(r.discount ?? 0),
    shipping: Number(r.shipping ?? 0),
    couponCode: String(r.couponCode ?? ''),
    paymentMethod: String(r.paymentMethod ?? ''),
    trackingCode: String(r.trackingCode ?? ''),
    isDemonstration: Boolean(r.isDemonstration),
    created: String(r.created ?? ''),
    addressSummary: [r.addressStreet, r.addressDistrict, r.addressCity, r.addressState]
      .filter(Boolean)
      .join(', '),
    items,
    fulfillmentStatus: String(r.fulfillmentStatus ?? 'awaiting_supplier'),
    supplierShipments: shipments,
  }
}

export function orderStatusLabel(locale: Locale, status: string): string {
  const labels: Record<string, Record<string, string>> = {
    'pt-br': {
      demo_pending_pix: 'Aguardando Pix (demonstração)',
      demo_pending_card: 'Aguardando cartão (demonstração)',
      demo_confirmed: 'Confirmado (demonstração)',
      paid: 'Pago',
      shipped: 'Enviado',
      delivered: 'Entregue',
      canceled: 'Cancelado',
    },
    es: {
      demo_pending_pix: 'Esperando Pix (demostración)',
      demo_pending_card: 'Esperando tarjeta (demostración)',
      demo_confirmed: 'Confirmado (demostración)',
      paid: 'Pagado',
      shipped: 'Enviado',
      delivered: 'Entregado',
      canceled: 'Cancelado',
    },
    'en-gb': {
      demo_pending_pix: 'Awaiting Pix (demonstration)',
      demo_pending_card: 'Awaiting card (demonstration)',
      demo_confirmed: 'Confirmed (demonstration)',
      paid: 'Paid',
      shipped: 'Shipped',
      delivered: 'Delivered',
      canceled: 'Canceled',
    },
  }
  return labels[locale]?.[status] ?? status
}

export function orderSummaryLine(order: CustomerOrder, locale: Locale): string {
  const count = order.items.reduce((acc, i) => acc + i.quantity, 0)
  return `${count} · ${formatPrice(order.total, locale)}`
}

export { STATUS_ORDER }

export { FULFILLMENT_STATUS }
