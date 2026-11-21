import { CatalogKit } from './types'

/**
 * As quatro páginas de kit do briefing. Cada kit lista os produtos que
 * o compõem (por ID do catálogo), a experiência proposta e o preço
 * demonstrativo. Estrutura pronta para controle de estoque dos
 * componentes na etapa comercial.
 */
export const kits: CatalogKit[] = [
  {
    id: 'k-serenidade',
    slug: 'ritual-da-serenidade',
    name: {
      'pt-br': 'Ritual da Serenidade',
      es: 'Ritual de la Serenidad',
      'en-gb': 'Ritual of Serenity',
    },
    experience: {
      'pt-br':
        'Uma pausa completa para noites que pedem silêncio: a vela serena, o incenso de lavanda e a pedra de pausa compõem o caminho do dia para o descanso.',
      es: 'Una pausa completa para noches que piden silencio: la vela serena, el incienso de lavanda y la piedra de pausa componen el camino del día al descanso.',
      'en-gb':
        'A complete pause for evenings that ask for silence: the serene candle, lavender incense and the pause stone pave the way from day to rest.',
    },
    detail: {
      'pt-br':
        'O kit chega embalado em linho com cartão-guia de três respirações. Ideal para presentes de despedida, aniversários ou para o seu próprio ritual noturno.',
      es: 'El kit llega envuelto en lino con una tarjeta-guía de tres respiraciones. Ideal para regalos de despedida, cumpleaños o para tu propio ritual nocturno.',
      'en-gb':
        'The kit arrives wrapped in linen with a three-breath guide card. Ideal for farewell gifts, birthdays or your own nightly ritual.',
    },
    price: 169.9,
    currency: 'BRL',
    image: 'https://img.usecurling.com/p/1200/900?q=lavender%20candle%20ritual%20set&color=white',
    productIds: ['p-vela-serenidade', 'p-inc-massala-lavanda', 'p-porta-incenso-ceramico'],
    featured: true,
    isDemonstrative: true,
  },
  {
    id: 'k-essencias-alma',
    slug: 'essencias-da-alma',
    name: {
      'pt-br': 'Essências da Alma',
      es: 'Esencias del Alma',
      'en-gb': 'Essences of the Soul',
    },
    experience: {
      'pt-br':
        'Uma viagem olfativa pela assinatura da casa: quatro essências em frascos de vidro âmbar, para explorar uma por semana e descobrir a sua favorita.',
      es: 'Un viaje olfativo por la firma de la casa: cuatro esencias en frascos de vidrio ámbar, para explorar una por semana y descubrir tu favorita.',
      'en-gb':
        'An olfactory journey through the house signature: four essences in amber glass bottles, one to explore each week until you find your favourite.',
    },
    detail: {
      'pt-br':
        'A caixa de linho inclui cartões com sugestões de uso para cada essência — no difusor, na pedra aromática ou em um banho de imersão lento.',
      es: 'La caja de lino incluye tarjetas con sugerencias de uso para cada esencia — en el difusor, en la piedra aromática o en un baño lento de inmersión.',
      'en-gb':
        'The linen box includes cards with usage suggestions for each essence — in the diffuser, on the aroma stone or in a slow soak bath.',
    },
    price: 139.9,
    currency: 'BRL',
    image:
      'https://img.usecurling.com/p/1200/900?q=amber%20glass%20bottles%20essential%20oils&color=white',
    productIds: ['p-essencia-jasmim', 'p-difusor-lavanda', 'p-difusor-bamboo'],
    featured: true,
    isDemonstrative: true,
  },
  {
    id: 'k-momento-zen',
    slug: 'momento-zen',
    name: { 'pt-br': 'Momento Zen', es: 'Momento Zen', 'en-gb': 'Zen Moment' },
    experience: {
      'pt-br':
        'Três respirações e fumaça alta: o kit reúne incenso Nag Champa, incensário de cerâmica e o cartão de pausa para a prática diária mais curta.',
      es: 'Tres respiraciones y humo alto: el kit reúne incienso Nag Champa, incensario de cerámica y la tarjeta de pausa para la práctica diaria más corta.',
      'en-gb':
        'Three breaths and rising smoke: the kit brings together Nag Champa incense, a ceramic holder and the pause card for the shortest daily practice.',
    },
    detail: {
      'pt-br':
        'Um presente certeiro para colegas, pais e amigos que vivem no ritmo rápido — e para o seu próprio primeiro canto de meditação.',
      es: 'Un regalo certero para colegas, padres y amigos que viven en el ritmo rápido — y para tu propio primer rincón de meditación.',
      'en-gb':
        'A sure-footed gift for colleagues, parents and friends living at a fast pace — and for your own first meditation corner.',
    },
    price: 119.9,
    currency: 'BRL',
    image: 'https://img.usecurling.com/p/1200/900?q=zen%20incense%20ceramic%20holder&color=white',
    productIds: ['p-inc-massala-nagchampa', 'p-incensario-meditacao', 'p-porta-incenso-madeira'],
    isDemonstrative: true,
  },
  {
    id: 'k-entardecer',
    slug: 'ritual-do-entardecer',
    name: { 'pt-br': 'Ritual do Entardecer', es: 'Ritual del Atardecer', 'en-gb': 'Sunset Ritual' },
    experience: {
      'pt-br':
        'Para a hora em que a luz baixa: chá quente, vela de baunilha e sândalo amadeirado preparam a transição do trabalho para a mesa, da mesa para a noite.',
      es: 'Para la hora en que la luz baja: té caliente, vela de vainilla y sándalo amaderado preparan la transición del trabajo a la mesa, de la mesa a la noche.',
      'en-gb':
        'For the hour the light dims: hot tea, a vanilla candle and woody sandalwood prepare the transition from work to table, from table to evening.',
    },
    detail: {
      'pt-br':
        'O kit do entardecer vem com sachê de chá, vela e spray de sândalo — o trio para desligar o computador com intenção e acender a noite com calma.',
      es: 'El kit del atardecer viene con saquito de té, vela y spray de sándalo — el trío para apagar el ordenador con intención y encender la noche con calma.',
      'en-gb':
        'The sunset kit comes with a tea sachet, a candle and sandalwood spray — the trio to switch off the laptop with intention and light the evening with calm.',
    },
    price: 129.9,
    currency: 'BRL',
    image: 'https://img.usecurling.com/p/1200/900?q=sunset%20tea%20candle%20cosy&color=white',
    productIds: ['p-vela-baunilha', 'p-spray-sandalo', 'p-kit-presente-aconchego'],
    isDemonstrative: true,
  },
]
