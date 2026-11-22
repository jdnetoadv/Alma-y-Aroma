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
    localSrc: string
    externalSrc: string
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
    // A experiência sonora está ATIVA. Cadeia de prioridade do provider:
    // 1) MP3 local em public/audio/ambiente-loop.mp3 (se existir);
    // 2) faixa externa por URL, em streaming: "That Zen Moment" — Kevin MacLeod
    //    (incompetech.com), CC-BY 4.0 (crédito obrigatório no rodapé);
    // 3) sintetizador WebAudio (src/lib/audio/tibetanSynth.ts) se a faixa falhar.
    // Nenhum autoplay: só após clique no controle do cabeçalho ou no convite.
    localSrc: '/audio/ambiente-loop.mp3',
    externalSrc:
      'https://incompetech.com/music/royalty-free/mp3-royaltyfree/That%20Zen%20Moment.mp3',
    defaultVolume: 0.3,
  },
}
