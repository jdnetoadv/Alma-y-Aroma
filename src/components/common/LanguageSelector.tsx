import React, { useState, useRef, useEffect } from 'react'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import { Locale, LOCALES } from '@/i18n/types'

interface LanguageSelectorProps {
  variant?: 'light' | 'dark'
  align?: 'left' | 'right'
  className?: string
}

export function LanguageSelector({
  variant = 'dark',
  align = 'right',
  className = '',
}: LanguageSelectorProps) {
  const { locale, setLocale } = useLocale()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const isLight = variant === 'light'
  const current = LOCALES[locale]

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Idioma atual: ${current.label}`}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-sans font-medium transition-all focus:outline-none focus:ring-2 focus:ring-gold/60 ${
          isLight
            ? 'border-ivory/30 bg-olive/40 text-ivory hover:border-gold hover:bg-olive/60'
            : 'border-sand/70 bg-ivory/80 backdrop-blur-sm text-graphite hover:border-gold hover:text-gold'
        }`}
      >
        <span className="text-sm leading-none" aria-hidden="true">
          {current.flag}
        </span>
        <span className="hidden sm:inline uppercase text-[11px] tracking-wider">
          {current.code === 'pt-br' ? 'PT' : current.code === 'es' ? 'ES' : 'EN'}
        </span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${
            isLight ? 'text-ivory/70' : 'text-graphite/60'
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Selecionar idioma"
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } mt-2 w-48 rounded-md bg-ivory shadow-elevation border border-sand py-1.5 z-50 animate-fade-in-down`}
        >
          {(Object.keys(LOCALES) as Locale[]).map((key) => {
            const item = LOCALES[key]
            const isSelected = key === locale
            return (
              <button
                key={key}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  setLocale(key)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-left text-xs transition-colors ${
                  isSelected
                    ? 'bg-sand/40 text-olive-deep font-semibold'
                    : 'text-graphite hover:bg-sand/20 hover:text-gold'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-base leading-none">{item.flag}</span>
                  <span className="font-sans">{item.label}</span>
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 text-gold flex-shrink-0" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
