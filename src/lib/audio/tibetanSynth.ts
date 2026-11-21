/**
 * Tibetan-style flute ambient loop, generated in the browser via Web Audio API.
 *
 * Fallback active because the licensed MP3 could not be programmatically
 * downloaded from Pixabay (the direct CDN file is a binary the agent tooling
 * cannot save; the page is Cloudflare-protected against scripted access):
 *
 *   "soothing tibetian flute music" — PoorArtistt, Pixabay (Pixabay Content
 *   License, free for use), track id 575523 (pixabay.com/music, busca
 *   "tibetian flute", autor PoorArtistt).
 *
 * To switch to the licensed track, drop it at public/audio/ambiente-loop.mp3
 * (download from the URL above) — the provider prefers the file whenever it
 * exists and never instantiates this synth in that case.
 *
 * The synth plays a slow minor-pentatonic phrase over a warm drone bed with
 * long silences between notes, like a bamboo/himalayan flute breathing.
 */

interface SynthHandle {
  stop: () => void
}

const PENTATONIC_BASE_HZ = 220 // A3 — low, warm register
const SCALE_RATIO = [1, 9 / 8, 6 / 5, 3 / 2, 8 / 5] // minor pentatonic ratios
const NOTE_MIN_GAP_S = 3.5
const NOTE_MAX_GAP_S = 9
const DRONE_LEVEL = 0.045
const NOTE_LEVEL = 0.16
const FADE_IN_S = 2.5

export async function startTibetanFluteSynth(volume: number): Promise<SynthHandle> {
  const AudioCtx: typeof AudioContext =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  if (!AudioCtx) {
    throw new Error('Web Audio API não suportada neste navegador')
  }

  const ctx = new AudioCtx()

  // Autoplay policy: contextos criados fora de um gesto efetivo (ou em
  // Safari/iOS, mesmo dentro dele) nascem "suspended" — osciladores rodando
  // num contexto suspenso produzem silêncio absoluto. Resume() PRECISA
  // acontecer dentro da cadeia síncrona do clique e o estado é conferido:
  // ícone "tocando" sem som é o pior cenário possível.
  const readState = (): AudioContextState => ctx.state
  if (readState() !== 'running') {
    try {
      await ctx.resume()
    } catch (err) {
      console.error('[tibetanSynth] ctx.resume() falhou:', err)
      void ctx.close().catch(() => {})
      throw new Error('AudioContext não pôde ser retomado (política de autoplay do navegador)')
    }
    if (readState() !== 'running') {
      void ctx.close().catch(() => {})
      throw new Error(`AudioContext seguiu em "${readState()}" após resume()`)
    }
  }

  const master = ctx.createGain()
  master.gain.setValueAtTime(0.0001, ctx.currentTime)
  master.connect(ctx.destination)
  master.gain.linearRampToValueAtTime(volume, ctx.currentTime + FADE_IN_S)

  // Warm tube-like saturation
  const shaper = ctx.createWaveShaper()
  const curve = new Float32Array(256)
  for (let i = 0; i < 256; i++) {
    const x = (i / 255) * 2 - 1
    curve[i] = Math.tanh(x * 2.2) / Math.tanh(2.2)
  }
  shaper.curve = curve
  shaper.connect(master)

  // Simple stereo-width feedback delay: adds the airy tail of a big hall
  const delay = ctx.createDelay(1.5)
  delay.delayTime.value = 0.42
  const feedback = ctx.createGain()
  feedback.gain.value = 0.32
  const wet = ctx.createGain()
  wet.gain.value = 0.35
  delay.connect(feedback)
  feedback.connect(delay)
  delay.connect(wet)
  wet.connect(shaper)

  const droneOut = ctx.createGain()
  droneOut.gain.value = DRONE_LEVEL
  droneOut.connect(shaper)

  const noteOut = ctx.createGain()
  noteOut.gain.value = NOTE_LEVEL
  noteOut.connect(delay)
  noteOut.connect(shaper)

  const timers: number[] = []
  let stopped = false

  const schedule = (fn: () => void, delayS: number) => {
    const id = window.setTimeout(() => {
      if (!stopped) fn()
    }, delayS * 1000)
    timers.push(id)
  }

  // ── Drone bed: root + fifth, slightly detuned, slow breathing LFO ──
  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  lfo.frequency.value = 0.07
  lfoGain.gain.value = 0.018
  lfo.connect(lfoGain)

  const droneVoices: Array<{ mult: number; detune: number }> = [
    { mult: 1, detune: -4 },
    { mult: 1, detune: 5 },
    { mult: 3 / 2, detune: 3 },
    { mult: 2, detune: -6 },
  ]
  for (const voice of droneVoices) {
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = PENTATONIC_BASE_HZ * voice.mult
    osc.detune.value = voice.detune
    const gain = ctx.createGain()
    gain.gain.value = voice.mult === 1 ? 1 : 0.4
    lfoGain.connect(gain.gain)
    osc.connect(gain)
    gain.connect(droneOut)
    osc.start()
  }
  lfo.start()

  // ── Flute notes: pentatonic phrase, one note at a time, long silences ──
  const playNote = () => {
    const degree = Math.floor(Math.random() * SCALE_RATIO.length)
    const octave = Math.random() < 0.3 ? 2 : 1
    const freq = PENTATONIC_BASE_HZ * SCALE_RATIO[degree] * octave

    const now = ctx.currentTime
    const attack = 0.6 + Math.random() * 0.5
    const hold = 1.4 + Math.random() * 1.4
    const release = 1.6 + Math.random() * 1.2
    const breath = ctx.createOscillator()
    breath.frequency.value = 5 + Math.random() * 3 // soft vibrato

    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.value = freq

    const vibrato = ctx.createGain()
    vibrato.gain.value = freq * 0.006
    breath.connect(vibrato)
    vibrato.connect(osc.frequency)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.linearRampToValueAtTime(1, now + attack)
    gain.gain.setValueAtTime(1, now + attack + hold)
    gain.gain.linearRampToValueAtTime(0.0001, now + attack + hold + release)

    osc.connect(gain)
    gain.connect(noteOut)
    osc.start(now)
    breath.start(now)
    const total = attack + hold + release
    osc.stop(now + total)
    breath.stop(now + total)
  }

  const scheduleNextNote = () => {
    const gap = NOTE_MIN_GAP_S + Math.random() * (NOTE_MAX_GAP_S - NOTE_MIN_GAP_S)
    schedule(() => {
      playNote()
      scheduleNextNote()
    }, gap)
  }
  scheduleNextNote()

  return {
    stop: () => {
      if (stopped) return
      stopped = true
      for (const id of timers) window.clearTimeout(id)
      try {
        master.gain.cancelScheduledValues(ctx.currentTime)
        master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
        master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5)
      } catch {
        // already closed
      }
      window.setTimeout(() => {
        void ctx.close().catch(() => {
          /* already closed */
        })
      }, 600)
    },
  }
}
