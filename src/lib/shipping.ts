import { Locale } from '@/i18n/types'

/**
 * Frete — Etapa 3: estimativa local demonstrativa, honesta e identificada
 * como tal na UI. Nenhum serviço externo (Correios/Melhor Envio) é
 * contratado nesta etapa; a assinatura abaixo já reflete a integração
 * futura (CEP → modalidades com prazo e preço).
 */

export interface ShippingQuote {
  id: string
  label: Record<Locale, string>
  price: number
  days: Record<Locale, string>
  estimated: true
}

const ECONOMY: ShippingQuote = {
  estimated: true,
  id: 'economy',
  label: {
    'pt-br': 'Econômico (estimativa demonstrativa)',
    es: 'Económico (estimación demostrativa)',
    'en-gb': 'Economy (demonstrative estimate)',
  },
  price: 19.9,
  days: {
    'pt-br': '8 a 14 dias úteis',
    es: '8 a 14 días hábiles',
    'en-gb': '8 to 14 business days',
  },
}

const STANDARD: ShippingQuote = {
  estimated: true,
  id: 'standard',
  label: {
    'pt-br': 'Padrão (estimativa demonstrativa)',
    es: 'Estándar (estimación demostrativa)',
    'en-gb': 'Standard (demonstrative estimate)',
  },
  price: 24.9,
  days: { 'pt-br': '5 a 9 dias úteis', es: '5 a 9 días hábiles', 'en-gb': '5 to 9 business days' },
}

const EXPRESS: ShippingQuote = {
  estimated: true,
  id: 'express',
  label: {
    'pt-br': 'Expresso (estimativa demonstrativa)',
    es: 'Exprés (estimación demostrativa)',
    'en-gb': 'Express (demonstrative estimate)',
  },
  price: 39.9,
  days: { 'pt-br': '2 a 4 dias úteis', es: '2 a 4 días hábiles', 'en-gb': '2 to 4 business days' },
}

export const shippingQuotes: ShippingQuote[] = [ECONOMY, STANDARD, EXPRESS]

export interface AddressInput {
  postcode: string
  street: string
  number: string
  complement?: string
  district: string
  city: string
  state: string
  country?: string
}

/** Validação simples de CEP brasileiro (8 dígitos). */
export function isValidBrazilianPostcode(postcode: string): boolean {
  return /^\d{5}-?\d{3}$/.test(postcode.trim())
}

/**
 * Cotação demonstrativa por CEP. Sem chamada externa: prazo estimado por
 * região (ddd-like prefix) — sempre rotulado como estimativa na UI.
 */
export function quoteShipping(postcode: string, itemsCount: number): ShippingQuote[] {
  if (!isValidBrazilianPostcode(postcode)) return []
  const digits = postcode.replace(/\D/g, '')
  const prefix = Number(digits.slice(0, 2))
  // Regiões mais distantes (Norte/Nordeste) recebem prazo maior na estimativa
  const remote = prefix <= 39 || (prefix >= 65 && prefix <= 69)
  if (remote) {
    return [
      { ...ECONOMY, price: ECONOMY.price + 6 },
      { ...STANDARD, price: STANDARD.price + 8 },
      { ...EXPRESS, price: EXPRESS.price + 14 },
    ]
  }
  return itemsCount > 0 ? shippingQuotes : []
}
