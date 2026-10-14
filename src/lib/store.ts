import { create } from 'zustand'
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware'
import type { HotspotId, ProductId, VariantId } from './data'
import { play, type Sfx } from './sfx'

/* ---------- Niveles ---------- */
export const threshold = (n: number) => Math.round(500 * Math.pow(Math.max(0, n - 1), 1.5))
export function levelFor(xp: number) {
  let n = 1
  while (xp >= threshold(n + 1)) n++
  return n
}

/* ---------- Misiones ---------- */
export interface Quest {
  id: string
  kind: 'daily' | 'weekly'
  title: string
  xp: number
  target: number
  prefix: string
}

export const QUESTS: Quest[] = [
  { id: 'd-login', kind: 'daily', title: 'Entra hoy y mantén tu racha', xp: 25, target: 1, prefix: 'login:' },
  { id: 'd-explore', kind: 'daily', title: 'Explora un producto en 3D', xp: 100, target: 1, prefix: 'explore:' },
  { id: 'd-ai', kind: 'daily', title: 'Haz una pregunta al asistente', xp: 50, target: 1, prefix: 'ai:' },
  { id: 'w-exploded', kind: 'weekly', title: 'Usa el despiece en los 2 productos', xp: 400, target: 2, prefix: 'exploded:' },
  { id: 'w-hotspots', kind: 'weekly', title: 'Descubre 3 componentes internos', xp: 300, target: 3, prefix: 'hotspot:' },
  { id: 'w-ar', kind: 'weekly', title: 'Proyecta un producto en AR', xp: 300, target: 1, prefix: 'ar:' },
  { id: 'w-trivia', kind: 'weekly', title: 'Acierta la trivia técnica', xp: 200, target: 3, prefix: 'trivia:' },
]

export const questProgress = (q: Quest, done: Record<string, true>) =>
  Math.min(q.target, Object.keys(done).filter((k) => k.startsWith(q.prefix)).length)

/* ---------- Tipos ---------- */
export interface Burst { id: number; amount: number; label: string }
export interface ChatAction { label: string; done?: boolean }
export interface ChatMsg { id: number; role: 'user' | 'ai'; text: string; actions?: ChatAction[]; done?: boolean }

interface State {
  // persistente
  xp: number
  done: Record<string, true>
  username: string | null
  sound: boolean
  // escena
  product: ProductId
  variant: VariantId
  exploded: boolean
  focus: HotspotId | null
  resetNonce: number
  // ui
  bursts: Burst[]
  levelUp: number | null
  signupOpen: boolean
  chatOpen: boolean
  aiState: 'idle' | 'thinking' | 'speaking' | 'acting'
  messages: ChatMsg[]
  toast: string | null

  award: (key: string, amount: number, label: string) => boolean
  sfx: (k: Sfx) => void
  set: (p: Partial<State>) => void
  setProduct: (p: ProductId) => void
  setVariant: (v: VariantId) => void
  setExploded: (on: boolean) => void
  setFocus: (h: HotspotId | null) => void
  register: (name: string) => void
  showToast: (t: string) => void
  pushMsg: (m: Omit<ChatMsg, 'id'>) => number
  patchMsg: (id: number, p: Partial<ChatMsg>) => void
}

const safeStorage: StateStorage = {
  getItem: (k) => { try { return localStorage.getItem(k) } catch { return null } },
  setItem: (k, v) => { try { localStorage.setItem(k, v) } catch { /* sin almacenamiento */ } },
  removeItem: (k) => { try { localStorage.removeItem(k) } catch { /* sin almacenamiento */ } },
}

let nextId = 1
let toastTimer: ReturnType<typeof setTimeout> | undefined

export const useGame = create<State>()(
  persist(
    (set, get) => ({
      xp: 0,
      done: {},
      username: null,
      sound: false,
      product: 'ion-one',
      variant: 'plata',
      exploded: false,
      focus: null,
      resetNonce: 0,
      bursts: [],
      levelUp: null,
      signupOpen: false,
      chatOpen: false,
      aiState: 'idle',
      messages: [
        {
          id: 0,
          role: 'ai',
          text: 'Hola, soy Nova. Puedo mostrarte productos, cambiar colores, desarmar un equipo o llevarte a tus misiones. Prueba: «muéstrame la batería del Ion Pro».',
          done: true,
        },
      ],
      toast: null,

      award(key, amount, label) {
        const s = get()
        if (s.done[key]) return false
        const before = levelFor(s.xp)
        const xp = s.xp + amount
        const done = { ...s.done, [key]: true as const }
        const burst = { id: nextId++, amount, label }
        set({ xp, done, bursts: [...s.bursts, burst] })
        setTimeout(() => set((st) => ({ bursts: st.bursts.filter((b) => b.id !== burst.id) })), 2400)
        const after = levelFor(xp)
        if (after > before) {
          setTimeout(() => { set({ levelUp: after }); get().sfx('level') }, 900)
        } else {
          get().sfx(key.startsWith('quest:') ? 'quest' : 'xp')
        }
        // Evaluar misiones tras cada evento
        for (const q of QUESTS) {
          const qk = `quest:${q.id}`
          if (!get().done[qk] && questProgress(q, get().done) >= q.target) {
            setTimeout(() => get().award(qk, q.xp, `Misión: ${q.title}`), 500)
          }
        }
        return true
      },
      sfx: (k) => play(k, get().sound),
      set: (p) => set(p),
      setProduct(p) {
        set({ product: p, focus: null, exploded: false })
      },
      setVariant(v) {
        set({ variant: v })
        get().sfx('swap')
      },
      setExploded(on) {
        set({ exploded: on, focus: null })
        if (on) get().award(`exploded:${get().product}`, 50, 'Despiece técnico')
      },
      setFocus(h) {
        // los componentes internos sólo se ven con el equipo desarmado
        if (h && h !== 'anillo' && !get().exploded) get().setExploded(true)
        set({ focus: h })
        if (h) get().award(`hotspot:${get().product}:${h}`, 25, 'Componente descubierto')
      },
      register(name) {
        set({ username: name, signupOpen: false })
        get().award('signup', 100, 'Medalla Pionero desbloqueada')
      },
      showToast(t) {
        clearTimeout(toastTimer)
        set({ toast: t })
        toastTimer = setTimeout(() => set({ toast: null }), 4200)
      },
      pushMsg(m) {
        const id = nextId++
        set((s) => ({ messages: [...s.messages, { ...m, id }] }))
        return id
      },
      patchMsg(id, p) {
        set((s) => ({ messages: s.messages.map((m) => (m.id === id ? { ...m, ...p } : m)) }))
      },
    }),
    {
      name: 'gallardo-tech',
      storage: createJSONStorage(() => safeStorage),
      partialize: (s) => ({ xp: s.xp, done: s.done, username: s.username, sound: s.sound }),
    },
  ),
)

export const today = () => new Date().toISOString().slice(0, 10)
