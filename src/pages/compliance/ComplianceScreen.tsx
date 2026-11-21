import { useMemo } from 'react'
import { Locale } from '@/i18n/types'
import { shopT } from '@/i18n/shopStrings'
import { complianceContent, CompliancePageKey } from './content'
import {
  ComplianceList,
  CompliancePage,
  ComplianceParagraph,
  ComplianceSection,
} from './ComplianceShell'

interface ComplianceScreenProps {
  locale: Locale
  pageKey: CompliancePageKey
}

/**
 * Tela genérica das páginas de conformidade (privacidade, cookies, termos,
 * trocas, entrega, contato). Todo o conteúdo vem de complianceContent —
 * minutas pendentes de revisão jurídica, com placeholders "[a definir]".
 */
export function ComplianceScreen({ locale, pageKey }: ComplianceScreenProps) {
  const t = useMemo(
    () => (key: string, vars?: Record<string, string>) => shopT(locale, key, vars),
    [locale],
  )
  const content = complianceContent[pageKey]

  return (
    <CompliancePage locale={locale} title={content.title[locale]} subtitle={content.intro[locale]}>
      {content.sections.map((section) => (
        <ComplianceSection key={section.heading['pt-br']} heading={section.heading[locale]}>
          {section.body.map((paragraph, index) => (
            <ComplianceParagraph key={index}>{paragraph[locale]}</ComplianceParagraph>
          ))}
        </ComplianceSection>
      ))}
      <ComplianceSection heading={t('compliance.sectionsTitle')}>
        <ComplianceList items={COMPLIANCE_LINK_TITLES[pageKey].map((key) => t(key))} />
      </ComplianceSection>
    </CompliancePage>
  )
}

const COMPLIANCE_LINK_TITLES: Record<CompliancePageKey, string[]> = {
  privacidade: [
    'footer.privacy',
    'footer.cookies',
    'footer.terms',
    'footer.returns',
    'footer.shipping',
    'footer.contact',
  ],
  cookies: ['footer.privacy', 'footer.terms'],
  termos: ['footer.privacy', 'footer.cookies', 'footer.returns'],
  trocas: ['footer.shipping', 'footer.contact'],
  entrega: ['footer.returns', 'footer.contact'],
  contato: ['footer.privacy', 'footer.cookies'],
}
