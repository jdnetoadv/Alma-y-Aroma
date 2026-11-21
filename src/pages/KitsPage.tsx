import { Link } from 'react-router-dom'
import { useLocale } from '@/i18n/LocaleContext'
import { catalogRepository, formatPrice } from '@/data/repository'
import { CatalogBreadcrumb, CollectionHeader } from '@/components/catalog/CatalogShared'

export default function KitsPage() {
  const { t, locale } = useLocale()
  const localePrefix = `/${locale}`
  const kits = catalogRepository.listKits()

  return (
    <div className="min-h-screen">
      <CatalogBreadcrumb
        className="mx-auto max-w-6xl px-4 pt-6 sm:px-6"
        items={[{ label: t('kits.title') }]}
      />
      <CollectionHeader
        badge={t('breadcrumb.kits')}
        title={t('kits.title')}
        description={t('kits.subtitle')}
      />

      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          {kits.map((kit) => (
            <Link
              key={kit.id}
              to={`${localePrefix}/kits/${kit.slug}`}
              className="group overflow-hidden rounded-lg border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="aspect-[16/10] overflow-hidden bg-secondary/40">
                <img
                  src={kit.image}
                  alt={kit.name[locale]}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <div className="p-6">
                <h2 className="font-serif text-2xl text-foreground group-hover:text-primary">
                  {kit.name[locale]}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {kit.experience[locale]}
                </p>
                <p className="mt-4 text-lg font-medium text-foreground">
                  {formatPrice(kit.price, locale)}
                  <span className="ml-2 text-xs font-normal uppercase tracking-wider text-muted-foreground/70">
                    {t('kits.priceNote')}
                  </span>
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary">
                  {t('kits.viewKit')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
