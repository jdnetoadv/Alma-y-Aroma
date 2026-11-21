import React, { useState } from 'react'
import { Sparkles, ArrowRight, Heart } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleContext'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export interface RitualOption {
  id: string
  labelKey: 'ritual.relax' | 'ritual.meditate' | 'ritual.renew' | 'ritual.nest' | 'ritual.gift'
  descKey:
    | 'ritual.relax.desc'
    | 'ritual.meditate.desc'
    | 'ritual.renew.desc'
    | 'ritual.nest.desc'
    | 'ritual.gift.desc'
  notesKey:
    | 'ritual.relax.notes'
    | 'ritual.meditate.notes'
    | 'ritual.renew.notes'
    | 'ritual.nest.notes'
    | 'ritual.gift.notes'
  imageUrl: string
  relatedCollection: string
}

export function RitualsSection() {
  const { t } = useLocale()
  const [selectedRitual, setSelectedRitual] = useState<RitualOption | null>(null)

  // 5 exact ritual options: Relaxar, Meditar, Renovar, Acolher, Presentear
  const rituals: RitualOption[] = [
    {
      id: 'relaxar',
      labelKey: 'ritual.relax',
      descKey: 'ritual.relax.desc',
      notesKey: 'ritual.relax.notes',
      imageUrl: 'https://img.usecurling.com/p/600/600?q=lavender%20tea%20bath&color=purple',
      relatedCollection: 'col.2.title', // Velas
    },
    {
      id: 'meditar',
      labelKey: 'ritual.meditate',
      descKey: 'ritual.meditate.desc',
      notesKey: 'ritual.meditate.notes',
      imageUrl: 'https://img.usecurling.com/p/600/600?q=meditation%20stone%20incense&color=black',
      relatedCollection: 'col.1.title', // Incensos
    },
    {
      id: 'renovar',
      labelKey: 'ritual.renew',
      descKey: 'ritual.renew.desc',
      notesKey: 'ritual.renew.notes',
      imageUrl: 'https://img.usecurling.com/p/600/600?q=sage%20herbs%20cleanse&color=green',
      relatedCollection: 'col.3.title', // Aromas
    },
    {
      id: 'acolher',
      labelKey: 'ritual.nest',
      descKey: 'ritual.nest.desc',
      notesKey: 'ritual.nest.notes',
      imageUrl:
        'https://img.usecurling.com/p/600/600?q=warm%20blanket%20candle%20amber&color=orange',
      relatedCollection: 'col.5.title', // Acessórios
    },
    {
      id: 'presentear',
      labelKey: 'ritual.gift',
      descKey: 'ritual.gift.desc',
      notesKey: 'ritual.gift.notes',
      imageUrl:
        'https://img.usecurling.com/p/600/600?q=gift%20ribbon%20linen%20botanical&color=white',
      relatedCollection: 'col.6.title', // Kits & Presentes
    },
  ]

  const handleGoToCollection = () => {
    setSelectedRitual(null)
    const el = document.getElementById('colecoes')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="rituais"
      aria-label="Encontre seu Ritual"
      className="py-24 sm:py-32 bg-cream text-espresso relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <span className="font-serif italic text-gold text-sm sm:text-base tracking-widest uppercase">
            Jornada Sensorial
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-espresso mt-2 mb-4">
            {t('ritual.title')}
          </h2>
          <div className="w-12 h-px bg-gold mx-auto mb-4" />
          <p className="font-sans text-xs sm:text-sm text-espresso/70 leading-relaxed">
            {t('ritual.subtitle')}
          </p>
        </div>

        {/* 5 Ritual Tiles: Horizontal row desktop, smooth snap-scroll on mobile */}
        <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 overflow-x-auto sm:overflow-visible pb-6 sm:pb-0 snap-x snap-mandatory scrollbar-none justify-start sm:justify-center">
          {rituals.map((ritual) => (
            <button
              key={ritual.id}
              type="button"
              onClick={() => setSelectedRitual(ritual)}
              className="group flex-shrink-0 w-44 sm:w-auto snap-center text-center focus:outline-none focus:ring-2 focus:ring-saffron/60 rounded-lg p-2 transition-transform duration-300 hover:-translate-y-1.5"
            >
              {/* Circular Tile with Acender (soft gold candle glow) on hover */}
              <div className="relative mx-auto w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full p-1 border border-clay group-hover:border-terracotta transition-colors duration-500">
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md bg-saffron/30 -z-10" />

                <div className="w-full h-full rounded-full overflow-hidden bg-clay/30">
                  <img
                    src={ritual.imageUrl}
                    alt={t(ritual.labelKey)}
                    loading="lazy"
                    className="w-full h-full object-cover transform duration-700 ease-out group-hover:scale-110"
                  />
                </div>
              </div>

              {/* Ritual Name below in serif */}
              <div className="mt-4">
                <h3 className="font-serif text-lg sm:text-xl font-normal text-espresso group-hover:text-terracotta transition-colors">
                  {t(ritual.labelKey)}
                </h3>
                <span className="inline-block w-0 h-0.5 bg-terracotta transition-all duration-300 group-hover:w-8" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Ritual Detail Modal with suggested scent family & related collection */}
      <Dialog
        open={Boolean(selectedRitual)}
        onOpenChange={(open) => !open && setSelectedRitual(null)}
      >
        <DialogContent className="max-w-md bg-cream border-clay text-espresso p-6 sm:p-8">
          {selectedRitual && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-serif text-xs uppercase tracking-[0.2em] text-gold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Ritual Alma y Aroma
                </span>
              </div>

              <div className="mx-auto w-24 h-24 rounded-full overflow-hidden border-2 border-gold/40 shadow-subtle my-2">
                <img
                  src={selectedRitual.imageUrl}
                  alt={t(selectedRitual.labelKey)}
                  className="w-full h-full object-cover"
                />
              </div>

              <DialogHeader className="text-center space-y-2">
                <DialogTitle className="font-serif text-3xl font-normal text-espresso">
                  {t(selectedRitual.labelKey)}
                </DialogTitle>
                <DialogDescription className="font-sans text-xs sm:text-sm text-espresso/80 leading-relaxed pt-1">
                  {t(selectedRitual.descKey)}
                </DialogDescription>
              </DialogHeader>

              {/* Olfactory suggestion badge */}
              <div className="p-3 rounded bg-clay/30 border border-clay/60 text-center">
                <span className="block font-sans text-[10px] uppercase tracking-wider text-espresso/60 font-semibold mb-1">
                  {t('ritual.modal.atmosphere')}
                </span>
                <p className="font-serif italic text-xs text-terracotta-dark font-medium">
                  {t(selectedRitual.notesKey)}
                </p>
              </div>

              {/* Link to related category */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoToCollection}
                  className="border-clay text-espresso hover:border-saffron hover:text-saffron text-xs uppercase tracking-wider rounded-sm"
                >
                  <span>{t('ritual.modal.related')}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 text-gold" />
                </Button>
                <Button
                  type="button"
                  onClick={() => setSelectedRitual(null)}
                  className="bg-wine hover:bg-wine-light text-cream text-xs uppercase tracking-wider rounded-sm"
                >
                  {t('ritual.modal.close')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
