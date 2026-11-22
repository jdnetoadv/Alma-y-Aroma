/**
 * Selo da marca com a LOGO OFICIAL da cliente — o PNG oficial transparente
 * ("Logotipo Dourado Alma y Aroma": chama atravessando o círculo aberto,
 * folhas na base e wordmark serifado), importado como ativo estático.
 * Sobre o rodapé vinho/escuro o dourado fica em destaque, sem bloco preto
 * visível.
 *
 * Usado no rodapé, conta/checkout e qualquer ponto que precise do selo
 * completo; o emblema sozinho vive em BrandEmblem.tsx.
 */
import { BRAND_LOGO_SRC } from '@/components/brand/BrandEmblem'

interface BrandSealProps {
  className?: string
  /** Título acessível no idioma corrente — sempre "Alma y Aroma". */
  title?: string
  /** Sem efeito: a arte oficial já traz o wordmark gravado. */
  showLettering?: boolean
}

export function BrandSeal({ className = '', title = 'Alma y Aroma' }: BrandSealProps) {
  return (
    <div role="img" aria-label={title} className={`flex flex-col items-center ${className}`}>
      {/* Arte oficial da cliente (PNG transparente: emblema + wordmark) */}
      <img
        src={BRAND_LOGO_SRC}
        alt=""
        draggable={false}
        className="w-28 object-contain drop-shadow-[0_2px_18px_rgba(180,154,103,0.45)]"
      />
    </div>
  )
}
