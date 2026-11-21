/// <reference path="../pb_data/types.d.ts" />
/**
 * Etapa 5 — ALMA Y AROMA.
 * - Coleção `collections` (vitrines temáticas, pública em leitura, admin na escrita)
 * - Coleção `suppliers` (privada: leitura/escrita só para administradores)
 * - Campos operacionais/comerciais em `products` (fornecedor, coleções, custos,
 *   prazos, mercados, regulatório, status de publicação) — nascem vazios
 * - Workflow manual de fulfillment em `orders` (dropshipping manual)
 * - Nomenclatura comercial das 7 categorias + 6 coleções iniciais
 * A coleção `users` não é tocada.
 */
const ADMIN_RULE = '@collection.admins.user ?= @request.auth.id'

const CATEGORY_RENAMES = {
  'aromas-essencias': {
    title: { 'pt-br': 'Aromas & Essências', es: 'Aromas & Esencias', 'en-gb': 'Aromas & Essences' },
    description: {
      'pt-br': 'Essências e óleos concentrados para ambientar a casa com discrição.',
      es: 'Esencias y aceites concentrados para ambientar la casa con disición.',
      'en-gb': 'Concentrated essences and oils to scent the home with discretion.',
    },
  },
  'difusores-aromatizadores': {
    title: {
      'pt-br': 'Difusores & Aromatizadores',
      es: 'Difusores & Aromatizadores',
      'en-gb': 'Diffusers & Scenting',
    },
    description: {
      'pt-br': 'Perfume contínuo, sem chama — varetas, elétricos e pedras aromáticas.',
      es: 'Perfume continuo, sin llama — varillas, eléctricos y piedras aromáticas.',
      'en-gb': 'Continuous, flame-free scent — reeds, electric and aroma stones.',
    },
  },
  'velas-aromaticas': {
    title: { 'pt-br': 'Velas & Luz', es: 'Velas & Luz', 'en-gb': 'Candles & Light' },
    description: {
      'pt-br': 'Cera vegetal e luz baixa para as horas em que a casa se aquieta.',
      es: 'Cera vegetal y luz baja para las horas en que la casa se aquieta.',
      'en-gb': 'Plant-based wax and low light for the hours when home goes quiet.',
    },
  },
  'incensos-defumacao': {
    title: {
      'pt-br': 'Incensos & Rituais',
      es: 'Incienso & Rituales',
      'en-gb': 'Incense & Rituals',
    },
    description: {
      'pt-br': 'Varas, cones e resinas para marcar o ritmo das suas pausas.',
      es: 'Varillas, conos y resinas para marcar el ritmo de tus pausas.',
      'en-gb': 'Sticks, cones and resins to mark the rhythm of your pauses.',
    },
  },
  'meditacao-relaxamento': {
    title: {
      'pt-br': 'Meditação & Equilíbrio',
      es: 'Meditación & Equilibrio',
      'en-gb': 'Meditation & Balance',
    },
    description: {
      'pt-br': 'Objetos de apoio à pausa: sinos, almofadas e acessórios de contemplação.',
      es: 'Objetos de apoyo a la pausa: campanas, cojines y accesorios de contemplación.',
      'en-gb': 'Objects that support the pause: bells, cushions and contemplation accessories.',
    },
  },
  'decoracao-zen': {
    title: { 'pt-br': 'Casa & Harmonia', es: 'Casa & Armonía', 'en-gb': 'Home & Harmony' },
    description: {
      'pt-br': 'Peças de madeira, cerâmica e pedra que trazem calma à decoração.',
      es: 'Piezas de madera, cerámica y piedra que traen calma a la decoración.',
      'en-gb': 'Wood, ceramic and stone pieces that bring calm to your decor.',
    },
  },
  'kits-presentes': {
    title: { 'pt-br': 'Presentes com Alma', es: 'Regalos con Alma', 'en-gb': 'Gifts with Soul' },
    description: {
      'pt-br': 'Combinações pensadas para presentear — ou para presentear a si mesmo.',
      es: 'Combinaciones pensadas para regalar — o para regalarte.',
      'en-gb': 'Curated combinations to give as gifts — or to gift yourself.',
    },
  },
}

