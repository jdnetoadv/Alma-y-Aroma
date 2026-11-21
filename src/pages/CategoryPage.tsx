import { useParams, Navigate } from 'react-router-dom'
import { useLocale } from '@/i18n/LocaleContext'
import { catalogRepository } from '@/data/repository'
import { ProductCard } from '@/components/catalog/ProductCard'
import { CatalogBreadcrumb, CollectionHeader } from '@/components/catalog/CatalogShared'

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t, locale } = useLocale()
  const localePrefix = `/${locale}`

  const category = catalogRepository.getCategoryBySlug(slug ?? '')

  if (!category) return <Navigate to={`${localePrefix}/loja`} replace />

  const categoryProducts = catalogRepository.listProductsByCategory(category.id)

  return (
    <div className="min-h-screen">
      <CatalogBreadcrumb
        items={[
          { label: t('shop.title'), to: `${localePrefix}/loja` },
          { label: category.title[locale] },
        ]}
        className="mx-auto max-w-6xl px-4 pt-6 sm:px-6"
      />
      <CollectionHeader
        badge={t('category.heroBadge')}
        title={category.title[locale]}
        description={category.description[locale]}
        category={category}
      />

      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <p className="mb-8 text-sm text-muted-foreground">
          {categoryProducts.length} {t('category.productsCount')}
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} localePrefix={localePrefix} />
          ))}
        </div>

        <div className="mt-14 border-t border-border/40 pt-8 text-center">
          <a
            href={`${localePrefix}/loja`}
            className="text-sm uppercase tracking-[0.2em] text-primary transition-opacity hover:opacity-70"
          >
            {t('category.exploreAll')}
          </a>
        </div>
      </div>
    </div>
  )
}
