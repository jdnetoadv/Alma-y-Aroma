import { Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLocale } from '@/i18n/LocaleContext'

export function HeroSection() {
  const { t, locale } = useLocale()

  // Curated imagery: contemplative Buddhist temple gate nestled in the forest —
  // weathered wood, deep greens, autumn-orange foliage and soft natural light.
  // Served warm-cacheable from the image CDN, responsive via srcset
  // (1920w desktop, 960w mobile) to keep the hero fast on every device.
  const heroImageAlt = ''
  const heroImageSrc =
    'https://img.usecurling.com/p/1920/1080?q=temple%20wooden%20gate%20autumn%20forest'
  const heroImageMobileSrc =
    'https://img.usecurling.com/p/960/1080?q=temple%20wooden%20gate%20autumn%20forest'

  return (
    <section
      id="hero"
      aria-label="Apresentação ALMA Y AROMA"
      className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-wine text-cream"
    >
      {/* Background Media with Respiração subtle breathing animation */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Photographic temple-in-the-forest backdrop (static image, no video) */}
        <div className="absolute inset-0 animate-breath will-change-transform">
          <img
            src={heroImageSrc}
            srcSet={`${heroImageMobileSrc} 960w, ${heroImageSrc} 1920w`}
            sizes="100vw"
            alt={heroImageAlt}
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Cinematic Scrim: deep wine gradient from top and bottom, plus a soft
            dark wash, keeps cream text at WCAG AA contrast over the forest tones
            on every language and on mobile */}
        <div className="absolute inset-0 bg-gradient-to-t from-wine-deep via-wine-deep/60 to-wine-deep/35" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(59,23,21,0.78)_100%)]" />
      </div>

      {/* Hero Content Overlay */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 text-center pt-24 sm:pt-28 pb-20">
        {/* Subtle decorative badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold/40 bg-wine-deep/50 backdrop-blur-sm text-gold-light mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-sans text-[11px] uppercase tracking-[0.2em] font-medium">
            Boutique Virtual de Bem-Estar
          </span>
        </div>

        {/* Main Hero Title (verbatim) */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-cream leading-[1.12] mb-6 animate-fade-in-up">
          {t('hero.title')}
        </h1>

        {/* Subtitle (verbatim) */}
        <p className="font-sans text-sm sm:text-base md:text-lg text-cream/85 max-w-2xl mx-auto font-light leading-relaxed mb-10 animate-fade-in-up delay-100">
          {t('hero.subtitle')}
        </p>

        {/* Primary CTA — abre a loja (catálogo demonstrativo) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
          <Link
            to={`/${locale}/loja`}
            className="group relative inline-flex items-center justify-center px-8 py-3.5 rounded-sm bg-saffron hover:bg-saffron-light text-wine-deep font-sans text-xs uppercase tracking-[0.16em] font-semibold transition-all duration-300 shadow-elevation hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-saffron focus:ring-offset-2 focus:ring-offset-wine-deep"
          >
            <span>{t('hero.cta')}</span>
            <span className="ml-2 w-1.5 h-1.5 rounded-full bg-wine-deep/70 group-hover:scale-125 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Delicate Scroll Down Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream/60 pointer-events-none animate-pulse">
        <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-cream/50">
          {t('hero.scroll')}
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-gold/60 to-transparent" />
      </div>
    </section>
  )
}