const COLLECTION_SEED = [
  {
    slug: 'ritual-da-manha',
    title: { 'pt-br': 'Ritual da Manhã', es: 'Ritual de la Mañana', 'en-gb': 'Morning Ritual' },
    description: {
      'pt-br': 'Aromas leves para abrir o dia com calma e clareza.',
      es: 'Aromas suaves para abrir el día con calma y claridad.',
      'en-gb': 'Light scents to open the day with calm and clarity.',
    },
  },
  {
    slug: 'pausa-serenidade',
    title: { 'pt-br': 'Pausa & Serenidade', es: 'Pausa & Serenidad', 'en-gb': 'Pause & Serenity' },
    description: {
      'pt-br': 'Peças para a pausa curta que recolhe o ritmo do dia.',
      es: 'Piezas para la pausa breve que recoge el ritmo del día.',
      'en-gb': 'Pieces for the short pause that gathers the pace of the day.',
    },
  },
  {
    slug: 'casa-em-harmonia',
    title: { 'pt-br': 'Casa em Harmonia', es: 'Casa en Armonía', 'en-gb': 'Home in Harmony' },
    description: {
      'pt-br': 'Ambientação discreta para cada canto da casa.',
      es: 'Ambientación discreta para cada rincón de la casa.',
      'en-gb': 'Discreet scenting for every corner of the home.',
    },
  },
  {
    slug: 'noites-tranquilas',
    title: { 'pt-br': 'Noites Tranquilas', es: 'Noches Tranquilas', 'en-gb': 'Quiet Evenings' },
    description: {
      'pt-br': 'Luz baixa e aromas quentes para desacelerar a noite.',
      es: 'Luz baja y aromas cálidos para desacelerar la noche.',
      'en-gb': 'Low light and warm aromas to slow the evening down.',
    },
  },
  {
    slug: 'essencia-natural',
    title: { 'pt-br': 'Essência Natural', es: 'Esencia Natural', 'en-gb': 'Natural Essence' },
    description: {
      'pt-br': 'Matérias honestas: cera vegetal, resinas, ervas e madeiras.',
      es: 'Materias honestas: cera vegetal, resinas, hierbas y maderas.',
      'en-gb': 'Honest materials: plant wax, resins, herbs and woods.',
    },
  },
  {
    slug: 'presentes-com-significado',
    title: {
      'pt-br': 'Presentes com Significado',
      es: 'Regalos con Significado',
      'en-gb': 'Gifts with Meaning',
    },
    description: {
      'pt-br': 'Curadorias para oferecer com intenção e cuidado.',
      es: 'Curadurías para regalar con intención y cuidado.',
      'en-gb': 'Curated sets to give with intention and care.',
    },
  },
]

