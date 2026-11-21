import React from 'react'
import { Link } from 'react-router-dom'
import { useLocale } from '@/i18n/LocaleContext'

interface LogoProps {
  variant?: 'light' | 'dark'
  className?: string
  showTagline?: boolean
}

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
      aria-label="ALMA Y AROMA — Página Inicial"
    >
      {/* Símbolo sutil de fumaça / luz com transição e drift suave no hover */}
      <div className="relative w-7 h-9 flex items-center justify-center flex-shrink-0">
        <svg
          viewBox="0 0 32 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-gold transform transition-transform duration-700 ease-out group-hover:-translate-y-1"
          aria-hidden="true"
        >
          {/* Base candle / incense glow base */}
          <circle cx="16" cy="35" r="1.5" fill="currentColor" opacity="0.8" />

          {/* Main smoke wisp ascending */}
          <path
            d="M16 33C16 33 13 27 14 21C15 15 20 13 18 7C17 4.5 15.5 3 15 2"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            className="transition-all duration-700 ease-in-out group-hover:stroke-gold-light"
          />
          {/* Secondary smoke wisp */}
          <path
            d="M16.5 30C16.5 30 18.5 24 17.5 19C16.5 14 13.5 11 15 5"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.65"
            className="transition-all duration-700 ease-in-out group-hover:stroke-gold"
          />
          {/* Delicate third curve */}
          <path
            d="M15 25C15 25 13 22 13 17C13 13 15.5 10.5 16 8"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity="0.4"
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
