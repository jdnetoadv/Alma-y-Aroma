/**
 * Logomarca oficial da marca ALMA Y AROMA — PNG OFICIAL da cliente
 * ("Logotipo Dourado Alma y Aroma": chama atravessando o círculo aberto,
 * folhas na base e wordmark serifado, FUNDO TRANSPARENTE), importado como
 * ativo estático pelo Vite, sem nenhum pipeline de processamento em build.
 *
 * Ponto único de verdade da marca: topbar (desktop e drawer mobile),
 * favicon (index.html) e selo do rodapé/conta/checkout compartilham esta arte.
 */
import officialLogo from '@/assets/almayaromaoriginalchampanhetransparente-ffaab.png'

/** PNG oficial completo (emblema + wordmark), fundo transparente. */
export const BRAND_LOGO_SRC = officialLogo

interface BrandEmblemProps {
  className?: string
  /** Título acessível — o emblema costuma vir acompanhado do wordmark. */
  title?: string
  /** Desativado (mantido por compatibilidade de chamadas existentes). */
  withHoverLift?: boolean
}

export function BrandEmblem({ className = '', title }: BrandEmblemProps) {
  return (
    <img
      src={BRAND_LOGO_SRC}
      alt={title ?? ''}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      draggable={false}
      className={className}
    />
  )
}
