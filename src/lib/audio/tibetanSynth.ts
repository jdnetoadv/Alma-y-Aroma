/**
 * Paisagem sonora zen de meditação, gerada no navegador via Web Audio API.
 *
 * Não há arquivo de áudio licenciado em public/audio/ambiente-loop.mp3: o
 * download de faixas de domínio público/royalty-free não foi possível no
 * ambiente de build, então esta é a versão sintetizada. O provider prefere o
 * arquivo sempre que ele existir e nunca instancia este synth nesse caso.
 *
 * Composição (lenta e grave, volume baixo):
 *   - drone contínuo em lá grave (A1 + quinta), com respiração muito lenta;
 *   - tigelas tibetanas: fundamental + parciais inarmônicos com decay longo
 *     (12–20 s), batidas esparsas a cada 15–30 s;
 *   - gongo suave ocasional (a cada 75–150 s), com entrada lenta;
 *   - reverb longo e escuro (delay com filtro passa-baixa no feedback) e
 *     filtro passa-baixa geral: nada agudo nem percussivo.
 */

interface SynthHandle {
  stop: () => void
}

interface Partial {
  ratio: number
  gain: number
  decayScale: number
}

const DRONE_ROOT_HZ = 55 // A1 — grave e estável
const DRONE_FIFTH_HZ = 82.41 // E2 — quinta justa acima
const DRONE_LEVEL = 0.1
const DRONE_BREATH_HZ = 0.03

const BOWL_ROOTS_HZ = [146.83, 164.81, 220, 246.94] // D3, E3, A3, B3
const BOWL_PARTIALS: Partial[] = [
  { ratio: 1, gain: 1, decayScale: 1 },
  { ratio: 2.71, gain: 0.35, decayScale: 0.6 },
  { ratio: 5.13, gain: 0.14, decayScale: 0.35 },
  { ratio: 8.4, gain: 0.05, decayScale: 0.2 },
]
const BOWL_LEVEL = 0.2
const BOWL_MIN_GAP_S = 15
const BOWL_MAX_GAP_S = 30
const BOWL_FIRST_DELAY_S = 4

const GONG_ROOT_HZ = 73.42 // D2
const GONG_PARTIALS: Partial[] = [
  { ratio: 1, gain: 1, decayScale: 1 },
  { ratio: 1.52, gain: 0.5, decayScale: 0.7 },
  { ratio: 2.14, gain: 0.3, decayScale: 0.5 },
  { ratio: 2.73, gain: 0.15, decayScale: 0.3 },
]
const GONG_LEVEL = 0.16
const GONG_ATTACK_S = 1.8
const GONG_MIN_GAP_S = 75
const GONG_MAX_GAP_S = 150

const FADE_IN_S = 4
const FADE_OUT_S = 0.5

