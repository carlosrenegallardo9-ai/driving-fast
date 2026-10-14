import { useEffect } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { levelFor, threshold, useGame } from '../lib/store'
import { scrollTo } from '../lib/execute'

const LINKS = [
  ['showroom', 'Ion'],
  ['quests', 'Quests'],
  ['ranking', 'Ranking'],
  ['recompensas', 'Recompensas'],
] as const

function useCountUp(value: number) {
  const mv = useMotionValue(value)
  const text = useTransform(mv, (v) => Math.round(v).toLocaleString('es-MX'))
  useEffect(() => {
    const c = animate(mv, value, { duration: 0.6, delay: 0.4, ease: 'easeOut' })
    return c.stop
  }, [value, mv])
  return text
}

export function LevelRing({ size = 40, stroke = 3 }: { size?: number; stroke?: number }) {
  const xp = useGame((s) => s.xp)
  const lv = levelFor(xp)
  const pct = (xp - threshold(lv)) / (threshold(lv + 1) - threshold(lv))
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line-soft)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--ink)" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c}
          animate={{ strokeDashoffset: c * (1 - pct) }}
          transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
        />
      </svg>
      <span className="num absolute inset-0 grid place-items-center font-semibold text-ink" style={{ fontSize: size * 0.34 }}>{lv}</span>
    </div>
  )
}

function Logo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2 21 7v10l-9 5-9-5V7z" fill="currentColor" />
      <path d="M12 7.5 16.5 10v4L12 16.5 7.5 14v-4z" fill="var(--bg-alt)" />
    </svg>
  )
}

export function XPHud() {
  const { xp, username, set } = useGame()
  const text = useCountUp(xp)
  return (
    <div className="flex items-center gap-2">
      <motion.button
        type="button"
        id="xp-hud"
        key={xp}
        animate={{ scale: [1, 1, 1.06, 1] }}
        transition={{ duration: 0.9, times: [0, 0.5, 0.7, 1] }}
        onClick={() => scrollTo('quests')}
        className="flex items-center gap-1.5 rounded-full py-0.5 pl-0.5 pr-2.5 text-[12px] text-ink"
        style={{ background: 'var(--fill)' }}
        title={username ? `Nivel ${levelFor(xp)}` : 'XP provisionales: crea tu cuenta para guardarlos'}
      >
        <LevelRing size={24} stroke={2} />
        <span className="num"><motion.span>{text}</motion.span> XP</span>
      </motion.button>
      {username ? (
        <span className="hidden text-[12px] text-ink sm:inline">@{username}</span>
      ) : (
        <button type="button" className="text-[12px] text-ink underline-offset-2 hover:underline" onClick={() => set({ signupOpen: true })}>
          Guardar
        </button>
      )}
    </div>
  )
}

export function SoundToggle() {
  const { sound, set } = useGame()
  return (
    <button
      type="button"
      className="hidden size-7 place-items-center rounded-full text-ink-2 hover:text-ink sm:grid"
      aria-label={sound ? 'Silenciar sonidos' : 'Activar sonidos'}
      aria-pressed={sound}
      onClick={() => set({ sound: !sound })}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M11 5 6 9H2v6h4l5 4V5z" />
        {sound ? <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" /> : <path d="m22 9-6 6m0-6 6 6" />}
      </svg>
    </button>
  )
}

export function Nav() {
  return (
    <header className="navbar fixed inset-x-0 top-0 z-40 gutter" style={{ paddingTop: 'env(safe-area-inset-top, 0px)', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
      <nav className="mx-auto flex h-11 max-w-[1024px] items-center justify-between gap-4" aria-label="Principal">
        <a href="#inicio" className="flex items-center gap-1.5 text-ink" onClick={(e) => { e.preventDefault(); scrollTo('inicio') }} aria-label="Gallardo Tech, inicio">
          <Logo />
          <span className="text-[14px] font-semibold tracking-tight">Gallardo</span>
        </a>
        <ul className="hidden flex-1 items-center justify-center gap-8 md:flex">
          {LINKS.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id) }} className="text-[12px] text-ink/80 transition-colors hover:text-ink">
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <SoundToggle />
          <XPHud />
        </div>
      </nav>
    </header>
  )
}

/** Barra inferior para móvil (zona del pulgar). */
export function TabBar() {
  const items: [string, string, string][] = [
    ['inicio', 'Inicio', 'M3 11 12 3l9 8v10H3z'],
    ['showroom', 'Ion', 'M12 2 3 7v10l9 5 9-5V7z'],
    ['quests', 'Quests', 'm12 2 3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z'],
    ['ranking', 'Ranking', 'M4 20V10m6 10V4m6 16v-7m4 7H2'],
  ]
  return (
    <nav
      className="navbar fixed inset-x-0 bottom-0 z-40 flex justify-around pt-2 md:hidden"
      style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 6px)', paddingLeft: 'max(16px, env(safe-area-inset-left, 0px))', paddingRight: 'max(84px, env(safe-area-inset-right, 0px))' }}
      aria-label="Secciones"
    >
      {items.map(([id, label, d]) => (
        <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id) }} className="flex flex-col items-center gap-0.5 px-2 text-[10px] text-ink-2">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden><path d={d} /></svg>
          {label}
        </a>
      ))}
    </nav>
  )
}
