import { lazy, Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame, questProgress, QUESTS } from '../lib/store'
import { HOTSPOTS, PRODUCTS, VARIANTS, type ProductId } from '../lib/data'

const ShowroomScene = lazy(() => import('./Scenes').then((m) => ({ default: m.ShowroomScene })))

function Icon({ d }: { d: string }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  )
}

export function Showroom() {
  const g = useGame()
  const p = PRODUCTS[g.product]
  const hotQuest = QUESTS.find((q) => q.id === 'w-hotspots')!
  const hotDone = questProgress(hotQuest, g.done)

  const launchAR = () => {
    g.award(`ar:${g.product}`, 50, `${p.name} en realidad aumentada`)
    g.showToast('Vista AR: en producción se abre Quick Look (iOS) o Scene Viewer (Android) con el modelo a escala real. En esta vista previa la simulamos.')
  }

  return (
    <section id="showroom" className="gutter scroll-mt-20 pb-24" aria-labelledby="showroom-title">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label">Showroom 3D</p>
            <h2 id="showroom-title" className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{p.name}</h2>
            <p className="mt-1 text-md">{p.tagline}</p>
          </div>
          <div className="glass flex p-1" style={{ borderRadius: 999 }} role="tablist" aria-label="Producto">
            {(Object.keys(PRODUCTS) as ProductId[]).map((id) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={g.product === id}
                onClick={() => g.setProduct(id)}
                className="relative rounded-full px-5 py-2 text-sm font-medium transition-colors"
                style={{ color: g.product === id ? 'var(--bg-0)' : 'var(--text-md)' }}
              >
                {g.product === id && (
                  <motion.span layoutId="prod-pill" className="absolute inset-0 rounded-full" style={{ background: 'var(--accent)' }} transition={{ type: 'spring', stiffness: 320, damping: 30 }} />
                )}
                <span className="relative">{PRODUCTS[id].name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[28px]" style={{ background: 'radial-gradient(ellipse at 50% 40%, color-mix(in srgb, var(--accent) 10%, var(--bg-1)), var(--bg-0) 70%)', border: '1px solid var(--glass-border)' }}>
          <div className="relative h-[460px] sm:h-[560px] lg:h-[620px]">
            <Suspense fallback={<div className="grid h-full place-items-center text-sm text-lo">Cargando visor 3D…</div>}>
              <ShowroomScene />
            </Suspense>

            {/* Panel de variantes */}
            <motion.div
              animate={{ opacity: g.exploded ? 0.35 : 1, x: g.exploded ? -8 : 0 }}
              className="glass absolute left-4 top-4 hidden w-48 p-4 md:block"
              style={{ borderRadius: 18 }}
            >
              <div className="label">Acabado</div>
              <div className="mt-3 flex flex-col gap-1.5">
                {VARIANTS.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    aria-pressed={g.variant === v.id}
                    onClick={() => g.setVariant(v.id)}
                    className="flex items-center gap-3 rounded-xl px-2 py-1.5 text-left text-sm transition-colors hover:bg-white/5"
                    style={{ color: g.variant === v.id ? 'var(--text-hi)' : 'var(--text-md)' }}
                  >
                    <span className="size-4 rounded-full" style={{ background: `linear-gradient(135deg, ${v.shell}, ${v.accent})`, boxShadow: g.variant === v.id ? `0 0 0 2px ${v.accent}` : 'inset 0 0 0 1px rgba(255,255,255,0.2)' }} />
                    {v.name}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Panel de especificaciones */}
            <motion.div
              animate={{ opacity: g.exploded ? 0.35 : 1, x: g.exploded ? 8 : 0 }}
              className="glass absolute right-4 top-4 hidden w-60 p-4 md:block"
              style={{ borderRadius: 18 }}
            >
              <div className="label">Especificaciones</div>
              <dl className="mt-3 flex flex-col gap-2 text-sm">
                {p.specs.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3">
                    <dt className="text-lo">{k}</dt>
                    <dd className="num text-right text-[13px] text-hi">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                <span className="num text-xl text-hi">{p.price}</span>
                <button type="button" className="btn btn-primary h-9 px-4 text-sm" onClick={() => g.showToast('El carrito llega en la fase de comercio. Esta vista previa cubre showroom, IA y gamificación.')}>Comprar</button>
              </div>
            </motion.div>

            <div className="pointer-events-none absolute inset-x-0 top-4 text-center md:hidden">
              <span className="label rounded-full px-3 py-1" style={{ background: 'rgba(0,0,0,0.4)' }}>Arrastra para girar · Pellizca para zoom</span>
            </div>

            {/* Dock */}
            <div className="absolute inset-x-3 bottom-3 flex justify-center">
              <div className="glass flex max-w-full flex-wrap items-center justify-center gap-1.5 p-1.5" style={{ borderRadius: 22 }}>
                <button type="button" className="btn h-10 px-4 text-sm" onClick={() => g.set({ focus: null, resetNonce: g.resetNonce + 1 })}>
                  <Icon d="M3 12a9 9 0 1 0 3-6.7L3 8m0-5v5h5" /> 360°
                </button>
                <button type="button" className="btn h-10 px-4 text-sm" aria-pressed={g.exploded} onClick={() => g.setExploded(!g.exploded)}>
                  <Icon d="M12 2v6m0 8v6M4 6l4 3m8 6 4 3M4 18l4-3m8-6 4-3" /> Despiece
                </button>
                <button type="button" className="btn h-10 px-4 text-sm" onClick={launchAR}>
                  <Icon d="M7 3H3v4m14-4h4v4M7 21H3v-4m14 4h4v-4M12 8l4 2v4l-4 2-4-2v-4z" /> Ver en AR
                </button>
              </div>
            </div>
          </div>

          {/* Pista de misión y hotspots */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 px-5 py-3">
            <div className="flex min-w-0 items-center gap-3 text-sm">
              <span className="label shrink-0">Misión</span>
              <span className="truncate text-hi">{hotQuest.title}</span>
              <span className="num shrink-0" style={{ color: 'var(--xp)' }}>{hotDone}/{hotQuest.target}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(HOTSPOTS) as (keyof typeof HOTSPOTS)[]).map((h) => (
                <button
                  key={h}
                  type="button"
                  aria-pressed={g.focus === h}
                  onClick={() => g.setFocus(g.focus === h ? null : h)}
                  className="rounded-full px-3 py-1 text-xs transition-colors"
                  style={{
                    border: '1px solid',
                    borderColor: g.focus === h ? 'var(--accent)' : 'var(--glass-border)',
                    color: g.focus === h ? 'var(--accent)' : 'var(--text-md)',
                  }}
                >
                  {g.done[`hotspot:${g.product}:${h}`] ? '✓ ' : ''}{HOTSPOTS[h].short}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Variantes en móvil */}
        <div className="mt-4 flex gap-2 md:hidden">
          {VARIANTS.map((v) => (
            <button key={v.id} type="button" aria-pressed={g.variant === v.id} onClick={() => g.setVariant(v.id)} className="btn h-10 flex-1 px-2 text-sm">
              <span className="size-3.5 rounded-full" style={{ background: `linear-gradient(135deg, ${v.shell}, ${v.accent})` }} /> {v.name}
            </button>
          ))}
        </div>
        <AnimatePresence>
          {g.focus && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass mt-4 p-4 md:hidden" style={{ borderRadius: 18 }}>
              <div className="label" style={{ color: 'var(--accent)' }}>Componente</div>
              <div className="font-semibold text-hi">{HOTSPOTS[g.focus].title}</div>
              <p className="text-sm text-md">{HOTSPOTS[g.focus].body}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
