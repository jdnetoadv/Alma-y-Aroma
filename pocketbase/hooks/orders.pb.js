/// <reference path="../pb_data/types.d.ts" />
/**
 * Etapa 3 — normalização de pedidos + webhook de pagamento (arquitetura).
 *
 * - onRecordCreateRequest (orders): gera código AYA-xxxx e atribui `user`
 *   ao autenticado (quando houver). Visitante também pode comprar.
 * - rota POST /backend/v1/payments/webhook : endpoint de confirmação para o
 *   provedor futuro (Stripe/Mercado Pago). Sem credenciais conectadas,
 *   apenas registra e responde 200 — NENHUMA operação financeira real.
 *
 * Notas de plataforma (JSVM): hooks sem sufixo "Request" rodam em transações
 * internas onde e.requestInfo() não existe; por isso usamos a variante
 * *Request. Toda a lógica fica INLINE nos callbacks — a VM do PocketBase
 * executa callbacks fora do escopo das declarações de nível superior.
 */
onRecordCreateRequest((e) => {
  const rec = e.record
  const auth = e.requestInfo().auth

  const user = rec.getString('user')
  if (user && (!auth || user !== auth.id)) {
    throw new BadRequestError('Pedido não autorizado.')
  }
  if (auth && !user) {
    rec.set('user', auth.id)
  }
  if (!rec.getString('code')) {
    rec.set(
      'code',
      'AYA-' +
        Date.now().toString(36).toUpperCase() +
        '-' +
        Math.random().toString(36).slice(2, 6).toUpperCase(),
    )
  }
  // Todo pedido desta etapa é demonstração — defesa extra no servidor.
  rec.set('isDemonstration', true)
  const status = rec.getString('status')
  if (!status.startsWith('demo_')) {
    rec.set('status', 'demo_pending_' + (rec.getString('paymentMethod') === 'pix' ? 'pix' : 'card'))
  }

  e.next()
}, 'orders')

routerAdd(
  'POST',
  '/backend/v1/payments/webhook',
  (e) => {
    let body = {}
    try {
      const raw = e.info && e.info.body
      if (typeof raw === 'string' && raw.length) {
        body = JSON.parse(raw)
      } else if (raw && typeof raw === 'object') {
        body = raw
      }
    } catch (err) {
      console.log('[payments/webhook] corpo inválido: ' + err)
    }

    const provider = body.provider || 'unknown'
    const orderCode = body.orderCode || body.reference || ''
    const event = body.event || body.type || 'unspecified'

    console.log(
      '[payments/webhook] provider=' +
        provider +
        ' event=' +
        event +
        ' order=' +
        orderCode +
        ' (demo — nenhuma cobrança real)',
    )

    return e.json(200, {
      received: true,
      demonstration: true,
      note: 'Pedido de demonstração — nenhuma cobrança real foi efetuada.',
    })
  },
  // Sem verificação de assinatura por enquanto: as credenciais do provedor
  // não estão conectadas (regra do usuário — nada de integração paga ainda).
)
