migrate(
  (app) => {
    const collection = new Collection({
      name: 'newsletter_subscribers',
      type: 'base',
      listRule: null,
      viewRule: null,
      createRule: '',
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'email', type: 'email', required: true },
        {
          name: 'locale',
          type: 'select',
          required: true,
          values: ['pt-br', 'es', 'en-gb'],
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_newsletter_subscribers_email ON newsletter_subscribers (email)',
      ],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('newsletter_subscribers')
    app.delete(collection)
  },
)
