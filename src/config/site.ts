/**
 * Site configuration for ALMA Y AROMA (Etapa 1)
 *
 * Configurable fields for commercial and contact data.
 * Per PRD: "Não inventar dados de contato, CNPJ, redes sociais ou políticas definitivas.
 * Utilizar campos configuráveis para informações ainda não fornecidas."
 */
export interface SiteConfig {
  brandName: string
  domain: string
  siteUrl: string
  instagramUrl?: string
  whatsappNumber?: string
  contactEmail?: string
  cnpj?: string
  audio: {
    enabled: boolean
    hasLicensedFile: boolean
    src: string
    defaultVolume: number
  }
}

export const siteConfig: SiteConfig = {
  brandName: 'ALMA Y AROMA',
  domain: 'www.almayaroma.shop',
  siteUrl: 'https://www.almayaroma.shop',
  // Campos configuráveis mantidos sem dados inventados até o cliente fornecer:
  instagramUrl: undefined, // ex.: 'https://instagram.com/almayaroma'
  whatsappNumber: undefined, // ex.: '+5511999999999'
  contactEmail: undefined, // ex.: 'contato@almayaroma.shop'
  cnpj: undefined,
  audio: {
    enabled: true,
    // Na Etapa 1 NÃO há arquivo licenciado fornecido pelo cliente.
    // O player funciona e ao clicar mostra mensagem honesta.
    // Assim que o cliente fornecer 'public/audio/ambiente-loop.mp3', basta mudar hasLicensedFile para true.
    hasLicensedFile: false,
    src: '/audio/ambiente-loop.mp3',
    defaultVolume: 0.3,
  },
}
