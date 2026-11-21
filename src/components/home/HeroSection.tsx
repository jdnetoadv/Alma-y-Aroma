import { Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLocale } from '@/i18n/LocaleContext'
import heroBanner from '@/assets/difusor-alma-y-aroma-ao-entardecer-e7ed7.png'

/**
 * Hero da homepage: o banner enviado pela usuária (difusor, vela, Buda,
 * lavanda e o emblema/wordmark ALMA Y AROMA já gravados na arte) é a camada
 * de fundo, sem desfoque. Os textos são HTML traduzidos (i18n pt-BR / es-ES /
 * en-GB) sobrepostos à imagem; só o texto muda ao trocar de idioma.
 * A marca (emblema + nome da arte) é centralizada horizontalmente; o conteúdo
 * é ancorado na base para não cobrir o emblema, que fica na parte superior.
 */
export function HeroSection() {
  const { t, locale } = useLocale()

  return (
    <section
      id="hero"
      aria-label="ALMA Y AROMA"
      className="relative flex flex-col overflow-hidden bg-wine-deep text-cream"
    >
      {/* Fundo do hero: o emblema/nome da arte fica em ~60% da largura da
          imagem (a estimativa anterior de 75% deixava a marca à esquerda).
          A camada tem 125% da largura do hero e recua 25%: pela regra de
          background-position percentual, o ponto a 60% da imagem alinha com
          60% da camada, então o emblema cai em -25% + 0,6·125% = 50% — centro
          exato em QUALQUER viewport (desktop e celular), sem media query.
          Zoom de só 1,25x (a tentativa anterior usava 2,2x): difusor/Buda
          permanecem visíveis à esquerda e a vela à direita.
          Ajuste fino: mudar f aqui e recalcular left = 50% - f·width. */}
      <div
        aria-hidden
        className="absolute top-0 bottom-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(${heroBanner})`,
          left: '-25%',
          width: '125%',
          backgroundPosition: '60% center',
        }}
      />
      {/* Escurecimento suave: base e laterais mais fortes para a leitura do
          texto; o centro/topo (emblema) permanece quase intacto. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-[#2B1113]/95 via-[#2B1113]/55 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-[#2B1113]/70 via-transparent to-transparent sm:from-[#2B1113]/50"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_70%,rgba(208,120,50,0.18),transparent_70%)] animate-breath will-change-transform"
      />
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
      />

      {/* Conteúdo centralizado horizontalmente, ancorado à base da composição */}
      <div className="relative z-10 flex-1 flex items-end justify-center min-h-[82vh] sm:min-h-[88vh] lg:min-h-screen px-6 pt-40 pb-16 sm:pb-20">
        <div className="mx-auto max-w-4xl w-full text-center">
          {/* Badge da nova boutique */}
          <div className="mb-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold/40 bg-wine-deep/55 backdrop-blur-sm text-gold-light animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-sans text-[11px] uppercase tracking-[0.2em] font-medium">
              {t('hero.badge')}
            </span>
          </div>

          {/* Slogan principal (traduzido; não faz parte da arte) */}
          <h1 className="font-serif text-cream text-3xl sm:text-5xl lg:text-6xl leading-tight tracking-wide animate-fade-in-up drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
            {t('hero.slogan')}
          </h1>

          {/* Linha de apoio */}
          <p className="mt-5 sm:mt-6 max-w-2xl mx-auto font-sans text-sm sm:text-base text-cream/85 leading-relaxed animate-fade-in-up">
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
