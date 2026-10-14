import { lazy, Suspense, type MouseEvent, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../lib/store'
import { scrollTo } from '../lib/execute'
import { PRODUCTS, RIVALS, VARIANTS } from '../lib/data'
import { Countdown, nextMonday } from './Countdown'

const HeroScene = lazy(() => import('./Scenes').then((m) => ({ default: m.HeroScene })))

export function Hero() {
  const { variant, setVariant } = useGame()
  return (
    <section id="inicio" className="relative overflow-hidden gutter pt-28 pb-10 lg:pt-32">
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 right-0 size-[640px] max-w-full rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--accent), transparent 65%)', transition: 'background 0.6s' }}
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-6 lg:grid-cols-[1.05fr_1fr]">
        <motion.div initial={{ opacity: 0.001, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }} className="min-w-0">
          <p className="label mb-5 flex items-center gap-2">
            <span className="inline-block size-1.5 rounded-full" style={{ background: 'var(--xp)', boxShadow: '0 0 8px var(--xp)' }} />
            Nuevo · Serie Ion 2026
          </p>
          <h1 className="font-display text-[44px] leading-[0.98] font-semibold tracking-[-0.03em] sm:text-6xl lg:text-[80px]">
            El futuro<br />
            <span style={{ color: 'var(--accent)', textShadow: '0 0 40px color-mix(in srgb, var(--accent) 50%, transparent)', transition: 'color 0.6s' }}>se puede tocar.</span>
          </h1>
          <p className="mt-6 max-w-[46ch] text-lg text-md">
            Gira, desarma y prueba nuestros equipos en 3D. Pregúntale a Nova lo que quieras y gana XP por cada cosa que descubras.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" className="btn btn-primary" onClick={() => scrollTo('showroom')}>Explorar en 3D</button>
            <button type="button" className="btn" onClick={() => scrollTo('quests')}>Ver misiones</button>
          </div>
          <div className="mt-10 flex items-center gap-3">
            <span className="label">Acabado</span>
            {VARIANTS.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVariant(v.id)}
                aria-label={`Acabado ${v.name}`}
                aria-pressed={variant === v.id}
                className="size-7 rounded-full transition-transform hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${v.shell}, ${v.accent})`,
                  boxShadow: variant === v.id ? `0 0 0 2px var(--bg-0), 0 0 0 3.5px ${v.accent}` : 'inset 0 0 0 1px rgba(255,255,255,0.15)',
                }}
              />
            ))}
          </div>
        </motion.div>
        <div className="relative aspect-square max-h-[560px] w-full max-w-full">
          <Suspense fallback={<div className="h-full w-full" />}>
            <HeroScene />
          </Suspense>
          <div className="glass absolute bottom-6 left-0 hidden px-4 py-3 sm:block" style={{ borderRadius: 16 }}>
            <div className="label">Ion One</div>
            <div className="num text-sm text-hi">20 h · 360° · 8 TOPS</div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- Bento ---------- */

function Cell({ children, className = '', onClick, label }: { children: ReactNode; className?: string; onClick?: () => void; label?: string }) {
  const move = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  const Tag = onClick ? 'button' : 'div'
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 320, damping: 30 }} className={`min-w-0 ${className}`}>
      <Tag
        type={onClick ? 'button' : undefined}
        onClick={onClick}
        onMouseMove={move}
        aria-label={label}
        className="glass spot flex h-full w-full flex-col p-6 text-left transition-colors"
      >
        {children}
      </Tag>
    </motion.div>
  )
}

