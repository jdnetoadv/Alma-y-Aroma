/**
 * Ferramenta de precificação — Etapa 5. Calcula o preço sugerido a partir
 * do custo de aquisição + frete do fornecedor + impostos estimados + taxas
 * de pagamento + custos operacionais variáveis + comissão, descontando a
 * margem de contribuição desejada. Alíquotas são ESTIMATIVAS editáveis —
 * nunca valores definitivos.
 */

export interface PricingInputs {
  /** Custo de aquisição do produto no fornecedor */
  acquisitionCost: number
  /** Frete pago ao fornecedor */
  supplierFreight: number
  /** Impostos estimados sobre a venda (R$ por unidade) */
  estimatedTaxes: number
  /** Taxa de pagamento (carteira/PIX) — % do preço de venda */
  paymentFeePct: number
  /** Custos operacionais variáveis (embalagem, etc.), R$ por unidade */
  variableCosts: number
  /** Comissão — % do preço de venda */
  commissionPct: number
  /** Margem de contribuição desejada — % do preço de venda */
  targetMarginPct: number
}

export interface PricingResult {
  /** Preço sugerido de venda */
  suggestedPrice: number
  /** Custo total fixo por unidade (aquisição + frete + impostos + variáveis) */
  fixedCosts: number
  /** Custos proporcionais ao preço (taxas + comissão) em R$ no preço sugerido */
  proportionalCosts: number
  /** Margem de contribuição estimada em R$ no preço sugerido */
  marginAmount: number
  /** Margem de contribuição estimada em % */
  marginPct: number
  /** true quando o preço atual NÃO cobre os custos */
  belowCost: boolean
  /** true quando a margem estimada está abaixo da desejada */
  belowTarget: boolean
}

/** Divide por (1 - soma das %) para embutir custos proporcionais no preço. */
export function computePricing(inputs: PricingInputs): PricingResult {
  const fixedCosts =
    inputs.acquisitionCost + inputs.supplierFreight + inputs.estimatedTaxes + inputs.variableCosts
  const proportionalPct = clampPct(inputs.paymentFeePct + inputs.commissionPct)

  // Preço tal que price − custosFixos − price·(taxas+comissão) = margem desejada·price
  const denominator = 1 - proportionalPct - clampPct(inputs.targetMarginPct)
  const rawPrice = denominator > 0.01 ? fixedCosts / denominator : fixedCosts / 0.01
  const suggestedPrice = round2(Math.max(rawPrice, 0))

  const proportionalCosts = round2(suggestedPrice * proportionalPct)
  const marginAmount = round2(suggestedPrice - fixedCosts - proportionalCosts)
  const marginPct = suggestedPrice > 0 ? round2((marginAmount / suggestedPrice) * 100) : 0
  const totalCost = fixedCosts + proportionalCosts

  return {
    suggestedPrice,
    fixedCosts: round2(fixedCosts),
    proportionalCosts,
    marginAmount,
    marginPct,
    belowCost: suggestedPrice <= totalCost,
    belowTarget: marginPct < inputs.targetMarginPct,
  }
}

/** Margem estimada de um produto com preço de venda já definido. */
export function computeMargin(
  inputs: Omit<PricingInputs, 'targetMarginPct'>,
  salePrice: number,
): PricingResult {
  const fixedCosts =
    inputs.acquisitionCost + inputs.supplierFreight + inputs.estimatedTaxes + inputs.variableCosts
  const proportionalPct = clampPct(inputs.paymentFeePct + inputs.commissionPct)
  const proportionalCosts = round2(salePrice * proportionalPct)
  const marginAmount = round2(salePrice - fixedCosts - proportionalCosts)
  const marginPct = salePrice > 0 ? round2((marginAmount / salePrice) * 100) : 0
  const totalCost = fixedCosts + proportionalCosts
  return {
    suggestedPrice: round2(salePrice),
    fixedCosts: round2(fixedCosts),
    proportionalCosts,
    marginAmount,
    marginPct,
    belowCost: marginAmount <= 0,
    belowTarget: false,
  }
}

function clampPct(pct: number): number {
  const value = Number.isFinite(pct) ? pct : 0
  return Math.min(Math.max(value, 0), 95) / 100
}

function round2(value: number): number {
  return Math.round(value * 100) / 100
}
