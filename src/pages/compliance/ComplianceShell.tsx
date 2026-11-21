import type { ReactNode } from 'react'
import { Locale } from '@/i18n/types'
import { CatalogBreadcrumb, CollectionHeader } from '@/components/catalog/CatalogShared'
import { SHOP_CURRENCY_PLACEHOLDER, shopCurrencyLabel } from './content'

interface CompliancePageProps {
  locale: Locale
  title: string
  subtitle: string
  children: ReactNode
}

const ARIA_LABELS: Record<Locale, string> = {
  'pt-br': 'Conteúdo',
  es: 'Contenido',
  'en-gb': 'Contents',
}

const BADGES: Record<Locale, string> = {
  'pt-br': 'Conformidade e transparência',
  es: 'Conformidad y transparencia',
  'en-gb': 'Compliance and transparency',
}

const PLACEHOLDER_LEGENDS: Record<Locale, string> = {
  'pt-br':
    'Campos marcados como "[a definir]" serão completados com os dados oficiais da loja (CNPJ, endereço, e-mail, canais de atendimento) antes da publicação final.',
  es: 'Los campos marcados como "[por definir]" se completarán con los datos oficiales de la tienda (CNPJ, dirección, correo electrónico, canales de atención) antes de la publicación final.',
  'en-gb':
    'Fields marked as "[to be defined]" will be completed with the shop’s official details (company registration, address, e-mail, support channels) before final publication.',
}

/**
 * Moldura comum das páginas de conformidade (Etapa 4): breadcrumb,
 * cabeçalho da marca, aviso de minuta e conteúdo em card elegante.
 */
export function CompliancePage({ locale, title, subtitle, children }: CompliancePageProps) {
  const homeHref = `/${locale}`
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <CatalogBreadcrumb items={[{ label: 'Alma y Aroma', to: homeHref }, { label: title }]} />
        <CollectionHeader badge={BADGES[locale]} title={title} description={subtitle} />
        <ComplianceDraftNotice locale={locale} />
        <article
          aria-label={ARIA_LABELS[locale]}
          className="rounded-2xl border border-border/60 bg-card/80 px-6 py-8 shadow-sm sm:px-10 sm:py-10"
        >
          <div className="space-y-8 text-sm leading-relaxed text-foreground/80">{children}</div>
        </article>
        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          {PLACEHOLDER_LEGENDS[locale]}
        </p>
      </div>
    </main>
  )
}

export function ComplianceSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-serif text-lg font-medium tracking-wide text-foreground sm:text-xl">
        {heading}
      </h2>
      {children}
    </section>
  )
}

export function ComplianceParagraph({ children }: { children: ReactNode }) {
  return <p className="whitespace-pre-line">{children}</p>
}

export function ComplianceList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5 marker:text-primary/40">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

export function CompliancePlaceholder({ children }: { children: ReactNode }) {
  return (
    <span className="rounded bg-primary/10 px-1.5 py-0.5 font-medium text-primary">{children}</span>
  )
}

export function ComplianceTable({
  caption,
  head,
  rows,
}: {
  caption: string
  head: string[]
  rows: string[][]
}) {
  return (
    <figure className="overflow-hidden rounded-xl border border-border/60">
      <table className="w-full text-left text-xs sm:text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-muted/60 text-muted-foreground">
          <tr>
            {head.map((label) => (
              <th key={label} scope="col" className="px-4 py-2.5 font-medium">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {rows.map((row) => (
            <tr key={row.join('|')} className="bg-card/50">
              {row.map((cell, index) => (
                <td
                  key={index}
                  className={`px-4 py-2.5 ${index === 0 ? 'font-medium text-foreground' : 'text-foreground/75'}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}

/** Aviso visível de que a página é minuta pendente de revisão jurídica. */
export function ComplianceDraftNotice({ locale }: { locale: Locale }) {
  return (
    <div
      role="note"
      className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 px-5 py-4 text-sm leading-relaxed text-amber-900 dark:text-amber-100"
    >
      <p className="font-medium">{DRAFT_NOTICE_TITLES[locale]}</p>
      <p className="mt-1 text-[13px]">{DRAFT_NOTICE_BODIES[locale]}</p>
    </div>
  )
}

const DRAFT_NOTICE_TITLES: Record<Locale, string> = {
  'pt-br': 'Minuta para revisão jurídica',
  es: 'Borrador pendiente de revisión jurídica',
  'en-gb': 'Draft pending legal review',
}

const DRAFT_NOTICE_BODIES: Record<Locale, string> = {
  'pt-br':
    'Este texto é uma MINUTA de demonstração. Ele ainda não passou por revisão jurídica e pode mudar antes da publicação final da loja. Não constitui aconselhamento jurídico.',
  es: 'Este texto es un BORRADOR de demostración. Todavía no pasó por revisión jurídica y puede cambiar antes de la publicación final de la tienda. No constituye asesoría legal.',
  'en-gb':
    'This text is a demonstration DRAFT. It has not yet undergone legal review and may change before the shop’s final publication. It does not constitute legal advice.',
}

export { SHOP_CURRENCY_PLACEHOLDER, shopCurrencyLabel }
