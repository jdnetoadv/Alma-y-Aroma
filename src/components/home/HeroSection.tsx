import { Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLocale } from '@/i18n/LocaleContext'
import bannerImg from '@/assets/banner-spa-luxuoso-alma-y-aroma-f5890.png'

export function HeroSection() {
  const { t, locale } = useLocale()

  // Banner oficial da boutique (fotografia de ambiente quente: difusor, vela,
  // Buda dourado e lavanda sobre fundo vinho). A arte JÁ contém emblema,
  // wordmark, slogan e a linha de categorias — o overlay HTML fica reduzido
  // ao essencial (badge + CTAs discretos) para não duplicar texto.
  // Desktop usa a arte inteira; no mobile o crop vertical foca o lado direito
  // (emblema/slogan) via object-position, com overlay reforçado na base.
  const heroImageAlt =
    locale === 'pt-br'
      ? 'Banner Alma y Aroma: difusor de varetas, vela acesa, estátua de Buda dourada e lavanda sobre ambiente vinho, com o emblema dourado da marca e o slogan “Essências que despertam sentidos.”'
      : locale === 'es'
        ? 'Banner de Alma y Aroma: difusor de varillas, vela encendida, Buda dorado y lavanda en un ambiente vino, con el emblema dorado de la marca y el eslogan “Essências que despertam sentidos.”'
        : 'Alma y Aroma banner: reed diffuser, lit candle, golden Buddha statue and lavender in a warm wine setting, with the brand’s golden emblem and the tagline “Essências que despertam sentidos.”'

  return (
    <section
      id="hero"
      aria-label="ALMA Y AROMA"
      className="relative flex flex-col overflow-hidden bg-wine-deep text-cream"
    >
      {/* Banner fotográfico (16:9 em desktop; crop vertical elegante no mobile,
          focado no emblema/slogan à direita da arte) */}
      <div className="relative w-full min-h-[78vh] sm:min-h-[88vh] lg:min-h-screen">
        <img
          src={bannerImg}
          alt={heroImageAlt}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-[68%_center] sm:object-center animate-breath will-change-transform"
        />

        {/* Overlay vinho sutil: garante contraste dos CTAs sem apagar a arte */}
        <div className="absolute inset-0 bg-gradient-to-t from-wine-deep/85 via-wine-deep/25 to-wine-deep/40 sm:from-wine-deep/70 sm:via-transparent sm:to-wine-deep/30" />

        {/* CTAs discretos na base do banner (o texto de marca vive na imagem) */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-14 sm:pb-16">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold/40 bg-wine-deep/55 backdrop-blur-sm text-gold-light animate-fade-in">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-sans text-[11px] uppercase tracking-[0.2em] font-medium">
                {t('hero.badge')}
              </span>
            </div>

            {/* Título acessível (o wordmark/slogan visível vivem na arte) */}
            <h1 className="sr-only">{t('hero.title')}</h1>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up">
              <Link
                to={`/${locale}/loja`}
                className="group relative inline-flex items-center justify-center px-8 py-3.5 rounded-sm bg-gold hover:bg-gold-hover text-wine-deep font-sans text-xs uppercase tracking-[0.16em] font-semibold transition-all duration-300 shadow-elevation hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gold-light focus:ring-offset-2 focus:ring-offset-wine-deep"
              >
                <span>{t('hero.cta')}</span>
                <span className="ml-2 w-1.5 h-1.5 rounded-full bg-wine-deep/70 group-hover:scale-125 transition-transform" />
              </Link>
              <Link
                to={`/${locale}/sensacoes`}
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-sm border border-gold/50 bg-wine-deep/40 backdrop-blur-sm text-cream hover:bg-wine-deep/60 hover:border-gold font-sans text-xs uppercase tracking-[0.16em] font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold/60 focus:ring-offset-2 focus:ring-offset-wine-deep"
              >
                {t('hero.ctaSecondary')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Faixa inferior vinho: repete a linha de categorias como texto real
          (traduzida nos 3 idiomas; na imagem ela é parte da arte) */}
      <div className="relative bg-wine-deep border-t border-gold/25">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:py-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
          <p className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.22em] text-gold-light">
            {t('hero.categories')}
          </p>
          <span className="hidden sm:inline text-gold/50" aria-hidden>
            •
          </span>
          <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-cream/60">
            {t('hero.scroll')}
          </span>
        </div>
      </div>
    </section>
  )
}
