import React from 'react'
import { Link } from 'react-router-dom'
import { useLocale } from '@/i18n/LocaleContext'

interface LogoProps {
  variant?: 'light' | 'dark'
  className?: string
  showTagline?: boolean
}

/**
 * Logomarca ALMA Y AROMA (imagem 3 do plano de branding) — emblema dourado de
 * chama/folha dentro de círculo + tipografia serifada em tom vinho. Renderizada
 * como SVG inline com fundo transparente, legível sobre marfim e sobre escuro.
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
      {/* Emblema dourado de chama/folha dentro de círculo (da logomarca entregue) */}
      <div className="relative w-7 h-9 flex items-center justify-center flex-shrink-0">
        <svg
          viewBox="0 0 32 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transform transition-transform duration-700 ease-out group-hover:-translate-y-1"
          aria-hidden="true"
        >
          {/* Círculo dourado */}
          <circle
            cx="16"
            cy="20"
            r="15"
            stroke="currentColor"
            strokeWidth="1.2"
            className="text-gold"
          />
          {/* Chama/folha central */}
          <path
            d="M16 30.5C14.4 25.8 13.6 21.6 14.3 17.4C15 13.2 16.6 10.4 17 8.2"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            className="text-gold transition-all duration-700 ease-in-out group-hover:stroke-gold-light"
          />
          <path
            d="M16.8 30.5C18.6 25.8 19.4 21.6 18.7 17.4C18 13.2 16.9 10.4 17 8.2"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
            opacity="0.75"
            className="text-gold-light transition-all duration-700 ease-in-out group-hover:stroke-gold"
          />
          {/* Folhas laterais */}
          <path
            d="M16 30.5C12.8 30.2 10.2 28.6 8.7 26.6C11.4 27.2 14 28.5 16 30.5Z"
            fill="currentColor"
            opacity="0.85"
            className="text-gold"
          />
          <path
            d="M16 30.5C19.2 30.2 21.8 28.6 23.3 26.6C20.6 27.2 18 28.5 16 30.5Z"
            fill="currentColor"
            opacity="0.65"
            className="text-gold-light"
          />
        </svg>
      </div>

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
              isLight ? 'text-cream/60' : 'text-espresso/60'
            }`}
          >
            {t('footer.tagline')}
          </span>
        )}
      </div>
    </Link>
  )
}
