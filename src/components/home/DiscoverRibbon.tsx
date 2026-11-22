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

/** Embaralha em cópia (Fisher–Yates) — ordem nova a cada montagem. */
function shuffle<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** Loop pequeno: repete itens até a fita ter volume suficiente sem buracos. */
const MIN_LOOP_ITEMS = 12

export function DiscoverRibbon() {
  const { locale } = useLocale()
  const t = (key: string) => shopT(locale, key)

  const items = useMemo(() => {
    const all = catalogRepository
      .listProducts()
      .filter((p) => (p as unknown as { status?: string }).status !== 'inactive')
    if (!all.length) return []
    const shuffled = shuffle(all)
    // Catálogo curto: repete a lista embaralhada até preencher o loop.
    const filled: CatalogProduct[] = []
    while (filled.length < MIN_LOOP_ITEMS) {
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
      <div className="mb-8 px-4 sm:px-6 lg:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">{t('shop.ribbon.eyebrow')}</p>
        <h2 className="mt-2 font-serif text-2xl text-espresso sm:text-3xl">
          {t('shop.ribbon.discover.title')}
        </h2>
        <p className="mt-1 text-xs text-espresso/70 sm:text-sm">{t('shop.ribbon.subtitle')}</p>
      </div>

      <div className="ribbon-track flex w-max gap-4 px-4 sm:gap-6">
        {loop.map((product, i) => (
          <Link
            key={`${product.id}-${i}`}
            to={`/${locale}/produto/${product.slug}`}
            aria-label={product.name[locale]}
            className="ribbon-card group/card flex w-44 shrink-0 flex-col overflow-hidden rounded-lg border border-gold/25 bg-card shadow-sm transition-colors duration-300 hover:border-wine/50 sm:w-52"
          >
            <div className="aspect-[4/5] overflow-hidden bg-secondary/40">
              <img
                src={thumbUrlOr(product.images[0])}
                alt={product.name[locale]}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-[1.05]"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1 p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/80">
                {product.productType[locale]}
              </p>
              <h3 className="font-serif text-base leading-snug text-espresso transition-colors group-hover/card:text-wine">
                {product.name[locale]}
              </h3>
              <p className="mt-auto text-sm text-gold">
                {formatPrice(product.price ?? product.illustrativePrice, locale)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
