import { CatalogCategory } from './types'

/**
 * As sete categorias da boutique. Slugs alinhados 1:1 com o backend
 * (PocketBase, coleção `categories`, migration 0002) e reutilizados nas
 * URLs localizadas: /pt-br/categoria/incensos-defumacao, etc.
 */
export const categories: CatalogCategory[] = [
  {
    id: 'aromas-essencias',
    slug: 'aromas-essencias',
    order: 1,
    title: {
      'pt-br': 'Aromas & Essências',
      es: 'Aromas & Esencias',
      'en-gb': 'Aromas & Essences',
    },
    description: {
      'pt-br': 'Essências concentradas e óleos para difusores, pedras e rituais de ambientação.',
      es: 'Esencias concentradas y aceites para difusores, piedras y rituales de ambientación.',
      'en-gb': 'Concentrated essences and oils for diffusers, stones and atmosphere rituals.',
    },
    longDescription: {
      'pt-br':
        'Essências concentradas, sprays e óleos para perfume constante sem chama. Ideais para entrada, escritório, quarto ou banheiro — bastam alguns toques ou gotas para que o ambiente respire calma durante horas.',
      es: 'Esencias concentradas, sprays y aceites para un perfume constante sin llama. Ideales para entrada, escritorio, dormitorio o baño — bastan unos toques o gotas para que el ambiente respire calma durante horas.',
      'en-gb':
        'Concentrated essences, sprays and oils for constant scent without a flame. Ideal for entryways, desks, bedrooms or bathrooms — a few drops or sprays are enough to keep a room breathing calm for hours.',
    },
    heroImage:
      'https://img.usecurling.com/p/1600/900?q=essential%20oil%20amber%20bottles&color=white',
    cardImage:
      'https://img.usecurling.com/p/800/1000?q=essential%20oil%20amber%20bottles&color=white',
  },
  {
    id: 'incensos-defumacao',
    slug: 'incensos-defumacao',
    order: 2,
    title: {
      'pt-br': 'Incensos & Defumação',
      es: 'Incienso & Defumación',
      'en-gb': 'Incense & Smudging',
    },
    description: {
      'pt-br':
        'Varas, cones e resinas para aromatizar e marcar o ritmo dos seus momentos de pausa.',
      es: 'Varillas, conos y resinas para aromatizar y marcar el ritmo de tus pausas.',
      'en-gb': 'Sticks, cones and resins to scent your pauses and mark their rhythm.',
    },
    longDescription: {
      'pt-br':
        'Nossos incensos massala são preparados no estilo tradicional, com resinas, ervas e madeiras nobres prensadas à mão. Cada fragrância foi escolhida para acompanhar pausas silenciosas, leitura, meditação ou o fim de um dia corrido — sempre com queima lenta e fumos suaves.',
      es: 'Nuestros inciensos massala se preparan al estilo tradicional, con resinas, hierbas y maderas nobles prensadas a mano. Cada fragancia fue elegida para acompañar pausas silenciosas, lectura, meditación o el fin de un día intenso — siempre con combustión lenta y humos suaves.',
      'en-gb':
        'Our massala incense sticks are prepared in the traditional way, with hand-pressed resins, herbs and precious woods. Each fragrance was chosen to accompany quiet pauses, reading, meditation or the end of a busy day — always with a slow burn and gentle smoke.',
    },
    heroImage: 'https://img.usecurling.com/p/1600/900?q=incense%20sticks%20smoke%20zen&color=black',
    cardImage: 'https://img.usecurling.com/p/800/1000?q=incense%20sticks%20smoke%20zen&color=black',
  },
  {
    id: 'velas-aromaticas',
    slug: 'velas-aromaticas',
    order: 3,
    title: {
      'pt-br': 'Velas Aromáticas',
      es: 'Velas Aromáticas',
      'en-gb': 'Scented Candles',
    },
    description: {
      'pt-br': 'Cera vegetal, pavio de algodão e luz baixa para as horas em que a casa se aquieta.',
      es: 'Cera vegetal, mecha de algodón y luz baja para las horas en que la casa se aquieta.',
      'en-gb':
        'Plant-based wax, cotton wick and low light for the hours when the house goes quiet.',
    },
    longDescription: {
      'pt-br':
        'Velas feitas com cera vegetal e pavios de algodão, formuladas para uma queima limpa e constante. São companheiras de banhos demorados, jantares calmos e noites de leitura — luz baixa, perfume discreto e presença.',
      es: 'Velas elaboradas con cera vegetal y mechas de algodón, formuladas para una combustión limpia y constante. Son compañeras de baños largos, cenas tranquilas y noches de lectura — luz baja, perfume discreto y presencia.',
      'en-gb':
        'Candles made with plant-based wax and cotton wicks, formulated for a clean, steady burn. They accompany long baths, calm dinners and reading nights — low light, discreet perfume and presence.',
    },
    heroImage:
      'https://img.usecurling.com/p/1600/900?q=scented%20candle%20warm%20light&color=white',
    cardImage:
      'https://img.usecurling.com/p/800/1000?q=scented%20candle%20warm%20light&color=white',
  },
  {
    id: 'difusores-aromatizadores',
    slug: 'difusores-aromatizadores',
    order: 4,
    title: {
      'pt-br': 'Difusores & Aromatizadores',
      es: 'Difusores & Aromatizadores',
      'en-gb': 'Diffusers & Scenting',
    },
    description: {
      'pt-br': 'Difusores elétricos, de varetas e pedras aromáticas para perfume contínuo.',
      es: 'Difusores eléctricos, de varillas y piedras aromáticas para perfume continuo.',
      'en-gb': 'Electric, reed and aroma stone diffusers for continuous scent.',
    },
    longDescription: {
      'pt-br':
        'Difusores de varetas, elétricos e pedras aromáticas para perfume contínuo sem chama. Basta girar as varetas ou ligar o aparelho para que o ambiente respire o mesmo aroma por horas.',
      es: 'Difusores de varillas, eléctricos y piedras aromáticas para perfume continuo sin llama. Basta girar las varillas o encender el aparato para que el ambiente respire el mismo aroma por horas.',
      'en-gb':
        'Reed, electric and aroma-stone diffusers for continuous flame-free scent. Flip the reeds or switch it on and the room keeps breathing the same aroma for hours.',
    },
    heroImage: 'https://img.usecurling.com/p/1600/900?q=reed%20diffuser%20home%20aroma&color=white',
    cardImage: 'https://img.usecurling.com/p/800/1000?q=reed%20diffuser%20home%20aroma&color=white',
  },
  {
    id: 'meditacao-relaxamento',
    slug: 'meditacao-relaxamento',
    order: 5,
    title: {
      'pt-br': 'Meditação & Relaxamento',
      es: 'Meditación & Relaxamiento',
      'en-gb': 'Meditation & Relaxation',
    },
    description: {
      'pt-br': 'Objetos de apoio à pausa: sinos, almofadas, pedras e acessórios de contemplação.',
      es: 'Objetos de apoyo a la pausa: campanas, cojines, piedras y accesorios de contemplación.',
      'en-gb':
        'Objects that support the pause: bells, cushions, stones and contemplation accessories.',
    },
    longDescription: {
      'pt-br':
        'Kits, incensários e conjuntos pensados para a sua pausa interior: acender, respirar, contemplar. Cada peça apoia rituais simples de presença — sem promessas, apenas objetos bonitos e funcionais para o seu momento de silêncio.',
      es: 'Kits, incensarios y conjuntos pensados para tu pausa interior: encender, respirar, contemplar. Cada pieza acompaña rituales simples de presencia — sin promesas, solo objetos bellos y funcionales para tu momento de silencio.',
      'en-gb':
        'Kits, holders and sets designed for your inner pause: light, breathe, contemplate. Each piece supports simple rituals of presence — no promises, only beautiful and functional objects for your quiet moment.',
    },
    heroImage:
      'https://img.usecurling.com/p/1600/900?q=meditation%20cushion%20zen%20bell&color=black',
    cardImage:
      'https://img.usecurling.com/p/800/1000?q=meditation%20cushion%20zen%20bell&color=black',
  },
  {
    id: 'decoracao-zen',
    slug: 'decoracao-zen',
    order: 6,
    title: {
      'pt-br': 'Decoração Zen',
      es: 'Decoración Zen',
      'en-gb': 'Zen Decoration',
    },
    description: {
      'pt-br': 'Peças de madeira, cerâmica e pedra que trazem calma à decoração.',
      es: 'Piezas de madera, cerámica y piedra que traen calma a la decoración.',
      'en-gb': 'Wood, ceramic and stone pieces that bring calm to your decor.',
    },
    longDescription: {
      'pt-br':
        'Peças de cerâmica, madeira e pedra que organizam e embelezam o seu canto de rituais. Porta-incensos, bandejas e detalhes desenhados para durar, combinando com a paleta quente da casa.',
      es: 'Piezas de cerámica, madera y piedra que organizan y embellecen tu rincón de rituales. Porta-inciensos, bandejas y detalles diseñados para durar, en sintonía con la paleta cálida de la casa.',
      'en-gb':
        'Ceramic, wood and stone pieces that organise and beautify your ritual corner. Incense holders, trays and details designed to last, in tune with the warm palette of the house.',
    },
    heroImage:
      'https://img.usecurling.com/p/1600/900?q=zen%20stone%20wood%20decoration&color=white',
    cardImage:
      'https://img.usecurling.com/p/800/1000?q=zen%20stone%20wood%20decoration&color=white',
  },
  {
    id: 'kits-presentes',
    slug: 'kits-presentes',
    order: 7,
    title: {
      'pt-br': 'Kits & Presentes',
      es: 'Kits & Regalos',
      'en-gb': 'Kits & Gifts',
    },
    description: {
      'pt-br': 'Combinações pensadas para presentear — ou para presentear a si mesmo.',
      es: 'Combinaciones pensadas para regalar — o para regalarte.',
      'en-gb': 'Curated combinations to give as gifts — or to gift yourself.',
    },
    longDescription: {
      'pt-br':
        'Curadorias prontas para presentear — ou para presentear a si mesmo. Cada kit reúne aromas e objetos complementares, embalados com linho e um cartão com mensagem; a composição exata de cada caixa aparece na página do kit.',
      es: 'Curadurías listas para regalar — o para regalarte. Cada kit reúne aromas y objetos complementares, envueltos en lino y una tarjeta con mensaje; la composición exacta de cada caja aparece en la página del kit.',
      'en-gb':
        'Curated sets ready to gift — or to treat yourself. Each kit brings together complementary scents and objects, wrapped in linen with a message card; the exact composition of each box appears on the kit page.',
    },
    heroImage: 'https://img.usecurling.com/p/1600/900?q=gift%20box%20aromatherapy&color=white',
    cardImage: 'https://img.usecurling.com/p/800/1000?q=gift%20box%20aromatherapy&color=white',
  },
]
