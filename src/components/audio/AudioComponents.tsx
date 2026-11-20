import React from 'react'
import { Volume2, VolumeX, Sparkles, X } from 'lucide-react'
import { useAmbientAudio } from './AmbientAudioProvider'
import { useLocale } from '@/i18n/LocaleContext'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function AudioControl() {
  const { isPlaying, toggleAudio } = useAmbientAudio()
  const { t } = useLocale()

  return (
    <button
      type="button"
      onClick={toggleAudio}
      aria-label={isPlaying ? t('audio.playing') : t('audio.button')}
      className="group relative flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-sand/60 bg-ivory/80 backdrop-blur-sm text-graphite hover:border-gold hover:text-gold transition-colors focus:outline-none focus:ring-2 focus:ring-gold/60"
      title={isPlaying ? t('audio.playing') : t('audio.button')}
    >
      {isPlaying ? (
        <span className="flex items-center gap-0.5 h-3.5 px-0.5">
          <span className="w-0.5 bg-gold rounded-full h-2.5 animate-pulse" />
          <span className="w-0.5 bg-gold rounded-full h-3.5 animate-pulse delay-75" />
          <span className="w-0.5 bg-gold rounded-full h-2 animate-pulse delay-150" />
        </span>
      ) : (
        <VolumeX className="w-4 h-4 text-graphite/70 group-hover:text-gold transition-colors" />
      )}
      <span className="hidden md:inline-block text-[11px] uppercase tracking-wider font-medium text-graphite/80 group-hover:text-gold">
        {isPlaying ? (
          <span className="flex items-center gap-1">
            <Volume2 className="w-3 h-3 text-gold" />
            Som
          </span>
        ) : (
          'Som'
        )}
      </span>
    </button>
  )
}

export function AudioInvitePill() {
  const { isInviteVisible, toggleAudio, dismissInvite } = useAmbientAudio()
  const { t } = useLocale()

  if (!isInviteVisible) return null

  return (
    <div
      role="region"
      aria-label={t('audio.title')}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0 z-40 max-w-[92vw] sm:max-w-md animate-fade-in-up"
    >
      <div className="flex items-center gap-3 px-4 py-3 bg-ivory/95 backdrop-blur-md rounded-full shadow-elevation border border-sand text-graphite">
        <div className="w-8 h-8 rounded-full bg-sand/40 flex items-center justify-center flex-shrink-0 text-gold">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0 pr-1">
          <p className="text-xs font-serif italic text-graphite/90 truncate">{t('audio.invite')}</p>
          <button
            type="button"
            onClick={toggleAudio}
            className="text-xs font-medium text-gold hover:text-gold-dark underline underline-offset-2 transition-colors"
          >
            {t('audio.button')}
          </button>
        </div>
        <button
          type="button"
          onClick={dismissInvite}
          aria-label={t('collections.modal.close')}
          className="p-1 rounded-full text-graphite/50 hover:text-graphite transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

export function AudioPendingModal() {
  const { isPendingNoticeOpen, closePendingNotice } = useAmbientAudio()
  const { t } = useLocale()

  return (
    <Dialog open={isPendingNoticeOpen} onOpenChange={(open) => !open && closePendingNotice()}>
      <DialogContent className="max-w-md bg-ivory border-sand text-graphite p-7">
        <DialogHeader className="text-center space-y-3">
          <div className="mx-auto w-12 h-12 rounded-full bg-sand/40 flex items-center justify-center text-gold">
            <Volume2 className="w-6 h-6" />
          </div>
          <DialogTitle className="font-serif text-2xl font-normal text-graphite">
            {t('audio.title')}
          </DialogTitle>
          <DialogDescription className="font-sans text-sm text-graphite/80 leading-relaxed pt-2">
            {t('audio.pending')}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 pt-4 border-t border-sand/60 flex justify-center">
          <Button
            type="button"
            onClick={closePendingNotice}
            className="bg-olive hover:bg-olive-light text-ivory px-6 font-sans text-xs uppercase tracking-wider rounded-sm transition-colors"
          >
            {t('audio.close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