const pick = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)]
const between = (min: number, max: number) => min + Math.random() * (max - min)

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
      console.error('[zenSynth] ctx.resume() falhou:', err)
      void ctx.close().catch(() => {})
      throw new Error('AudioContext não pôde ser retomado (política de autoplay do navegador)')
    }
    if (readState() !== 'running') {
      void ctx.close().catch(() => {})
      throw new Error(`AudioContext seguiu em "${readState()}" após resume()`)
    }
  }

  // ── Cadeia de saída: master (fade) → tom escuro → destino ──
  const master = ctx.createGain()
  master.gain.setValueAtTime(0.0001, ctx.currentTime)
  master.gain.linearRampToValueAtTime(volume, ctx.currentTime + FADE_IN_S)
  master.connect(ctx.destination)

  const tone = ctx.createBiquadFilter()
  tone.type = 'lowpass'
  tone.frequency.value = 1000
  tone.Q.value = 0.5
  tone.connect(master)

  // Barramento seco: todas as fontes somam aqui
  const mix = ctx.createGain()
  mix.gain.value = 1
  mix.connect(tone)

  // Reverb longo e escuro: delay com filtro no feedback (cada repetição fica mais grave)
  const delay = ctx.createDelay(2)
  delay.delayTime.value = 0.9
  const damp = ctx.createBiquadFilter()
  damp.type = 'lowpass'
  damp.frequency.value = 1400
  const feedback = ctx.createGain()
  feedback.gain.value = 0.45
  const wet = ctx.createGain()
  wet.gain.value = 0.35
  mix.connect(delay)
  delay.connect(damp)
  damp.connect(feedback)
  feedback.connect(delay)
  damp.connect(wet)
  wet.connect(tone)

  const droneOut = ctx.createGain()
  droneOut.gain.value = 1
  droneOut.connect(mix)

  const bowlOut = ctx.createGain()
  bowlOut.gain.value = 1
  bowlOut.connect(mix)

  const gongOut = ctx.createGain()
  gongOut.gain.value = 1
  gongOut.connect(mix)

  const timers: number[] = []
  let stopped = false

  const schedule = (fn: () => void, delayS: number) => {
    const id = window.setTimeout(() => {
      if (!stopped) fn()
    }, delayS * 1000)
    timers.push(id)
  }

  // ── Drone: fundamental + quinta, com respiração lentíssima no volume ──
  const breath = ctx.createOscillator()
  breath.frequency.value = DRONE_BREATH_HZ
  const breathDepth = ctx.createGain()
  breathDepth.gain.value = DRONE_LEVEL * 0.3
  breath.connect(breathDepth)

  const droneGain = ctx.createGain()
  droneGain.gain.value = DRONE_LEVEL
  breathDepth.connect(droneGain.gain)
  droneGain.connect(droneOut)

  for (const freq of [DRONE_ROOT_HZ, DRONE_FIFTH_HZ]) {
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq
    osc.detune.value = (Math.random() - 0.5) * 4
    osc.connect(droneGain)
    osc.start()
  }
  breath.start()

  // ── Golpe de tigela / gongo: parciais inarmônicos com decay longo ──
  const strike = (
    root: number,
    partials: Partial[],
    level: number,
    decayS: number,
    attackS: number,
    dest: AudioNode,
  ) => {
    const now = ctx.currentTime
    for (const p of partials) {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = root * p.ratio
      osc.detune.value = (Math.random() - 0.5) * 6
      const env = ctx.createGain()
      const peak = Math.max(0.0002, p.gain * level)
      const length = decayS * p.decayScale
      env.gain.setValueAtTime(0.0001, now)
      env.gain.exponentialRampToValueAtTime(peak, now + attackS)
      env.gain.exponentialRampToValueAtTime(0.0001, now + attackS + length)
      osc.connect(env)
      env.connect(dest)
      osc.start(now)
      osc.stop(now + attackS + length + 0.2)
    }
  }

  const playBowl = () => {
    strike(pick(BOWL_ROOTS_HZ), BOWL_PARTIALS, BOWL_LEVEL, between(12, 20), 0.03, bowlOut)
  }

  const scheduleNextBowl = (firstDelayS?: number) => {
    const gap = firstDelayS ?? between(BOWL_MIN_GAP_S, BOWL_MAX_GAP_S)
    schedule(() => {
      playBowl()
      scheduleNextBowl()
    }, gap)
  }
  scheduleNextBowl(BOWL_FIRST_DELAY_S)

  const playGong = () => {
    strike(GONG_ROOT_HZ, GONG_PARTIALS, GONG_LEVEL, between(18, 24), GONG_ATTACK_S, gongOut)
  }

  const scheduleNextGong = () => {
    schedule(
      () => {
        playGong()
        scheduleNextGong()
      },
      between(GONG_MIN_GAP_S, GONG_MAX_GAP_S),
    )
  }
  scheduleNextGong()

  return {
    stop: () => {
      if (stopped) return
      stopped = true
      for (const id of timers) window.clearTimeout(id)
      try {
        master.gain.cancelScheduledValues(ctx.currentTime)
        master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
        master.gain.linearRampToValueAtTime(0, ctx.currentTime + FADE_OUT_S)
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
