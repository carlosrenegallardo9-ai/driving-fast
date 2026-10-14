import { useEffect } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { levelFor, threshold, useGame } from '../lib/store'
import { scrollTo } from '../lib/execute'

const LINKS = [
  ['showroom', 'Productos'],
  ['quests', 'Quests'],
  ['ranking', 'Ranking'],
  ['recompensas', 'Recompensas'],
] as const

function useCountUp(value: number) {
  const mv = useMotionValue(value)
  const text = useTransform(mv, (v) => Math.round(v).toLocaleString('es-MX'))
  useEffect(() => {
    const c = animate(mv, value, { duration: 0.6, delay: 0.5, ease: 'easeOut' })
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
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--xp)" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c}
          animate={{ strokeDashoffset: c * (1 - pct) }}
          transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
          style={{ filter: 'drop-shadow(0 0 4px var(--xp))' }}
        />
      </svg>
      <span className="num absolute inset-0 grid place-items-center text-hi" style={{ fontSize: size * 0.32 }}>{lv}</span>
    </div>
  )
}

export function XPHud() {
  const { xp, username, set, sound } = useGame()
  const lv = levelFor(xp)
  const text = useCountUp(xp)
  const provisional = !username
  return (
    <div className="flex items-center gap-2">
      <motion.div
        id="xp-hud"
        key={xp}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1, 1.08, 1] }}
        transition={{ duration: 0.9, times: [0, 0.55, 0.7, 1] }}
        className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: `1px ${provisional ? 'dashed' : 'solid'} ${provisional ? 'rgba(182,255,61,0.35)' : 'var(--glass-border)'}`,
        }}
        title={provisional ? 'XP provisionales: crea tu cuenta para guardarlos' : `Nivel ${lv}`}
      >
        <LevelRing size={34} />
        <div className="leading-tight">
          <div className="num text-sm text-hi"><motion.span>{text}</motion.span> <span className="text-lo">XP</span></div>
          <div className="label" style={{ fontSize: 10, color: provisional ? 'var(--xp)' : undefined }}>
            {provisional ? 'Provisional' : `Nivel ${lv}`}
          </div>
        </div>
      </motion.div>
      <div className="hidden items-center gap-1 rounded-full px-2.5 py-1.5 sm:flex" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)' }} title="Racha diaria: 5 días">
        <span aria-hidden>🔥</span><span className="num text-sm text-hi">5</span>
      </div>
      <button
        type="button"
        className="hidden size-9 place-items-center rounded-full text-md sm:grid"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)' }}
        aria-label={sound ? 'Silenciar sonidos' : 'Activar sonidos'}
        aria-pressed={sound}
        onClick={() => set({ sound: !sound })}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M11 5 6 9H2v6h4l5 4V5z" />
          {sound ? <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" /> : <path d="m22 9-6 6m0-6 6 6" />}
        </svg>
      </button>
      {provisional ? (
        <button type="button" className="btn btn-primary h-9 px-4 text-sm" onClick={() => set({ signupOpen: true })}>
          Guardar XP
        </button>
      ) : (
        <span className="hidden text-sm text-hi md:inline">@{username}</span>
      )}
    </div>
  )
}

export function Nav() {
  return (
    <header className="fixed inset-x-0 z-40 gutter" style={{ top: 'calc(env(safe-area-inset-top, 0px) + 12px)' }}>
      <nav className="glass mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 pl-5 pr-2" style={{ borderRadius: 999 }} aria-label="Principal">
        <a href="#inicio" className="flex items-center gap-2 font-display text-[15px] font-semibold tracking-tight text-hi" onClick={(e) => { e.preventDefault(); scrollTo('inicio') }}>
          <span aria-hidden className="grid size-6 place-items-center rounded-md" style={{ background: 'var(--accent)', boxShadow: '0 0 16px var(--accent)' }}>
            <span className="block size-2.5 rotate-45" style={{ background: 'var(--bg-0)' }} />
          </span>
          <span className="hidden sm:inline">GALLARDO TECH</span>
          <span className="sm:hidden">GT</span>
        </a>
        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id) }} className="rounded-full px-3.5 py-2 text-sm text-md transition-colors hover:text-hi">
                {label}
              </a>
            </li>
          ))}
        </ul>
        <XPHud />
      </nav>
    </header>
  )
}

/** Barra inferior para móvil (zona del pulgar). */
export function TabBar() {
  const items = [['inicio', 'Inicio', 'M3 11 12 3l9 8v10H3z'], ...LINKS.slice(0, 3).map(([id, l]) => [id, l, { showroom: 'M12 2 3 7v10l9 5 9-5V7z', quests: 'm12 2 3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z', ranking: 'M4 20V10m6 10V4m6 16v-7m4 7H2' }[id as 'showroom']])] as [string, string, string][]
  return (
    <nav
      className="glass fixed inset-x-0 bottom-0 z-40 flex justify-around pt-2 lg:hidden"
      style={{ borderRadius: '20px 20px 0 0', paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)', paddingLeft: 'max(16px, env(safe-area-inset-left, 0px))', paddingRight: 'max(88px, env(safe-area-inset-right, 0px))' }}
      aria-label="Secciones"
    >
      {items.map(([id, label, d]) => (
        <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id) }} className="flex flex-col items-center gap-0.5 px-2 text-[11px] text-md">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden><path d={d} /></svg>
          {label}
        </a>
      ))}
    </nav>
  )
}
