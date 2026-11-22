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
  // Refs espelhando o estado para uso dentro de callbacks assíncronos sem
  // depender de closures obsoletas (stale state após await).
  const hasLicensedFileRef = useRef<boolean | null>(null)
  const isPlayingRef = useRef(false)
  const probeDoneRef = useRef<Promise<boolean> | null>(null)
  const pendingToggleRef = useRef(false)
  const toggleAudioRef = useRef<() => void>(() => {})

  // Source resolution: prefer the licensed MP3 when it exists at
  // public/audio/ambiente-loop.mp3; otherwise fall back to the WebAudio
  // zen-meditation soundscape (drone + tibetan bowls, see
  // src/lib/audio/tibetanSynth.ts).
  const probeFile = async (): Promise<boolean> => {
    try {
      const res = await fetch(siteConfig.audio.src, { method: 'HEAD' })
      // Um host SPA com fallback responde 200 com index.html (text/html) para
      // QUALQUER caminho inexistente — res.ok sozinho dá falso-positivo e o
      // <audio> apontando para HTML falha em silêncio. Só aceitamos audio/*.
      if (!res.ok) return false
      const type = res.headers.get('content-type') ?? ''
      if (!type.startsWith('audio/')) {
        console.warn(
          `[audio] ${siteConfig.audio.src} respondeu "${type}" (não é audio/*) — usando o synth WebAudio`,
        )
        return false
      }
      return true
    } catch (err) {
      console.warn('[audio] probe do MP3 falhou — usando o synth WebAudio:', err)
      return false
    }
  }

  useEffect(() => {
    if (!siteConfig.audio.enabled) return

    let cancelled = false

    probeDoneRef.current = probeFile()

    void probeDoneRef.current.then((found) => {
      if (cancelled) return
      setHasLicensedFile(found)
      hasLicensedFileRef.current = found
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const startSynthFallback = async () => {
    synthRef.current?.stop()
    synthRef.current = null
    // startTibetanFluteSynth faz ctx.resume() DENTRO do gesto do clique e
    // lança (com console.error) se o contexto não retomar — nunca retorna um
    // handle "tocando" para um contexto suspenso.
    const handle = await startTibetanFluteSynth(siteConfig.audio.defaultVolume)
    synthRef.current = handle
  }

  const toggleAudio = () => {
    setHasInteracted(true)
    setIsInviteVisible(false)

    // Clique durante o probe (rede lenta): enfileira e executa quando a fonte
    // resolver, em vez de descartar o clique silenciosamente.
    if (hasLicensedFileRef.current === null) {
      if (!pendingToggleRef.current) {
        pendingToggleRef.current = true
        void probeDoneRef.current?.then(() => {
          const wanted = pendingToggleRef.current
          pendingToggleRef.current = false
          if (wanted) toggleAudioRef.current()
        })
      }
      return
    }

    const stopPlayback = () => {
      if (hasLicensedFileRef.current) {
        audioRef.current?.pause()
      } else {
        synthRef.current?.stop()
        synthRef.current = null
      }
      isPlayingRef.current = false
      setIsPlaying(false)
      try {
        localStorage.setItem(AUDIO_OPT_IN_KEY, 'false')
      } catch {
        /* intentionally ignored */
      }
    }

    if (isPlayingRef.current) {
      stopPlayback()
      return
    }

    const startPlayback = async () => {
      if (hasLicensedFileRef.current) {
        const audio = audioRef.current
        if (!audio) throw new Error('Elemento de áudio MP3 não disponível')
        await audio.play()
      } else {
        await startSynthFallback()
      }
      isPlayingRef.current = true
      setIsPlaying(true)
      try {
        localStorage.setItem(AUDIO_OPT_IN_KEY, 'true')
      } catch {
        /* intentionally ignored */
      }
    }

    void startPlayback().catch((err) => {
      // NUNCA engolir o erro: ícone "tocando" sem som é o pior cenário.
      console.error('[audio] playback falhou:', err)
      // Se o MP3 falhou no play (corrompido, 404 tardio, codec), cai para o
      // synth imediatamente — o usuário clicou e quer ouvir algo.
      if (hasLicensedFileRef.current) {
        hasLicensedFileRef.current = false
        setHasLicensedFile(false)
        audioRef.current?.pause()
        audioRef.current = null
        startSynthFallback()
          .then(() => {
            isPlayingRef.current = true
            setIsPlaying(true)
          })
          .catch((synthErr) => {
            console.error('[audio] synth WebAudio também falhou:', synthErr)
            isPlayingRef.current = false
            setIsPlaying(false)
          })
      } else {
        synthRef.current?.stop()
        synthRef.current = null
        isPlayingRef.current = false
        setIsPlaying(false)
      }
    })
  }

  // Mantém o ref sempre apontando para o toggle mais recente (o enfileiramento
  // do probe reinvoca através dele).
  toggleAudioRef.current = toggleAudio

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
