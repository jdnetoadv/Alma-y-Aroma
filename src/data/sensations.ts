import { SensationNavigationItem } from './types'

/**
 * Navegação por sensações — "Encontre o aroma do seu momento."
 * Cada item direciona a uma coleção de produtos relacionados.
 * Sem promessas de efeitos médicos ou espirituais garantidos.
 */
export const sensations: SensationNavigationItem[] = [
  {
    id: 'relaxar',
    labelKey: 'ritual.relax',
    titleKey: 'sensation.relax',
    image: 'https://img.usecurling.com/p/800/600?q=lavender%20soft%20light&color=white',
    productIds: [
      'p-inc-massala-lavanda',
      'p-vela-lavanda',
      'p-vela-serenidade',
      'p-difusor-lavanda',
      'p-essencia-jasmim',
      'p-kit-ritual-serenidade',
      'p-inc-massala-jasmim',
      'p-caixa-essencias-alma',
    ],
  },
  {
    id: 'meditar',
    labelKey: 'ritual.meditate',
    titleKey: 'sensation.meditate',
    image: 'https://img.usecurling.com/p/800/600?q=meditation%20incense%20smoke&color=black',
    productIds: [
      'p-inc-massala-sandel',
      'p-inc-massala-nagchampa',
      'p-inc-massala-patchouli',
      'p-kit-ritual-meditacao',
      'p-incensario-meditacao',
      'p-porta-incenso-ceramico',
      'p-conjunto-contemplacao',
      'p-porta-incenso-madeira',
      'p-difusor-bamboo',
    ],
  },
  {
    id: 'renovar',
    labelKey: 'ritual.renew',
    titleKey: 'sensation.renew',
    image: 'https://img.usecurling.com/p/800/600?q=citrus%20fresh%20green%20botanical&color=green',
    productIds: [
      'p-difusor-bamboo',
      'p-essencia-jasmim',
      'p-vela-sandalo',
      'p-spray-sandalo',
      'p-vela-lavanda',
      'p-bandeja-rituais',
      'p-kit-presente-momento-zen',
    ],
  },
  {
    id: 'acolher',
    labelKey: 'ritual.nest',
    titleKey: 'sensation.acolher',
    image: 'https://img.usecurling.com/p/800/600?q=cosy%20candle%20warm%20blanket&color=orange',
    productIds: [
      'p-vela-baunilha',
      'p-vela-sandalo',
      'p-inc-massala-sandel',
      'p-spray-sandalo',
      'p-porta-incenso-madeira',
      'p-bandeja-rituais',
      'p-kit-presente-aconchego',
      'p-kit-presente-momento-zen',
    ],
  },
  {
    id: 'presentear',
    labelKey: 'ritual.gift',
    titleKey: 'sensation.presentear',
    image: 'https://img.usecurling.com/p/800/600?q=gift%20box%20linen%20ribbon&color=gray',
    productIds: [
      'p-caixa-essencias-alma',
      'p-kit-presente-aconchego',
      'p-kit-presente-momento-zen',
      'p-kit-ritual-meditacao',
      'p-kit-ritual-serenidade',
      'p-conjunto-contemplacao',
      'p-vela-serenidade',
      'p-bandeja-rituais',
    ],
  },
]
