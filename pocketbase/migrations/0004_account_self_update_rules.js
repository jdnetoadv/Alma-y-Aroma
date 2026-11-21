/// <reference path="../pb_data/types.d.ts" />
/**
 * Etapa 4 — Área do cliente: permite que o usuário autenticado edite e
 * remova os PRÓPRIOS perfis e endereços (a migração original dava update
 * só ao admin, o que impedia editar dados pessoais e endereços).
 */
migrate(
  (app) => {
    const SELF = 'user = @request.auth.id'
    for (const name of ['profiles', 'addresses']) {
      const col = app.findCollectionByNameOrId(name)
      col.updateRule = SELF
      col.deleteRule = SELF
      app.save(col)
    }
  },
  (app) => {
    const ADMIN_RULE = '@collection.admins.user ?= @request.auth.id'
    for (const name of ['profiles', 'addresses']) {
      const col = app.findCollectionByNameOrId(name)
      col.updateRule = ADMIN_RULE
      col.deleteRule = ADMIN_RULE
      app.save(col)
    }
  },
)
