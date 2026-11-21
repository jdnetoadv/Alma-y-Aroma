import React, { useState } from 'react'
import { Sparkles, ArrowRight, X } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface CollectionItem {
  id: string
  titleKey:
    | 'col.1.title'
    | 'col.2.title'
    | 'col.3.title'
    | 'col.4.title'
    | 'col.5.title'
    | 'col.6.title'
  descKey: 'col.1.desc' | 'col.2.desc' | 'col.3.desc' | 'col.4.desc' | 'col.5.desc' | 'col.6.desc'
  imageUrl: string
  aspect: string
}

export function CollectionsSection() {
  const { t } = useLocale()
  const [activeModalItem, setActiveModalItem] = useState<CollectionItem | null>(null)

  // 6 specific boutique categories with sophisticated curated imagery matching palette
  const collections: CollectionItem[] = [
    {
      id: 'incensos',
      titleKey: 'col.1.title',
      descKey: 'col.1.desc',
      imageUrl: 'https://img.usecurling.com/p/800/1000?q=incense%20smoke%20sticks&color=black',
      aspect: 'aspect-[4/5]',
    },
    {
      id: 'velas',
      titleKey: 'col.2.title',
      descKey: 'col.2.desc',
      imageUrl: 'https://img.usecurling.com/p/800/1000?q=scented%20candle%20linen&color=white',
      aspect: 'aspect-[4/5]',
    },
    {
      id: 'aromas',
      titleKey: 'col.3.title',
      descKey: 'col.3.desc',
      imageUrl: 'https://img.usecurling.com/p/800/1000?q=essential%20oil%20diffuser&color=gray',
      aspect: 'aspect-[4/5]',
    },
    {
      id: 'rituais',
      titleKey: 'col.4.title',
      descKey: 'col.4.desc',
      imageUrl: 'https://img.usecurling.com/p/800/1000?q=meditation%20brass%20bell&color=black',
      aspect: 'aspect-[4/5]',
    },
    {
      id: 'acessorios',
      titleKey: 'col.5.title',
      descKey: 'col.5.desc',
      imageUrl: 'https://img.usecurling.com/p/800/1000?q=ceramic%20incense%20holder&color=white',
      aspect: 'aspect-[4/5]',
    },
    {
      id: 'kits',
      titleKey: 'col.6.title',
      descKey: 'col.6.desc',
      imageUrl: 'https://img.usecurling.com/p/800/1000?q=gift%20box%20linen&color=gray',
      aspect: 'aspect-[4/5]',
    },
  ]

  return (
    <section
      id="colecoes"
      aria-label="Nossas Coleções"
      className="py-24 sm:py-32 bg-cream text-espresso relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <span className="font-serif italic text-gold text-sm sm:text-base tracking-widest uppercase">
            Boutique & Rituais
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-espresso mt-2 mb-4">
            {t('collections.title')}
          </h2>
          <div className="w-12 h-px bg-gold mx-auto mb-4" />
          <p className="font-sans text-xs sm:text-sm text-espresso/70 leading-relaxed">
            {t('collections.subtitle')}
          </p>
        </div>

        {/* 6 Categories Grid: 3x2 desktop, 2x3 tablet, single col mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {collections.map((item, index) => (
            <article
              key={item.id}
              className="group cursor-pointer bg-cream-100 rounded-sm overflow-hidden border border-clay/70 shadow-subtle hover:shadow-elevation transition-all duration-500 hover:-translate-y-1 flex flex-col"
              onClick={() => setActiveModalItem(item)}
            >
              {/* Image Container with hover zoom */}
              <div className="relative overflow-hidden aspect-[4/5] bg-clay/30">
                <img
                  src={item.imageUrl}
                  alt={t(item.titleKey)}
                  loading="lazy"
                  className="w-full h-full object-cover transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-wine-deep/70 via-wine-deep/20 to-transparent opacity-60 group-hover:opacity-75 transition-opacity" />

                {/* Numbering badge */}
                <div className="absolute top-4 left-4 w-7 h-7 rounded-full bg-cream/80 backdrop-blur-sm border border-clay/60 flex items-center justify-center font-serif text-xs text-espresso font-medium">
                  0{index + 1}
                </div>

                {/* Overlaid Title on card bottom */}
                <div className="absolute bottom-4 left-4 right-4 text-cream">
                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-cream tracking-wide leading-tight">
                    {t(item.titleKey)}
                  </h3>
                  <div className="w-0 h-0.5 bg-gold mt-2 transition-all duration-300 ease-out group-hover:w-12" />
                </div>
              </div>

              {/* Text Body */}
              <div className="p-5 flex-1 flex flex-col justify-between bg-cream">
                <p className="font-sans text-xs text-espresso/80 leading-relaxed mb-4">
                  {t(item.descKey)}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-clay/40 text-xs font-sans font-medium text-saffron group-hover:text-saffron-dark transition-colors">
                  <span>{t('collections.viewCollection')}</span>
                  <ArrowRight className="w-3.5 h-3.5 transform transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Honest "Em breve" Editorial Overlay for Category */}
      <Dialog
        open={Boolean(activeModalItem)}
        onOpenChange={(open) => !open && setActiveModalItem(null)}
      >
        <DialogContent className="max-w-lg bg-cream border-clay text-espresso p-6 sm:p-8">
          {activeModalItem && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-serif text-xs uppercase tracking-[0.2em] text-gold">
                  Coleção Alma y Aroma
                </span>
                <Badge className="bg-clay/60 text-wine-deep hover:bg-clay/70 text-[11px] font-sans">
                  {t('cart.soon')}
                </Badge>
              </div>

              <div className="overflow-hidden rounded-sm aspect-[16/9] bg-clay/30 my-2">
                <img
                  src={activeModalItem.imageUrl}
                  alt={t(activeModalItem.titleKey)}
                  className="w-full h-full object-cover"
                />
              </div>

              <DialogHeader className="text-left space-y-2">
                <DialogTitle className="font-serif text-2xl sm:text-3xl font-normal text-espresso">
                  {t(activeModalItem.titleKey)}
                </DialogTitle>
                <DialogDescription className="font-sans text-xs sm:text-sm text-espresso/80 leading-relaxed">
                  {t(activeModalItem.descKey)}
                </DialogDescription>
              </DialogHeader>

              <div className="p-3.5 rounded bg-clay/30 border border-clay/60">
                <p className="font-serif italic text-xs text-espresso/90 leading-relaxed">
                  {t('collections.modal.soon')}
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="button"
                  onClick={() => setActiveModalItem(null)}
                  className="bg-wine hover:bg-wine-light text-cream text-xs uppercase tracking-wider rounded-sm"
                >
                  {t('collections.modal.close')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
