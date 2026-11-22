import React from 'react'
import { Link } from 'react-router-dom'
import { BrandEmblem } from '@/components/brand/BrandEmblem'
import { useLocale } from '@/i18n/LocaleContext'

interface LogoProps {
  variant?: 'light' | 'dark'
  className?: string
  showTagline?: boolean
}

/**
 * Logomarca ALMA Y AROMA — identidade NOVA enviada pela cliente (PNGs de
 * referência): emblema de chama/folha em gradiente dourado dentro de círculo
 * fino aberto no topo + wordmark "ALMA Y AROMA" em serifadas marfim/creme com
 * letter-spacing largo. Renderizada como SVG vetorial com fundo transparente
 * (a referência PNG tem fundo preto opaco, não aproveitável no topbar marfim).
 * O mesmo emblema canônico é usado no rodapé, favicon, conta e checkout.
 */
export function Logo({ variant = 'dark', className = '', showTagline = false }: LogoProps) {
  const { locale, t } = useLocale()
  const isLight = variant === 'light'

  return (
    <Link
      to={`/${locale}/#hero`}
      onClick={(e) => {
        // If already on the page, smooth scroll to top
        if (window.location.pathname.startsWith(`/${locale}`)) {
          e.preventDefault()
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }}
      className={`group flex items-center gap-3 select-none outline-none ${className}`}
      aria-label="Alma y Aroma"
    >
      {/* Emblema da nova identidade (chama/folha + círculo dourado aberto) */}
      <BrandEmblem className="w-8 h-9 flex-shrink-0" />

      <div className="flex flex-col">
        <span
          className={`font-serif tracking-[0.28em] text-base md:text-lg uppercase font-medium leading-none transition-colors duration-300 ${
            isLight
              ? 'text-cream group-hover:text-gold-light'
              : 'text-espresso group-hover:text-gold'
          }`}
        >
          ALMA Y AROMA
        </span>
        {showTagline && (
          <span
            className={`font-sans text-[10px] tracking-[0.2em] uppercase mt-1 transition-colors duration-300 ${
              isLight ? 'text-gold/90' : 'text-espresso/60'
            }`}
          >
            {t('footer.tagline')}
          </span>
        )}
      </div>
    </Link>
  )
}
