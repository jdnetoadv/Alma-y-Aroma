import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { siteConfig } from '@/config/site'
import { startTibetanFluteSynth } from '@/lib/audio/tibetanSynth'

interface AmbientAudioContextValue {
  isPlaying: boolean
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
const FADE_IN_MS = 2500

// Fonte em uso: 'file' = MP3 local, 'external' = faixa por URL (streaming),
// 'synth' = fallback sintetizado, null = ainda sondando.
type AudioSource = 'file' | 'external' | 'synth' | null

export function AmbientAudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPendingNoticeOpen, setIsPendingNoticeOpen] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [isInviteVisible, setIsInviteVisible] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const synthRef = useRef<{ stop: () => void } | null>(null)
  const fadeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  // Refs espelhando o estado para uso dentro de callbacks assíncronos sem
  // depender de closures obsoletas (stale state após await).
  const sourceRef = useRef<AudioSource>(null)
  const isPlayingRef = useRef(false)
  const probeDoneRef = useRef<Promise<void> | null>(null)
  const pendingToggleRef = useRef(false)
  const toggleAudioRef = useRef<() => void>(() => {})

  // Cadeia de prioridade: MP3 local (public/audio/ambiente-loop.mp3, se existir)
  // → faixa externa por URL (siteConfig.audio.externalSrc, streaming) →
  // sintetizador WebAudio (src/lib/audio/tibetanSynth.ts).
  const probeLocalFile = async (): Promise<boolean> => {
    try {
      const res = await fetch(siteConfig.audio.localSrc, { method: 'HEAD' })
      // Um host SPA com fallback responde 200 com index.html (text/html) para
      // QUALQUER caminho inexistente — só aceitamos audio/*.
      if (!res.ok) return false
      const type = res.headers.get('content-type') ?? ''
      return type.startsWith('audio/')
    } catch {
      return false
    }
  }

  const createAudio = (src: string) => {
    const audio = new Audio(src)
    audio.loop = true
    audio.volume = siteConfig.audio.defaultVolume
    audio.onerror = () => {
      // Falha tardia (404, rede caiu no meio, codec): se estava tocando, cai no synth.
      if (isPlayingRef.current && audioRef.current === audio) {
        console.warn('[audio] erro ao tocar a faixa — usando o synth WebAudio')
        void fallbackToSynth()
      }
    }
    return audio
  }

  useEffect(() => {
    if (!siteConfig.audio.enabled) return

    let cancelled = false

    probeDoneRef.current = probeLocalFile().then((hasLocal) => {
      if (cancelled) return
      if (hasLocal) {
        sourceRef.current = 'file'
        audioRef.current = createAudio(siteConfig.audio.localSrc)
      } else if (siteConfig.audio.externalSrc) {
        sourceRef.current = 'external'
        audioRef.current = createAudio(siteConfig.audio.externalSrc)
      } else {
        sourceRef.current = 'synth'
      }
    })

    return () => {
      cancelled = true
      stopFade()
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

  const stopFade = () => {
    if (fadeTimerRef.current) {
      clearInterval(fadeTimerRef.current)
      fadeTimerRef.current = null
    }
  }

  // Volume gradual de 0 até o padrão em FADE_IN_MS.
  const fadeIn = (audio: HTMLAudioElement) => {
    stopFade()
    const target = siteConfig.audio.defaultVolume
    const start = Date.now()
    audio.volume = 0
    fadeTimerRef.current = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / FADE_IN_MS)
      audio.volume = target * p
      if (p >= 1) stopFade()
    }, 100)
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

  // Troca a fonte por ordem: arquivo/URL falhou → synth, sem quebrar a UI.
  const fallbackToSynth = async () => {
    stopFade()
    audioRef.current?.pause()
    audioRef.current = null
    sourceRef.current = 'synth'
    try {
      await startSynthFallback()
      isPlayingRef.current = true
      setIsPlaying(true)
    } catch (synthErr) {
      console.error('[audio] synth WebAudio também falhou:', synthErr)
      isPlayingRef.current = false
      setIsPlaying(false)
    }
  }

  const toggleAudio = () => {
    setHasInteracted(true)
    setIsInviteVisible(false)

    // Clique durante o probe (rede lenta): enfileira e executa quando a fonte
    // resolver, em vez de descartar o clique silenciosamente.
    if (sourceRef.current === null) {
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
      if (sourceRef.current !== 'synth') {
        stopFade()
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
      if (sourceRef.current !== 'synth') {
        const audio = audioRef.current
        if (!audio) throw new Error('Elemento de áudio não disponível')
        // play() é chamado síncronamente dentro do gesto do clique.
        fadeIn(audio)
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
      if (sourceRef.current !== 'synth') {
        // O arquivo/URL não tocou (404, rede, codec): cai para o synth na hora —
        // o usuário clicou e quer ouvir algo.
        void fallbackToSynth()
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
