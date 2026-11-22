/**
 * Selo da marca com a LOGO OFICIAL da cliente — emblema dourado (chama
 * atravessando o círculo aberto, folhas na base) sobre fundo transparente,
 * com wordmark e slogan em texto real abaixo (mesma tipografia do SVG
 * anterior, agora sobre a arte oficial processada).
 *
 * O fundo preto do PNG oficial foi removido por chave de luminância no
 * pipeline de build — sobre o rodapé vinho/escuro o glow dourado fica
 * bonito, sem bloco preto visível.
 *
 * Usado no rodapé, conta/checkout e qualquer ponto que precise do selo
 * completo; o emblema sozinho vive em BrandEmblem.tsx.
 */
import { BRAND_EMBLEM_SRC } from '@/components/brand/BrandEmblem'

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
    <div role="img" aria-label={title} className={`flex flex-col items-center ${className}`}>
      {/* Emblema oficial da cliente (arte PNG processada, fundo transparente) */}
      <img
        src={BRAND_EMBLEM_SRC}
        alt=""
        draggable={false}
        className="w-24 h-24 object-contain drop-shadow-[0_2px_18px_rgba(180,154,103,0.45)]"
      />

      {showLettering && (
        <div className="flex flex-col items-center mt-2">
          {/* Wordmark marfim com leve gradiente, serifado e espaçado */}
          <span
            className="font-serif uppercase text-lg leading-none bg-clip-text text-transparent bg-gradient-to-r from-[#B9A67E] via-[#F7F1E4] to-[#B9A67E]"
            style={{ letterSpacing: '0.18em' }}
          >
            ALMA Y AROMA
          </span>

          {/* Slogan dourado entre dois filetes horizontais curtos, encaixado
              EXATAMENTE entre eles */}
          <span className="flex items-center gap-2 mt-1.5">
            <span className="h-px w-6 bg-gold" aria-hidden />
            <span className="font-sans text-[9px] font-semibold uppercase tracking-[0.12em] text-gold whitespace-nowrap">
              ESSÊNCIAS QUE DESPERTAM SENTIDOS.
            </span>
            <span className="h-px w-6 bg-gold" aria-hidden />
          </span>
        </div>
      )}
    </div>
  )
}
