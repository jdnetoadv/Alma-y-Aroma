import React from 'react'
import { Sparkles } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'

export function EssenceSection() {
  const { t } = useLocale()

  return (
    <section
      id="essencia"
      aria-label="Nossa Essência"
      className="py-24 sm:py-32 bg-sand/35 text-graphite relative overflow-hidden border-y border-sand/60"
    >
      {/* Subtle organic background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sand/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Contemplative Image Column (5 cols on desktop) */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
              {/* Outer decorative gold/sand frame */}
              <div className="absolute -inset-2.5 rounded-sm border border-gold/40 transform -rotate-1 hidden sm:block pointer-events-none" />

              <div className="relative rounded-sm overflow-hidden aspect-[4/5] bg-sand shadow-elevation">
                <img
                  src="https://img.usecurling.com/p/800/1000?q=candle%20ceramic%20table%20tea&color=white"
                  alt="Atmosfera de contemplação da Alma y Aroma"
                  loading="lazy"
                  className="w-full h-full object-cover transform duration-1000 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-graphite/40 via-transparent to-transparent" />
              </div>

              {/* Floating quote pill */}
              <div className="absolute -bottom-4 right-4 sm:-bottom-5 sm:-right-4 bg-ivory/95 backdrop-blur-md px-4 py-2.5 rounded-sm border border-sand shadow-subtle max-w-[200px]">
                <p className="font-serif italic text-xs text-graphite/90 leading-tight">
                  "O bem-estar mora nos detalhes."
                </p>
              </div>
            </div>
          </div>

          {/* Editorial Text Column (7 cols on desktop) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ivory/80 border border-sand text-gold">
              <Sparkles className="w-3 h-3" />
              <span className="font-sans text-[11px] uppercase tracking-[0.2em] font-medium text-graphite/80">
                {t('essence.badge')}
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-graphite leading-[1.15]">
              {t('essence.title')}
            </h2>

            <div className="w-16 h-px bg-gold" />

            {/* Verbatim manifesto text */}
            <div className="space-y-5 text-graphite/90 font-sans text-sm sm:text-base leading-relaxed">
              <p className="font-serif italic text-base sm:text-lg text-olive-deep leading-relaxed pl-4 border-l-2 border-gold/60">
                {t('essence.p1')}
              </p>
              <p className="font-normal text-graphite/80 pt-1">{t('essence.p2')}</p>
            </div>

            {/* Brand pillars */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-sand/70 text-center">
              <div>
                <span className="block font-serif text-xl sm:text-2xl text-olive-deep font-normal">
                  100%
                </span>
                <span className="font-sans text-[11px] uppercase tracking-wider text-graphite/60">
                  Vegetal & Puro
                </span>
              </div>
              <div>
                <span className="block font-serif text-xl sm:text-2xl text-olive-deep font-normal">
                  Origem
                </span>
                <span className="font-sans text-[11px] uppercase tracking-wider text-graphite/60">
                  Massala Nobre
                </span>
              </div>
              <div>
                <span className="block font-serif text-xl sm:text-2xl text-olive-deep font-normal">
                  Rituais
                </span>
                <span className="font-sans text-[11px] uppercase tracking-wider text-graphite/60">
                  Conexão Interior
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
