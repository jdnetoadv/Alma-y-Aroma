import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import { Locale } from '@/i18n/types'
import { CatalogProduct, ProductCategory, PurposeTag, ScentFamily } from '@/data/types'
import { catalogRepository, searchCatalog } from '@/data/repository'
import { ProductCard } from '@/components/catalog/ProductCard'
import { CatalogBreadcrumb, CollectionHeader } from '@/components/catalog/CatalogShared'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type SortOption = 'name' | 'priceAsc' | 'priceDesc' | 'newest' | 'featured'
type PriceRange = 'all' | 'under50' | '50to100' | '100to150' | 'over150'

interface CatalogFilters {
  category: ProductCategory | 'all'
  productType: string
  scent: ScentFamily | 'all'
  price: PriceRange
  purpose: PurposeTag | 'all'
}

const DEFAULT_FILTERS: CatalogFilters = {
  category: 'all',
  productType: 'all',
  scent: 'all',
  price: 'all',
  purpose: 'all',
}

const PRICE_RANGES: { id: PriceRange; min: number; max: number }[] = [
  { id: 'under50', min: 0, max: 50 },
  { id: '50to100', min: 50, max: 100 },
  { id: '100to150', min: 100, max: 150 },
  { id: 'over150', min: 150, max: Infinity },
]

function matchesPrice(price: number, range: PriceRange): boolean {
  if (range === 'all') return true
  const r = PRICE_RANGES.find((p) => p.id === range)
  if (!r) return true
  if (r.max === Infinity) return price > r.min
  return price > r.min && price <= r.max
}

export function applyCatalogFilters(
  items: CatalogProduct[],
  filters: CatalogFilters,
  sort: SortOption,
  locale: Locale = 'pt-br',
): CatalogProduct[] {
  const filtered = items.filter(
    (p) =>
      (filters.category === 'all' || p.category === filters.category) &&
      (filters.scent === 'all' || p.scentFamily === filters.scent) &&
      (filters.purpose === 'all' || p.purposes.includes(filters.purpose)) &&
      (filters.productType === 'all' || p.productType[locale] === filters.productType) &&
      matchesPrice(p.illustrativePrice, filters.price),
  )

  const sorted = [...filtered]
  switch (sort) {
    case 'name':
      sorted.sort((a, b) => a.name[locale].localeCompare(b.name[locale], locale))
      break
    case 'priceAsc':
      sorted.sort((a, b) => a.illustrativePrice - b.illustrativePrice)
      break
    case 'priceDesc':
      sorted.sort((a, b) => b.illustrativePrice - a.illustrativePrice)
      break
    case 'newest':
      sorted.sort((a, b) => Number(b.isNew ?? false) - Number(a.isNew ?? false))
      break
    case 'featured':
      sorted.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false))
      break
  }
  return sorted
}

interface FilterSectionProps {
  label: string
  children: React.ReactNode
}

function FilterSection({ label, children }: FilterSectionProps) {
  return (
    <div className="border-b border-border/40 pb-5">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  )
}

