import React, { useEffect } from 'react'
import { HeroSection } from '@/components/home/HeroSection'
import { CollectionsSection } from '@/components/home/CollectionsSection'
import { EssenceSection } from '@/components/home/EssenceSection'
import { RitualsSection } from '@/components/home/RitualsSection'
import { MomentSection } from '@/components/home/MomentSection'
import { useHomeShelves, HomeShelfSection } from '@/components/home/HomeShelves'
import { useCatalogReady } from '@/data/repository'

export default function Index() {
  // Handle hash navigation if present when page mounts or hash changes
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '')
      const el = document.getElementById(id)
      if (el) {
        // Slight timeout to allow layout paint
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    }
  }, [])

  // Etapa 5: vitrines dinâmicas — renderizam depois que o catálogo do
  // backend (ou fallback local) está pronto.
  const ready = useCatalogReady()
  const shelves = useHomeShelves(ready)

  return (
    <div className="w-full">
      {/* 1. Cinematic Hero */}
      <HeroSection />

      {/* 2. Nossas Coleções (6 Categories) */}
      <CollectionsSection />

      {/* 3. Vitrines dinâmicas (Etapa 5): seleção editorial, novidades,
          presentes e rituais — produtos reais do repositório central. */}
      {shelves.map((shelf) => (
        <HomeShelfSection key={shelf.id} shelf={shelf} />
      ))}

      {/* 4. Nossa Essência (Verbatim Manifesto) */}
      <EssenceSection />

      {/* 5. Encontre seu Ritual (5 Options) */}
      <RitualsSection />

      {/* 6. Um Momento para Você (Editorial Break) */}
      <MomentSection />
    </div>
  )
}
