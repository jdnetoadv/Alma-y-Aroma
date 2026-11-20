import React from 'react'
import { Link } from 'react-router-dom'
import { useLocale } from '@/i18n/LocaleContext'
import { Sparkles, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const { t, locale } = useLocale()

  return (
    <div className="min-h-screen bg-ivory text-graphite flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative smoke wisp */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-sand/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md w-full text-center space-y-6 bg-ivory-100 p-8 sm:p-10 rounded-sm border border-sand shadow-elevation">
        {/* Subtle smoke icon */}
        <div className="w-12 h-12 rounded-full bg-sand/40 border border-gold/40 flex items-center justify-center mx-auto text-gold">
          <Sparkles className="w-5 h-5" />
        </div>

        <div className="space-y-2">
          <span className="font-serif italic text-gold text-xs uppercase tracking-[0.2em]">
            Alma y Aroma
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-graphite leading-tight">
            {t('notfound.title')}
          </h1>
        </div>

        <div className="w-12 h-px bg-gold mx-auto" />

        <p className="font-sans text-xs sm:text-sm text-graphite/75 leading-relaxed">
          {t('notfound.message')}
        </p>

        <div className="pt-2">
          <Link
            to={`/${locale}/`}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-sm bg-olive hover:bg-olive-light text-ivory text-xs uppercase font-sans tracking-wider transition-colors shadow-subtle"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('notfound.backHome')}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
