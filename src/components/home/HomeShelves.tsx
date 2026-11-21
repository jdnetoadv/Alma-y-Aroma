/**
 * Vitrines dinâmicas da homepage — Etapa 5. Consomem o repositório central
 * (backend PocketBase com fallback local). NÃO usam dados de vendas:
 * "Escolhas Alma y Aroma" é seleção editorial (featured), "Novidades" usa
 * isNew, "Para Presentear" usa kits e produtos de presente, "Descubra Seu
 * Ritual" organiza produtos por momento/ambiente (purposes). Sem contadores
 * falsos, urgência artificial ou promoções inexistentes.
 */
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLocale } from '@/i18n/LocaleContext'
import { shopT } from '@/i18n/shopStrings'
import { catalogRepository } from '@/data/repository'
import { CatalogProduct, CatalogKit, PurposeTag } from '@/data/types'
import { ProductCard } from '@/components/catalog/ProductCard'

export interface HomeShelf {
  id: string
  titleKey: string
  subtitleKey: string
  ctaKey: string
  ctaHref: string
  products: CatalogProduct[]
}

const RITUAL_SHELF: { purpose: PurposeTag; tagMatch: string }[] = [
  { purpose: 'relaxar', tagMatch: 'relax' },
  { purpose: 'meditar', tagMatch: 'medit' },
  { purpose: 'renovar', tagMatch: 'renov' },
  { purpose: 'acolher', tagMatch: 'acolh' },
]

/** Monta as 4 vitrines a partir do repositório (sem duplicar dados). */
export function useHomeShelves(ready?: boolean): HomeShelf[] {
  const { locale } = useLocale()
  return useMemo(() => {
    if (ready === false) return []
    const all = catalogRepository.listProducts().filter((p) => {
      const status = (p as unknown as { status?: string }).status
      return status !== 'inactive'
    })
    const editorial = all.filter((p) => p.featured).slice(0, 4)
    const novelties = all
      .filter((p) => p.isNew && !editorial.some((e) => e.id === p.id))
      .slice(0, 4)
    // "Para Presentear": kit real do repositório + produtos marcados p/ presente.
    const giftKit = catalogRepository.getKitBySlug('kit-presente-essencial')
    const giftKitProducts = giftKit ? catalogRepository.getKitProducts(giftKit) : []
    const giftProducts = [...giftKitProducts, ...all]
      .filter(
        (p, i, arr) =>
          arr.findIndex((x) => x.id === p.id) === i &&
          (giftKitProducts.some((k) => k.id === p.id) ||
            p.tags.some((tag) => /present|gift|kit/i.test(tag))),
      )
      .slice(0, 4)
    const ritual = RITUAL_SHELF.map(({ purpose }) => catalogRepository.listBySensation(purpose))
      .flat()
      .filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i)
      .slice(0, 4)

    return [
      {
        id: 'escolhas',
        titleKey: 'shop.shelf.choices.title',
        subtitleKey: 'shop.shelf.choices.subtitle',
        ctaKey: 'shop.shelf.seeAll',
        ctaHref: `/${locale}/loja`,
        products: editorial,
      },
      {
        id: 'novidades',
        titleKey: 'shop.shelf.new.title',
        subtitleKey: 'shop.shelf.new.subtitle',
        ctaKey: 'shop.shelf.seeAll',
        ctaHref: `/${locale}/loja`,
        products: novelties,
      },
      {
        id: 'presentear',
        titleKey: 'shop.shelf.gifts.title',
        subtitleKey: 'shop.shelf.gifts.subtitle',
        ctaKey: 'shop.shelf.seeAll',
        ctaHref: `/${locale}/loja`,
        products: giftProducts,
      },
      {
        id: 'ritual',
        titleKey: 'shop.shelf.ritual.title',
        subtitleKey: 'shop.shelf.ritual.subtitle',
        ctaKey: 'shop.shelf.seeAll',
        ctaHref: `/${locale}/sensacoes`,
        products: ritual,
      },
    ].filter((shelf) => shelf.products.length > 0)
  }, [locale, ready])
}

/** Seção de vitrine com heading editorial e cards reais do catálogo. */
export function HomeShelfSection({ shelf }: { shelf: HomeShelf }) {
  const { t } = useLocale()
  return (
    <section aria-label={t(shelf.titleKey)} className="py-16 sm:py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl text-espresso">{t(shelf.titleKey)}</h2>
            <p className="mt-1 text-xs sm:text-sm text-espresso/70">{t(shelf.subtitleKey)}</p>
          </div>
          <Link
            to={shelf.ctaHref}
            className="text-xs uppercase tracking-wider text-gold hover:text-terracotta transition-colors"
          >
            {t(shelf.ctaKey)}
          </Link>
        </div>
        {shelf.products.length ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {shelf.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-espresso/60">{t('shop.shelf.empty')}</p>
        )}
      </div>
    </section>
  )
}