migrate(
  (app) => {
    // ─── collections (vitrines temáticas) ──────────────────────────────────
    const collections = new Collection({
      type: 'base',
      name: 'collections',
      listRule: 'active = true',
      viewRule: 'active = true',
      createRule: ADMIN_RULE,
      updateRule: ADMIN_RULE,
      deleteRule: ADMIN_RULE,
      fields: [
        { name: 'slug', type: 'text', required: true, presentable: true },
        { name: 'title', type: 'json', maxSize: 2000 },
        { name: 'description', type: 'json', maxSize: 4000 },
        { name: 'heroImage', type: 'text' },
        { name: 'sortOrder', type: 'number' },
        { name: 'active', type: 'bool' },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_collections_slug ON collections (slug)'],
    })
    app.save(collections)

    // ─── suppliers (privado — nenhum dado público) ─────────────────────────
    const suppliers = new Collection({
      type: 'base',
      name: 'suppliers',
      listRule: ADMIN_RULE,
      viewRule: ADMIN_RULE,
      createRule: ADMIN_RULE,
      updateRule: ADMIN_RULE,
      deleteRule: ADMIN_RULE,
      fields: [
        { name: 'slug', type: 'text', required: true, presentable: true },
        { name: 'legalName', type: 'text' },
        { name: 'tradeName', type: 'text' },
        { name: 'country', type: 'text' },
        { name: 'region', type: 'text' },
        { name: 'contactName', type: 'text' },
        { name: 'contactEmail', type: 'text' },
        { name: 'contactPhone', type: 'text' },
        { name: 'website', type: 'text' },
        { name: 'categories', type: 'json', maxSize: 3000 },
        {
          name: 'modality',
          type: 'select',
          maxSelect: 1,
          values: [
            'national_direct',
            'international_direct',
            'wholesale_distributor',
            'own_brand',
            'fulfillment_partner',
          ],
        },
        { name: 'commercialTerms', type: 'text' },
        { name: 'processingDays', type: 'number' },
        { name: 'deliveryTerms', type: 'text' },
        { name: 'returnPolicy', type: 'text' },
        { name: 'taxInfo', type: 'text' },
        {
          name: 'homologationStatus',
          type: 'select',
          maxSelect: 1,
          values: ['pending', 'approved', 'blocked'],
        },
        { name: 'notes', type: 'text' },
        { name: 'active', type: 'bool' },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_suppliers_slug ON suppliers (slug)'],
    })
    app.save(suppliers)

    const collectionsId = app.findCollectionByNameOrId('collections').id
    const suppliersId = app.findCollectionByNameOrId('suppliers').id

    // ─── products: operação, custos e mercados (campos vazios por padrão) ──
    const products = app.findCollectionByNameOrId('products')
    products.fields.add(
      new Field({
        name: 'thematicCollections',
        type: 'relation',
        collectionId: collectionsId,
        maxSelect: 99,
      }),
    )
    products.fields.add(new Field({ name: 'videos', type: 'json', maxSize: 3000 }))
    products.fields.add(new Field({ name: 'costPrice', type: 'number' }))
    products.fields.add(new Field({ name: 'supplierFreight', type: 'number' }))
    products.fields.add(new Field({ name: 'estimatedTaxes', type: 'number' }))
    products.fields.add(new Field({ name: 'variableCosts', type: 'number' }))
    products.fields.add(new Field({ name: 'paymentFeesPct', type: 'number' }))
    products.fields.add(new Field({ name: 'commissionPct', type: 'number' }))
    products.fields.add(new Field({ name: 'targetMarginPct', type: 'number' }))
    products.fields.add(
      new Field({ name: 'supplier', type: 'relation', collectionId: suppliersId, maxSelect: 1 }),
    )
    products.fields.add(new Field({ name: 'countryOrigin', type: 'text' }))
    products.fields.add(
      new Field({
        name: 'supplierAvailability',
        type: 'select',
        maxSelect: 1,
        values: ['available', 'low_stock', 'backorder', 'unavailable'],
      }),
    )
    products.fields.add(new Field({ name: 'processingDays', type: 'number' }))
    products.fields.add(new Field({ name: 'deliveryDays', type: 'number' }))
    products.fields.add(
      new Field({
        name: 'enabledCountries',
        type: 'select',
        maxSelect: 4,
        values: ['BR', 'ES', 'EU', 'GB'],
      }),
    )
    products.fields.add(new Field({ name: 'regulatoryNotes', type: 'json', maxSize: 6000 }))
    products.fields.add(
      new Field({
        name: 'publishStatus',
        type: 'select',
        maxSelect: 1,
        values: ['draft', 'published', 'archived'],
      }),
    )
    // A escrita do catálogo passa a exigir vínculo com a coleção `admins`.
    products.createRule = ADMIN_RULE
    products.updateRule = ADMIN_RULE
    products.deleteRule = ADMIN_RULE
    app.save(products)

    // ─── orders: workflow manual de fulfillment (dropshipping manual) ──────
    const orders = app.findCollectionByNameOrId('orders')
    orders.fields.add(
      new Field({
        name: 'fulfillmentStatus',
        type: 'select',
        maxSelect: 1,
        values: ['awaiting_supplier', 'supplier_confirmed', 'processing', 'shipped', 'delivered'],
      }),
    )
    orders.fields.add(new Field({ name: 'supplierShipments', type: 'json', maxSize: 8000 }))
    app.save(orders)

    // ─── nomenclatura comercial das categorias (registros existentes) ──────
    const catRecs = app.findRecordsByFilter('categories', '', 'sortOrder', 0, 0)
    for (const rec of catRecs) {
      const renamed = CATEGORY_RENAMES[rec.getString('slug')]
      if (!renamed) continue
      rec.set('title', renamed.title)
      rec.set('description', renamed.description)
      app.save(rec)
    }

    // ─── 6 coleções temáticas iniciais (idempotente por slug) ──────────────
    const colCollection = app.findCollectionByNameOrId('collections')
    COLLECTION_SEED.forEach((seed, index) => {
      let existing = null
      try {
        existing = app.findFirstRecordByFilter(colCollection, `slug="${seed.slug}"`)
      } catch (e) {
        existing = null
      }
      if (existing) return
      const rec = new Record(colCollection)
      rec.set('slug', seed.slug)
      rec.set('title', seed.title)
      rec.set('description', seed.description)
      rec.set('heroImage', '')
      rec.set('sortOrder', index + 1)
      rec.set('active', true)
      app.save(rec)
    })
  },
  (app) => {
    // Revert best-effort — nunca toca em `users`.
    try {
      app.delete(app.findCollectionByNameOrId('suppliers'))
    } catch (e) {}
    try {
      app.delete(app.findCollectionByNameOrId('collections'))
    } catch (e) {}
    try {
      const products = app.findCollectionByNameOrId('products')
      for (const name of [
        'thematicCollections',
        'videos',
        'costPrice',
        'supplierFreight',
        'estimatedTaxes',
        'variableCosts',
        'paymentFeesPct',
        'commissionPct',
        'targetMarginPct',
        'supplier',
        'countryOrigin',
        'supplierAvailability',
        'processingDays',
        'deliveryDays',
        'enabledCountries',
        'regulatoryNotes',
        'publishStatus',
      ]) {
        try {
          products.fields.removeByName(name)
        } catch (e) {}
      }
      products.createRule = ''
      products.updateRule = ''
      products.deleteRule = ''
      app.save(products)
      const orders = app.findCollectionByNameOrId('orders')
      for (const name of ['fulfillmentStatus', 'supplierShipments']) {
        try {
          orders.fields.removeByName(name)
        } catch (e) {}
      }
      app.save(orders)
    } catch (e) {}
  },
)