export function Bento() {
  const { setProduct, set, xp } = useGame()
  const top = [...RIVALS].sort((a, b) => b.weekly - a.weekly).slice(0, 3)
  const open = (id: 'ion-one' | 'ion-pro') => { setProduct(id); scrollTo('showroom') }
  return (
    <section className="gutter pb-24" aria-label="Accesos rápidos">
      <div className="mx-auto grid max-w-7xl auto-rows-[minmax(180px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Cell className="sm:col-span-2 sm:row-span-2" onClick={() => open('ion-pro')} label="Abrir Ion Pro en el showroom">
          <div className="label">Producto · {PRODUCTS['ion-pro'].price}</div>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">Ion Pro</h2>
          <p className="mt-1 text-md">{PRODUCTS['ion-pro'].tagline}. Cinco drivers, sub integrado y 32 horas de batería.</p>
          <div className="relative mt-6 flex flex-1 items-end justify-center">
            <div className="absolute inset-x-8 bottom-0 top-4 rounded-[50%] opacity-40 blur-2xl" style={{ background: 'radial-gradient(circle, var(--accent), transparent 70%)' }} />
            <div className="relative grid w-full grid-cols-3 gap-3 pb-2">
              {PRODUCTS['ion-pro'].specs.slice(0, 3).map(([k, v]) => (
                <div key={k} className="rounded-2xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>
                  <div className="label" style={{ fontSize: 10 }}>{k}</div>
                  <div className="num mt-1 text-[13px] text-hi">{v}</div>
                </div>
              ))}
            </div>
          </div>
          <span className="mt-4 text-sm" style={{ color: 'var(--accent)' }}>Ver en 3D →</span>
        </Cell>

        <Cell onClick={() => scrollTo('quests')} label="Ir a la misión del día">
          <div className="flex items-center justify-between">
            <span className="label">Misión del día</span>
            <span className="num rounded-full px-2 py-0.5 text-xs" style={{ color: 'var(--xp)', background: 'rgba(182,255,61,0.1)' }}>+100 XP</span>
          </div>
          <p className="mt-3 font-medium text-hi">Explora un producto en 3D</p>
          <div className="mt-auto h-1.5 overflow-hidden rounded-full bg-white/5">
            <div className="h-full rounded-full" style={{ width: xp > 0 ? '100%' : '8%', background: 'var(--xp)', boxShadow: '0 0 12px var(--xp)', transition: 'width 0.6s' }} />
          </div>
        </Cell>

        <Cell onClick={() => set({ chatOpen: true })} label="Abrir el asistente Nova">
          <span className="label">Asistente IA</span>
          <p className="mt-3 font-medium text-hi">«¿Qué modelo tiene más batería?»</p>
          <p className="mt-auto text-sm text-md">Nova responde y te lleva a la pieza en 3D.</p>
        </Cell>

        <Cell className="sm:col-span-2 lg:col-span-1 lg:row-span-2" onClick={() => scrollTo('ranking')} label="Ver ranking completo">
          <div className="flex items-center justify-between gap-2">
            <span className="label">Ranking semanal</span>
            <span className="text-xs"><Countdown to={nextMonday()} compact /></span>
          </div>
          <ol className="mt-4 flex flex-col gap-2">
            {top.map((r, i) => (
              <li key={r.name} className="flex items-center gap-3 rounded-xl px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <span className="num w-4 text-sm" style={{ color: i === 0 ? 'var(--gold)' : 'var(--text-lo)' }}>{i + 1}</span>
                <span className="flex-1 truncate text-sm text-hi">@{r.name}</span>
                <span className="num text-sm text-md">{r.weekly.toLocaleString('es-MX')}</span>
              </li>
            ))}
          </ol>
          <p className="mt-auto pt-4 text-sm text-md">El #1 del mes gana un Ion Pro edición Founders.</p>
        </Cell>

        <Cell className="sm:col-span-2" onClick={() => open('ion-one')} label="Abrir Ion One en el showroom">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="label">Producto · {PRODUCTS['ion-one'].price}</div>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">Ion One</h2>
              <p className="mt-1 max-w-[38ch] text-md">{PRODUCTS['ion-one'].tagline}. Desármalo capa por capa y mira el chip que corre la IA sin nube.</p>
            </div>
            <span className="btn shrink-0">Despiece técnico</span>
          </div>
        </Cell>
      </div>
    </section>
  )
}
