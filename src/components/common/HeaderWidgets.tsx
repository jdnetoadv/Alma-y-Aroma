import React, { useState } from 'react'
import { Search, ShoppingBag, X, ArrowUpRight } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'

export function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t, locale } = useLocale()
  const [query, setQuery] = useState('')

  const quickLinks = [
    { label: t('menu.incense'), href: `/${locale}/#colecoes` },
    { label: t('menu.candles'), href: `/${locale}/#colecoes` },
    { label: t('menu.aromas'), href: `/${locale}/#colecoes` },
    { label: t('menu.rituals'), href: `/${locale}/#rituais` },
    { label: t('menu.essence'), href: `/${locale}/#essencia` },
  ]

  const handleLinkClick = (href: string) => {
    onClose()
    const targetId = href.split('#')[1]
    if (targetId) {
      const el = document.getElementById(targetId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl bg-cream border-clay text-espresso p-6 sm:p-8">
        <DialogHeader className="text-left space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-serif tracking-[0.2em] text-xs uppercase text-gold">
              Alma y Aroma
            </span>
            <Badge variant="outline" className="border-clay text-[11px] text-espresso/70">
              {t('cart.soon')}
            </Badge>
          </div>
          <DialogTitle className="font-serif text-2xl sm:text-3xl font-normal text-espresso">
            {t('search.placeholder')}
          </DialogTitle>
          <DialogDescription className="font-sans text-xs sm:text-sm text-espresso/70">
            {t('search.soon')}
          </DialogDescription>
        </DialogHeader>

        {/* Input visual */}
        <div className="relative mt-2">
          <Search className="w-4 h-4 text-gold absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            className="w-full bg-cream-100 border border-clay rounded-sm pl-10 pr-4 py-2.5 text-sm text-espresso placeholder:text-espresso/40 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron"
          />
        </div>

        {/* Quick links to existing sections */}
        <div className="mt-4 pt-4 border-t border-clay/60">
          <p className="text-xs uppercase tracking-wider text-espresso/60 font-sans mb-3">
            {t('search.quickLinks')}
          </p>
          <div className="flex flex-wrap gap-2">
            {quickLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => handleLinkClick(link.href)}
                className="group flex items-center gap-1 px-3 py-1.5 rounded-full border border-clay bg-cream text-xs font-sans text-espresso hover:border-saffron hover:text-saffron transition-colors"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="w-3 h-3 text-gold/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function CartButton() {
  const { t } = useLocale()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={t('cart.soon')}
          className="relative p-2 rounded-full text-espresso/80 hover:text-saffron hover:bg-clay/30 transition-colors focus:outline-none focus:ring-2 focus:ring-saffron/60"
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-gold/80" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-64 bg-cream border-clay text-espresso p-4 shadow-elevation"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-serif text-sm font-semibold tracking-wide">ALMA Y AROMA</span>
          <Badge className="bg-clay/60 text-wine-deep hover:bg-clay/80 text-[10px] font-sans font-medium">
            {t('cart.soon')}
          </Badge>
        </div>
        <p className="font-sans text-xs text-espresso/80 leading-relaxed">{t('cart.message')}</p>
      </PopoverContent>
    </Popover>
  )
}
