/**
 * Selo circular da marca — fidelidade às artes de referência da cliente
 * (fundo transparente, sem o quadro preto das referências):
 *   • Círculo FINO dourado ABERTO no topo (atravessado pela chama);
 *   • Chama/folha VAZADA de duas curvas finas em gradiente de ouro
 *     envelhecido (#B49A67 → claro), com ponta ascendente e duas folhas
 *     na base apontando para baixo;
 *   • Tipografia "ALMA Y AROMA" em serifadas com leve gradiente marfim
 *     e letter-spacing largo;
 *   • Slogan "ESSÊNCIAS QUE DESPERTAM SENTIDOS." em dourado, caixa alta,
 *     entre dois traços horizontais curtos de cada lado.
 * O slogan usa textLength fixo, então nunca mais transborda nem fica
 * sobreposto/riscado por outra linha, em nenhuma largura de renderização.
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

      {/* Emblema canônico da marca (formas idênticas a BrandEmblem.tsx):
          círculo fino aberto no topo + chama vazada + folhas na base. */}
      <g transform="translate(9.6 10)">
        <g transform="scale(0.848)">
          <path
            d="M48 14.55 A40 40 0 1 0 82.14 24.55"
            fill="none"
            stroke="url(#aya-seal-gold)"
            strokeWidth="3.54"
            strokeLinecap="round"
          />
          <path
            d="M54.5 80 C47 66 42 48 42.5 36 C42.8 29 44.5 19.5 48 12"
            fill="none"
            stroke="url(#aya-seal-gold)"
            strokeWidth="3.54"
            strokeLinecap="round"
          />
          <path
            d="M41.5 80 C49 66 54 48 53.5 36 C53.2 29 51.5 19.5 48 12"
            fill="none"
            stroke="url(#aya-seal-gold)"
            strokeWidth="3.54"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M48 84 C45 84 41.5 82.5 39.5 80 C42.5 79.5 45.5 80.5 48 84 Z"
            fill="url(#aya-seal-gold)"
          />
          <path
            d="M48 84 C51 84 54.5 82.5 56.5 80 C53.5 79.5 50.5 80.5 48 84 Z"
            fill="url(#aya-seal-gold)"
            opacity="0.85"
          />
        </g>
      </g>

      {showLettering && (
        <>
          {/* Wordmark marfim com leve gradiente, serifado e espaçado.
              textLength fixo: nunca transborda, nunca se sobrepõe. */}
          <text
            x="60"
            y="110"
            textAnchor="middle"
            fill="url(#aya-seal-ivory)"
            fontFamily="Cormorant Garamond, Georgia, serif"
            fontSize="12"
            fontWeight="500"
            letterSpacing="2.2"
            textLength="100"
            lengthAdjust="spacing"
          >
            ALMA Y AROMA
          </text>

          {/* Slogan dourado entre dois filetes horizontais curtos, encaixado
              EXATAMENTE entre eles (textLength fixo, sem sobreposição). */}
          <line x1="4" y1="121" x2="19" y2="121" stroke="url(#aya-seal-gold)" strokeWidth="1.6" />
          <line
            x1="101"
            y1="121"
            x2="116"
            y2="121"
            stroke="url(#aya-seal-gold)"
            strokeWidth="1.6"
          />
          <text
            x="60"
            y="123.8"
            textAnchor="middle"
            fill="url(#aya-seal-gold)"
            fontFamily="Jost, system-ui, sans-serif"
            fontSize="6"
            fontWeight="600"
            letterSpacing="0.4"
            textLength="76"
            lengthAdjust="spacing"
          >
            ESSÊNCIAS QUE DESPERTAM SENTIDOS.
          </text>
        </>
      )}
    </svg>
  )
}
