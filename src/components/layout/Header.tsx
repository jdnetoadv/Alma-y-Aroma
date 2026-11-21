import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Search } from 'lucide-react'
import { Logo } from '@/components/common/Logo'
import { LanguageSelector } from '@/components/common/LanguageSelector'
import { SearchModal, CartButton } from '@/components/common/HeaderWidgets'
import { AudioControl } from '@/components/audio/AudioComponents'
import { useLocale } from '@/i18n/LocaleContext'

export function Header() {
  const { t, locale } = useLocale()
  const location = useLocation()
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Track scroll position for header glassmorphism transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  // Etapa 2: itens de catálogo direcionam às categorias da loja; "Início",
  // "Nossa Essência" e "Rituais" continuam rolando até seções da homepage.
  const navItems: Array<{
    label: string
    kind: 'anchor' | 'route'
    to: string
    target: string
  }> = [
    { label: t('menu.home'), kind: 'anchor', to: `/${locale}`, target: 'hero' },
    { label: t('menu.incense'), kind: 'route', to: `/${locale}/categoria/incensos`, target: '' },
    { label: t('menu.candles'), kind: 'route', to: `/${locale}/categoria/velas`, target: '' },
    { label: t('menu.aromas'), kind: 'route', to: `/${locale}/categoria/aromas`, target: '' },
    { label: t('menu.kits'), kind: 'route', to: `/${locale}/kits`, target: '' },
    { label: t('menu.rituals'), kind: 'anchor', to: `/${locale}`, target: 'rituais' },
    { label: t('menu.essence'), kind: 'anchor', to: `/${locale}`, target: 'essencia' },
  ]

  const handleNavClick = (item: (typeof navItems)[number]) => {
    setIsMobileMenuOpen(false)
    if (item.kind === 'route') {
      navigate(item.to)
      return
    }
    if (location.pathname !== item.to) {
      // Em uma página interna: volta à homepage antes de rolar
      navigate(item.to)
      return
    }
    const el = document.getElementById(item.target)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-cream/95 backdrop-blur-md shadow-subtle border-b border-clay/50 py-3.5'
            : 'bg-gradient-to-b from-espresso/40 via-espresso/10 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Mobile hamburger + Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Abrir menu de navegação"
              className={`lg:hidden p-2 rounded-full transition-colors ${
                isScrolled
                  ? 'text-espresso hover:text-saffron hover:bg-clay/30'
                  : 'text-cream hover:text-saffron'
              }`}
            >
              <Menu className="w-5 h-5" />
            </button>

            <Logo variant={isScrolled ? 'dark' : 'light'} />
          </div>

          {/* Center: Desktop Navigation Menu */}
          <nav aria-label="Navegação principal" className="hidden lg:flex items-center space-x-7">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavClick(item)}
                className={`relative font-sans text-xs uppercase tracking-[0.14em] font-medium transition-colors group py-1 ${
                  isScrolled
                    ? 'text-espresso/85 hover:text-saffron'
                    : 'text-cream/90 hover:text-cream'
                }`}
              >
                <span>{item.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-saffron transition-all duration-300 ease-out group-hover:w-full" />
              </button>
            ))}
          </nav>

          {/* Right cluster: Search, Cart, Audio, Language (strictly ordered) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* 1. Search */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label={t('search.placeholder')}
              className={`p-2 rounded-full transition-colors ${
                isScrolled
                  ? 'text-espresso/80 hover:text-saffron hover:bg-clay/30'
                  : 'text-cream/90 hover:text-saffron'
              }`}
            >
              <Search className="w-4 h-4" />
            </button>

            {/* 2. Cart (Em breve) */}
            <CartButton />

            {/* 3. Music Control */}
            <AudioControl />

            {/* 4. Language Selector — MUST BE LAST AND IN TOP RIGHT CORNER */}
            <LanguageSelector variant={isScrolled ? 'dark' : 'light'} align="right" />
          </div>
        </div>
      </header>

      {/* Mobile Drawer (full-screen cream background, staggered serif links) */}
      {isMobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-cream flex flex-col justify-between p-6 overflow-y-auto animate-fade-in"
        >
          {/* Drawer top bar */}
          <div className="flex items-center justify-between pb-4 border-b border-clay/60">
            <Logo variant="dark" />
            <div className="flex items-center gap-2">
              <LanguageSelector variant="dark" align="right" />
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Fechar menu"
                className="p-2 rounded-full text-espresso hover:text-saffron transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Drawer navigation links */}
          <nav className="flex-1 flex flex-col justify-center py-8 space-y-5">
            {navItems.map((item, index) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavClick(item)}
                style={{ animationDelay: `${index * 50}ms` }}
                className="text-left font-serif text-2xl sm:text-3xl text-espresso hover:text-saffron transition-colors py-1 border-b border-clay/30 animate-fade-in-up"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Drawer bottom info */}
          <div className="pt-6 border-t border-clay/60 space-y-3">
            <p className="font-serif italic text-xs text-espresso/70">{t('footer.tagline')}</p>
            <p className="font-sans text-[11px] text-espresso/50 tracking-wider uppercase">
              {t('footer.rights')}
            </p>
          </div>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
