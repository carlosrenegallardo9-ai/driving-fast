import { lazy, Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame, questProgress, QUESTS } from '../lib/store'
import { HOTSPOTS, PRODUCTS, type HotspotId, type ProductId } from '../lib/data'
import { Swatches } from './Hero'

const ShowroomScene = lazy(() => import('./Scenes').then((m) => ({ default: m.ShowroomScene })))

function Icon({ d }: { d: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
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
    g.showToast('En producción se abre Quick Look (iOS) o Scene Viewer (Android) con el modelo a tamaño real. Aquí lo simulamos.')
  }

  return (
    <section id="showroom" className="band-dark gutter scroll-mt-11 pt-24 pb-20" aria-labelledby="showroom-title">
      <div className="mx-auto max-w-[1100px]">
        <div className="text-center">
          <p className="eyebrow">Showroom 3D</p>
          <h2 id="showroom-title" className="section-title mt-1">Míralo por dentro.</h2>
          <p className="subhead mx-auto mt-3 max-w-[34ch]" style={{ color: 'var(--ink-2)' }}>
            Gíralo, desármalo pieza por pieza y toca cada componente.
          </p>
          <div className="mt-8 inline-flex rounded-full p-1" style={{ background: 'var(--fill)' }} role="tablist" aria-label="Producto">
            {(Object.keys(PRODUCTS) as ProductId[]).map((id) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={g.product === id}
                onClick={() => g.setProduct(id)}
                className="relative rounded-full px-6 py-2 text-[15px] transition-colors"
                style={{ color: g.product === id ? 'var(--on-solid)' : 'var(--ink)' }}
              >
                {g.product === id && (
                  <motion.span layoutId="prod-pill" className="absolute inset-0 rounded-full" style={{ background: 'var(--solid)' }} transition={{ type: 'spring', stiffness: 320, damping: 30 }} />
                )}
                <span className="relative">{PRODUCTS[id].name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative mt-6 h-[440px] sm:h-[560px] lg:h-[620px]">
          <Suspense fallback={<div className="grid h-full place-items-center text-[14px]">Cargando visor 3D…</div>}>
            <ShowroomScene />
          </Suspense>
          <p className="pointer-events-none absolute inset-x-0 bottom-2 text-center text-[12px]" style={{ color: 'var(--ink-3)' }}>
            Arrastra para girar · Pellizca o usa la rueda para acercar
          </p>
        </div>

        {/* Controles */}
        <div className="mt-4 flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center gap-2">
            <button type="button" className="chip" onClick={() => g.set({ focus: null, resetNonce: g.resetNonce + 1 })}>
              <Icon d="M3 12a9 9 0 1 0 3-6.7L3 8m0-5v5h5" /> Vista inicial
            </button>
            <button type="button" className="chip" aria-pressed={g.exploded} onClick={() => g.setExploded(!g.exploded)}>
              <Icon d="M12 2v6m0 8v6M4 6l4 3m8 6 4 3M4 18l4-3m8-6 4-3" /> {g.exploded ? 'Ensamblar' : 'Despiece'}
            </button>
            <button type="button" className="chip" onClick={launchAR}>
              <Icon d="M7 3H3v4m14-4h4v4M7 21H3v-4m14 4h4v-4M12 8l4 2v4l-4 2-4-2v-4z" /> Ver en AR
            </button>
          </div>
          <Swatches />
          <div className="flex flex-wrap justify-center gap-2" aria-label="Componentes">
            {(Object.keys(HOTSPOTS) as HotspotId[]).map((h) => (
              <button key={h} type="button" className="chip" aria-pressed={g.focus === h} onClick={() => g.setFocus(g.focus === h ? null : h)}>
                {g.done[`hotspot:${g.product}:${h}`] && <span aria-hidden>✓</span>}
                {HOTSPOTS[h].short}
              </button>
            ))}
          </div>
          <p className="text-[14px]">
            Misión: {hotQuest.title.toLowerCase()} · <span className="num text-ink">{hotDone}/{hotQuest.target}</span>
          </p>
        </div>

        <AnimatePresence>
          {g.focus && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="card mx-auto mt-6 max-w-md p-5 text-center md:hidden">
              <div className="text-[17px] font-semibold text-ink">{HOTSPOTS[g.focus].title}</div>
              <p className="mt-1 text-[15px]">{HOTSPOTS[g.focus].body}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Especificaciones */}
        <dl className="mt-16 grid grid-cols-2 gap-y-10 border-t pt-12 text-center sm:grid-cols-3 lg:grid-cols-5" style={{ borderColor: 'var(--line)' }}>
          {p.specs.map(([k, v]) => (
            <div key={k} className="px-2">
              <dt className="text-[14px]">{k}</dt>
              <dd className="num mt-1 text-[19px] font-semibold text-ink">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <span className="text-[17px] text-ink">{p.name} desde <span className="num">{p.price}</span></span>
          <button type="button" className="btn btn-solid btn-sm" onClick={() => g.showToast('La tienda llega en la fase de comercio. Esta vista previa cubre showroom, IA y gamificación.')}>Comprar</button>
        </div>
      </div>
    </section>
  )
}
