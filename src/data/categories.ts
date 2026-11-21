import { CatalogCategory } from './types'

/**
 * As seis categorias da boutique. Slugs curtos, reutilizados nas URLs
 * localizadas: /pt-br/categoria/incensos, /es/categoria/inciensos...
 */
export const categories: CatalogCategory[] = [
  {
    id: 'incensos',
    slug: 'incensos',
    order: 1,
    title: {
      'pt-br': 'Incensos & Massala',
      es: 'Inciensos & Massala',
      'en-gb': 'Incense & Massala',
    },
    description: {
      'pt-br':
        'Fórmulas tradicionais e madeiras nobres, prensadas à mão para elevar a frequência do ambiente.',
      es: 'Fórmulas tradicionales y maderas nobles, prensadas a mano para elevar la vibración de cada espacio.',
      'en-gb':
        'Traditional artisan formulas and precious woods, hand-rolled to elevate your sanctuary.',
    },
    longDescription: {
      'pt-br':
        'Nossos incensos massala são preparados no estilo tradicional, com resinas, ervas e madeiras nobres prensadas à mão. Cada fragrância foi escolhida para acompanhar pausas silenciosas, leitura, meditação ou o fim de um dia corrido — sempre com queima lenta e fumos suaves.',
      es: 'Nuestros inciensos massala se preparan al estilo tradicional, con resinas, hierbas y maderas nobles prensadas a mano. Cada fragancia fue elegida para acompañar pausas silenciosas, lectura, meditación o el fin de un día intenso — siempre con combustión lenta y humos suaves.',
      'en-gb':
        'Our massala incense sticks are prepared in the traditional way, with hand-pressed resins, herbs and precious woods. Each fragrance was chosen to accompany quiet pauses, reading, meditation or the end of a busy day — always with a slow burn and gentle smoke.',
    },
    heroImage: 'https://img.usecurling.com/p/1600/900?q=incense%20smoke%20sticks&color=black',
    cardImage: 'https://img.usecurling.com/p/800/1000?q=incense%20smoke%20sticks&color=black',
  },
  {
    id: 'velas',
    slug: 'velas',
    order: 2,
    title: {
      'pt-br': 'Velas Aromáticas',
      es: 'Velas Aromáticas',
      'en-gb': 'Scented Candles',
    },
    description: {
      'pt-br': 'Cera vegetal, pavios de algodão e óleos finos para uma queima limpa e envolvente.',
      es: 'Cera vegetal, mechas de algodón y finos aceites para una combustión limpia y envolvente.',
      'en-gb': 'Plant-based botanical wax, cotton wicks and fine oils for a clean, lingering burn.',
    },
    longDescription: {
      'pt-br':
        'Velas feitas com cera vegetal e pavios de algodão, formuladas para uma queima limpa e constante. São companheiras de banhos demorados, jantares calmos e noites de leitura — luz baixa, perfume discreto e presença.',
      es: 'Velas elaboradas con cera vegetal y mechas de algodón, formuladas para una combustión limpia y constante. Son compañeras de baños largos, cenas tranquilas y noches de lectura — luz baja, perfume discreto y presencia.',
      'en-gb':
        'Candles made with plant-based wax and cotton wicks, formulated for a clean, steady burn. They accompany long baths, calm dinners and reading nights — low light, discreet perfume and presence.',
    },
    heroImage: 'https://img.usecurling.com/p/1600/900?q=scented%20candle%20linen&color=white',
    cardImage: 'https://img.usecurling.com/p/800/1000?q=scented%20candle%20linen&color=white',
  },
  {
    id: 'aromas',
    slug: 'aromas',
    order: 3,
    title: {
      'pt-br': 'Aromas & Essências',
      es: 'Aromas & Esencias',
      'en-gb': 'Aromas & Essences',
    },
    description: {
      'pt-br':
        'Gotas de presença, difusores e névoas aromáticas para perfumar com sutileza e constância.',
      es: 'Gotas de presencia, difusores y brumas aromáticas para perfumar con sutileza y constancia.',
      'en-gb': 'Subtle drops of presence, reed diffusers and room mists for serene constancy.',
    },
    longDescription: {
      'pt-br':
        'Difusores, sprays e essências para perfume constante sem chama. Ideais para entrada, escritório, quarto ou banheiro — bastam alguns toques ou varetas para que o ambiente respire calma durante horas.',
      es: 'Difusores, sprays y esencias para un perfume constante sin llama. Ideales para entrada, escritorio, dormitorio o baño — bastan unas varillas o toques para que el ambiente respire calma durante horas.',
      'en-gb':
        'Diffusers, sprays and essences for constant scent without a flame. Ideal for entryways, desks, bedrooms or bathrooms — a few reeds or sprays are enough to keep a room breathing calm for hours.',
    },
    heroImage: 'https://img.usecurling.com/p/1600/900?q=essential%20oil%20diffuser&color=gray',
    cardImage: 'https://img.usecurling.com/p/800/1000?q=essential%20oil%20diffuser&color=gray',
  },
  {
    id: 'rituais',
    slug: 'rituais',
    order: 4,
    title: {
      'pt-br': 'Rituais & Espiritualidade',
      es: 'Rituales & Espiritualidad',
      'en-gb': 'Rituals & Spirituality',
    },
    description: {
      'pt-br':
        'Elementos sagrados, sinos, resinas puras e incensários concebidos para a sua pausa interior.',
      es: 'Elementos sagrados, campanas, resinas puras e incensarios diseñados para tu pausa interior.',
      'en-gb': 'Sacred elements, bells, raw resins and holders crafted for quiet reflection.',
    },
    longDescription: {
      'pt-br':
        'Kits, incensários e conjuntos pensados para a sua pausa interior: acender, respirar, contemplar. Cada peça apoia rituais simples de presença — sem promessas, apenas objetos bonitos e funcionais para o seu momento de silêncio.',
      es: 'Kits, incensarios y conjuntos pensados para tu pausa interior: encender, respirar, contemplar. Cada pieza acompaña rituales simples de presencia — sin promesas, solo objetos bellos y funcionales para tu momento de silencio.',
      'en-gb':
        'Kits, holders and sets designed for your inner pause: light, breathe, contemplate. Each piece supports simple rituals of presence — no promises, only beautiful and functional objects for your quiet moment.',
    },
    heroImage: 'https://img.usecurling.com/p/1600/900?q=meditation%20brass%20bell&color=black',
    cardImage: 'https://img.usecurling.com/p/800/1000?q=meditation%20brass%20bell&color=black',
  },
  {
    id: 'acessorios',
    slug: 'acessorios',
    order: 5,
    title: {
      'pt-br': 'Acessórios & Decoração',
      es: 'Accesorios & Decoración',
      'en-gb': 'Accessories & Décor',
    },
    description: {
      'pt-br':
        'Design minimalista em cerâmica, pedra e latão envelhecido que harmoniza com seu santuário.',
      es: 'Diseño minimalista en cerámica, piedra y latón envejecido que armoniza con tu santuario.',
      'en-gb':
        'Minimalist ceramics, stone and aged brass designed to complement your calm interior.',
    },
    longDescription: {
      'pt-br':
        'Peças de cerâmica, madeira e latão que organizam e embelezam o seu canto de rituais. Porta-incensos, bandejas e detalhes desenhados para durar, combinando com a paleta quente da casa.',
      es: 'Piezas de cerámica, madera y latón que organizan y embellecen tu rincón de rituales. Porta-inciensos, bandejas y detalles diseñados para durar, en sintonía con la paleta cálida de la casa.',
      'en-gb':
        'Ceramic, wood and brass pieces that organise and beautify your ritual corner. Incense holders, trays and details designed to last, in tune with the warm palette of the house.',
    },
    heroImage: 'https://img.usecurling.com/p/1600/900?q=ceramic%20incense%20holder&color=white',
    cardImage: 'https://img.usecurling.com/p/800/1000?q=ceramic%20incense%20holder&color=white',
  },
  {
    id: 'kits',
    slug: 'kits',
    order: 6,
    title: {
      'pt-br': 'Kits & Presentes',
      es: 'Kits & Regalos',
      'en-gb': 'Kits & Gifts',
    },
    description: {
      'pt-br': 'Curadorias especiais embaladas com linho e carinho para presentear quem você ama.',
      es: 'Curadurías especiales envueltas en lino y afecto para obsequiar a quienes más amas.',
      'en-gb': 'Bespoke sets wrapped in natural linen and care, prepared for thoughtful gifting.',
    },
    longDescription: {
      'pt-br':
        'Curadorias prontas para presentear — ou para presentear a si mesmo. Cada kit reúne aromas e objetos complementares, embalados com linho e um cartão com mensagem; a composição exata de cada caixa aparece na página do kit.',
      es: 'Curadurías listas para regalar — o para regalarte. Cada kit reúne aromas y objetos complementares, envueltos en lino y una tarjeta con mensaje; la composición exacta de cada caja aparece en la página del kit.',
      'en-gb':
        'Curated sets ready to gift — or to treat yourself. Each kit brings together complementary scents and objects, wrapped in linen with a message card; the exact composition of each box appears on the kit page.',
    },
    heroImage: 'https://img.usecurling.com/p/1600/900?q=gift%20box%20linen&color=gray',
    cardImage: 'https://img.usecurling.com/p/800/1000?q=gift%20box%20linen&color=gray',
  },
]
