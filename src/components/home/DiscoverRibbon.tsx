/**
 * Vitrine contínua da homepage — fita horizontal infinita com o catálogo
 * passando sozinho (embaralhado a cada visita), pausa ao passar o mouse e
 * clique levando à página do produto. Miniaturas leves (?thumb=300x300) e
 * estilo da marca: marfim, vinho, dourado, serifadas.
 */
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLocale } from '@/i18n/LocaleContext'
import { shopT } from '@/i18n/shopStrings'
import { catalogRepository } from '@/data/repository'
import { CatalogProduct } from '@/data/types'
import { thumbUrlOr } from '@/lib/shop/thumbnails'
import { formatPrice } from '@/data/repository'

/* ── Ajustes da fita (valores únicos, fáceis de tunar depois) ────────────── */

/** Quantos produtos por ciclo da fita (embaralhados a cada visita). */
const RIBBON_PRODUCT_COUNT = 9

/** Largura do card em px no mobile e ≥640px (imagem usa proporção 4/5). */
const RIBBON_CARD_WIDTH = {
  /** ~45% maior que o antigo w-44 (176px). */
  mobile: 256,
  /** ~45% maior que o antigo w-52 (208px). */
  desktop: 304,
} as const

/** Duração do ciclo de deslize (uma cópia da lista). Mais alto = mais lento. */
const RIBBON_CYCLE_SECONDS = 75

/* ────────────────────────────────────────────────────────────────────────── */

/** Embaralha em cópia (Fisher–Yates) — ordem nova a cada montagem. */
function shuffle<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function DiscoverRibbon() {
  const { locale } = useLocale()
  const t = (key: string) => shopT(locale, key)

  const items = useMemo(() => {
    const all = catalogRepository
      .listProducts()
      .filter((p) => (p as unknown as { status?: string }).status !== 'inactive')
    if (!all.length) return []
    const shuffled = shuffle(all).slice(0, RIBBON_PRODUCT_COUNT)
    // Catálogo curto (< RIBBON_PRODUCT_COUNT): repete a lista embaralhada
    // até completar o ciclo, sem buracos na fita.
    const filled: CatalogProduct[] = [...shuffled]
    while (filled.length < RIBBON_PRODUCT_COUNT) {
      filled.push(...shuffle(shuffled))
    }
    return filled
  }, [])

  // A fita renderiza duas cópias da mesma sequência: a animação desloca
  // exatamente -50%, então ao terminar o ciclo a cópia 2 ocupa o lugar da 1
  // e o loop recomeça sem emenda visível.
  const loop = useMemo(() => [...items, ...items], [items])

  if (!items.length) return null

  return (
    <section
      aria-label={t('shop.ribbon.discover.title')}
      className="group/ribbon overflow-hidden bg-cream py-14 sm:py-16"
    >
      <div className="mb-10 px-4 sm:px-6 lg:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">{t('shop.ribbon.eyebrow')}</p>
        <h2 className="mt-2 font-serif text-2xl text-espresso sm:text-3xl">
          {t('shop.ribbon.discover.title')}
        </h2>
        <p className="mt-1 text-xs text-espresso/70 sm:text-sm">{t('shop.ribbon.subtitle')}</p>
      </div>

      {/* Valores das constantes chegam ao CSS via variáveis customizadas —
          única fonte de verdade para largura dos cards e duração do ciclo. */}
      <div
        className="ribbon-track flex w-max gap-5 px-4 sm:gap-8"
        style={{
          animationDuration: `${RIBBON_CYCLE_SECONDS}s`,
          ['--ribbon-card-w' as string]: `${RIBBON_CARD_WIDTH.mobile}px`,
          ['--ribbon-card-w-sm' as string]: `${RIBBON_CARD_WIDTH.desktop}px`,
        }}
      >
        {loop.map((product, i) => (
          <Link
            key={`${product.id}-${i}`}
            to={`/${locale}/produto/${product.slug}`}
            aria-label={product.name[locale]}
            className="ribbon-card group/card flex shrink-0 flex-col overflow-hidden rounded-xl border border-gold/25 bg-card shadow-sm transition-colors duration-300 hover:border-wine/50"
          >
            <div className="aspect-[4/5] overflow-hidden bg-secondary/40">
              <img
                src={thumbUrlOr(product.images[0])}
                alt={product.name[locale]}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-[1.05]"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1.5 p-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/80">
                {product.productType[locale]}
              </p>
              <h3 className="font-serif text-lg leading-snug text-espresso transition-colors group-hover/card:text-wine">
                {product.name[locale]}
              </h3>
              <p className="mt-auto text-base text-gold">
                {formatPrice(product.price ?? product.illustrativePrice, locale)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
