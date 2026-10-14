// Sonidos sintetizados con Web Audio (sin archivos) y háptica opcional.
let ctx: AudioContext | null = null

function tone(freq: number, start: number, dur: number, gain = 0.05, type: OscillatorType = 'sine') {
  if (!ctx) return
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = type
  o.frequency.value = freq
  g.gain.setValueAtTime(0, ctx.currentTime + start)
  g.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur)
  o.connect(g).connect(ctx.destination)
  o.start(ctx.currentTime + start)
  o.stop(ctx.currentTime + start + dur + 0.05)
}

export type Sfx = 'tick' | 'xp' | 'level' | 'quest' | 'swap'

export function play(kind: Sfx, enabled: boolean) {
  if (enabled) {
    try {
      ctx ??= new AudioContext()
      if (kind === 'tick') tone(2400, 0, 0.05, 0.02, 'triangle')
      if (kind === 'swap') { tone(600, 0, 0.18, 0.03); tone(900, 0.06, 0.2, 0.03) }
      if (kind === 'xp') { tone(1046, 0, 0.18); tone(1568, 0.08, 0.3) }
      if (kind === 'quest') { tone(196, 0, 0.4, 0.08, 'triangle'); tone(392, 0.05, 0.5, 0.04) }
      if (kind === 'level') { tone(523, 0, 0.5); tone(659, 0.12, 0.5); tone(784, 0.24, 0.8) }
    } catch {
      /* audio no disponible */
    }
  }
  const pattern = { tick: 0, swap: 10, xp: 15, quest: 30, level: [20, 40, 20] }[kind]
  try {
    if (pattern && 'vibrate' in navigator) navigator.vibrate(pattern)
  } catch {
    /* háptica no disponible */
  }
}
