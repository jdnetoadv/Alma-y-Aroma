/**
 * Etapa 4 — preparação comercial dos produtos:
 * - peso (weightGrams) e dimensões (lengthCm, widthCm, heightCm) para futuro
 *   cálculo de frete;
 * - pricesByCurrency (JSON) para preços configuráveis por mercado (BRL/EUR/GBP),
 *   sem conversão automática: sem preço configurado, a loja mantém BRL.
 *
 * Todos os campos são opcionais — nada é exigido dos registros existentes.
 */
migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('products')

    const numeric = ['weightGrams', 'lengthCm', 'widthCm', 'heightCm']
    for (const name of numeric) {
      if (!col.fields.getByName(name)) {
        col.fields.add(new NumberField({ name, min: 0 }))
      }
    }
    if (!col.fields.getByName('pricesByCurrency')) {
      col.fields.add(new JSONField({ name: 'pricesByCurrency', maxSize: 100000 }))
    }

    app.save(col)
  },
  (app) => {
    // Revert: os campos são opcionais e inofensivos; remoção de campos em down
    // não é necessária para o estado atual do projeto.
    const col = app.findCollectionByNameOrId('products')
    if (!col.fields.getByName('pricesByCurrency')) return
    col.fields.removeByName('pricesByCurrency')
    app.save(col)
  },
)
