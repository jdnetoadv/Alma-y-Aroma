import { Link } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import { CatalogProduct } from '@/data/types'
import { formatPrice } from '@/data/repository'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: CatalogProduct
  localePrefix: string
  badge?: string
  className?: string
}

/**
 * Card de produto do catálogo (loja, categorias, sensações, relacionados).
 * Compra desabilitada com indicação discreta de "em breve".
 */
export function ProductCard({ product, localePrefix, badge, className }: ProductCardProps) {
  const { t, locale } = useLocale()

  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-lg border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md',
        className,
      )}
    >
      <Link
        to={`${localePrefix}/produto/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-secondary/40"
        aria-label={product.name[locale]}
      >
        <img
          src={product.images[0]}
          alt={product.name[locale]}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-background/85 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground backdrop-blur">
          {t('product.demoBadge')}
        </span>
        {badge && (
          <span className="absolute right-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-primary-foreground">
            {badge}
          </span>
        )}
        {product.isNew && (
          <span className="absolute bottom-3 left-3 rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-accent-foreground">
            {t('shop.sort.newest')}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
          {product.productType[locale]}
        </p>
        <h3 className="mt-1 font-serif text-xl leading-snug text-foreground">
          <Link
            to={`${localePrefix}/produto/${product.slug}`}
            className="transition-colors hover:text-primary"
          >
            {product.name[locale]}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {product.shortDescription[locale]}
        </p>
        <p className="mt-3 text-base font-medium text-foreground">
          {formatPrice(product.illustrativePrice, locale)}
          <span className="ml-2 text-xs font-normal text-muted-foreground/70">
            {t('product.demoBadge').toLowerCase()}
          </span>
        </p>

        <div className="mt-4 flex flex-col gap-2 pt-2 sm:flex-row">
          <Link
            to={`${localePrefix}/produto/${product.slug}`}
            className="inline-flex h-9 flex-1 items-center justify-center rounded-md border border-border bg-transparent px-3 text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {t('product.viewDetails')}
          </Link>
          <button
            type="button"
            disabled
            title={t('product.cartSoon')}
            aria-disabled="true"
            className="inline-flex h-9 flex-1 cursor-not-allowed items-center justify-center gap-1.5 rounded-md border border-border/50 bg-muted/40 px-3 text-sm text-muted-foreground/70"
          >
            <Lock className="h-3.5 w-3.5" aria-hidden />
            {t('product.addToCart')}
          </button>
        </div>
      </div>
    </article>
  )
}
