import { Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLocale } from '@/i18n/LocaleContext'
import { BrandSeal } from '@/components/common/BrandSeal'
import bannerArt from '@/assets/banner-spa-luxuoso-alma-y-aroma-f5890.png'

/**
 * Hero da homepage: a fotografia do banner (vinho profundo, difusor, vela,
 * Buda e lavanda) como camada de fundo — mas com overlay vinho forte, leve
 * desfoque e zoom para neutralizar o texto/emblema EMBUTIDO na arte, de modo
 * que o visitante leia apenas o texto HTML traduzido (i18n: pt-BR / es-ES /
 * en-GB) sobreposto à atmosfera fotográfica.
 */
export function HeroSection() {
  const { t, locale } = useLocale()

  return (
    <section
      id="hero"
      aria-label="ALMA Y AROMA"
      className="relative flex flex-col overflow-hidden bg-wine-deep text-cream"
    >
      {/* Fundo do hero: a fotografia do banner, ampliada e deslocada para
          enquadrar a área da foto (difusor/vela/Buda) e tirar a faixa central
          de texto embutido do enquadramento; leve desfoque e overlay vinho
          escuro completam a neutralização. Camadas de halo âmbar + gradiente
          por cima mantêm o clima atual. A camada com animate-breath respira a
          20s, respeitando prefers-reduced-motion (regra já em main.css). */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover scale-110 blur-[2px]"
        style={{ backgroundImage: `url(${bannerArt})`, backgroundPosition: '52% 38%' }}
      />
      <div aria-hidden className="absolute inset-0 bg-wine-deep/85" />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-[#3E1A1D]/80 via-wine-deep/60 to-[#2B1113]/90"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_38%,rgba(208,120,50,0.2),transparent_70%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(45%_35%_at_50%_30%,rgba(199,177,131,0.1),transparent_75%)] animate-breath will-change-transform"
      />
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
      />

      {/* Conteúdo centralizado (vertical e horizontalmente) */}
      <div className="relative z-10 flex-1 flex items-center justify-center min-h-[78vh] sm:min-h-[88vh] lg:min-h-screen px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl w-full text-center">
          {/* Selo da marca: disco vinho com anéis dourados + chama */}
          <BrandSeal className="mx-auto h-24 w-24 sm:h-32 sm:w-32 lg:h-36 lg:w-36 animate-fade-in drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]" />

          {/* Badge da nova boutique */}
          <div className="mt-7 sm:mt-9 mb-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold/40 bg-wine-deep/55 backdrop-blur-sm text-gold-light animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-sans text-[11px] uppercase tracking-[0.2em] font-medium">
              {t('hero.badge')}
            </span>
          </div>

          {/* Slogan principal (traduzido; era parte da arte do banner) */}
          <h1 className="font-serif text-cream text-3xl sm:text-5xl lg:text-6xl leading-tight tracking-wide animate-fade-in-up">
            {t('hero.slogan')}
          </h1>

          {/* Linha de apoio */}
          <p className="mt-5 sm:mt-6 max-w-2xl mx-auto font-sans text-sm sm:text-base text-cream/80 leading-relaxed animate-fade-in-up">
            {t('hero.subtitle')}
          </p>

          {/* CTAs */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up">
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

      {/* Faixa inferior vinho: linha de categorias como texto real (traduzida) */}
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
