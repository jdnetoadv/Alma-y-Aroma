// Miniaturas do PocketBase: os campos de arquivo `galleryFiles` e `imageFile`
// não tinham tamanhos de thumb configurados — o parâmetro `?thumb=300x300`
// nas URLs era ignorado e a UI carregava os originais (vários MB) até em
// thumbnails de 80 px. Esta migração habilita a geração de thumbs 300x300
// (WxH, recorte central — formato usado nas miniaturas da galeria admin e
// dos cards da loja). PocketBase gera o thumb LAZILY no primeiro acesso e
// serve o original como fallback se a geração falhar.
migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('products')

    for (const fieldName of ['imageFile', 'galleryFiles']) {
      const field = col.fields.getByName(fieldName)
      if (!field) continue
      // No JSVM o Field expõe as propriedades diretas (field.thumbs) — não há
      // field.get()/set(). Lê o valor atual (defensivo) e reatribui um array.
      const current = []
      try {
        const existing = field.thumbs
        if (existing && typeof existing.length === 'number') {
          for (let i = 0; i < existing.length; i++) {
            const size = String(existing[i])
            if (size && current.indexOf(size) === -1) current.push(size)
          }
        }
      } catch (_) {
        // sem thumbs legíveis — segue com lista vazia
      }
      if (current.indexOf('300x300') === -1) current.push('300x300')
      field.thumbs = current
    }

    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('products')
    for (const fieldName of ['imageFile', 'galleryFiles']) {
      const field = col.fields.getByName(fieldName)
      if (!field) continue
      const current = []
      try {
        const existing = field.thumbs
        if (existing && typeof existing.length === 'number') {
          for (let i = 0; i < existing.length; i++) {
            const size = String(existing[i])
            if (size && size !== '300x300' && current.indexOf(size) === -1) current.push(size)
          }
        }
      } catch (_) {}
      field.thumbs = current
    }
    app.save(col)
  },
)
