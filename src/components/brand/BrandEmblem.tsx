/**
 * Emblema oficial da marca ALMA Y AROMA — LOGO OFICIAL da cliente
 * (PNG "Logotipo Dourado Alma y Aroma", fundo preto removido por chave de
 * luminância no pipeline de build, glow dourado preservado como
 * transparência suave). NÃO é um desenho vetorial: é a arte oficial
 * recortada (chama + círculo aberto + folhas), sem o wordmark.
 *
 * Ponto único de verdade do emblema: topbar (desktop e drawer mobile),
 * favicon e selo do rodapé/conta/checkout compartilham esta arte.
 */

/** Arte oficial processada em public/brand/ (gerada no build a partir do PNG oficial). */
export const BRAND_EMBLEM_SRC = '/brand/emblem.png'
/** Lockup oficial completa (emblema + wordmark), fundo transparente. */
export const BRAND_LOCKUP_SRC = '/brand/lockup.png'

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
      src={BRAND_EMBLEM_SRC}
      alt={title ?? ''}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      draggable={false}
      className={className}
    />
  )
}
