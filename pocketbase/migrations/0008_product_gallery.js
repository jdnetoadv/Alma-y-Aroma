/**
 * Galeria de fotos do produto: campo `galleryFiles` (file, até 10 arquivos)
 * na coleção `products`, ao lado do `imageFile` (arquivo único legado) e das
 * URLs em `images` (json). A loja monta a sequência na ordem:
 * 1º arquivo de galleryFiles, depois imageFile (legado), depois images[].
 * Campo opcional — registros existentes não mudam.
 */
migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('products')
    if (!col.fields.getByName('galleryFiles')) {
      col.fields.add(
        new FileField({
          name: 'galleryFiles',
          maxSelect: 10,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        }),
      )
    }
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('products')
    if (!col.fields.getByName('galleryFiles')) return
    col.fields.removeByName('galleryFiles')
    app.save(col)
  },
)
