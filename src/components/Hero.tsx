import { lazy, Suspense, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../lib/store'
import { scrollTo } from '../lib/execute'
import { PRODUCTS, RIVALS, VARIANTS } from '../lib/data'
import { Countdown, nextMonday } from './Countdown'

const HeroScene = lazy(() => import('./Scenes').then((m) => ({ default: m.HeroScene })))

const rise = {
  initial: { opacity: 0.001, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] as const },
}

export function Swatches({ size = 22 }: { size?: number }) {
  const { variant, setVariant } = useGame()
  const current = VARIANTS.find((v) => v.id === variant)!
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-3.5" role="radiogroup" aria-label="Acabado">
        {VARIANTS.map((v) => (
          <button
            key={v.id}
            type="button"
            role="radio"
            aria-checked={variant === v.id}
            aria-label={v.name}
            onClick={() => setVariant(v.id)}
            className="rounded-full transition-transform hover:scale-110"
            style={{
              width: size,
              height: size,
              background: `linear-gradient(145deg, ${v.swatch}, ${v.shell})`,
              boxShadow: variant === v.id
                ? '0 0 0 2px var(--bg), 0 0 0 3.5px var(--ink)'
                : 'inset 0 0 0 1px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.4)',
            }}
          />
        ))}
      </div>
      <span className="text-[12px] text-ink-2">{current.name}</span>
    </div>
  )
}

export function Hero() {
  return (
    <section id="inicio" className="band gutter pt-[88px]">
      <motion.div {...rise} className="mx-auto max-w-[980px] text-center">
        <p className="eyebrow">Nuevo</p>
        <h1 className="headline mt-1">Ion One</h1>
        <p className="subhead mx-auto mt-3 max-w-[30ch]">Sonido en 360°. Inteligencia que vive dentro.</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3.5">
          <button type="button" className="btn btn-solid" onClick={() => scrollTo('showroom')}>Explorar en 3D</button>
          <button type="button" className="btn btn-ghost" onClick={() => scrollTo('quests')}>Ver misiones</button>
        </div>
      </motion.div>
      <div className="relative mx-auto mt-2 aspect-[16/10] w-full max-w-[980px]">
        <Suspense fallback={<div className="h-full w-full" />}>
          <HeroScene />
        </Suspense>
      </div>
      <div className="pb-14">
        <Swatches />
      </div>
    </section>
  )
}

