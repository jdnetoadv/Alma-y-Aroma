import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import { catalogRepository } from '@/data/repository'
import { ProductCategory } from '@/data/types'

export interface CollectionItem {
  id: ProductCategory
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
  const { t, locale } = useLocale()

  // 6 specific boutique categories with sophisticated curated imagery matching palette.
  // Cada card direciona à página de categoria correspondente na loja (Etapa 2).
  const collections: CollectionItem[] = [
    {
      id: 'incensos-defumacao',
      titleKey: 'col.1.title',
      descKey: 'col.1.desc',
      imageUrl: 'https://img.usecurling.com/p/800/1000?q=incense%20smoke%20sticks&color=black',
      aspect: 'aspect-[4/5]',
    },
    {
      id: 'velas-aromaticas',
      titleKey: 'col.2.title',
      descKey: 'col.2.desc',
      imageUrl: 'https://img.usecurling.com/p/800/1000?q=scented%20candle%20linen&color=white',
      aspect: 'aspect-[4/5]',
    },
    {
      id: 'aromas-essencias',
      titleKey: 'col.3.title',
      descKey: 'col.3.desc',
      imageUrl: 'https://img.usecurling.com/p/800/1000?q=essential%20oil%20diffuser&color=gray',
      aspect: 'aspect-[4/5]',
    },
    {
      id: 'meditacao-relaxamento',
      titleKey: 'col.4.title',
      descKey: 'col.4.desc',
      imageUrl: 'https://img.usecurling.com/p/800/1000?q=meditation%20brass%20bell&color=black',
      aspect: 'aspect-[4/5]',
    },
    {
      id: 'decoracao-zen',
      titleKey: 'col.5.title',
      descKey: 'col.5.desc',
      imageUrl: 'https://img.usecurling.com/p/800/1000?q=ceramic%20incense%20holder&color=white',
      aspect: 'aspect-[4/5]',
    },
    {
      id: 'kits-presentes',
      titleKey: 'col.6.title',
      descKey: 'col.6.desc',
      imageUrl: 'https://img.usecurling.com/p/800/1000?q=gift%20box%20linen&color=gray',
      aspect: 'aspect-[4/5]',
    },
  ]

  const hrefFor = (id: ProductCategory): string => {
    const category = catalogRepository.getCategory(id)
    const slug = category?.slug ?? id
    return `/${locale}/categoria/${slug}`
  }

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
            <Link
              key={item.id}
              to={hrefFor(item.id)}
              className="group bg-cream-100 rounded-sm overflow-hidden border border-clay/70 shadow-subtle hover:shadow-elevation transition-all duration-500 hover:-translate-y-1 flex flex-col focus:outline-none focus:ring-2 focus:ring-saffron"
              aria-label={`${t('collections.viewCollection')} — ${t(item.titleKey)}`}
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
