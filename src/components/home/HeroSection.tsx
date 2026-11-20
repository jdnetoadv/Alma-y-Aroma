import React, { useState } from 'react'
import { ChevronDown, Sparkles } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'

export function HeroSection() {
  const { t } = useLocale()
  const [videoLoaded, setVideoLoaded] = useState(false)

  const handleCtaClick = () => {
    const el = document.getElementById('colecoes')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Curated imagery: ethereal incense smoke rising against dark organic texture, warm candle glow
  // Poster: serene high-res contemplative incense & candle still from Unsplash
  // Looping MP4 ambient video from Pexels (licensed for commercial use, CC0 equivalent)
  const posterUrl = 'https://img.usecurling.com/p/1920/1080?q=incense%20smoke%20candle&color=black'
  const videoSrc =
    'https://assets.mixkit.co/videos/preview/mixkit-smoke-from-an-incense-stick-42672-large.mp4'

  return (
    <section
      id="hero"
      aria-label="Apresentação ALMA Y AROMA"
      className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-graphite text-ivory"
    >
      {/* Background Media with Respiração subtle breathing animation */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Still poster image as instant background */}
        <div
          className="absolute inset-0 bg-cover bg-center animate-breath transition-opacity duration-1000"
          style={{
            backgroundImage: `url('${posterUrl}')`,
            opacity: videoLoaded ? 0.35 : 0.85,
          }}
        />

        {/* Ambient video background (subtle smoke loop) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={posterUrl}
          onCanPlayThrough={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover animate-breath transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-40' : 'opacity-0'
          }`}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* Cinematic Scrim: Graphite gradient fading from top and bottom for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-graphite via-graphite/60 to-graphite/40" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-graphite/70" />
      </div>

      {/* Hero Content Overlay */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 text-center pt-24 sm:pt-28 pb-20">
        {/* Subtle decorative smoke wisp badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold/40 bg-graphite/50 backdrop-blur-sm text-gold-light mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-sans text-[11px] uppercase tracking-[0.2em] font-medium">
            Boutique Virtual de Bem-Estar
          </span>
        </div>

        {/* Main Hero Title (verbatim) */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-ivory leading-[1.12] mb-6 animate-fade-in-up">
          {t('hero.title')}
        </h1>

        {/* Subtitle (verbatim) */}
        <p className="font-sans text-sm sm:text-base md:text-lg text-ivory/80 max-w-2xl mx-auto font-light leading-relaxed mb-10 animate-fade-in-up delay-100">
          {t('hero.subtitle')}
        </p>

        {/* Primary CTA (verbatim) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
          <button
            type="button"
            onClick={handleCtaClick}
            className="group relative inline-flex items-center justify-center px-8 py-3.5 rounded-sm bg-gold hover:bg-gold-light text-graphite font-sans text-xs uppercase tracking-[0.16em] font-semibold transition-all duration-300 shadow-elevation hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-graphite"
          >
            <span>{t('hero.cta')}</span>
            <span className="ml-2 w-1.5 h-1.5 rounded-full bg-graphite/70 group-hover:scale-125 transition-transform" />
          </button>
        </div>
      </div>

      {/* Delicate Scroll Down Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ivory/60 pointer-events-none animate-pulse">
        <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-ivory/50">
          {t('hero.scroll')}
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-gold/60 to-transparent" />
      </div>
    </section>
  )
}
