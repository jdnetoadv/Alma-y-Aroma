/// <reference path="../pb_data/types.d.ts" />
/**
 * Etapa 3 — estrutura de e-commerce ALMA Y AROMA.
 * Coleções: categories, products, orders, coupons, favorites, profiles.
 * A coleção `users` existente NÃO é modificada (perfil estendido em `profiles`).
 */
migrate(
  (app) => {
    // ─── categories ─────────────────────────────────────────────────────
    const categories = new Collection({
      type: 'base',
      name: 'categories',
      listRule: 'active = true',
      viewRule: 'active = true',
      createRule: '',
      updateRule: '',
      deleteRule: '',
      fields: [
        { name: 'slug', type: 'text', required: true, presentable: true },
        { name: 'title', type: 'json', maxSize: 2000 },
        { name: 'description', type: 'json', maxSize: 4000 },
        { name: 'heroImage', type: 'text' },
        { name: 'sortOrder', type: 'number' },
        { name: 'active', type: 'bool' },
      ],
    })
    app.save(categories)

    // ─── products ───────────────────────────────────────────────────────
    const products = new Collection({
      type: 'base',
      name: 'products',
      listRule: 'active = true',
      viewRule: 'active = true',
      createRule: '',
      updateRule: '',
      deleteRule: '',
      fields: [
        { name: 'slug', type: 'text', required: true, presentable: true },
        { name: 'sku', type: 'text' },
        { name: 'categoryId', type: 'text', required: true },
        { name: 'name', type: 'json', maxSize: 3000 },
        { name: 'shortDescription', type: 'json', maxSize: 4000 },
        { name: 'longDescription', type: 'json', maxSize: 8000 },
        { name: 'images', type: 'json', maxSize: 4000 },
        { name: 'variations', type: 'json', maxSize: 8000 },
        { name: 'productType', type: 'json', maxSize: 2000 },
        { name: 'scentFamily', type: 'text' },
        { name: 'tags', type: 'json', maxSize: 3000 },
        { name: 'purposes', type: 'json', maxSize: 2000 },
        { name: 'price', type: 'number' },
        { name: 'compareAtPrice', type: 'number' },
        { name: 'currency', type: 'select', values: ['BRL', 'EUR', 'GBP'] },
        { name: 'stock', type: 'number' },
        { name: 'featured', type: 'bool' },
        { name: 'isNew', type: 'bool' },
        { name: 'demonstrative', type: 'bool' },
        { name: 'active', type: 'bool' },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_products_slug ON products (slug)'],
    })
    app.save(products)

    // ─── orders ─────────────────────────────────────────────────────────
    const orders = new Collection({
      type: 'base',
      name: 'orders',
      // Somente o dono vê o próprio pedido; admin vê todos. Criação
      // autenticada OU visitante (checkout como convidado).
      // Visitante (sem login) também pode criar pedido de demonstração;
      // leitura restrita ao dono ou ao admin.
      listRule: 'user = @request.auth.id',
      viewRule: 'user = @request.auth.id',
      createRule: '',
      // user/code são normalizados no hook pocketbase/hooks/orders.js
      updateRule: '',
      deleteRule: '',
      fields: [
        { name: 'code', type: 'text', presentable: true },
        { name: 'user', type: 'relation', collectionId: '_pb_users_auth_', maxSelect: 1 },
        {
          name: 'status',
          type: 'select',
          values: [
            'demo_pending_pix',
            'demo_pending_card',
            'demo_confirmed',
            'canceled',
            'paid',
            'shipped',
            'delivered', // reservados p/ integração real futura
          ],
        },
        {
          name: 'paymentMethod',
          type: 'select',
          values: ['pix', 'credit_card', 'debit_card', 'international_card'],
        },
        { name: 'currency', type: 'select', values: ['BRL', 'EUR', 'GBP'] },
        { name: 'locale', type: 'text' },
        { name: 'subtotal', type: 'number' },
        { name: 'discount', type: 'number' },
        { name: 'shipping', type: 'number' },
        { name: 'total', type: 'number' },
        { name: 'couponCode', type: 'text' },
        { name: 'shippingQuoteId', type: 'text' },
        { name: 'shippingEstimate', type: 'bool' },
        { name: 'isDemonstration', type: 'bool' },
        { name: 'trackingCode', type: 'text' },
        { name: 'addressName', type: 'text' },
        { name: 'addressPostcode', type: 'text' },
        { name: 'addressStreet', type: 'text' },
        { name: 'addressDistrict', type: 'text' },
        { name: 'addressCity', type: 'text' },
        { name: 'addressState', type: 'text' },
        { name: 'addressCountry', type: 'text' },
        { name: 'items', type: 'json', maxSize: 20000 },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_orders_code ON orders (code)'],
    })
    app.save(orders)

    // ─── coupons ────────────────────────────────────────────────────────
    const coupons = new Collection({
      type: 'base',
      name: 'coupons',
      listRule: 'active = true',
      viewRule: 'active = true',
      createRule: '',
      updateRule: '',
      deleteRule: '',
      fields: [
        { name: 'code', type: 'text', required: true, presentable: true },
        { name: 'kind', type: 'select', values: ['percent', 'fixed'] },
        { name: 'value', type: 'number', required: true },
        { name: 'minSubtotal', type: 'number' },
        { name: 'active', type: 'bool' },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_coupons_code ON coupons (code)'],
    })
    app.save(coupons)

    // ─── favorites ──────────────────────────────────────────────────────
    const favorites = new Collection({
      type: 'base',
      name: 'favorites',
      listRule: 'user = @request.auth.id',
      viewRule: 'user = @request.auth.id',
      createRule: 'user = @request.auth.id',
      deleteRule: 'user = @request.auth.id',
      fields: [
        {
          name: 'user',
          type: 'relation',
          collectionId: '_pb_users_auth_',
          required: true,
          maxSelect: 1,
        },
        { name: 'productSlug', type: 'text', required: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_fav_user_product ON favorites (user, productSlug)'],
    })
    app.save(favorites)

    // ─── profiles (1:1 com users — a coleção users não é tocada) ────────
    const profiles = new Collection({
      type: 'base',
      name: 'profiles',
      listRule: 'user = @request.auth.id',
      viewRule: 'user = @request.auth.id',
      createRule: 'user = @request.auth.id',
      updateRule: 'user = @request.auth.id',
      deleteRule: '',
      fields: [
        {
          name: 'user',
          type: 'relation',
          collectionId: '_pb_users_auth_',
          required: true,
          maxSelect: 1,
        },
        { name: 'phone', type: 'text' },
        { name: 'cpf', type: 'text' },
        { name: 'lgpdConsentAt', type: 'date' },
        { name: 'marketingOptIn', type: 'bool' },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_profiles_user ON profiles (user)'],
    })
    app.save(profiles)

    // ─── endereços ──────────────────────────────────────────────────────
    const addresses = new Collection({
      type: 'base',
      name: 'addresses',
      listRule: 'user = @request.auth.id',
      viewRule: 'user = @request.auth.id',
      createRule: 'user = @request.auth.id',
      updateRule: 'user = @request.auth.id',
      deleteRule: 'user = @request.auth.id',
      fields: [
        {
          name: 'user',
          type: 'relation',
          collectionId: '_pb_users_auth_',
          required: true,
          maxSelect: 1,
        },
        { name: 'label', type: 'text' },
        { name: 'postcode', type: 'text', required: true },
        { name: 'street', type: 'text', required: true },
        { name: 'number', type: 'text', required: true },
        { name: 'complement', type: 'text' },
        { name: 'district', type: 'text' },
        { name: 'city', type: 'text', required: true },
        { name: 'state', type: 'text', required: true },
        { name: 'country', type: 'text' },
        { name: 'isDefault', type: 'bool' },
      ],
    })
    app.save(addresses)

    // ─── seed: 7 categorias do usuário ──────────────────────────────────
    const seedCategories = [
      {
        slug: 'aromas-essencias',
        title: {
          'pt-br': 'Aromas & Essências',
          es: 'Aromas & Esencias',
          'en-gb': 'Aromas & Essences',
        },
        description: {
          'pt-br':
            'Essências concentradas e óleos para difusores, pedras e rituais de ambientação.',
          es: 'Esencias concentradas y aceites para difusores, piedras y rituales de ambientación.',
          'en-gb': 'Concentrated essences and oils for diffusers, stones and atmosphere rituals.',
        },
        heroImage: 'essential%20oil%20amber%20bottles',
        sortOrder: 1,
      },
      {
        slug: 'incensos-defumacao',
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
        heroImage: 'incense%20sticks%20smoke%20zen',
        sortOrder: 2,
      },
      {
        slug: 'velas-aromaticas',
        title: { 'pt-br': 'Velas Aromáticas', es: 'Velas Aromáticas', 'en-gb': 'Scented Candles' },
        description: {
          'pt-br':
            'Cera vegetal, pavio de algodão e luz baixa para as horas em que a casa se aquieta.',
          es: 'Cera vegetal, mecha de algodón y luz baja para las horas en que la casa se aquieta.',
          'en-gb':
            'Plant-based wax, cotton wick and low light for the hours when the house goes quiet.',
        },
        heroImage: 'scented%20candle%20warm%20light',
        sortOrder: 3,
      },
      {
        slug: 'difusores-aromatizadores',
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
        heroImage: 'reed%20diffuser%20home%20aroma',
        sortOrder: 4,
      },
      {
        slug: 'meditacao-relaxamento',
        title: {
          'pt-br': 'Meditação & Relaxamento',
          es: 'Meditación & Relaxamiento',
          'en-gb': 'Meditation & Relaxation',
        },
        description: {
          'pt-br':
            'Objetos de apoio à pausa: sinos, almofadas, pedras e acessórios de contemplação.',
          es: 'Objetos de apoyo a la pausa: campanas, cojines, piedras y accesorios de contemplación.',
          'en-gb':
            'Objects that support the pause: bells, cushions, stones and contemplation accessories.',
        },
        heroImage: 'meditation%20cushion%20zen%20bell',
        sortOrder: 5,
      },
      {
        slug: 'decoracao-zen',
        title: { 'pt-br': 'Decoração Zen', es: 'Decoración Zen', 'en-gb': 'Zen Decoration' },
        description: {
          'pt-br': 'Peças de madeira, cerâmica e pedra que trazem calma à decoração.',
          es: 'Piezas de madera, cerámica y piedra que traen calma a la decoración.',
          'en-gb': 'Wood, ceramic and stone pieces that bring calm to your decor.',
        },
        heroImage: 'zen%20stone%20wood%20decoration',
        sortOrder: 6,
      },
      {
        slug: 'kits-presentes',
        title: { 'pt-br': 'Kits & Presentes', es: 'Kits & Regalos', 'en-gb': 'Kits & Gifts' },
        description: {
          'pt-br': 'Combinações pensadas para presentear — ou para presentear a si mesmo.',
          es: 'Combinaciones pensadas para regalar — o para regalarte.',
          'en-gb': 'Curated combinations to give as gifts — or to gift yourself.',
        },
        heroImage: 'gift%20box%20aromatherapy',
        sortOrder: 7,
      },
    ]

    for (const c of seedCategories) {
      const rec = new Record(categories)
      rec.set('slug', c.slug)
      rec.set('title', JSON.stringify(c.title))
      rec.set('description', JSON.stringify(c.description))
      rec.set('heroImage', c.heroImage)
      rec.set('sortOrder', c.sortOrder)
      rec.set('active', true)
      app.save(rec)
    }

    // ─── coleção de administradores (a coleção `users` NÃO é tocada) ────
    // Regra usada em todas as regras admin acima via lookup:
    // existe um registro em `admins` com `user` = autenticado.
    const admins = new Collection({
      type: 'base',
      name: 'admins',
      listRule: 'user = @request.auth.id',
      viewRule: 'user = @request.auth.id',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        {
          name: 'user',
          type: 'relation',
          collectionId: '_pb_users_auth_',
          required: true,
          maxSelect: 1,
        },
        { name: 'note', type: 'text' },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_admins_user ON admins (user)'],
    })
    app.save(admins)

    // Regra reutilizável: "@collection.admins.user ?= @request.auth.id"
    const ADMIN_RULE = '@collection.admins.user ?= @request.auth.id'
    for (const name of ['categories', 'products', 'orders', 'coupons', 'profiles', 'addresses']) {
      const col = app.findCollectionByNameOrId(name)
      col.updateRule = ADMIN_RULE
      col.deleteRule = ADMIN_RULE
      app.save(col)
    }
    // categories/products: admin também lista/vê (inclusive inativos)
    for (const name of ['categories', 'products']) {
      const col = app.findCollectionByNameOrId(name)
      col.listRule = 'active = true || ' + ADMIN_RULE
      col.viewRule = col.listRule
      app.save(col)
    }
    // orders: admin também lista/vê todos
    const ordersCol = app.findCollectionByNameOrId('orders')
    ordersCol.listRule = 'user = @request.auth.id || ' + ADMIN_RULE
    ordersCol.viewRule = ordersCol.listRule
    app.save(ordersCol)
    // coupons: admin lista todos (inclusive inativos)
    const couponsCol = app.findCollectionByNameOrId('coupons')
    couponsCol.listRule = 'active = true || ' + ADMIN_RULE
    couponsCol.viewRule = couponsCol.listRule
    app.save(couponsCol)
    // profiles: admin também lista/vê
    const profilesCol = app.findCollectionByNameOrId('profiles')
    profilesCol.listRule = 'user = @request.auth.id || ' + ADMIN_RULE
    profilesCol.viewRule = profilesCol.listRule
    app.save(profilesCol)
    // addresses: admin também lista/vê
    const addressesCol = app.findCollectionByNameOrId('addresses')
    addressesCol.listRule = 'user = @request.auth.id || ' + ADMIN_RULE
    addressesCol.viewRule = addressesCol.listRule
    app.save(addressesCol)

    // ─── seed: admin demonstrativo (senha só de demonstração, trocar!) ───
    try {
      const adminUser = new Record(app.findCollectionByNameOrId('users'))
      adminUser.set('email', 'admin@almayaroma.shop')
      adminUser.set('name', 'Admin Alma y Aroma (demo)')
      adminUser.setPassword('AlmaDemo2026!')
      adminUser.set('verified', true)
      app.save(adminUser)
      const adminRec = new Record(admins)
      adminRec.set('user', adminUser.id)
      adminRec.set('note', 'Conta administrativa de demonstração — trocar a senha em produção.')
      app.save(adminRec)
    } catch (e) {
      console.log('seed admin skip: ' + e)
    }

    // ─── cupom de boas-vindas demonstrativo ─────────────────────────────
    const welcome = new Record(coupons)
    welcome.set('code', 'BEMVINDO10')
    welcome.set('kind', 'percent')
    welcome.set('value', 10)
    welcome.set('minSubtotal', 0)
    welcome.set('active', true)
    app.save(welcome)
  },
  (app) => {
    // rollback: remove apenas o que esta migration criou
    for (const name of [
      'addresses',
      'profiles',
      'favorites',
      'coupons',
      'orders',
      'products',
      'categories',
    ]) {
      try {
        app.delete(app.findCollectionByNameOrId(name))
      } catch (e) {}
    }
  },
)
