/**
 * Limpeza real das traduções-cópia (o pt-br NUNCA é tocado).
 *
 * A migração 0010 tentava o mesmo, mas `rec.get()` num campo json devolve os
 * BYTES crus (array de números) no JSVM — nunca o objeto parseado. Com isso
 * `asObject()` devolvia `{}`, o pt-br saía vazio e TODO registro era pulado:
 * a migração "aplicou" sem alterar uma linha. Aqui o JSON é lido de
 * `rec.getString(field)` (o texto cru, que é o JSON serializado) e, quando há
 * o que limpar, a gravação vai por SQL direto (`app.db()`), sem depender de
 * setters de campo json.
 *
 * Idempotente: só zera es/'en-gb' QUANDO são cópias exatas (aparadas) do
 * pt-br; textos reais em es/en-gb e registros sem pt-br ficam intactos.
 * Roda em banco vazio como no-op (não há registros a limpar).
 */
const FIELDS = ['name', 'shortDescription', 'longDescription']
const COPY_LOCALES = ['es', 'en-gb']

function asObject(raw) {
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) return raw
  if (typeof raw === 'string' && raw) {
    try {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed
    } catch (_) {}
  }
  return {}
}

migrate(
  (app) => {
    const recs = app.findRecordsByFilter('products', '', 'id', 0, 0)
    for (const rec of recs) {
      for (const field of FIELDS) {
        // json no JSVM: get() devolve bytes; getString() devolve o texto cru
        // (o JSON serializado) — é dele que o objeto vem.
        const value = asObject(rec.getString(field))
        const pt = typeof value['pt-br'] === 'string' ? value['pt-br'].trim() : ''
        if (!pt) continue

        const next = Object.assign({}, value)
        let touched = false
        for (const loc of COPY_LOCALES) {
          if (typeof next[loc] === 'string' && next[loc].trim() === pt && next[loc] !== '') {
            next[loc] = ''
            touched = true
          }
        }
        if (!touched) continue

        // field vem da constante FIELDS (sem input externo): interpolação
        // segura; identificadores não podem ser parametrizados em SQLite.
        const json = JSON.stringify(next)
        app
          .db()
          .newQuery('UPDATE products SET ' + field + ' = {:json} WHERE id = {:id}')
          .bind({ json: json, id: rec.id })
          .execute()
      }
    }
  },
  (app) => {
    // Sem reversão: só valores idênticos ao pt-br foram zerados.
  },
)
