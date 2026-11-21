import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Check, ShoppingCart } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import { catalogRepository, formatPrice } from '@/data/repository'
import { cartStore } from '@/lib/cart/cartStore'
import { toast } from '@/hooks/use-toast'
import { shopT } from '@/i18n/shopStrings'
import { CatalogBreadcrumb } from '@/components/catalog/CatalogShared'
import { ProductCard } from '@/components/catalog/ProductCard'
import { Button } from '@/components/ui/button'

export default function KitDetailPage() {
  const { slug } = useParams()
  const { t, locale } = useLocale()
  const localePrefix = `/${locale}`
  const kit = slug ? catalogRepository.getKitBySlug(slug) : undefined

  if (!kit) {
    return (
      <div className="min-h-screen px-4 py-24 text-center">
        <h1 className="font-serif text-3xl text-foreground">{t('shop.emptyTitle')}</h1>
        <Button asChild variant="outline" className="mt-6">
          <Link to={`${localePrefix}/kits`}>{t('kits.backToKits')}</Link>
        </Button>
      </div>
    )
  }

  const kitProducts = catalogRepository.getKitProducts(kit)

  return (
    <div className="min-h-screen">
      <CatalogBreadcrumb
        className="mx-auto max-w-6xl px-4 pt-6 sm:px-6"
        items={[
          { label: t('kits.title'), to: `${localePrefix}/kits` },
          { label: kit.name[locale] },
        ]}
      />

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="aspect-[4/3] overflow-hidden rounded-lg border border-border/60 bg-secondary/40">
            <img src={kit.image} alt={kit.name[locale]} className="h-full w-full object-cover" />
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary/80">{t('kits.title')}</p>
            <h1 className="mt-2 font-serif text-4xl leading-tight text-foreground sm:text-5xl">
              {kit.name[locale]}
            </h1>
            <p className="mt-6 text-2xl font-medium text-foreground">
              {formatPrice(kit.price, locale)}
              <span className="ml-3 align-middle text-xs font-normal uppercase tracking-wider text-muted-foreground/70">
                {t('kits.priceNote')}
              </span>
            </p>

            <div className="mt-8">
              <h2 className="font-serif text-2xl text-foreground">{t('kits.experienceTitle')}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{kit.experience[locale]}</p>
              <p className="mt-4 leading-relaxed text-muted-foreground">{kit.detail[locale]}</p>
            </div>

            <div className="mt-8">
              <h2 className="font-serif text-2xl text-foreground">{t('kits.compositionTitle')}</h2>
              <ul className="mt-3 space-y-2">
                {kitProducts.map((p) => (
                  <li key={p.id} className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                    <Link
                      to={`${localePrefix}/produto/${p.slug}`}
                      className="text-foreground/90 underline-offset-4 transition-colors hover:text-primary hover:underline"
                    >
                      {p.name[locale]}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs italic text-muted-foreground/80">
                {t('kits.compositionNote')}
              </p>
            </div>

            <div className="mt-10">
              <button
                type="button"
                onClick={() => {
                  cartStore.addItem(kitProducts[0], 1)
                  toast({ title: shopT(locale, 'cart.added') })
                }}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <ShoppingCart className="h-4 w-4" aria-hidden />
                {t('product.addToCart')} — {t('kits.priceNote')}
              </button>
            </div>
          </div>
        </div>

        <section className="mt-16 border-t border-border/40 pt-10">
          <h2 className="font-serif text-2xl text-foreground">{t('product.related')}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {kitProducts.map((p) => (
              <ProductCard key={p.id} product={p} localePrefix={localePrefix} />
            ))}
          </div>
        </section>

        <div className="mt-14">
          <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
            <Link to={`${localePrefix}/kits`}>
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
              {t('kits.backToKits')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
