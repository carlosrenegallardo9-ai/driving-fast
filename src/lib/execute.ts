import type { Action } from './agent'
import { useGame } from './store'

export const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'start',
  })

/** Ejecuta en la interfaz una acción pedida por el asistente. */
export function execute(a: Action) {
  const g = useGame.getState()
  switch (a.kind) {
    case 'navigate': return scrollTo(a.section)
    case 'open_product': return g.setProduct(a.id)
    case 'set_variant': return g.setVariant(a.id)
    case 'toggle_exploded': return g.setExploded(a.on)
    case 'focus_hotspot': return g.setFocus(a.id)
  }
}
