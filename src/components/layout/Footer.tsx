import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Instagram, MessageCircle, Mail, CheckCircle2, AlertCircle, ArrowUp } from 'lucide-react'
import { Logo } from '@/components/common/Logo'
import { BrandSeal } from '@/components/common/BrandSeal'
import { LanguageSelector } from '@/components/common/LanguageSelector'
import { useLocale } from '@/i18n/LocaleContext'
import { useAmbientAudio } from '@/components/audio/AmbientAudioProvider'
import { siteConfig } from '@/config/site'
import { subscribeNewsletter } from '@/services/newsletter'

export function Footer() {
  const { t, locale } = useLocale()
  const { hasLicensedFile } = useAmbientAudio()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'duplicate' | 'error'
    message: string
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFeedback(null)

    const trimmed = email.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!trimmed || !emailRegex.test(trimmed)) {
      setFeedback({
        type: 'error',
        message: t('newsletter.invalidEmail'),
      })
      return
    }

    setIsSubmitting(true)
    try {
      const res = await subscribeNewsletter({ email: trimmed, locale })
      if (res.success) {
        setFeedback({
          type: 'success',
          message: t('newsletter.success'),
        })
        setEmail('')
      } else if (res.isDuplicate) {
        setFeedback({
          type: 'duplicate',
          message: t('newsletter.duplicate'),
        })
      } else {
        setFeedback({
          type: 'error',
          message: t('newsletter.error'),
        })
      }
    } catch {
      setFeedback({
        type: 'error',
        message: t('newsletter.error'),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSectionScroll = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-wine-deep text-cream/90 relative overflow-hidden border-t border-wine/40">
      {/* Atmosfera quente do banner: halo âmbar difuso + filete dourado no topo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_0%,rgba(208,120,50,0.14),transparent_70%)]"
      />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-12">
        {/* Main 4-column grid on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-cream/10">
          {/* Col 1: Brand & Manifesto (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-4">
              <BrandSeal title="Alma y Aroma" className="h-16 w-16 flex-shrink-0" />
              <Logo variant="light" showTagline />
            </div>
            <p className="font-sans text-xs text-cream/70 leading-relaxed max-w-sm pt-2">
              {t('essence.p2')}
            </p>

            {/* Social / contact - rendered ONLY if configured in siteConfig */}
            <div className="flex items-center gap-3 pt-2">
              {siteConfig.instagramUrl && (
                <a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram da Alma y Aroma"
                  className="w-8 h-8 rounded-full border border-cream/20 flex items-center justify-center text-cream/80 hover:text-saffron hover:border-saffron transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {siteConfig.whatsappNumber && (
                <a
                  href={`https://wa.me/${siteConfig.whatsappNumber.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp da Alma y Aroma"
                  className="w-8 h-8 rounded-full border border-cream/20 flex items-center justify-center text-cream/80 hover:text-saffron hover:border-saffron transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
              {siteConfig.contactEmail && (
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  aria-label="E-mail de contato"
                  className="w-8 h-8 rounded-full border border-cream/20 flex items-center justify-center text-cream/80 hover:text-saffron hover:border-saffron transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Institutional (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-serif text-base tracking-wider uppercase text-cream font-medium">
              {t('footer.institutional')}
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <button
                  type="button"
                  onClick={() => handleSectionScroll('hero')}
                  className="text-cream/70 hover:text-saffron transition-colors"
                >
                  {t('menu.home')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleSectionScroll('colecoes')}
                  className="text-cream/70 hover:text-saffron transition-colors"
                >
                  {t('collections.title')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleSectionScroll('essencia')}
                  className="text-cream/70 hover:text-saffron transition-colors"
                >
                  {t('menu.essence')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleSectionScroll('rituais')}
                  className="text-cream/70 hover:text-saffron transition-colors"
                >
                  {t('ritual.title')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Policies (2 cols) - real links to the compliance drafts (Etapa 4) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-serif text-base tracking-wider uppercase text-cream font-medium">
              {t('footer.policies')}
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              {(
                [
                  ['footer.privacy', 'privacidade'],
                  ['footer.cookies', 'cookies'],
                  ['footer.terms', 'termos'],
                  ['footer.returns', 'trocas'],
                  ['footer.shipping', 'entrega'],
                  ['footer.contact', 'contato'],
                ] as const
              ).map(([key, path]) => (
                <li key={path}>
                  <Link
                    to={`/${locale}/${path}`}
                    className="text-cream/60 hover:text-saffron transition-colors"
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Newsletter capture (3 cols) - real capture into PocketBase */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-base tracking-wider uppercase text-cream font-medium">
              {t('newsletter.title')}
            </h4>
            <p className="font-sans text-xs text-cream/70 leading-relaxed">
              {t('newsletter.subtitle')}
            </p>

            <form onSubmit={handleSubmit} className="space-y-2 pt-1" noValidate>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('newsletter.placeholder')}
                  required
                  disabled={isSubmitting}
                  className="flex-1 bg-cream/10 border border-cream/20 rounded-sm px-3.5 py-2 text-xs text-cream placeholder:text-cream/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-saffron hover:bg-saffron-light text-wine-deep font-semibold px-4 py-2 text-xs uppercase tracking-wider rounded-sm transition-colors flex-shrink-0 disabled:opacity-60"
                >
                  {isSubmitting ? t('newsletter.subscribing') : t('newsletter.button')}
                </button>
              </div>

              {/* Feedback messages */}
              {feedback && (
                <div
                  role="status"
                  className={`flex items-start gap-2 p-2.5 rounded text-xs leading-snug animate-fade-in ${
                    feedback.type === 'success'
                      ? 'bg-wine/60 border border-saffron/40 text-cream'
                      : feedback.type === 'duplicate'
                        ? 'bg-gold/20 border border-gold/40 text-gold-light'
                        : 'bg-red-950/60 border border-red-500/40 text-red-200'
                  }`}
                >
                  {feedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-saffron-light flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  )}
                  <span>{feedback.message}</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-cream/60">
          <div className="flex flex-wrap items-center gap-4">
            <span>{t('footer.rights')}</span>
            <span className="hidden sm:inline">•</span>
            <span className="italic">{t('footer.crafted')}</span>
            {/* Atribuição da faixa real — exibida somente quando o MP3 está tocando */}
            {hasLicensedFile && (
              <>
                <span className="hidden sm:inline">•</span>
                <span className="text-[11px] text-cream/50">
                  Música: Flute of the Silent Valley — omar sahel (djovan), via Pixabay
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Language selector repeated in footer */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-cream/50">
                {t('footer.selectLanguage')}:
              </span>
              <LanguageSelector variant="light" align="right" />
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Voltar ao topo"
              className="p-2 rounded-full border border-cream/20 text-cream/70 hover:text-saffron hover:border-saffron transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
