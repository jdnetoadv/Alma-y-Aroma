import { Locale } from '@/i18n/types'
import { useLocale } from '@/i18n/LocaleContext'
import { shopT } from '@/i18n/shopStrings'
import { AdminProduct } from '@/lib/admin/service'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

/** Idiomas traduzidos no painel; o pt-br é a base, editada nos campos principais. */
export type TranslatedLocale = Exclude<Locale, 'pt-br'>
export type TranslatedField = 'name' | 'shortDescription' | 'longDescription'
export type ProductTranslationDraft = Record<TranslatedField, Record<TranslatedLocale, string>>

const TRANSLATED_LOCALES: { code: TranslatedLocale; label: string }[] = [
  { code: 'es', label: 'es-ES' },
  { code: 'en-gb', label: 'en-GB' },
]

/** Rascunho de traduções a partir do produto salvo (vazio na criação). */
export function translationDraftFrom(product?: AdminProduct): ProductTranslationDraft {
  const build = (src?: Partial<Record<Locale, string>>) => ({
    es: src?.es ?? '',
    'en-gb': src?.['en-gb'] ?? '',
  })
  return {
    name: build(product?.name),
    shortDescription: build(product?.shortDescription),
    longDescription: build(product?.longDescription),
  }
}

/**
 * Texto por idioma para gravar: pt-br é o valor informado e os demais saem
 * aparados. Idioma vazio é gravado como '' — a loja mostra o pt-br nesse caso.
 */
export function withPortuguese(
  pt: string,
  draft: Record<TranslatedLocale, string>,
): Record<Locale, string> {
  return {
    'pt-br': pt,
    es: draft.es.trim(),
    'en-gb': draft['en-gb'].trim(),
  }
}

/** Painel "Traduções": nome, descrição curta e completa em es-ES e en-GB. */
export function ProductTranslationsPanel({
  value,
  onChange,
  ptName,
  ptShortDescription,
  ptLongDescription,
}: {
  value: ProductTranslationDraft
  onChange: (next: ProductTranslationDraft) => void
  ptName: string
  ptShortDescription: string
  ptLongDescription: string
}) {
  const { locale } = useLocale()
  const t = (key: string) => shopT(locale, key)

  function setValue(field: TranslatedField, code: TranslatedLocale, text: string) {
    onChange({ ...value, [field]: { ...value[field], [code]: text } })
  }

  const fields: {
    field: TranslatedField
    label: string
    pt: string
    multiline: boolean
  }[] = [
    { field: 'name', label: t('admin.productName'), pt: ptName, multiline: false },
    {
      field: 'shortDescription',
      label: t('admin.shortDescription'),
      pt: ptShortDescription,
      multiline: false,
    },
    {
      field: 'longDescription',
      label: t('admin.longDescription'),
      pt: ptLongDescription,
      multiline: true,
    },
  ]

  return (
    <fieldset className="space-y-3 rounded-md border border-border/60 p-4">
      <legend className="px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {t('admin.translations.title')}
      </legend>
      <p className="text-[11px] text-muted-foreground">{t('admin.translations.hint')}</p>
      {TRANSLATED_LOCALES.map(({ code, label: localeLabel }) => (
        <div key={code} className="space-y-2">
          <p className="text-xs font-medium text-foreground">{localeLabel}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map(({ field, label, pt, multiline }) => {
              const id = `prod-${field}-${code}`
              const current = value[field][code]
              return (
                <div key={field} className={`space-y-1 ${multiline ? 'sm:col-span-2' : ''}`}>
                  <Label htmlFor={id} className="text-xs text-muted-foreground">
                    {label} ({localeLabel})
                  </Label>
                  {multiline ? (
                    <Textarea
                      id={id}
                      value={current}
                      placeholder={pt}
                      onChange={(e) => setValue(field, code, e.target.value)}
                      rows={4}
                      className="bg-background"
                    />
                  ) : (
                    <Input
                      id={id}
                      value={current}
                      placeholder={pt}
                      onChange={(e) => setValue(field, code, e.target.value)}
                      className="bg-background"
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </fieldset>
  )
}