/* ---------- Banda negra: Ion Pro ---------- */
export function ProBand() {
  const setProduct = useGame((s) => s.setProduct)
  const pro = PRODUCTS['ion-pro']
  const stats = [
    ['32 h', 'de batería'],
    ['24', 'TOPS de IA local'],
    ['5', 'drivers + subwoofer'],
  ]
  return (
    <section className="band-dark gutter py-24 text-center" aria-labelledby="pro-title">
      <div className="mx-auto max-w-[980px]">
        <p className="eyebrow">Ion Pro</p>
        <h2 id="pro-title" className="section-title mx-auto mt-1 max-w-[16ch]">Un estudio entero. En tu escritorio.</h2>
        <p className="subhead mx-auto mt-4 max-w-[36ch]" style={{ color: 'var(--ink-2)' }}>
          Desde {pro.price}. Cinco drivers, subwoofer integrado y un chip que procesa tu voz sin salir de casa.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
          <button type="button" className="link" onClick={() => { setProduct('ion-pro'); scrollTo('showroom') }}>Míralo por dentro ›</button>
          <button type="button" className="link" onClick={() => useGame.getState().set({ chatOpen: true })}>Pregúntale a Nova ›</button>
        </div>
        <dl className="mx-auto mt-16 grid max-w-[760px] grid-cols-1 gap-10 sm:grid-cols-3">
          {stats.map(([v, l]) => (
            <div key={l}>
              <dt className="sr-only">{l}</dt>
              <dd className="num text-[56px] leading-none font-semibold" style={{ color: 'var(--ink)' }}>{v}</dd>
              <dd className="mt-2 text-[17px]">{l}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

/* ---------- Mosaico de accesos ---------- */
function Tile({ children, onClick, label, dark = false }: { children: ReactNode; onClick: () => void; label: string; dark?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`${dark ? 'band-dark' : ''} tile group flex min-h-[340px] min-w-0 flex-col items-center px-8 pt-12 pb-10 text-center transition-transform duration-500 hover:scale-[1.01]`}
      style={dark ? { borderRadius: 28 } : undefined}
    >
      {children}
    </button>
  )
}

export function Tiles() {
  const xp = useGame((s) => s.xp)
  const top = [...RIVALS].sort((a, b) => b.weekly - a.weekly).slice(0, 3)
  return (
    <section className="band gutter py-3" aria-label="Accesos rápidos">
      <div className="mx-auto grid max-w-[1260px] gap-3 md:grid-cols-2">
        <Tile onClick={() => useGame.getState().set({ chatOpen: true })} label="Abrir el asistente Nova">
          <h3 className="text-[40px] leading-tight font-semibold">Nova</h3>
          <p className="subhead mt-1">Pregunta. Ella te lo muestra.</p>
          <span className="link mt-3 text-[17px]">Abrir asistente ›</span>
          <div className="mt-auto flex w-full max-w-[340px] flex-col gap-2 pt-8 text-left text-[15px]">
            <span className="self-end rounded-2xl px-4 py-2" style={{ background: 'var(--solid)', color: 'var(--on-solid)' }}>¿Cuál tiene más batería?</span>
            <span className="self-start rounded-2xl px-4 py-2 text-ink" style={{ background: 'var(--card)' }}>El Ion Pro: 32 h. Te enseño la pieza.</span>
          </div>
        </Tile>
        <Tile onClick={() => scrollTo('quests')} label="Ir a Tech Quests" dark>
          <h3 className="text-[40px] leading-tight font-semibold">Tech Quests</h3>
          <p className="subhead mt-1" style={{ color: 'var(--ink-2)' }}>Explora. Gana XP. Sube de nivel.</p>
          <span className="link mt-3 text-[17px]">Ver misiones ›</span>
          <div className="mt-auto w-full max-w-[320px] pt-8 text-left">
            <div className="flex items-center justify-between text-[15px] text-ink">
              <span>Misión del día</span><span className="num">+100 XP</span>
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded-full" style={{ background: 'var(--line)' }}>
              <div className="h-full rounded-full" style={{ width: xp > 25 ? '100%' : '10%', background: 'var(--ink)', transition: 'width 0.6s' }} />
            </div>
            <p className="mt-2 text-[13px]">Explora un producto en 3D</p>
          </div>
        </Tile>
        <Tile onClick={() => scrollTo('ranking')} label="Ver el ranking semanal">
          <h3 className="text-[40px] leading-tight font-semibold">Ranking</h3>
          <p className="subhead mt-1">La semana cierra en <Countdown to={nextMonday()} compact /></p>
          <span className="link mt-3 text-[17px]">Ver clasificación ›</span>
          <ol className="mt-auto w-full max-w-[320px] pt-8 text-left">
            {top.map((r, i) => (
              <li key={r.name} className="flex items-center gap-3 py-2 text-[15px]" style={{ borderTop: i ? '1px solid var(--line)' : undefined }}>
                <span className="num w-4 font-semibold text-ink">{i + 1}</span>
                <span className="flex-1 text-ink">@{r.name}</span>
                <span className="num">{r.weekly.toLocaleString('es-MX')}</span>
              </li>
            ))}
          </ol>
        </Tile>
        <Tile onClick={() => scrollTo('recompensas')} label="Ver recompensas del mes">
          <h3 className="text-[40px] leading-tight font-semibold">Recompensas</h3>
          <p className="subhead mt-1">El #1 del mes se lleva un Ion Pro Founders.</p>
          <span className="link mt-3 text-[17px]">Ver premios ›</span>
          <div className="mt-auto flex items-end gap-3 pt-8" aria-hidden>
            {[48, 72, 40].map((h, i) => (
              <div key={i} className="flex w-16 items-start justify-center rounded-t-xl pt-2 text-[15px] font-semibold text-ink" style={{ height: h + 30, background: 'var(--card)' }}>
                {[2, 1, 3][i]}
              </div>
            ))}
          </div>
        </Tile>
      </div>
    </section>
  )
}
