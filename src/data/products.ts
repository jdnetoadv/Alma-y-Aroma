import { CatalogProduct, ProductTechnical } from './types'

/**
 * Dados técnicos DEMONSTRATIVOS. Valores marcados como "—" estão
 * intencionalmente em branco para configuração futura, sem inventar dados.
 */
const technical = (
  sku: string,
  composition: string,
  extra: Partial<ProductTechnical> = {},
): ProductTechnical => ({
  brand: {
    'pt-br': 'Alma y Aroma (demonstrativo)',
    es: 'Alma y Aroma (demostrativo)',
    'en-gb': 'Alma y Aroma (demonstrative)',
  },
  composition: { 'pt-br': composition, es: composition, 'en-gb': composition },
  weight: { 'pt-br': '—', es: '—', 'en-gb': '—' },
  dimensions: { 'pt-br': '—', es: '—', 'en-gb': '—' },
  contents: { 'pt-br': '—', es: '—', 'en-gb': '—' },
  origin: { 'pt-br': '—', es: '—', 'en-gb': '—' },
  usage: {
    'pt-br': 'Instruções de uso serão definidas com a produção.',
    es: 'Instrucciones de uso se definirán con la producción.',
    'en-gb': 'Usage instructions to be defined with production.',
  },
  care: {
    'pt-br': 'Cuidados e advertências serão definidos com a produção.',
    es: 'Cuidados y advertencias se definirán con la producción.',
    'en-gb': 'Care and warnings to be defined with production.',
  },
  sku,
  ...extra,
})

const demoImages = (q: string, extraQuery?: string): string[] => [
  `https://img.usecurling.com/p/1000/1250?q=${q}&color=white`,
  `https://img.usecurling.com/p/1000/1250?q=${q}${extraQuery ?? '%20detail'}`,
]

/**
 * Os 24 produtos demonstrativos do catálogo (nomes verbatim do briefing).
 * Preços ilustrativos em reais; nenhum produto está à venda nesta etapa.
 */
