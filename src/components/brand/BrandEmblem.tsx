/**
 * Emblema canônico da marca ALMA Y AROMA — fidelidade às artes de referência
 * da cliente. A chama/folha é VAZADA: duas curvas finas que nascem afastadas
 * na base, se cruzam no meio e se unem numa ponta ascendente (nunca uma
 * “lente”/amêndoa fechada preenchida, como na versão anterior). Na base, duas
 * folhas finas apontando para BAIXO a partir da ponta. Tudo inscrito num
 * círculo FINO dourado ABERTO no topo, por onde a chama atravessa.
 *
 * Este é o ponto único de verdade do emblema: header, drawer mobile,
 * favicon (public/favicon.svg espelha estas formas), selo do rodapé
 * (BrandSeal), conta e confirmação de pedido compartilham esta arte.
 */
interface BrandEmblemProps {
  className?: string
  /** Título acessível — o emblema costuma vir acompanhado do wordmark. */
  title?: string
  /** Desativa a micro-interação de elevação no hover (usado no header). */
  withHoverLift?: boolean
}

export function BrandEmblem({ className = '', title, withHoverLift = true }: BrandEmblemProps) {
  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={`${withHoverLift ? 'transform transition-transform duration-700 ease-out group-hover:-translate-y-1 ' : ''}${className}`}
    >
      {title && <title>{title}</title>}
      <defs>
        <linearGradient
          id="aya-emblem-gold"
          x1="20"
          y1="14"
          x2="76"
          y2="88"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#E2CE9F" />
          <stop offset="0.5" stopColor="#B49A67" />
          <stop offset="1" stopColor="#8A6F3E" />
        </linearGradient>
      </defs>

      {/* Círculo fino dourado, ABERTO no topo onde a chama o atravessa
          (arco explícito com furo de 40° a 140° — nunca um círculo fechado) */}
      <path
        d="M48 14.55 A40 40 0 1 0 82.14 24.55"
        fill="none"
        stroke="url(#aya-emblem-gold)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Chama central VAZADA — duas curvas finas, sem preenchimento.
          Direita: base afastada, cruza à esquerda no meio, ponta no topo.
          Esquerda: espelhada, cruzando de volta — silhueta de folha lanceta. */}
      <path
        d="M54.5 80 C47 66 42 48 42.5 36 C42.8 29 44.5 19.5 48 12"
        fill="none"
        stroke="url(#aya-emblem-gold)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M41.5 80 C49 66 54 48 53.5 36 C53.2 29 51.5 19.5 48 12"
        fill="none"
        stroke="url(#aya-emblem-gold)"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Duas folhas finas na base, APONTANDO PARA BAIXO a partir da ponta */}
      <path
        d="M48 84 C45 84 41.5 82.5 39.5 80 C42.5 79.5 45.5 80.5 48 84 Z"
        fill="url(#aya-emblem-gold)"
      />
      <path
        d="M48 84 C51 84 54.5 82.5 56.5 80 C53.5 79.5 50.5 80.5 48 84 Z"
        fill="url(#aya-emblem-gold)"
        opacity="0.85"
      />
    </svg>
  )
}
