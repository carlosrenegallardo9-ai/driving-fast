// Asistente simulado: interpreta la intención y devuelve texto + acciones sobre la interfaz.
// En producción esto lo resuelve un LLM con tool use (ver docs/propuesta-ux.md §7.4);
// las acciones tienen la misma forma que esas herramientas.
import { HOTSPOTS, PRODUCTS, VARIANTS, type HotspotId, type ProductId, type VariantId } from './data'

export type Action =
  | { kind: 'navigate'; section: 'showroom' | 'quests' | 'ranking' | 'recompensas' }
  | { kind: 'open_product'; id: ProductId }
  | { kind: 'set_variant'; id: VariantId }
  | { kind: 'toggle_exploded'; on: boolean }
  | { kind: 'focus_hotspot'; id: HotspotId }

export const actionLabel = (a: Action): string => {
  switch (a.kind) {
    case 'navigate': return `Ir a ${{ showroom: 'Showroom', quests: 'Tech Quests', ranking: 'Ranking', recompensas: 'Recompensas' }[a.section]}`
    case 'open_product': return `Abrir ${PRODUCTS[a.id].name}`
    case 'set_variant': return `Acabado ${VARIANTS.find((v) => v.id === a.id)!.name}`
    case 'toggle_exploded': return a.on ? 'Activar despiece' : 'Ensamblar equipo'
    case 'focus_hotspot': return `Enfocar: ${HOTSPOTS[a.id].title}`
  }
}

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
const has = (s: string, ...words: string[]) => words.some((w) => s.includes(w))

export function respond(input: string, current: ProductId): { text: string; actions: Action[] } {
  const s = norm(input)
  const actions: Action[] = []
  const parts: string[] = []

  let product: ProductId = current
  if (/\bpro\b/.test(s)) product = 'ion-pro'
  else if (/\bone\b/.test(s)) product = 'ion-one'
  const p = PRODUCTS[product]
  const spec = (k: string) => p.specs.find(([n]) => n === k)![1]

  if (has(s, 'compar', 'diferencia', 'cual es mejor', 'cual compro')) {
    const a = PRODUCTS['ion-one']
    const b = PRODUCTS['ion-pro']
    return {
      text: `${a.name} (${a.price}) es compacto: ${a.specs[1][1]} y ${a.specs[2][1]}. ${b.name} (${b.price}) sube a ${b.specs[1][1]}, ${b.specs[2][1]} y un chip de ${b.specs[0][1]}. Si es para un escritorio o estudio, Ion Pro; para moverlo por casa, Ion One. Te abro el Pro para que lo veas.`,
      actions: [{ kind: 'navigate', section: 'showroom' }, { kind: 'open_product', id: 'ion-pro' }],
    }
  }

  if (has(s, 'mision', 'quest', 'xp', 'punto', 'nivel', 'racha')) {
    return { text: 'Estas son tus misiones. Las diarias se renuevan a medianoche y las semanales el lunes. La más rápida ahora: abre el despiece de un producto (+50 XP).', actions: [{ kind: 'navigate', section: 'quests' }] }
  }
  if (has(s, 'ranking', 'clasificacion', 'tabla', 'lider', 'posicion', 'top')) {
    return { text: 'Aquí está el ranking en vivo. Se reinicia cada lunes (semanal) y cada día 1 (mensual); tus medallas se quedan para siempre en tu perfil.', actions: [{ kind: 'navigate', section: 'ranking' }] }
  }
  if (has(s, 'premio', 'recompensa', 'gano', 'ganar')) {
    return { text: 'El #1 del mes se lleva hardware exclusivo; del #2 al #3, merch de edición limitada; del #4 al #10, un cupón del 20 %. Te muestro el detalle.', actions: [{ kind: 'navigate', section: 'recompensas' }] }
  }

  const sceneActions: Action[] = []
  if (product !== current || has(s, 'muestra', 'ensena', 'ver ', 'abre', 'abrir')) sceneActions.push({ kind: 'open_product', id: product })

  let variant: VariantId | null = null
  if (has(s, 'blanco', 'claro')) variant = 'blanco'
  else if (has(s, 'plata', 'gris', 'plateado', 'aluminio')) variant = 'plata'
  else if (has(s, 'medianoche', 'negro', 'oscuro')) variant = 'medianoche'
  if (variant) {
    sceneActions.push({ kind: 'set_variant', id: variant })
    parts.push(`Listo, ${p.name} en acabado ${VARIANTS.find((v) => v.id === variant)!.name}.`)
  }

  let hotspot: HotspotId | null = null
  if (has(s, 'bateria', 'autonomia', 'carga', 'dura')) hotspot = 'bateria'
  else if (has(s, 'chip', 'procesador', 'npu', 'tops', 'cerebro')) hotspot = 'chip'
  else if (has(s, 'sonido', 'driver', 'bocina', 'audio', 'bajo', 'altavoz')) hotspot = 'driver'
  else if (has(s, 'luz', 'led', 'anillo')) hotspot = 'anillo'

  if (hotspot) {
    sceneActions.push({ kind: 'focus_hotspot', id: hotspot })
    const detail = {
      bateria: `La batería del ${p.name} da ${spec('Batería')}. ${HOTSPOTS.bateria.body}`,
      chip: `El ${p.name} usa el chip ${spec('Procesador')}. ${HOTSPOTS.chip.body}`,
      driver: `Audio ${spec('Audio')}. ${HOTSPOTS.driver.body}`,
      anillo: HOTSPOTS.anillo.body,
    }[hotspot]
    parts.push(`${detail} Lo desarmé y enfoqué la cámara en esa pieza.`)
  } else if (has(s, 'despiece', 'desarma', 'por dentro', 'interior', 'componente', 'pieza')) {
    sceneActions.push({ kind: 'toggle_exploded', on: true })
    parts.push(`Aquí tienes el despiece del ${p.name}. Toca los puntos brillantes para ver cada componente.`)
  } else if (has(s, 'arma', 'ensambla', 'cierra', 'junta')) {
    sceneActions.push({ kind: 'toggle_exploded', on: false })
    parts.push('Equipo ensamblado de nuevo.')
  }

  if (has(s, 'precio', 'cuesta', 'cuanto vale', 'comprar')) parts.push(`${p.name} cuesta ${p.price}.`)
  if (has(s, 'espec', 'ficha', 'caracteristica') && !hotspot) {
    parts.push(`${p.name}: ${p.specs.map(([k, v]) => `${k.toLowerCase()} ${v}`).join(', ')}.`)
    if (!sceneActions.length) sceneActions.push({ kind: 'open_product', id: product })
  }

  if (sceneActions.length) {
    actions.push({ kind: 'navigate', section: 'showroom' }, ...sceneActions)
    if (!parts.length) parts.push(`Te muestro el ${p.name}: ${p.tagline.toLowerCase()}.`)
    return { text: parts.join(' '), actions }
  }
  if (parts.length) return { text: parts.join(' '), actions }

  if (has(s, 'hola', 'buenas', 'hey')) {
    return { text: '¡Hola! Pregúntame por un producto, pide verlo en otro color o desarmado, o dime «mis misiones».', actions: [] }
  }
  return {
    text: 'Puedo ayudarte con los productos Ion One e Ion Pro, sus componentes, colores y precios, y con tus misiones y el ranking. Prueba «compara los dos modelos» o «muéstrame el chip».',
    actions: [],
  }
}
