import pb from '@/lib/pocketbase/client'
import { Locale } from '@/i18n/types'
import { CartItem, AppliedCoupon } from '@/lib/cart/cartStore'
import { AddressInput } from '@/lib/shipping'

/**
 * Pedidos — Etapa 3. Nenhum pagamento real: o checkout cria um pedido de
 * demonstração (status `demo_*`) claramente identificado. Dados sensíveis
 * de cartão JAMAIS são enviados ou armazenados — só o método escolhido.
 *
 * Arquitetura pronta para provedores: quando Stripe/Mercado Pago forem
 * autorizados, um hook no backend criará a cobrança e o webhook em
 * /backend/v1/payments/webhook confirmará o pedido (ver README do painel).
 */

export type PaymentMethod = 'pix' | 'credit_card' | 'debit_card' | 'international_card'

export interface DemoOrderInput {
  items: Pick<CartItem, 'productId' | 'name' | 'unitPrice' | 'quantity' | 'variation'>[]
  totals: { subtotal: number; discount: number; shipping: number; total: number }
  coupon: AppliedCoupon | null
  address: AddressInput
  shippingQuoteId: string
  paymentMethod: PaymentMethod
  currency: 'BRL'
  locale: Locale
  note?: string
}

export interface DemoOrderResult {
  id: string
  code: string
  status: string
  total: number
  paymentMethod: PaymentMethod
}

export async function createDemoOrder(input: DemoOrderInput): Promise<DemoOrderResult> {
  const payload = {
    locale: input.locale,
    currency: input.currency,
    paymentMethod: input.paymentMethod,
    status: input.paymentMethod === 'pix' ? 'demo_pending_pix' : 'demo_pending_card',
    subtotal: input.totals.subtotal,
    discount: input.totals.discount,
    shipping: input.totals.shipping,
    total: input.totals.total,
    couponCode: input.coupon?.code ?? '',
    shippingQuoteId: input.shippingQuoteId,
    shippingEstimate: true,
    isDemonstration: true,
    addressName: '',
    addressPostcode: input.address.postcode,
    addressStreet: `${input.address.street}, ${input.address.number}${
      input.address.complement ? ` — ${input.address.complement}` : ''
    }`,
    addressDistrict: input.address.district,
    addressCity: input.address.city,
    addressState: input.address.state,
    addressCountry: input.address.country ?? 'BR',
    trackingCode: '',
    items: JSON.stringify(
      input.items.map((i) => ({
        productId: i.productId,
        name: i.name,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
        variation: i.variation ?? null,
        lineTotal: i.unitPrice * i.quantity,
      })),
    ),
  }

  const rec = await pb.collection('orders').create(payload)
  return {
    id: rec.id,
    code: rec.code,
    status: rec.status,
    total: rec.total,
    paymentMethod: rec.paymentMethod,
  }
}
