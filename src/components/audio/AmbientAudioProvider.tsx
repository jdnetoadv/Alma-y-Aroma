import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { siteConfig } from '@/config/site'

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

  const hasLicensedFile = siteConfig.audio.hasLicensedFile

  // Setup HTML Audio element if licensed file exists
  useEffect(() => {
    if (!hasLicensedFile) return

    const audio = new Audio(siteConfig.audio.src)
    audio.loop = true
    audio.volume = siteConfig.audio.defaultVolume
    audioRef.current = audio

    return () => {
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [hasLicensedFile])

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

    // Honest behavior: if no licensed audio file exists, inform the client
    if (!hasLicensedFile) {
      setIsPendingNoticeOpen(true)
      return
    }

    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      try {
        localStorage.setItem(AUDIO_OPT_IN_KEY, 'false')
      } catch {
        /* intentionally ignored */
      }
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true)
          try {
            localStorage.setItem(AUDIO_OPT_IN_KEY, 'true')
          } catch {
            /* intentionally ignored */
          }
        })
        .catch(() => {
          setIsPlaying(false)
        })
    }
  }

  const openPendingNotice = () => setIsPendingNoticeOpen(true)
  const closePendingNotice = () => setIsPendingNoticeOpen(false)

  return (
    <AmbientAudioContext.Provider
      value={{
        isPlaying,
        hasLicensedFile,
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
