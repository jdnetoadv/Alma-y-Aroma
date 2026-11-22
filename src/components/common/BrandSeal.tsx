/**
 * Selo circular da marca — NOVA identidade enviada pela cliente (PNGs de
 * referência anexados à tarefa). A referência tem fundo preto opaco, então a
 * arte foi recriada como SVG vetorial fiel e transparente:
 *   • Círculo FINO dourado ABERTO no topo (atravessado pela chama);
 *   • Chama estilizada com duas curvas finas em gradiente quente
 *     (#B49A67 → claro) terminando em duas folhas na base;
 *   • Tipografia "ALMA Y AROMA" em serifadas com leve gradiente marfim
 *     e letter-spacing largo;
 *   • Slogan "ESSÊNCIAS QUE DESPERTAM SENTIDOS." em dourado, caixa alta,
 *     entre dois traços horizontais curtos de cada lado.
 * Usado no rodapé, conta/checkout e qualquer ponto que precise do selo
 * circular completo; o emblema sozinho vive em BrandEmblem.tsx.
 */
interface BrandSealProps {
  className?: string
  /** Título acessível no idioma corrente — sempre "Alma y Aroma". */
  title?: string
  /** Mostra wordmark + slogan abaixo do emblema (padrão do selo completo). */
  showLettering?: boolean
}

export function BrandSeal({
  className = '',
  title = 'Alma y Aroma',
  showLettering = true,
}: BrandSealProps) {
  return (
    <svg
      viewBox={showLettering ? '0 0 120 150' : '0 0 120 124'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={className}
    >
      <title>{title}</title>
      <defs>
        <linearGradient
          id="aya-seal-gold"
          x1="0"
          y1="26"
          x2="120"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#E2CE9F" />
          <stop offset="0.5" stopColor="#B49A67" />
          <stop offset="1" stopColor="#8A6F3E" />
        </linearGradient>
        <linearGradient
          id="aya-seal-ivory"
          x1="8"
          y1="102"
          x2="112"
          y2="118"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#D8C9AE" />
          <stop offset="0.45" stopColor="#F7F1E4" />
          <stop offset="1" stopColor="#B9A67E" />
        </linearGradient>
      </defs>

      {/* Emblema canônico da marca (compartilhado com header/favicon).
          Centro em 60,64 · raio do círculo fino 40 · chama até y=16. */}
      <g transform="translate(0 -2)">
        <g transform="translate(8.5714 0) scale(0.57143)">
          <circle
            cx="48"
            cy="53"
            r="45"
            fill="none"
            stroke="url(#aya-seal-gold)"
            strokeWidth="3"
            strokeDasharray="249 38"
            strokeDashoffset="-19"
            transform="rotate(46 48 53)"
            strokeLinecap="round"
          />
          <path
            d="M48 88 C42 70 40 54 42.5 40 C45 26 46.8 18 48 10 C49.2 18 51 26 53.5 40 C56 54 54 70 48 88 Z"
            fill="url(#aya-seal-gold)"
            opacity="0.28"
          />
          <path
            d="M48 88 C43 70 41 54 43.5 40 C45.8 26.5 46.9 18.5 48 10"
            fill="none"
            stroke="url(#aya-seal-gold)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M48 88 C53.5 70 55.5 54 53 40 C50.8 26.5 49.1 18.5 48 10"
            fill="none"
            stroke="url(#aya-seal-gold)"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M48 88 C39 87 31 82.5 26.5 76.5 C34 78 41.5 82 48 88 Z"
            fill="url(#aya-seal-gold)"
          />
          <path
            d="M48 88 C57 87 65 82.5 69.5 76.5 C62 78 54.5 82 48 88 Z"
            fill="url(#aya-seal-gold)"
            opacity="0.85"
          />
        </g>
      </g>

      {showLettering && (
        <>
          {/* Wordmark marfim com leve gradiente, serifado e espaçado */}
          <text
            x="60"
            y="110"
            textAnchor="middle"
            fill="url(#aya-seal-ivory)"
            fontFamily="Cormorant Garamond, Georgia, serif"
            fontSize="12"
            fontWeight="500"
            letterSpacing="2.2"
          >
            ALMA Y AROMA
          </text>

          {/* Slogan dourado entre dois filetes horizontais curtos */}
          <line x1="10" y1="121" x2="26" y2="121" stroke="url(#aya-seal-gold)" strokeWidth="1.6" />
          <line x1="94" y1="121" x2="110" y2="121" stroke="url(#aya-seal-gold)" strokeWidth="1.6" />
          <text
            x="60"
            y="124.5"
            textAnchor="middle"
            fill="url(#aya-seal-gold)"
            fontFamily="Jost, system-ui, sans-serif"
            fontSize="6"
            fontWeight="600"
            letterSpacing="1.1"
          >
            ESSÊNCIAS QUE DESPERTAM SENTIDOS.
          </text>
        </>
      )}
    </svg>
  )
}