export const products: CatalogProduct[] = [
  // ─── Incensos & Massala ───────────────────────────────────────────────
  {
    id: 'p-inc-massala-sandel',
    sku: 'AYA-INC-001',
    slug: 'incenso-massala-sandalo',
    category: 'incensos',
    name: {
      'pt-br': 'Incenso Massala Sândalo',
      es: 'Incienso Massala Sándalo',
      'en-gb': 'Massala Sandalwood Incense',
    },
    shortDescription: {
      'pt-br': 'Madeira cremosa e envolvente para pausas serenas.',
      es: 'Madera cremosa y envolvente para pausas serenas.',
      'en-gb': 'Creamy, enveloping wood for serene pauses.',
    },
    longDescription: {
      'pt-br':
        'Uma fragrância amadeirada e acolhedora que convida à contemplação. Ideal para criar uma atmosfera de tranquilidade e transformar pequenos momentos em rituais de bem-estar.',
      es: 'Una fragancia amaderada y acogedora que invita a la contemplación. Ideal para crear una atmósfera de tranquilidad y transformar pequeños momentos en rituales de bienestar.',
      'en-gb':
        'A warm, woody fragrance that invites contemplation. Ideal for creating an atmosphere of tranquillity and turning small moments into rituals of wellbeing.',
    },
    illustrativePrice: 24.9,
    currency: 'BRL',
    images: demoImages('sandalwood%20incense%20sticks'),
    variations: [{ kind: 'aroma', values: ['Sândalo', 'Sándalo', 'Sandalwood'] }],
    scentFamily: 'woody',
    productType: { 'pt-br': 'Incenso', es: 'Incienso', 'en-gb': 'Incense' },
    tags: ['sandalwood', 'sándalo', 'sândalo', 'woody', 'amadeirado', 'meditar', 'acolher'],
    purposes: ['meditar', 'acolher'],
    featured: true,
    isNew: false,
    status: 'demo',
    isDemonstrative: true,
    technical: technical(
      'AYA-INC-001',
      'Massala tradicional, madeiras e resinas (composição demonstrativa)',
    ),
  },
  {
    id: 'p-inc-massala-lavanda',
    sku: 'AYA-INC-002',
    slug: 'incenso-massala-lavanda',
    category: 'incensos',
    name: {
      'pt-br': 'Incenso Massala Lavanda',
      es: 'Incienso Massala Lavanda',
      'en-gb': 'Massala Lavender Incense',
    },
    shortDescription: {
      'pt-br': 'Floral herbáceo suave para desacelerar o dia.',
      es: 'Floral herbáceo suave para desacelerar el día.',
      'en-gb': 'Soft herbal floral to slow the day down.',
    },
    longDescription: {
      'pt-br':
        'O clássico floral herbáceo da lavanda em uma base massala suave. Uma escolha delicada para o fim da tarde, para acompanhar o chá e a transição do trabalho para o descanso.',
      es: 'El clásico floral herbáceo de la lavanda en una base massala suave. Una elección delicada para el final de la tarde, para acompañar el té y la transición del trabajo al descanso.',
      'en-gb':
        'The classic herbal floral of lavender on a soft massala base. A delicate choice for late afternoon, accompanying tea and the transition from work to rest.',
    },
    illustrativePrice: 24.9,
    currency: 'BRL',
    images: demoImages('lavender%20incense%20sticks'),
    variations: [{ kind: 'aroma', values: ['Lavanda', 'Lavanda', 'Lavender'] }],
    scentFamily: 'floral-herbal',
    productType: { 'pt-br': 'Incenso', es: 'Incienso', 'en-gb': 'Incense' },
    tags: ['lavanda', 'lavender', 'floral', 'relaxar'],
    purposes: ['relaxar'],
    featured: true,
    isNew: true,
    status: 'demo',
    isDemonstrative: true,
    technical: technical(
      'AYA-INC-002',
      'Massala tradicional, ervas e óleos (composição demonstrativa)',
    ),
  },
  {
    id: 'p-inc-massala-rosa',
    sku: 'AYA-INC-003',
    slug: 'incenso-massala-rosa',
    category: 'incensos',
    name: {
      'pt-br': 'Incenso Massala Rosa',
      es: 'Incienso Massala Rosa',
      'en-gb': 'Massala Rose Incense',
    },
    shortDescription: {
      'pt-br': 'Floral romântico e luminoso para momentos de cuidado.',
      es: 'Floral romántico y luminoso para momentos de cuidado.',
      'en-gb': 'Romantic, luminous floral for moments of self-care.',
    },
    longDescription: {
      'pt-br':
        'Pétalos de rosa em uma base quente e levemente adocicada. Um perfume luminoso para rituais de autocuidado, banho demorado ou uma mesa posta para dois.',
      es: 'Pétalos de rosa sobre una base cálida y ligeramente dulce. Un perfume luminoso para rituales de autocuidado, un baño largo o una mesa puesta para dos.',
      'en-gb':
        'Rose petals over a warm, lightly sweet base. A luminous perfume for self-care rituals, long baths or a table set for two.',
    },
    illustrativePrice: 24.9,
    currency: 'BRL',
    images: demoImages('rose%20incense%20smoke'),
    variations: [{ kind: 'aroma', values: ['Rosa', 'Rosa', 'Rose'] }],
    scentFamily: 'floral-herbal',
    productType: { 'pt-br': 'Incenso', es: 'Incienso', 'en-gb': 'Incense' },
    tags: ['rosa', 'rose', 'floral', 'acolher'],
    purposes: ['acolher'],
    status: 'demo',
    isDemonstrative: true,
    technical: technical(
      'AYA-INC-003',
      'Massala tradicional, pétalos e óleos (composição demonstrativa)',
    ),
  },
  {
    id: 'p-inc-massala-jasmim',
    sku: 'AYA-INC-004',
    slug: 'incenso-massala-jasmim',
    category: 'incensos',
    name: {
      'pt-br': 'Incenso Massala Jasmim',
      es: 'Incienso Massala Jazmín',
      'en-gb': 'Massala Jasmine Incense',
    },
    shortDescription: {
      'pt-br': 'Floral branco intenso para noites de presença.',
      es: 'Floral blanco intenso para noches de presencia.',
      'en-gb': 'Intense white floral for present evenings.',
    },
    longDescription: {
      'pt-br':
        'Jasmim noturno, floral branco e envolvente. Belo para as horas em que a casa silencia e a conversa se faz baixa — um convite à presença.',
      es: 'Jazmín nocturno, floral blanco y envolvente. Hermoso para las horas en que la casa se calla y la conversación baja — una invitación a la presencia.',
      'en-gb':
        'Night jasmine, an enveloping white floral. Beautiful for the hours when the house falls silent and conversation softens — an invitation to presence.',
    },
    illustrativePrice: 24.9,
    currency: 'BRL',
    images: demoImages('jasmine%20flowers%20incense'),
    variations: [{ kind: 'aroma', values: ['Jasmim', 'Jazmín', 'Jasmine'] }],
    scentFamily: 'floral-herbal',
    productType: { 'pt-br': 'Incenso', es: 'Incienso', 'en-gb': 'Incense' },
    tags: ['jasmim', 'jazmín', 'jasmine', 'floral', 'relaxar'],
    purposes: ['relaxar'],
    status: 'demo',
    isDemonstrative: true,
    technical: technical(
      'AYA-INC-004',
      'Massala tradicional, flores e óleos (composição demonstrativa)',
    ),
  },
  {
    id: 'p-inc-massala-patchouli',
    sku: 'AYA-INC-005',
    slug: 'incenso-massala-patchouli',
    category: 'incensos',
    name: {
      'pt-br': 'Incenso Massala Patchouli',
      es: 'Incienso Massala Patchouli',
      'en-gb': 'Massala Patchouli Incense',
    },
    shortDescription: {
      'pt-br': 'Terroso e profundo, para enraizar a mente.',
      es: 'Terroso y profundo, para enraizar la mente.',
      'en-gb': 'Earthy and deep, to ground the mind.',
    },
    longDescription: {
      'pt-br':
        'Patchouli terroso e profundo, com fundo doce. Um incenso de enraizamento — companheiro de práticas de respiração, escrita e leitura atenta.',
      es: 'Patchouli terroso y profundo, con fondo dulce. Un incienso de enraizamiento — compañero de prácticas de respiración, escritura y lectura atenta.',
      'en-gb':
        'Earthy, deep patchouli with a sweet undertone. A grounding incense — a companion for breathing practices, journalling and attentive reading.',
    },
    illustrativePrice: 24.9,
    currency: 'BRL',
    images: demoImages('patchouli%20incense%20smoke'),
    variations: [{ kind: 'aroma', values: ['Patchouli', 'Patchouli', 'Patchouli'] }],
    scentFamily: 'woody',
    productType: { 'pt-br': 'Incenso', es: 'Incienso', 'en-gb': 'Incense' },
    tags: ['patchouli', 'terroso', 'earthy', 'meditar'],
    purposes: ['meditar'],
    status: 'demo',
    isDemonstrative: true,
    technical: technical(
      'AYA-INC-005',
      'Massala tradicional, folhas e resinas (composição demonstrativa)',
    ),
  },
  {
    id: 'p-inc-massala-nagchampa',
    sku: 'AYA-INC-006',
    slug: 'incenso-massala-nag-champa',
    category: 'incensos',
    name: {
      'pt-br': 'Incenso Massala Nag Champa',
      es: 'Incienso Massala Nag Champa',
      'en-gb': 'Massala Nag Champa Incense',
    },
    shortDescription: {
      'pt-br': 'O clássico das ashrams, doce e resinoso.',
      es: 'El clásico de los ashrams, dulce y resinoso.',
      'en-gb': 'The ashram classic, sweet and resinous.',
    },
    longDescription: {
      'pt-br':
        'Nag Champa é o clássico dos templos: doce, resinoso e inconfundível. Feito para práticas de meditação e para quem busca um perfume de memória afetiva.',
      es: 'Nag Champa es el clásico de los templos: dulce, resinoso e inconfundible. Hecho para prácticas de meditación y para quienes buscan un perfume de memoria afectiva.',
      'en-gb':
        'Nag Champa is the temple classic: sweet, resinous and unmistakable. Made for meditation practices and for those seeking a perfume of fond memory.',
    },
    illustrativePrice: 24.9,
    currency: 'BRL',
    images: demoImages('nag%20champa%20incense'),
    variations: [{ kind: 'aroma', values: ['Nag Champa', 'Nag Champa', 'Nag Champa'] }],
    scentFamily: 'resinous',
    productType: { 'pt-br': 'Incenso', es: 'Incienso', 'en-gb': 'Incense' },
    tags: ['nag champa', 'resina', 'resinous', 'meditar'],
    purposes: ['meditar'],
    featured: true,
    status: 'demo',
    isDemonstrative: true,
    technical: technical(
      'AYA-INC-006',
      'Massala tradicional, resinas e flores (composição demonstrativa)',
    ),
  },

  // ─── Velas Aromáticas ─────────────────────────────────────────────────
  {
    id: 'p-vela-serenidade',
    sku: 'AYA-VEL-001',
    slug: 'vela-aromatica-serenidade',
    category: 'velas',
    name: {
      'pt-br': 'Vela Aromática Serenidade',
      es: 'Vela Aromática Serenidad',
      'en-gb': 'Serenity Scented Candle',
    },
    shortDescription: {
      'pt-br': 'Luz baixa e perfume calmante para o fim do dia.',
      es: 'Luz baja y perfume calmante para el fin del día.',
      'en-gb': 'Low light and calming scent for the end of the day.',
    },
    longDescription: {
      'pt-br':
        'Nossa vela assinatura: cera vegetal, pavio de algodão e uma mistura calmante de lavanda e notas amadeiradas. Para acender quando a casa se aquieta e o corpo pede pausa.',
      es: 'Nuestra vela insignia: cera vegetal, mecha de algodón y una mezcla calmante de lavanda y notas amaderadas. Para encender cuando la casa se aquieta y el cuerpo pide pausa.',
      'en-gb':
        'Our signature candle: plant-based wax, cotton wick and a calming blend of lavender and woody notes. Light it when the house grows quiet and the body asks for a pause.',
    },
    illustrativePrice: 79.9,
    currency: 'BRL',
    images: demoImages('scented%20candle%20serene'),
    variations: [{ kind: 'tamanho', values: ['Pequena · 140g', 'Pequeña · 140g', 'Small · 140g'] }],
    scentFamily: 'floral-herbal',
    productType: { 'pt-br': 'Vela', es: 'Vela', 'en-gb': 'Candle' },
    tags: ['lavanda', 'vela', 'candle', 'serenidade', 'relaxar'],
    purposes: ['relaxar'],
    featured: true,
    status: 'demo',
    isDemonstrative: true,
    technical: technical(
      'AYA-VEL-001',
      'Cera vegetal, pavio de algodão e óleos essenciais (composição demonstrativa)',
    ),
  },
  {
    id: 'p-vela-sandalo',
    sku: 'AYA-VEL-002',
    slug: 'vela-aromatica-sandalo',
    category: 'velas',
    name: {
      'pt-br': 'Vela Aromática Sândalo',
      es: 'Vela Aromática Sándalo',
      'en-gb': 'Sandalwood Scented Candle',
    },
    shortDescription: {
      'pt-br': 'Amadeirado cremoso para noites de contemplação.',
      es: 'Amaderado cremoso para noches de contemplación.',
      'en-gb': 'Creamy woody scent for contemplative evenings.',
    },
    longDescription: {
      'pt-br':
        'Sândalo cremoso em cera vegetal. Uma vela de presença: bela acesa sobre a mesa de jantar, no altar de leitura ou no banho demorado de domingo.',
      es: 'Sándalo cremoso en cera vegetal. Una vela de presencia: bella encendida sobre la mesa, en el rincón de lectura o en el baño largo del domingo.',
      'en-gb':
        'Creamy sandalwood in plant-based wax. A candle of presence: beautiful lit on the dinner table, by the reading chair or in the long Sunday bath.',
    },
    illustrativePrice: 79.9,
    currency: 'BRL',
    images: demoImages('sandalwood%20candle'),
    variations: [{ kind: 'tamanho', values: ['Pequena · 140g', 'Pequeña · 140g', 'Small · 140g'] }],
    scentFamily: 'woody',
    productType: { 'pt-br': 'Vela', es: 'Vela', 'en-gb': 'Candle' },
    tags: ['sândalo', 'sandalo', 'sandalwood', 'vela', 'acolher', 'meditar'],
    purposes: ['acolher', 'meditar'],
    isNew: true,
    status: 'demo',
    isDemonstrative: true,
    technical: technical(
      'AYA-VEL-002',
      'Cera vegetal, pavio de algodão e óleos essenciais (composição demonstrativa)',
    ),
  },
  {
    id: 'p-vela-lavanda',
    sku: 'AYA-VEL-003',
    slug: 'vela-aromatica-lavanda',
    category: 'velas',
    name: {
      'pt-br': 'Vela Aromática Lavanda',
      es: 'Vela Aromática Lavanda',
      'en-gb': 'Lavender Scented Candle',
    },
    shortDescription: {
      'pt-br': 'Floral herbáceo clássico para amenos noites.',
      es: 'Floral herbáceo clásico para noches suaves.',
      'en-gb': 'The classic herbal floral for gentle evenings.',
    },
    longDescription: {
      'pt-br':
        'Lavanda fresca e herbal, para os que amam o clássico. Perfume que preenche o quarto com suavidade e acompanha rotinas noturnas de desaceleração.',
      es: 'Lavanda fresca y herbal, para quienes aman lo clásico. Un perfume que llena el dormitorio con suavidad y acompaña rutinas nocturnas de desaceleración.',
      'en-gb':
        'Fresh herbal lavender, for those who love the classic. A scent that softly fills the bedroom and accompanies evening wind-down routines.',
    },
    illustrativePrice: 79.9,
    currency: 'BRL',
    images: demoImages('lavender%20candle'),
    variations: [{ kind: 'tamanho', values: ['Pequena · 140g', 'Pequeña · 140g', 'Small · 140g'] }],
    scentFamily: 'floral-herbal',
    productType: { 'pt-br': 'Vela', es: 'Vela', 'en-gb': 'Candle' },
    tags: ['lavanda', 'lavender', 'vela', 'candle', 'relaxar'],
    purposes: ['relaxar'],
    status: 'demo',
    isDemonstrative: true,
    technical: technical(
      'AYA-VEL-003',
      'Cera vegetal, pavio de algodão e óleos essenciais (composição demonstrativa)',
    ),
  },
  {
    id: 'p-vela-baunilha',
    sku: 'AYA-VEL-004',
    slug: 'vela-aromatica-baunilha',
    category: 'velas',
    name: {
      'pt-br': 'Vela Aromática Baunilha',
      es: 'Vela Aromática Vainilla',
      'en-gb': 'Vanilla Scented Candle',
    },
    shortDescription: {
      'pt-br': 'Doce e quente, como um abraço em casa.',
      es: 'Dulce y cálida, como un abrazo en casa.',
      'en-gb': 'Sweet and warm, like an embrace at home.',
    },
    longDescription: {
      'pt-br':
        'Baunilha quente com fundo de caramelo suave. A vela mais acolhedora da coleção — perfuma a casa como bolo no forno e chuva na janela.',
      es: 'Vainilla cálida con fondo de caramelo suave. La vela más acogedora de la colección — perfuma la casa como un bolo en el horno y lluvia en la ventana.',
      'en-gb':
        'Warm vanilla with a soft caramel undertone. The cosiest candle in the collection — it scents the house like cake in the oven and rain on the window.',
    },
    illustrativePrice: 79.9,
    currency: 'BRL',
    images: demoImages('vanilla%20candle%20warm'),
    variations: [{ kind: 'tamanho', values: ['Pequena · 140g', 'Pequeña · 140g', 'Small · 140g'] }],
    scentFamily: 'amber-warm',
    productType: { 'pt-br': 'Vela', es: 'Vela', 'en-gb': 'Candle' },
    tags: ['baunilha', 'vainilla', 'vanilla', 'vela', 'candle', 'acolher'],
    purposes: ['acolher'],
    status: 'demo',
    isDemonstrative: true,
    technical: technical(
      'AYA-VEL-004',
      'Cera vegetal, pavio de algodão e óleos essenciais (composição demonstrativa)',
    ),
  },

  // ─── Aromas & Essências ───────────────────────────────────────────────
  {
    id: 'p-difusor-lavanda',
    sku: 'AYA-DIF-001',
    slug: 'difusor-ambiente-lavanda',
    category: 'aromas',
    name: {
      'pt-br': 'Difusor de Ambiente Lavanda',
      es: 'Difusor de Ambiente Lavanda',
      'en-gb': 'Lavender Room Diffuser',
    },
    shortDescription: {
      'pt-br': 'Perfume contínuo e suave por semanas, sem chama.',
      es: 'Perfume continuo y suave durante semanas, sin llama.',
      'en-gb': 'Continuous, gentle scent for weeks, flame-free.',
    },
    longDescription: {
      'pt-br':
        'Difusor de varetas com essência de lavanda. Perfume contínuo e discreto para entrada, quarto ou escritório — basta girar as varetas para renovar a intensidade.',
      es: 'Difusor de varillas con esencia de lavanda. Perfume continuo y discreto para entrada, dormitorio o escritorio — basta girar las varillas para renovar la intensidad.',
      'en-gb':
        'Reed diffuser with lavender essence. Continuous, discreet scent for entryway, bedroom or desk — simply flip the reeds to renew the intensity.',
    },
    illustrativePrice: 89.9,
    currency: 'BRL',
    images: demoImages('reed%20diffuser%20lavender'),
    variations: [{ kind: 'formato', values: ['100ml', '100ml', '100ml'] }],
    scentFamily: 'floral-herbal',
    productType: { 'pt-br': 'Difusor', es: 'Difusor', 'en-gb': 'Diffuser' },
    tags: ['lavanda', 'lavender', 'difusor', 'diffuser', 'relaxar'],
    purposes: ['relaxar'],
    featured: true,
    status: 'demo',
    isDemonstrative: true,
    technical: technical(
      'AYA-DIF-001',
      'Base vegetal, essência e varetas (composição demonstrativa)',
    ),
  },
  {
    id: 'p-difusor-bamboo',
    sku: 'AYA-DIF-002',
    slug: 'difusor-ambiente-bamboo',
    category: 'aromas',
    name: {
      'pt-br': 'Difusor de Ambiente Bamboo',
      es: 'Difusor de Ambiente Bamboo',
      'en-gb': 'Bamboo Room Diffuser',
    },
    shortDescription: {
      'pt-br': 'Verde e fresco, como floresta após a chuva.',
      es: 'Verde y fresco, como bosque tras la lluvia.',
      'en-gb': 'Green and fresh, like a forest after rain.',
    },
    longDescription: {
      'pt-br':
        'Notas verdes e frescas com fundo amadeirado leve. Um diffuser limpo e contemporâneo — o aroma da floresta após a chuva dentro de casa.',
      es: 'Notas verdes y frescas con fondo amaderado leve. Un difusor limpio y contemporáneo — el aroma del bosque tras la lluvia dentro de casa.',
      'en-gb':
        'Green, fresh notes over a light woody base. A clean, contemporary diffuser — the scent of the forest after rain, indoors.',
    },
    illustrativePrice: 89.9,
    currency: 'BRL',
    images: demoImages('bamboo%20diffuser%20green'),
    variations: [{ kind: 'formato', values: ['100ml', '100ml', '100ml'] }],
    scentFamily: 'citrus-fresh',
    productType: { 'pt-br': 'Difusor', es: 'Difusor', 'en-gb': 'Diffuser' },
    tags: ['bamboo', 'fresco', 'fresh', 'verde', 'renovar'],
    purposes: ['renovar'],
    status: 'demo',
    isDemonstrative: true,
    technical: technical(
      'AYA-DIF-002',
      'Base vegetal, essência e varetas (composição demonstrativa)',
    ),
  },
  {
    id: 'p-spray-sandalo',
    sku: 'AYA-SPR-001',
    slug: 'spray-aromatico-sandalo',
    category: 'aromas',
    name: {
      'pt-br': 'Spray Aromático Sândalo',
      es: 'Spray Aromático Sándalo',
      'en-gb': 'Sandalwood Room Spray',
    },
    shortDescription: {
      'pt-br': 'Névoa instantânea de sândalo para tecidos e ambientes.',
      es: 'Bruma instantánea de sándalo para tejidos y ambientes.',
      'en-gb': 'Instant sandalwood mist for fabrics and rooms.',
    },
    longDescription: {
      'pt-br':
        'Spray de ambiente com sândalo amadeirado. Alguns toques renovam almofadas, cortinas e o ar da sala em segundos — o ritual rápido para receber visitas.',
      es: 'Spray de ambiente con sándalo amaderado. Unos toques renuevan cojines, cortinas y el aire de la sala en segundos — el ritual rápido para recibir visitas.',
      'en-gb':
        'Room spray with woody sandalwood. A few sprays renew cushions, curtains and the living-room air in seconds — the quick ritual before welcoming guests.',
    },
    illustrativePrice: 59.9,
    currency: 'BRL',
    images: demoImages('room%20spray%20amber%20bottle'),
    variations: [{ kind: 'formato', values: ['120ml', '120ml', '120ml'] }],
    scentFamily: 'woody',
    productType: { 'pt-br': 'Spray', es: 'Spray', 'en-gb': 'Spray' },
    tags: ['sândalo', 'sandalo', 'sandalwood', 'spray', 'acolher'],
    purposes: ['acolher'],
    status: 'demo',
    isDemonstrative: true,
    technical: technical(
      'AYA-SPR-001',
      'Base alcoólica vegetal e essência (composição demonstrativa)',
    ),
  },
  {
    id: 'p-essencia-jasmim',
    sku: 'AYA-ESE-001',
    slug: 'essencia-aromatica-jasmim',
    category: 'aromas',
    name: {
      'pt-br': 'Essência Aromática Jasmim',
      es: 'Esencia Aromática Jazmín',
      'en-gb': 'Jasmine Aromatic Essence',
    },
    shortDescription: {
      'pt-br': 'Concentrado floral branco para difusores e gotas.',
      es: 'Concentrado floral blanco para difusores y gotas.',
      'en-gb': 'White floral concentrate for diffusers and drops.',
    },
    longDescription: {
      'pt-br':
        'Essência concentrada de jasmim para uso em difusores, pedras aromáticas e limpeza ritual do espaço. Um frasco pequeno, muitas semanas de perfume.',
      es: 'Esencia concentrada de jazmín para difusores, piedras aromáticas y limpieza ritual del espacio. Un frasco pequeño, muchas semanas de perfume.',
      'en-gb':
        'Concentrated jasmine essence for diffusers, aroma stones and ritual space-cleaning. A small bottle, many weeks of scent.',
    },
    illustrativePrice: 39.9,
    currency: 'BRL',
    images: demoImages('essential%20oil%20bottle%20jasmine'),
    variations: [{ kind: 'formato', values: ['10ml', '10ml', '10ml'] }],
    scentFamily: 'floral-herbal',
    productType: { 'pt-br': 'Essência', es: 'Esencia', 'en-gb': 'Essence' },
    tags: ['jasmim', 'jazmín', 'jasmine', 'essência', 'relaxar'],
    purposes: ['relaxar'],
    isNew: true,
    status: 'demo',
    isDemonstrative: true,
    technical: technical('AYA-ESE-001', 'Essência concentrada (composição demonstrativa)'),
  },

  // ─── Rituais & Espiritualidade ────────────────────────────────────────
  {
    id: 'p-kit-ritual-meditacao',
    sku: 'AYA-RIT-001',
    slug: 'kit-ritual-de-meditacao',
    category: 'rituais',
    name: {
      'pt-br': 'Kit Ritual de Meditação',
      es: 'Kit Ritual de Meditación',
      'en-gb': 'Meditation Ritual Kit',
    },
    shortDescription: {
      'pt-br': 'Incensos, suporte e sino para sua pausa diária.',
      es: 'Inciensos, soporte y campana para tu pausa diaria.',
      'en-gb': 'Incense, holder and bell for your daily pause.',
    },
    longDescription: {
      'pt-br':
        'Um kit completo para a sua pausa diária: incensos massala, porta-incenso de madeira e um pequeno sino de atenção plena. Tudo o que o momento pede — só falta a sua respiração.',
      es: 'Un kit completo para tu pausa diaria: inciensos massala, porta-incienso de madera y una pequeña campana de atención plena. Todo lo que el momento pide — solo falta tu respiración.',
      'en-gb':
        'A complete kit for your daily pause: massala incense, a wooden holder and a small mindfulness bell. Everything the moment asks for — only your breath is missing.',
    },
    illustrativePrice: 149.9,
    currency: 'BRL',
    images: demoImages('meditation%20kit%20incense%20bell'),
    variations: [{ kind: 'kit', values: ['Padrão', 'Estándar', 'Standard'] }],
    scentFamily: 'resinous',
    productType: { 'pt-br': 'Kit', es: 'Kit', 'en-gb': 'Kit' },
    tags: ['kit', 'meditação', 'meditation', 'sino', 'bell', 'meditar'],
    purposes: ['meditar'],
    featured: true,
    status: 'demo',
    isDemonstrative: true,
    technical: technical(
      'AYA-RIT-001',
      'Composição do kit descrita na página do produto (demonstrativo)',
    ),
  },
  {
    id: 'p-kit-ritual-serenidade',
    sku: 'AYA-RIT-002',
    slug: 'kit-ritual-de-serenidade',
    category: 'rituais',
    name: {
      'pt-br': 'Kit Ritual de Serenidade',
      es: 'Kit Ritual de Serenidad',
      'en-gb': 'Serenity Ritual Kit',
    },
    shortDescription: {
      'pt-br': 'Lavanda, vela e pedra de pausa para noites calmas.',
      es: 'Lavanda, vela y piedra de pausa para noches calmas.',
      'en-gb': 'Lavender, candle and a pause stone for calm nights.',
    },
    longDescription: {
      'pt-br':
        'Lavanda em todas as formas: vela aromática, incenso e uma pedra lisa de pausa para segurar nas mãos. O ritual completo para noites que pedem silêncio.',
      es: 'Lavanda en todas las formas: vela aromática, incienso y una piedra lisa de pausa para sostener en las manos. El ritual completo para noches que piden silencio.',
      'en-gb':
        'Lavender in every form: a scented candle, incense and a smooth pause stone to hold. The complete ritual for evenings that ask for silence.',
    },
    illustrativePrice: 169.9,
    currency: 'BRL',
    images: demoImages('serenity%20ritual%20lavender%20candle'),
    variations: [{ kind: 'kit', values: ['Padrão', 'Estándar', 'Standard'] }],
    scentFamily: 'floral-herbal',
    productType: { 'pt-br': 'Kit', es: 'Kit', 'en-gb': 'Kit' },
    tags: ['kit', 'lavanda', 'serenidade', 'relaxar'],
    purposes: ['relaxar'],
    status: 'demo',
    isDemonstrative: true,
    technical: technical(
      'AYA-RIT-002',
      'Composição do kit descrita na página do produto (demonstrativo)',
    ),
  },
  {
    id: 'p-incensario-meditacao',
    sku: 'AYA-RIT-003',
    slug: 'incensario-para-meditacao',
    category: 'rituais',
    name: {
      'pt-br': 'Incensário para Meditação',
      es: 'Incensario para Meditación',
      'en-gb': 'Meditation Incense Holder',
    },
    shortDescription: {
      'pt-br': 'Peça central de cerâmica para a sua prática.',
      es: 'Pieza central de cerámica para tu práctica.',
      'en-gb': 'A ceramic centrepiece for your practice.',
    },
    longDescription: {
      'pt-br':
        'Incensário de cerâmica artesanal com cinzeiro integrado e fumaça que se eleva em espiral. A peça central do seu canto de prática.',
      es: 'Incensario de cerámica artesanal con cenicero integrado y humo que se eleva en espiral. La pieza central de tu rincón de práctica.',
      'en-gb':
        'Handmade ceramic incense holder with integrated ash catch and smoke that rises in a spiral. The centrepiece of your practice corner.',
    },
    illustrativePrice: 119.9,
    currency: 'BRL',
    images: demoImages('ceramic%20incense%20holder%20dark'),
    variations: [{ kind: 'formato', values: ['Cerâmica', 'Cerámica', 'Ceramic'] }],
    scentFamily: 'woody',
    productType: { 'pt-br': 'Incensário', es: 'Incensario', 'en-gb': 'Incense Holder' },
    tags: ['incensário', 'incensario', 'cerâmica', 'cerámica', 'ceramic', 'meditar'],
    purposes: ['meditar'],
    status: 'demo',
    isDemonstrative: true,
    technical: technical('AYA-RIT-003', 'Cerâmica artesanal (composição demonstrativa)'),
  },
  {
    id: 'p-conjunto-contemplacao',
    sku: 'AYA-RIT-004',
    slug: 'conjunto-ritual-de-contemplacao',
    category: 'rituais',
    name: {
      'pt-br': 'Conjunto Ritual de Contemplação',
      es: 'Conjunto Ritual de Contemplación',
      'en-gb': 'Contemplation Ritual Set',
    },
    shortDescription: {
      'pt-br': 'Resinas, concha e vela para rituais lentos.',
      es: 'Resinas, cuchara y vela para rituales lentos.',
      'en-gb': 'Resins, spoon and candle for slow rituals.',
    },
    longDescription: {
      'pt-br':
        'Conjunto de contemplação com resinas puras, concha de latão e vela para queima lenta. Para rituais lentos, feitos sem pressa, ao fim da tarde.',
      es: 'Conjunto de contemplación con resinas puras, cuchara de latón y vela de combustión lenta. Para rituales lentos, hechos sin prisa, al final de la tarde.',
      'en-gb':
        'A contemplation set with pure resins, a brass spoon and a slow-burn candle. For slow rituals, made without hurry, at the end of the afternoon.',
    },
    illustrativePrice: 189.9,
    currency: 'BRL',
    images: demoImages('frankincense%20resin%20brass%20spoon'),
    variations: [{ kind: 'kit', values: ['Padrão', 'Estándar', 'Standard'] }],
    scentFamily: 'resinous',
    productType: { 'pt-br': 'Conjunto', es: 'Conjunto', 'en-gb': 'Set' },
    tags: ['resina', 'resin', 'olíbano', 'contemplação', 'meditar'],
    purposes: ['meditar'],
    isNew: true,
    status: 'demo',
    isDemonstrative: true,
    technical: technical('AYA-RIT-004', 'Resinas naturais e latão (composição demonstrativa)'),
  },

  // ─── Acessórios & Decoração ───────────────────────────────────────────
  {
    id: 'p-porta-incenso-ceramico',
    sku: 'AYA-ACE-001',
    slug: 'porta-incenso-ceramico',
    category: 'acessorios',
    name: {
      'pt-br': 'Porta-Incenso Cerâmico',
      es: 'Porta-Incienso Cerámico',
      'en-gb': 'Ceramic Incense Holder',
    },
    shortDescription: {
      'pt-br': 'Curvas simples e acabamento acetinado.',
      es: 'Curvas simples y acabado satinado.',
      'en-gb': 'Simple curves and a satin finish.',
    },
    longDescription: {
      'pt-br':
        'Porta-incenso de cerâmica com curvas simples e acabamento acetinado, esmaltado à mão. Combina com qualquer canto da casa e segura varetas e cones.',
      es: 'Porta-incienso de cerámica de curvas simples y acabado satinado, esmaltado a mano. Combina con cualquier rincón de la casa y sostiene varillas y conos.',
      'en-gb':
        'A ceramic incense holder with simple curves and a satin, hand-glazed finish. It suits any corner of the house and holds both sticks and cones.',
    },
    illustrativePrice: 39.9,
    currency: 'BRL',
    images: demoImages('ceramic%20incense%20holder%20minimal'),
    variations: [{ kind: 'formato', values: ['Areia', 'Arena', 'Sand'] }],
    scentFamily: 'woody',
    productType: { 'pt-br': 'Porta-incenso', es: 'Porta-incienso', 'en-gb': 'Incense Holder' },
    tags: ['porta-incenso', 'cerâmica', 'cerámica', 'ceramic', 'meditar'],
    purposes: ['meditar'],
    status: 'demo',
    isDemonstrative: true,
    technical: technical('AYA-ACE-001', 'Cerâmica esmaltada à mão (composição demonstrativa)'),
  },
  {
    id: 'p-porta-incenso-madeira',
    sku: 'AYA-ACE-002',
    slug: 'porta-incenso-madeira',
    category: 'acessorios',
    name: {
      'pt-br': 'Porta-Incenso de Madeira',
      es: 'Porta-Incienso de Madera',
      'en-gb': 'Wooden Incense Holder',
    },
    shortDescription: {
      'pt-br': 'Madeira maciça envelhecida, quente ao toque.',
      es: 'Madera maciza envejecida, cálida al tacto.',
      'en-gb': 'Aged solid wood, warm to the touch.',
    },
    longDescription: {
      'pt-br':
        'Porta-incenso em madeira maciça com envelhecimento natural, quente ao toque. Peça robusta e discreta que envelhece bem ao lado dos seus rituais.',
      es: 'Porta-incienso en madera maciza con envejecimiento natural, cálida al tacto. Pieza robusta y discreta que envejece bien junto a tus rituales.',
      'en-gb':
        'A solid-wood incense holder with a natural aged finish, warm to the touch. A sturdy, discreet piece that ages gracefully beside your rituals.',
    },
    illustrativePrice: 49.9,
    currency: 'BRL',
    images: demoImages('wooden%20incense%20holder%20dark%20wood'),
    variations: [{ kind: 'formato', values: ['Madeira escura', 'Madera oscura', 'Dark wood'] }],
    scentFamily: 'woody',
    productType: { 'pt-br': 'Porta-incenso', es: 'Porta-incienso', 'en-gb': 'Incense Holder' },
    tags: ['porta-incenso', 'madeira', 'madera', 'wood', 'meditar', 'acolher'],
    purposes: ['meditar', 'acolher'],
    status: 'demo',
    isDemonstrative: true,
    technical: technical(
      'AYA-ACE-002',
      'Madeira maciça com acabamento natural (composição demonstrativa)',
    ),
  },
  {
    id: 'p-bandeja-rituais',
    sku: 'AYA-ACE-003',
    slug: 'bandeja-decorativa-para-rituais',
    category: 'acessorios',
    name: {
      'pt-br': 'Bandeja Decorativa para Rituais',
      es: 'Bandeja Decorativa para Rituales',
      'en-gb': 'Decorative Ritual Tray',
    },
    shortDescription: {
      'pt-br': 'Organiza vela, incenso e cristais em um só lugar.',
      es: 'Organiza vela, incienso y cristales en un solo lugar.',
      'en-gb': 'Organises candle, incense and crystals in one place.',
    },
    longDescription: {
      'pt-br':
        'Bandeja decorativa que organiza vela, incenso e cristais em um só lugar. Borda elevada e base forrada em feltro para proteger a superfície.',
      es: 'Bandeja decorativa que organiza vela, incienso y cristales en un solo lugar. Borde elevado y base forrada en fieltro para proteger la superficie.',
      'en-gb':
        'A decorative tray that organises candle, incense and crystals in one place. Raised rim and a felt-lined base to protect the surface.',
    },
    illustrativePrice: 69.9,
    currency: 'BRL',
    images: demoImages('decorative%20tray%20ritual%20ceramic'),
    variations: [{ kind: 'formato', values: ['30cm', '30cm', '30cm'] }],
    scentFamily: 'woody',
    productType: { 'pt-br': 'Bandeja', es: 'Bandeja', 'en-gb': 'Tray' },
    tags: ['bandeja', 'tray', 'decoração', 'decoración', 'acolher'],
    purposes: ['acolher'],
    status: 'demo',
    isDemonstrative: true,
    technical: technical('AYA-ACE-003', 'Madeira e feltro (composição demonstrativa)'),
  },

  // ─── Kits & Presentes ─────────────────────────────────────────────────
  {
    id: 'p-caixa-essencias-alma',
    sku: 'AYA-KIT-001',
    slug: 'caixa-essencias-da-alma',
    category: 'kits',
    name: {
      'pt-br': 'Caixa Essências da Alma',
      es: 'Caja Esencias del Alma',
      'en-gb': 'Essences of the Soul Box',
    },
    shortDescription: {
      'pt-br': 'Quatro essências assinadas em caixa de linho.',
      es: 'Cuatro esencias de la casa en caja de lino.',
      'en-gb': 'Four signature essences in a linen box.',
    },
    longDescription: {
      'pt-br':
        'Quatro essências assinadas da casa em uma caixa forrada de linho. Um presente completo para quem ama explorar aromas — com cartão com mensagem.',
      es: 'Cuatro esencias de la casa en una caja forrada de lino. Un regalo completo para quienes aman explorar aromas — con tarjeta con mensaje.',
      'en-gb':
        "Four of the house's signature essences in a linen-lined box. A complete gift for those who love exploring scents — with a message card.",
    },
    illustrativePrice: 139.9,
    currency: 'BRL',
    images: demoImages('gift%20box%20essential%20oils%20linen'),
    variations: [{ kind: 'kit', values: ['4 essências', '4 esencias', '4 essences'] }],
    scentFamily: 'floral-herbal',
    productType: { 'pt-br': 'Kit presente', es: 'Kit regalo', 'en-gb': 'Gift kit' },
    tags: ['presente', 'regalo', 'gift', 'essências', 'presentear'],
    purposes: ['presentear'],
    featured: true,
    status: 'demo',
    isDemonstrative: true,
    technical: technical(
      'AYA-KIT-001',
      'Composição do kit descrita na página do produto (demonstrativo)',
    ),
  },
  {
    id: 'p-kit-presente-aconchego',
    sku: 'AYA-KIT-002',
    slug: 'kit-presente-aconchego',
    category: 'kits',
    name: {
      'pt-br': 'Kit Presente Aconchego',
      es: 'Kit Regalo Aconchego',
      'en-gb': 'Cosiness Gift Kit',
    },
    shortDescription: {
      'pt-br': 'Vela baunilha e chá para noites dentro de casa.',
      es: 'Vela vainilla y té para noches dentro de casa.',
      'en-gb': 'Vanilla candle and tea for nights spent in.',
    },
    longDescription: {
      'pt-br':
        'Vela de baunilha, essência acolhedora e um sachê de chá para as noites dentro de casa. O kit para abraçar — em presente ou para si.',
      es: 'Vela de vainilla, esencia acogedora y un saquito de té para las noches dentro de casa. El kit para abrazar — de regalo o para ti.',
      'en-gb':
        'A vanilla candle, a cosy essence and a sachet of tea for nights spent in. The kit that hugs — as a gift or for yourself.',
    },
    illustrativePrice: 129.9,
    currency: 'BRL',
    images: demoImages('cosy%20gift%20kit%20candle%20tea'),
    variations: [{ kind: 'kit', values: ['Padrão', 'Estándar', 'Standard'] }],
    scentFamily: 'amber-warm',
    productType: { 'pt-br': 'Kit presente', es: 'Kit regalo', 'en-gb': 'Gift kit' },
    tags: ['presente', 'regalo', 'gift', 'baunilha', 'vanilla', 'acolher', 'presentear'],
    purposes: ['presentear', 'acolher'],
    status: 'demo',
    isDemonstrative: true,
    technical: technical(
      'AYA-KIT-002',
      'Composição do kit descrita na página do produto (demonstrativo)',
    ),
  },
  {
    id: 'p-kit-presente-momento-zen',
    sku: 'AYA-KIT-003',
    slug: 'kit-presente-momento-zen',
    category: 'kits',
    name: {
      'pt-br': 'Kit Presente Momento Zen',
      es: 'Kit Regalo Momento Zen',
      'en-gb': 'Zen Moment Gift Kit',
    },
    shortDescription: {
      'pt-br': 'Incensos, porta-incenso e cartão de pausa.',
      es: 'Inciensos, porta-incienso y tarjeta de pausa.',
      'en-gb': 'Incense, a holder and a pause card.',
    },
    longDescription: {
      'pt-br':
        'Incensos massala, porta-incenso cerâmico e um cartão-guia de pausa com três respirações. O presente para quem precisa desacelerar.',
      es: 'Inciensos massala, porta-incienso cerámico y una tarjeta-guía de pausa con tres respiraciones. El regalo para quien necesita desacelerar.',
      'en-gb':
        'Massala incense, a ceramic holder and a pause-guide card with three breaths. The gift for anyone who needs to slow down.',
    },
    illustrativePrice: 119.9,
    currency: 'BRL',
    images: demoImages('zen%20gift%20kit%20incense%20stone'),
    variations: [{ kind: 'kit', values: ['Padrão', 'Estándar', 'Standard'] }],
    scentFamily: 'resinous',
    productType: { 'pt-br': 'Kit presente', es: 'Kit regalo', 'en-gb': 'Gift kit' },
    tags: ['presente', 'regalo', 'gift', 'zen', 'meditar', 'presentear'],
    purposes: ['presentear', 'meditar'],
    isNew: true,
    status: 'demo',
    isDemonstrative: true,
    technical: technical(
      'AYA-KIT-003',
      'Composição do kit descrita na página do produto (demonstrativo)',
    ),
  },
]

/** Verificação estrutural rápida: o catálogo tem exatamente os 24 produtos do briefing. */
if (products.length !== 24) {
  // eslint-disable-next-line no-console
  console.warn('[catalogo] Esperados 24 produtos demonstrativos, encontrados:', products.length)
}
