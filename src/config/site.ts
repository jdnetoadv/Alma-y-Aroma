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
    // A experiência sonora está ATIVA. O provider tenta primeiro o MP3 em
    // public/audio/ambiente-loop.mp3 ("soothing tibetian flute music",
    // PoorArtistt, Pixabay Content License — ver src/lib/audio/tibetanSynth.ts);
    // se o arquivo não existir, usa o fallback sintetizado via WebAudio
    // (flauta tibetana pentatônica sobre drone). Nenhum autoplay: só após
    // clique no controle do cabeçalho ou no convite.
    hasLicensedFile: false, // informativo — o provider detecta o arquivo em runtime via HEAD
    src: '/audio/ambiente-loop.mp3',
    defaultVolume: 0.3,
  },
}
