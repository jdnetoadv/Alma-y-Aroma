/**
 * Emblema canônico da marca ALMA Y AROMA — identidade NOVA enviada pela
 * cliente (PNGs de referência anexados à tarefa). A referência tem fundo
 * preto opaco, então a arte foi recriada como SVG vetorial transparente:
 * chama estilizada de duas curvas finas em gradiente quente (#B49A67 →
 * claro), terminando em duas folhas na base, inscrita num círculo FINO
 * dourado aberto no topo (atravessado pela chama).
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

      {/* Círculo fino dourado, aberto no topo onde a chama o atravessa */}
      <circle
        cx="48"
        cy="53"
        r="45"
        fill="none"
        stroke="url(#aya-emblem-gold)"
        strokeWidth="3"
        strokeDasharray="249 38"
        strokeDashoffset="-19"
        transform="rotate(46 48 53)"
        strokeLinecap="round"
      />

      {/* Chama central: corpo em gradiente translúcido + duas curvas finas */}
      <path
        d="M48 88 C42 70 40 54 42.5 40 C45 26 46.8 18 48 10 C49.2 18 51 26 53.5 40 C56 54 54 70 48 88 Z"
        fill="url(#aya-emblem-gold)"
        opacity="0.28"
      />
      <path
        d="M48 88 C43 70 41 54 43.5 40 C45.8 26.5 46.9 18.5 48 10"
        fill="none"
        stroke="url(#aya-emblem-gold)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M48 88 C53.5 70 55.5 54 53 40 C50.8 26.5 49.1 18.5 48 10"
        fill="none"
        stroke="url(#aya-emblem-gold)"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Duas folhas na base da chama */}
      <path
        d="M48 88 C39 87 31 82.5 26.5 76.5 C34 78 41.5 82 48 88 Z"
        fill="url(#aya-emblem-gold)"
      />
      <path
        d="M48 88 C57 87 65 82.5 69.5 76.5 C62 78 54.5 82 48 88 Z"
        fill="url(#aya-emblem-gold)"
        opacity="0.85"
      />
    </svg>
  )
}
