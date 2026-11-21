import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ShoppingBag, X, ArrowUpRight, ArrowRight } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import { searchCatalog } from '@/data/repository'
import { formatPrice } from '@/data/repository'
import { useCartStore } from '@/lib/cart/useCartStore'
import { shopT } from '@/i18n/shopStrings'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

export function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t, locale } = useLocale()
  const [query, setQuery] = useState('')

  const results = useMemo(
    () => (isOpen && query.trim().length >= 2 ? searchCatalog(query, locale).slice(0, 6) : null),
    [isOpen, query, locale],
  )
  const hasResults = results !== null && results.length > 0

  // Quick links still help visitors who prefer navigating by section
  const quickLinks = [
    { label: t('shop.title'), href: `/${locale}/loja` },
    { label: t('kits.title'), href: `/${locale}/kits` },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl bg-cream border-clay text-espresso p-6 sm:p-8">
        <DialogHeader className="text-left space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-serif tracking-[0.2em] text-xs uppercase text-gold">
              Alma y Aroma
            </span>
            <Badge variant="outline" className="border-clay text-[11px] text-espresso/70">
              {t('search.results')}
            </Badge>
          </div>
          <DialogTitle className="font-serif text-2xl sm:text-3xl font-normal text-espresso">
            {t('search.placeholder')}
          </DialogTitle>
          <DialogDescription className="font-sans text-xs sm:text-sm text-espresso/70">
            {t('search.hint')}
          </DialogDescription>
        </DialogHeader>

        {/* Input — agora funcional sobre o catálogo demonstrativo */}
        <div className="relative mt-2">
          <Search className="w-4 h-4 text-gold absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            aria-label={t('search.placeholder')}
            className="w-full bg-cream-100 border border-clay rounded-sm pl-10 pr-4 py-2.5 text-sm text-espresso placeholder:text-espresso/40 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label={t('search.close')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso/50 hover:text-espresso"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Resultados reais do catálogo */}
        {results !== null && (
          <div className="mt-4 max-h-[45vh] overflow-y-auto">
            {hasResults ? (
              <>
                <p className="text-xs uppercase tracking-wider text-espresso/60 font-sans mb-3">
                  {t('search.results')}
                </p>
                <ul className="space-y-2">
                  {results.map((product) => (
                    <li key={product.id}>
                      <Link
                        to={`/${locale}/produto/${product.slug}`}
                        onClick={onClose}
                        className="group flex items-center gap-3 rounded-sm border border-clay/50 bg-cream p-2.5 hover:border-saffron transition-colors"
                      >
                        <img
                          src={product.images[0]}
                          alt=""
                          className="h-12 w-12 shrink-0 rounded-sm object-cover"
                          loading="lazy"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-serif text-sm text-espresso">
                            {product.name[locale]}
                          </span>
                          <span className="block truncate text-[11px] font-sans text-espresso/60">
                            {product.productType[locale]} ·{' '}
                            {formatPrice(product.illustrativePrice, locale)}
                          </span>
                        </span>
                        <ArrowRight className="w-4 h-4 shrink-0 text-gold/70 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/${locale}/loja?q=${encodeURIComponent(query.trim())}`}
                  onClick={onClose}
                  className="mt-4 flex items-center justify-center gap-1.5 rounded-sm border border-clay bg-cream px-3 py-2 text-xs font-sans font-medium text-saffron hover:border-saffron transition-colors"
                >
                  {t('search.viewAll')}
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </>
            ) : (
              <p className="rounded-sm border border-dashed border-clay/60 bg-cream-100 px-4 py-6 text-center font-sans text-xs text-espresso/70">
                {t('search.noResults')}
              </p>
            )}
          </div>
        )}

        {/* Quick links */}
        <div className="mt-4 pt-4 border-t border-clay/60">
          <p className="text-xs uppercase tracking-wider text-espresso/60 font-sans mb-3">
            {t('search.quickLinks')}
          </p>
          <div className="flex flex-wrap gap-2">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={onClose}
                className="group flex items-center gap-1 px-3 py-1.5 rounded-full border border-clay bg-cream text-xs font-sans text-espresso hover:border-saffron hover:text-saffron transition-colors"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="w-3 h-3 text-gold/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Botão do carrinho — Etapa 3: link direto para /{locale}/carrinho com
 * contador de itens (quantidade total) em destaque quando há produtos.
 */
export function CartButton() {
  const { locale } = useLocale()
  const { itemCount } = useCartStore()
  const cartLabel = shopT(locale, 'cart.title')

  return (
    <Link
      to={`/${locale}/carrinho`}
      aria-label={`${cartLabel}${itemCount ? ` (${itemCount})` : ''}`}
      className="relative inline-flex items-center p-2 rounded-full text-espresso/80 hover:text-saffron hover:bg-clay/30 transition-colors focus:outline-none focus:ring-2 focus:ring-saffron/60"
    >
      <ShoppingBag className="w-4 h-4" aria-hidden />
      {itemCount > 0 && (
        <span
          className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-saffron px-1 font-sans text-[10px] font-semibold leading-none text-wine-deep"
          aria-hidden
        >
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </Link>
  )
}
