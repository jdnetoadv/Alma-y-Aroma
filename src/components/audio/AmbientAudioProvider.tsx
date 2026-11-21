import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { siteConfig } from '@/config/site'
import { startTibetanFluteSynth } from '@/lib/audio/tibetanSynth'

interface AmbientAudioContextValue {
  isPlaying: boolean
  hasLicensedFile: boolean
  hasInteracted: boolean
  isPendingNoticeOpen: boolean
  toggleAudio: () => void
  openPendingNotice: () => void
  closePendingNotice: () => void
  dismissInvite: () => void
  isInviteVisible: boolean
}

const AmbientAudioContext = createContext<AmbientAudioContextValue | null>(null)

const AUDIO_OPT_IN_KEY = 'alma_y_aroma_audio_opt_in'
const AUDIO_INVITE_DISMISSED_KEY = 'alma_y_aroma_audio_dismissed'

export function AmbientAudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPendingNoticeOpen, setIsPendingNoticeOpen] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [isInviteVisible, setIsInviteVisible] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const synthRef = useRef<{ stop: () => void } | null>(null)
  // Which source is in use: null = still probing, true = MP3, false = synth fallback
  const [hasLicensedFile, setHasLicensedFile] = useState<boolean | null>(null)

  // Source resolution: prefer the licensed MP3 when it exists at
  // public/audio/ambiente-loop.mp3; otherwise fall back to the WebAudio
  // tibetan-flute synth (see src/lib/audio/tibetanSynth.ts for the track
  // this fallback stands in for and how to swap it).
  useEffect(() => {
    if (!siteConfig.audio.enabled) return

    let cancelled = false

    const probeFile = async () => {
      try {
        const res = await fetch(siteConfig.audio.src, { method: 'HEAD' })
        return res.ok
      } catch {
        return false
      }
    }

    void probeFile().then((found) => {
      if (cancelled) return
      setHasLicensedFile(found)
      if (!found) return

      const audio = new Audio(siteConfig.audio.src)
      audio.loop = true
      audio.volume = siteConfig.audio.defaultVolume
      audioRef.current = audio
    })

    return () => {
      cancelled = true
      audioRef.current?.pause()
      audioRef.current = null
      synthRef.current?.stop()
      synthRef.current = null
    }
  }, [])

  // Show invite pill after delay if user hasn't opted in or dismissed
  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem(AUDIO_INVITE_DISMISSED_KEY)
      const optedIn = localStorage.getItem(AUDIO_OPT_IN_KEY)
      if (dismissed || optedIn) return
    } catch {
      // Storage unavailable
    }

    const timer = setTimeout(() => {
      setIsInviteVisible(true)
    }, 3800)

    const onScrollOnce = () => {
      setIsInviteVisible(true)
      window.removeEventListener('scroll', onScrollOnce)
    }
    window.addEventListener('scroll', onScrollOnce, { passive: true })

    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', onScrollOnce)
    }
  }, [])

  const dismissInvite = () => {
    setIsInviteVisible(false)
    try {
      sessionStorage.setItem(AUDIO_INVITE_DISMISSED_KEY, 'true')
    } catch {
      // Storage unavailable
    }
  }

  const toggleAudio = () => {
    setHasInteracted(true)
    setIsInviteVisible(false)

    if (hasLicensedFile === null) return // still probing

    const startPlayback = async () => {
      if (hasLicensedFile) {
        const audio = audioRef.current
        if (!audio) return
        await audio.play()
      } else {
        synthRef.current?.stop()
        synthRef.current = startTibetanFluteSynth(siteConfig.audio.defaultVolume)
      }
      setIsPlaying(true)
      try {
        localStorage.setItem(AUDIO_OPT_IN_KEY, 'true')
      } catch {
        /* intentionally ignored */
      }
    }

    const stopPlayback = () => {
      if (hasLicensedFile) {
        audioRef.current?.pause()
      } else {
        synthRef.current?.stop()
        synthRef.current = null
      }
      setIsPlaying(false)
      try {
        localStorage.setItem(AUDIO_OPT_IN_KEY, 'false')
      } catch {
        /* intentionally ignored */
      }
    }

    if (isPlaying) {
      stopPlayback()
      return
    }

    void startPlayback().catch(() => {
      setIsPlaying(false)
    })
  }

  const openPendingNotice = () => setIsPendingNoticeOpen(true)
  const closePendingNotice = () => setIsPendingNoticeOpen(false)

  return (
    <AmbientAudioContext.Provider
      value={{
        isPlaying,
        hasLicensedFile: hasLicensedFile === true,
        hasInteracted,
        isPendingNoticeOpen,
        toggleAudio,
        openPendingNotice,
        closePendingNotice,
        dismissInvite,
        isInviteVisible,
      }}
    >
      {children}
    </AmbientAudioContext.Provider>
  )
}

export function useAmbientAudio(): AmbientAudioContextValue {
  const ctx = useContext(AmbientAudioContext)
  if (!ctx) {
    throw new Error('useAmbientAudio must be used within an AmbientAudioProvider')
  }
  return ctx
}
