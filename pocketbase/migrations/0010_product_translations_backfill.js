/**
 * Traduções por idioma dos produtos. Os campos `name`, `shortDescription` e
 * `longDescription` (json) já guardam { 'pt-br', es, 'en-gb' } — esta migração
 * não cria colunas. Os registros publicados antes do formulário trilíngue
 * copiavam o texto em português para es e en-gb; aqui esses valores-cópia são
 * limpos (ficam vazios), para que a loja caia no português de forma explícita.
 * O pt-br NUNCA é alterado: nenhum texto é perdido.
 */
const TRANSLATED_FIELDS = ['name', 'shortDescription', 'longDescription']
const COPY_LOCALES = ['es', 'en-gb']

function asObject(raw) {
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) return raw
  if (typeof raw === 'string' && raw) {
    try {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object') return parsed
    } catch (_) {}
  }
  return {}
}

migrate(
  (app) => {
    const recs = app.findRecordsByFilter('products', '', 'id', 0, 0)
    for (const rec of recs) {
      let changed = false
      for (const field of TRANSLATED_FIELDS) {
        const value = Object.assign({}, asObject(rec.get(field)))
        const pt = typeof value['pt-br'] === 'string' ? value['pt-br'].trim() : ''
        if (!pt) continue
        for (const loc of COPY_LOCALES) {
          if (typeof value[loc] === 'string' && value[loc].trim() === pt) {
            value[loc] = ''
            changed = true
          }
        }
        rec.set(field, value)
      }
      if (changed) app.save(rec)
    }
  },
  (app) => {
    // Sem reversão: os textos copiados são idênticos ao pt-br, que permanece.
  },
)
