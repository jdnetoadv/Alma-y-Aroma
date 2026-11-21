/**
 * Selo circular da marca (imagem 4 do plano de branding) — círculo dourado com
 * fundo vinho, chama/folha central dourada e tipografia "ALMA Y AROMA".
 * Renderizado como SVG inline: funciona sobre qualquer fundo sem tratamento,
 * pois o círculo fecha a composição (hero, confirmação de pedido, conta).
 */
interface BrandSealProps {
  className?: string
  /** Título acessível no idioma corrente — sempre "Alma y Aroma". */
  title?: string
}

export function BrandSeal({ className = '', title = 'Alma y Aroma' }: BrandSealProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={className}
    >
      <title>{title}</title>
      {/* Disco vinho + anéis dourados (círculo fecha a composição) */}
      <circle cx="60" cy="60" r="58" fill="#4A1B1F" />
      <circle cx="60" cy="60" r="58" stroke="#B49A67" strokeWidth="1.5" />
      <circle
        cx="60"
        cy="60"
        r="52"
        fill="#3E1A1D"
        stroke="#B49A67"
        strokeWidth="0.8"
        opacity="0.9"
      />

      {/* Chama/folha central */}
      <path
        d="M60 62C55.8 49.6 54.2 39.6 55.9 29.8C57.6 20 61.2 13.4 62 8.6C63.4 13.6 62.6 24 60.9 33.8C59.2 43.6 60.8 53.6 60 62Z"
        fill="#C7B183"
      />
      <path
        d="M60 62C64.6 49.8 66.2 39.8 64.5 30C62.8 20.2 61 13.6 62 8.6C66.2 14.4 67.4 24.4 65.5 34.6C63.6 44.8 62.4 54.6 60 62Z"
        fill="#B49A67"
      />
      {/* Folhas laterais na base da chama */}
      <path d="M60 62C50.4 61.2 42.4 57.2 37.6 51.6C45.6 53 53.6 56.6 60 62Z" fill="#C7B183" />
      <path d="M60 62C69.6 61.2 77.6 57.2 82.4 51.6C74.4 53 66.4 56.6 60 62Z" fill="#B49A67" />

      {/* Tipografia "ALMA Y AROMA" */}
      <text
        x="60"
        y="79"
        textAnchor="middle"
        fill="#E8D9C3"
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontSize="11.5"
        letterSpacing="2.6"
      >
        ALMA Y AROMA
      </text>

      {/* Slogan entre filetes dourados */}
      <line x1="24" y1="88" x2="40" y2="88" stroke="#B49A67" strokeWidth="0.7" />
      <line x1="80" y1="88" x2="96" y2="88" stroke="#B49A67" strokeWidth="0.7" />
      <text
        x="60"
        y="91.5"
        textAnchor="middle"
        fill="#C7B183"
        fontFamily="Jost, system-ui, sans-serif"
        fontSize="4.6"
        letterSpacing="1.5"
      >
        ESSÊNCIAS QUE DESPERTAM SENTIDOS.
      </text>
    </svg>
  )
}
