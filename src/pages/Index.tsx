import React, { useEffect } from 'react'
import { HeroSection } from '@/components/home/HeroSection'
import { CollectionsSection } from '@/components/home/CollectionsSection'
import { EssenceSection } from '@/components/home/EssenceSection'
import { RitualsSection } from '@/components/home/RitualsSection'
import { MomentSection } from '@/components/home/MomentSection'

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

  return (
    <div className="w-full">
      {/* 1. Cinematic Hero */}
      <HeroSection />

      {/* 2. Nossas Coleções (6 Categories) */}
      <CollectionsSection />

      {/* 3. Nossa Essência (Verbatim Manifesto) */}
      <EssenceSection />

      {/* 4. Encontre seu Ritual (5 Options) */}
      <RitualsSection />

      {/* 5. Um Momento para Você (Editorial Break) */}
      <MomentSection />
    </div>
  )
}
