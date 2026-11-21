import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import { catalogRepository } from '@/data/repository'
import { PurposeTag } from '@/data/types'
import { ProductCard } from '@/components/catalog/ProductCard'
import { CatalogBreadcrumb, CollectionHeader } from '@/components/catalog/CatalogShared'
import { Button } from '@/components/ui/button'

const VALID_PURPOSES: PurposeTag[] = ['relaxar', 'meditar', 'renovar', 'acolher', 'presentear']

export default function SensationPage() {
  const { purpose } = useParams()
  const { t, locale } = useLocale()
  const localePrefix = `/${locale}`
  const valid = VALID_PURPOSES.includes(purpose as PurposeTag) ? (purpose as PurposeTag) : null
  const products = valid ? catalogRepository.listBySensation(valid) : []

  if (!valid) {
    return (
      <div className="min-h-screen px-4 py-24 text-center">
        <h1 className="font-serif text-3xl text-foreground">{t('shop.emptyTitle')}</h1>
        <Button asChild variant="outline" className="mt-6">
          <Link to={`${localePrefix}/loja`}>{t('product.backToShop')}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <CatalogBreadcrumb
        className="mx-auto max-w-6xl px-4 pt-6 sm:px-6"
        items={[
          { label: t('sensation.title'), to: `${localePrefix}/#sensacoes` },
          { label: t(`sensation.${valid}`) },
        ]}
      />
      <CollectionHeader
        badge={t('sensation.title')}
        title={t(`sensation.${valid}`)}
        description={t(`sensation.${valid}.desc`)}
      />
      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} localePrefix={localePrefix} />
          ))}
        </div>
        <div className="mt-12">
          <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
            <Link to={localePrefix}>
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
              {t('breadcrumb.home')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