export default function ShopPage() {
  const { t, locale } = useLocale()
  const [searchParams] = useSearchParams()
  const localePrefix = `/${locale}`
  const searchQuery = (searchParams.get('q') ?? '').trim()

  const [filters, setFilters] = useState<CatalogFilters>(() => ({
    ...DEFAULT_FILTERS,
    category: (searchParams.get('categoria') as ProductCategory | null) ?? 'all',
    purpose: (searchParams.get('sensacao') as PurposeTag | null) ?? 'all',
  }))
  const [sort, setSort] = useState<SortOption>('featured')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const allProducts = catalogRepository.listProducts()
  const searchResults = useMemo(
    () => (searchQuery ? searchCatalog(searchQuery, locale) : null),
    [searchQuery, locale],
  )
  const productTypes = useMemo(
    () =>
      Array.from(new Set(allProducts.map((p) => p.productType[locale]))).sort((a, b) =>
        a.localeCompare(b, locale),
      ),
    [allProducts, locale],
  )
  const scentFamilies: ScentFamily[] = [
    'floral-herbal',
    'woody',
    'citrus-fresh',
    'amber-warm',
    'resinous',
  ]

  const visibleProducts = useMemo(
    () => applyCatalogFilters(searchResults ?? allProducts, filters, sort, locale),
    [allProducts, searchResults, filters, sort, locale],
  )

  const activeFilterCount =
    (filters.category !== 'all' ? 1 : 0) +
    (filters.productType !== 'all' ? 1 : 0) +
    (filters.scent !== 'all' ? 1 : 0) +
    (filters.price !== 'all' ? 1 : 0) +
    (filters.purpose !== 'all' ? 1 : 0)

  const setFilter = <K extends keyof CatalogFilters>(key: K, value: CatalogFilters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }))

  const scentFamilyLabels: Record<ScentFamily, string> = {
    'floral-herbal':
      locale === 'pt-br'
        ? 'Floral & Herbáceo'
        : locale === 'es'
          ? 'Floral & Herbal'
          : 'Floral & Herbal',
    woody: locale === 'pt-br' ? 'Amadeirado' : locale === 'es' ? 'Amaderado' : 'Woody',
    'citrus-fresh':
      locale === 'pt-br'
        ? 'Cítrico & Fresco'
        : locale === 'es'
          ? 'Cítrico & Fresco'
          : 'Citrus & Fresh',
    'amber-warm':
      locale === 'pt-br' ? 'Âmbar & Quente' : locale === 'es' ? 'Ámbar & Cálido' : 'Amber & Warm',
    resinous: locale === 'pt-br' ? 'Resinoso' : locale === 'es' ? 'Resinoso' : 'Resinous',
  }

  const purposeLabels: Record<PurposeTag, string> = {
    relaxar: t('sensation.relax'),
    meditar: t('sensation.meditate'),
    renovar: t('sensation.renew'),
    acolher: t('sensation.acolher'),
    presentear: t('sensation.presentear'),
  }

  const filterPanel = (
    <div className="space-y-5">
      <FilterSection label={t('shop.filterCategory')}>
        <Select
          value={filters.category}
          onValueChange={(v) => setFilter('category', v as CatalogFilters['category'])}
        >
          <SelectTrigger aria-label={t('shop.filterCategory')} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('shop.allCategories')}</SelectItem>
            {catalogRepository.listCategories().map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.title[locale]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterSection>

      <FilterSection label={t('shop.filterType')}>
        <Select value={filters.productType} onValueChange={(v) => setFilter('productType', v)}>
          <SelectTrigger aria-label={t('shop.filterType')} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {locale === 'pt-br'
                ? 'Todos os tipos'
                : locale === 'es'
                  ? 'Todos los tipos'
                  : 'All types'}
            </SelectItem>
            {productTypes.map((pt) => (
              <SelectItem key={pt} value={pt}>
                {pt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterSection>

      <FilterSection label={t('shop.filterScent')}>
        <Select
          value={filters.scent}
          onValueChange={(v) => setFilter('scent', v as CatalogFilters['scent'])}
        >
          <SelectTrigger aria-label={t('shop.filterScent')} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {locale === 'pt-br'
                ? 'Todas as famílias'
                : locale === 'es'
                  ? 'Todas las familias'
                  : 'All families'}
            </SelectItem>
            {scentFamilies.map((s) => (
              <SelectItem key={s} value={s}>
                {scentFamilyLabels[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterSection>

      <FilterSection label={t('shop.filterPrice')}>
        <Select
          value={filters.price}
          onValueChange={(v) => setFilter('price', v as CatalogFilters['price'])}
        >
          <SelectTrigger aria-label={t('shop.filterPrice')} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('shop.priceRange.all')}</SelectItem>
            {PRICE_RANGES.map((r) => (
              <SelectItem key={r.id} value={r.id}>
                {t(`shop.priceRange.${r.id}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterSection>

      <FilterSection label={t('shop.filterPurpose')}>
        <Select
          value={filters.purpose}
          onValueChange={(v) => setFilter('purpose', v as CatalogFilters['purpose'])}
        >
          <SelectTrigger aria-label={t('shop.filterPurpose')} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {locale === 'pt-br'
                ? 'Toda finalidade'
                : locale === 'es'
                  ? 'Toda finalidad'
                  : 'Any purpose'}
            </SelectItem>
            {(Object.keys(purposeLabels) as PurposeTag[]).map((p) => (
              <SelectItem key={p} value={p}>
                {purposeLabels[p]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterSection>

      {activeFilterCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFilters(DEFAULT_FILTERS)}
          className="w-full text-muted-foreground hover:text-foreground"
        >
          {t('shop.clearFilters')}
        </Button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen">
      <CatalogBreadcrumb
        items={[{ label: t('shop.title') }]}
        className="mx-auto max-w-6xl px-4 pt-6 sm:px-6"
      />
      <CollectionHeader
        badge={t('shop.heroBadge')}
        title={t('shop.title')}
        description={t('shop.subtitle')}
      />

      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="mb-8 flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {searchResults !== null && (
              <span className="font-medium text-foreground">
                {t('shop.searchResultsFor').replace('{query}', searchQuery)} ·{' '}
              </span>
            )}
            {visibleProducts.length} {t('shop.count')}
          </p>
          <div className="flex items-center gap-3">
            <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
              <SelectTrigger aria-label={t('shop.sortLabel')} className="w-[190px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">{t('shop.sort.featured')}</SelectItem>
                <SelectItem value="newest">{t('shop.sort.newest')}</SelectItem>
                <SelectItem value="priceAsc">{t('shop.sort.priceAsc')}</SelectItem>
                <SelectItem value="priceDesc">{t('shop.sort.priceDesc')}</SelectItem>
                <SelectItem value="name">{t('shop.sort.name')}</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setFiltersOpen((v) => !v)}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" aria-hidden />
              {t('shop.filters')}
              {activeFilterCount > 0 && (
                <span className="ml-1.5 rounded-full bg-primary px-1.5 text-[11px] text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
          {/* Filters — desktop sidebar / mobile collapsible */}
          <aside className={cn('lg:block', filtersOpen ? 'block' : 'hidden')}>
            <div className="rounded-lg border border-border/50 bg-card/60 p-5 lg:sticky lg:top-24">
              {filterPanel}
            </div>
          </aside>

          <div>
            {visibleProducts.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border/60 px-6 py-16 text-center">
                <h2 className="font-serif text-2xl text-foreground">{t('shop.emptyTitle')}</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                  {t('shop.emptyMessage')}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-6"
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                >
                  {t('shop.clearFilters')}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} localePrefix={localePrefix} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
