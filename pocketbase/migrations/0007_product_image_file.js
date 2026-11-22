/**
 * Imagem de produto por upload de arquivo: campo `imageFile` (file, 1 arquivo)
 * na coleção `products`. A loja usa o arquivo antes do primeiro item de
 * `images` (URLs). Campo opcional — registros existentes não mudam.
 */
migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('products')
    if (!col.fields.getByName('imageFile')) {
      col.fields.add(
        new FileField({
          name: 'imageFile',
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        }),
      )
    }
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('products')
    if (!col.fields.getByName('imageFile')) return
    col.fields.removeByName('imageFile')
    app.save(col)
  },
)
