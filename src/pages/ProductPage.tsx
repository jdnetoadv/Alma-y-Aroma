import { useEffect, useMemo, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Plus,
  Minus,
  ShoppingCart,
  ShoppingBag,
  Truck,
  ChevronRight,
  Heart,
  X,
} from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import { CatalogProduct } from '@/data/types'
import { catalogRepository, formatPrice } from '@/data/repository'
import { ProductCard } from '@/components/catalog/ProductCard'
import { CatalogBreadcrumb } from '@/components/catalog/CatalogShared'
import { cartStore } from '@/lib/cart/cartStore'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { shopT } from '@/i18n/shopStrings'
import { useFavorites } from '@/lib/favorites/useFavorites'
import pb from '@/lib/pocketbase/client'
import { cn } from '@/lib/utils'

export default function ProductPage() {
  const { slug } = useParams()
  const { t, locale } = useLocale()
  const navigate = useNavigate()
  const localePrefix = `/${locale}`
  const { isFavorite, toggle } = useFavorites()
  const product = slug ? catalogRepository.getProductBySlug(slug) : undefined
  const fav = product ? isFavorite(product.slug) : false

  const handleFavorite = () => {
    if (!product) return
    if (!pb.authStore.isValid) {
      navigate(`${localePrefix}/conta`)
      return
    }
    toggle(product.slug).then((added) => {
      toast({ title: shopT(locale, added ? 'fav.added' : 'fav.removed') })
    })
  }

  const [activeImage, setActiveImage] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  /** Índice selecionado em cada grupo de variação (kind → índice em values). */
  const [variationSelection, setVariationSelection] = useState<Record<string, number>>({})
  const [quantity, setQuantity] = useState(1)
  const [showTech, setShowTech] = useState(false)

  useEffect(() => {
    setActiveImage(0)
    setZoomed(false)
    const initial: Record<string, number> = {}
    product?.variations?.forEach((v) => {
      initial[v.kind] = 0
    })
    setVariationSelection(initial)
    setQuantity(1)
    setShowTech(false)
  }, [product?.id])

  const related = useMemo(
    () => (product ? catalogRepository.listRelated(product, 4) : []),
    [product],
  )

  if (!product) {
    return (
      <div className="min-h-screen px-4 py-24 text-center">
        <h1 className="font-serif text-3xl text-foreground">{t('shop.emptyTitle')}</h1>
        <Button asChild variant="outline" className="mt-6">
          <Link to={`${localePrefix}/loja`}>{t('product.backToShop')}</Link>
        </Button>
      </div>
    )
  }

  const category = catalogRepository.getCategory(product.category)
  const name = product.name[locale]
  const gallery = product.images
  const variationList = product.variations ?? []
  const techRows: { label: string; value?: string }[] = [
    { label: t('product.tech.brand'), value: product.technical?.brand?.[locale] },
    { label: t('product.tech.composition'), value: product.technical?.composition?.[locale] },
    { label: t('product.tech.weight'), value: product.technical?.weight?.[locale] },
    { label: t('product.tech.dimensions'), value: product.technical?.dimensions?.[locale] },
    { label: t('product.tech.contents'), value: product.technical?.contents?.[locale] },
    { label: t('product.tech.origin'), value: product.technical?.origin?.[locale] },
    { label: t('product.tech.usage'), value: product.technical?.usage?.[locale] },
    { label: t('product.tech.care'), value: product.technical?.care?.[locale] },
    { label: t('product.tech.sku'), value: product.sku },
  ]
  const kitIds = catalogRepository.listKits().filter((k) => k.productIds.includes(product.id))

  return (
    <div className="min-h-screen">
      {/* SEO: página demonstrativa — não indexar como oferta real */}
      <NoindexTag />

      <CatalogBreadcrumb
        className="mx-auto max-w-6xl px-4 pt-6 sm:px-6"
        items={[
          { label: t('shop.title'), to: `${localePrefix}/loja` },
          ...(category
            ? [{ label: category.title[locale], to: `${localePrefix}/categoria/${category.slug}` }]
            : []),
          { label: name },
        ]}
      />

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Galeria */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-lg border border-border/60 bg-secondary/40">
              <img
                src={gallery[activeImage]}
                alt={`${name} — imagem ${activeImage + 1}`}
                className="h-full w-full object-cover transition-transform duration-500"
                onClick={() => setZoomed(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setZoomed(true)}
                aria-label={`${name} — ampliar imagem`}
              />
              <span className="absolute left-4 top-4 rounded-full bg-background/85 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground backdrop-blur">
                {t('product.demoBadge')}
              </span>
            </div>
            {gallery.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                {gallery.map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    aria-label={`${name} — miniatura ${i + 1}`}
                    className={cn(
                      'h-20 w-20 shrink-0 overflow-hidden rounded-md border transition-all',
                      i === activeImage
                        ? 'border-primary ring-1 ring-primary/40'
                        : 'border-border/50 opacity-70 hover:opacity-100',
                    )}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informações */}
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary/80">
              {category?.title[locale] ?? product.category}
            </p>
            <h1 className="mt-2 flex flex-wrap items-center gap-3 font-serif text-4xl leading-tight text-foreground sm:text-5xl">
              <span>{name}</span>
              <button
                type="button"
                onClick={handleFavorite}
                aria-label={shopT(locale, fav ? 'fav.remove' : 'fav.add')}
                aria-pressed={fav}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/60 bg-background/70 transition-colors hover:border-primary/50"
              >
                <Heart
                  className={cn(
                    'h-4 w-4 transition-colors',
                    fav ? 'fill-primary text-primary' : 'text-muted-foreground',
                  )}
                  aria-hidden
                />
              </button>
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {product.shortDescription[locale]}
            </p>
            {product.compareAtPrice && product.compareAtPrice > product.price ? (
              <p className="mt-6 flex flex-wrap items-baseline gap-3">
                <span className="text-2xl font-medium text-foreground">
                  {formatPrice(product.price, locale)}
                </span>
                <span className="text-base text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice, locale)}
                </span>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {t('product.savePercent', {
                    percent: String(
                      Math.round(
                        ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100,
                      ),
                    ),
                  })}
                </span>
              </p>
            ) : (
              <p className="mt-6 text-2xl font-medium text-foreground">
                {formatPrice(product.price, locale)}
              </p>
            )}

            {/* Variações */}
            {variationList.length > 0 && (
              <div className="mt-8">
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  {t('product.variations')}
                </p>
                <div className="space-y-4">
                  {variationList.map((v) => (
                    <div key={v.kind}>
                      <p className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground/80">
                        {t(`variation.${v.kind}` as 'variation.aroma')}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {v.values.map((value, i) => {
                          const selected = (variationSelection[v.kind] ?? 0) === i
                          return (
                            <button
                              key={value + i}
                              type="button"
                              onClick={() =>
                                setVariationSelection((prev) => ({ ...prev, [v.kind]: i }))
                              }
                              aria-pressed={selected}
                              className={cn(
                                'rounded-md border px-4 py-2 text-sm transition-colors',
                                selected
                                  ? 'border-primary bg-primary/10 text-foreground'
                                  : 'border-border/60 text-muted-foreground hover:border-primary/50',
                              )}
                            >
                              {value}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantidade + disponibilidade */}
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  {t('product.quantity')}
                </p>
                <div className="inline-flex items-center rounded-md border border-border">
                  <button
                    type="button"
                    className="px-3 py-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="-"
                  >
                    <Minus className="h-4 w-4" aria-hidden />
                  </button>
                  <span className="w-10 text-center text-sm">{quantity}</span>
                  <button
                    type="button"
                    className="px-3 py-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setQuantity((q) => Math.min(9, q + 1))}
                    aria-label="+"
                  >
                    <Plus className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  {t('product.availability')}
                </p>
                <LocalBadge className="border-border/60 text-muted-foreground">
                  {t('product.availableDemo')}
                </LocalBadge>
              </div>
            </div>

            {/* Adicionar ao carrinho + frete */}
            <div className="mt-8 space-y-3">
              <Button
                type="button"
                onClick={() => {
                  const variationLabel = variationList
                    .map(
                      (v, idx) =>
                        v.values[variationSelection[v.kind] ?? 0] ??
                        v.values[variationSelection[v.kind] ?? 0],
                    )
                    .filter(Boolean)
                    .join(' · ')
                  cartStore.addItem(product, quantity, variationLabel || undefined)
                  toast({
                    title: shopT(locale, 'cart.added'),
                    description: `${name} · ${quantity} × ${formatPrice(product.illustrativePrice, locale)}`,
                  })
                }}
                className="h-12 w-full bg-primary text-base hover:bg-primary/90"
              >
                <ShoppingCart className="mr-2 h-4 w-4" aria-hidden />
                {t('product.addToCart')}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const variationLabel = variationList
                    .map((v) => v.values[variationSelection[v.kind] ?? 0])
                    .filter(Boolean)
                    .join(' · ')
                  cartStore.addItem(product, quantity, variationLabel || undefined)
                  navigate(`${localePrefix}/checkout`)
                }}
                className="h-12 w-full text-base"
              >
                <ShoppingBag className="mr-2 h-4 w-4" aria-hidden />
                {t('product.buyNow')}
              </Button>
              <p className="flex items-center gap-2 text-xs text-muted-foreground/80">
                <Truck className="h-3.5 w-3.5" aria-hidden />
                {t('product.deliveryEstimate')}
              </p>
              <p className="text-xs italic text-muted-foreground/60">
                {t('product.demoDisclaimer')}
              </p>
            </div>

            {/* Descrição sensorial */}
            <div className="mt-10 border-t border-border/40 pt-8">
              <h2 className="font-serif text-2xl text-foreground">{t('product.detailTitle')}</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                {product.longDescription[locale]}
              </p>
            </div>

            {/* Informações técnicas */}
            <div className="mt-10 border-t border-border/40 pt-8">
              <button
                type="button"
                onClick={() => setShowTech((v) => !v)}
                className="flex w-full items-center justify-between text-left"
                aria-expanded={showTech}
              >
                <span className="font-serif text-2xl text-foreground">
                  {t('product.technicalInfo')}
                </span>
                <ChevronRight
                  className={cn('h-5 w-5 transition-transform', showTech && 'rotate-90')}
                  aria-hidden
                />
              </button>
              {showTech && (
                <div className="mt-5">
                  <p className="mb-4 text-xs italic text-muted-foreground/80">
                    {t('product.technical.demoNote')}
                  </p>
                  <dl className="space-y-2 text-sm">
                    {techRows.map(
                      (row) =>
                        row.value && (
                          <div
                            key={row.label}
                            className="flex gap-3 border-b border-border/20 pb-2"
                          >
                            <dt className="w-40 shrink-0 text-muted-foreground">{row.label}</dt>
                            <dd className="text-foreground/90">{row.value}</dd>
                          </div>
                        ),
                    )}
                  </dl>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Kits que incluem este produto */}
        {kitIds.length > 0 && (
          <section className="mt-16 border-t border-border/40 pt-10">
            <h2 className="font-serif text-2xl text-foreground">{t('product.relatedKits')}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {kitIds.map((kit) => (
                <Link
                  key={kit.id}
                  to={`${localePrefix}/kits/${kit.slug}`}
                  className="group flex items-center gap-4 rounded-lg border border-border/60 bg-card/60 p-4 transition-colors hover:border-primary/40"
                >
                  <img
                    src={kit.image}
                    alt={kit.name[locale]}
                    className="h-16 w-16 rounded-md object-cover"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-serif text-lg text-foreground group-hover:text-primary">
                      {kit.name[locale]}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(kit.price, locale)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Relacionados */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-border/40 pt-10">
            <h2 className="font-serif text-2xl text-foreground">{t('product.related')}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} localePrefix={localePrefix} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-14">
          <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
            <Link
              to={category ? `${localePrefix}/categoria/${category.slug}` : `${localePrefix}/loja`}
            >
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
              {category ? t('product.backToCategory') : t('product.backToShop')}
            </Link>
          </Button>
        </div>
      </div>

      {/* Ampliação (lightbox) */}
      {zoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 p-4 backdrop-blur-sm"
          onClick={() => setZoomed(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${name} — imagem ampliada`}
        >
          <img
            src={gallery[activeImage]}
            alt={name}
            className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl"
          />
          <button
            type="button"
            className="absolute right-6 top-6 text-background/80 hover:text-background"
            aria-label="Fechar"
            onClick={() => setZoomed(false)}
          >
            <X className="h-8 w-8" aria-hidden />
          </button>
        </div>
      )}
    </div>
  )
}

/** Meta noindex para páginas de produto demonstrativo. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type CatalogProductImport = CatalogProduct
function NoindexTag() {
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)
    return () => {
      document.head.removeChild(meta)
    }
  }, [])
  return null
}

function LocalBadge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn('inline-flex items-center rounded-full border px-3 py-1 text-xs', className)}
    >
      {children}
    </span>
  )
}
