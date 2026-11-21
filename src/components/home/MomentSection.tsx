import React from 'react'
import { useLocale } from '@/i18n/LocaleContext'

export function MomentSection() {
  const { t } = useLocale()

  return (
    <section
      aria-label="Um Momento para Você"
      className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden bg-wine text-cream"
    >
      {/* Contemplative background image with subtle parallax-lite look */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed transform duration-1000 scale-105"
        style={{
          backgroundImage:
            "url('https://img.usecurling.com/p/1920/1080?q=meditation%20candle%20smoke%20linen%20dark&color=black')",
        }}
      />

      {/* Atmospheric scrim */}
      <div className="absolute inset-0 bg-wine-deep/70 backdrop-blur-[1px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-wine-deep via-transparent to-wine/60" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-8 text-center py-20">
        <span className="font-serif italic text-gold text-xs sm:text-sm uppercase tracking-[0.24em] mb-4 block">
          {t('moment.title')}
        </span>

        {/* Verbatim quote */}
        <blockquote className="font-serif italic text-2xl sm:text-4xl md:text-5xl font-light text-cream leading-[1.3] mb-6">
          "{t('moment.phrase')}"
        </blockquote>

        <div className="w-16 h-px bg-gold/70 mx-auto mb-6" />

        <p className="font-sans text-xs sm:text-sm text-cream/75 max-w-lg mx-auto font-light leading-relaxed">
          {t('moment.subphrase')}
        </p>
      </div>
    </section>
  )
}
