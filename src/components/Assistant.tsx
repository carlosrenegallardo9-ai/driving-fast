import { useEffect, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '../lib/store'
import { actionLabel, respond } from '../lib/agent'
import { execute } from '../lib/execute'

const SUGGESTIONS = ['Muéstrame la batería del Ion Pro', 'Compara los dos modelos', 'Ponlo en color Ember', 'Mis misiones']
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

function Orb({ size = 56 }: { size?: number }) {
  const state = useGame((s) => s.aiState)
  const busy = state !== 'idle'
  return (
    <motion.span
      aria-hidden
      className="relative block rounded-full"
      style={{
        width: size,
        height: size,
        background: 'radial-gradient(circle at 32% 28%, rgba(255,255,255,0.9), transparent 22%), radial-gradient(circle at 50% 60%, var(--accent), var(--accent-2) 75%)',
        boxShadow: `0 0 ${busy ? 40 : 24}px -4px var(--accent), inset 0 -6px 16px rgba(0,0,0,0.35)`,
      }}
      animate={
        state === 'thinking' ? { rotate: 360, scale: [1, 0.94, 1] }
        : state === 'speaking' ? { scale: [1, 1.08, 0.98, 1.05, 1] }
        : state === 'acting' ? { scale: [1, 1.15, 1] }
        : { scale: [1, 1.04, 1] }
      }
      transition={
        state === 'thinking' ? { rotate: { duration: 1.6, repeat: Infinity, ease: 'linear' }, scale: { duration: 0.8, repeat: Infinity } }
        : { duration: state === 'idle' ? 4 : 0.7, repeat: Infinity, ease: 'easeInOut' }
      }
    >
      {state === 'thinking' && (
        <span className="absolute -inset-1.5 rounded-full border border-dashed opacity-60" style={{ borderColor: 'var(--accent)' }} />
      )}
    </motion.span>
  )
}

export function Assistant() {
  const g = useGame()
  const [input, setInput] = useState('')
  const [voice, setVoice] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [g.messages])
  useEffect(() => {
    if (g.chatOpen) setTimeout(() => inputRef.current?.focus(), 250)
  }, [g.chatOpen])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') useGame.getState().set({ chatOpen: false }) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const send = async (text: string) => {
    const q = text.trim()
    if (!q || g.aiState !== 'idle') return
    setInput('')
    const s = useGame.getState()
    s.pushMsg({ role: 'user', text: q, done: true })
    s.set({ aiState: 'thinking' })
    await wait(650)

    const { text: answer, actions } = respond(q, useGame.getState().product)
    const id = s.pushMsg({ role: 'ai', text: '', actions: actions.map((a) => ({ label: actionLabel(a) })) })
    s.set({ aiState: 'speaking' })
    if (voice && 'speechSynthesis' in window) {
      try {
        const u = new SpeechSynthesisUtterance(answer)
        u.lang = 'es-MX'
        speechSynthesis.cancel()
        speechSynthesis.speak(u)
      } catch { /* sin voz */ }
    }
    for (let i = 0; i <= answer.length; i += 3) {
      s.patchMsg(id, { text: answer.slice(0, i) })
      await wait(14)
    }
    s.patchMsg(id, { text: answer })

    if (actions.length) {
      s.set({ aiState: 'acting' })
      for (let k = 0; k < actions.length; k++) {
        execute(actions[k])
        await wait(k === 0 ? 700 : 420)
        const msg = useGame.getState().messages.find((m) => m.id === id)!
        s.patchMsg(id, { actions: msg.actions!.map((a, j) => (j <= k ? { ...a, done: true } : a)) })
      }
      // en móvil cerramos el panel para que se vea la acción
      if (window.innerWidth < 640) setTimeout(() => s.set({ chatOpen: false }), 900)
    }
    s.patchMsg(id, { done: true })
    s.set({ aiState: 'idle' })
    const asked = useGame.getState().messages.filter((m) => m.role === 'user').length
    if (asked <= 5) s.award(`ai:${asked}`, 25, 'Pregunta a Nova')
  }

  const submit = (e: FormEvent) => { e.preventDefault(); send(input) }

  return (
    <>
      <AnimatePresence>
        {!g.chatOpen && (
          <motion.button
            type="button"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => g.set({ chatOpen: true })}
            className="fixed z-50 rounded-full"
            style={{ right: 'calc(env(safe-area-inset-right, 0px) + 16px)', bottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}
            aria-label="Abrir asistente Nova"
          >
            <Orb />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {g.chatOpen && (
          <motion.aside
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="glass fixed z-50 flex flex-col overflow-hidden"
            style={{
              right: 'calc(env(safe-area-inset-right, 0px) + 12px)',
              left: 'max(12px, env(safe-area-inset-left, 0px))',
              bottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)',
              top: 'calc(env(safe-area-inset-top, 0px) + 80px)',
              maxWidth: 420,
              marginLeft: 'auto',
              maxHeight: 640,
              marginTop: 'auto',
              background: 'rgba(14, 17, 25, 0.82)',
            }}
            aria-label="Asistente Nova"
          >
            <header className="flex items-center gap-3 border-b border-white/5 px-4 py-3">
              <Orb size={30} />
              <div className="flex-1 leading-tight">
                <div className="text-sm font-semibold text-hi">Nova</div>
                <div className="label" style={{ fontSize: 10 }}>
                  {{ idle: 'Asistente · en línea', thinking: 'Pensando…', speaking: 'Respondiendo…', acting: 'Ejecutando acciones…' }[g.aiState]}
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setVoice(!voice); if (voice) try { speechSynthesis.cancel() } catch { /* sin voz */ } }}
                aria-pressed={voice}
                className="rounded-full px-2.5 py-1 text-xs"
                style={{ border: '1px solid var(--glass-border)', color: voice ? 'var(--accent)' : 'var(--text-md)' }}
              >
                Voz {voice ? 'sí' : 'no'}
              </button>
              <button type="button" onClick={() => g.set({ chatOpen: false })} aria-label="Cerrar asistente" className="grid size-8 place-items-center rounded-full text-md hover:bg-white/5">✕</button>
            </header>

            <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4" aria-live="polite">
              {g.messages.map((m) => (
                <div key={m.id} className={m.role === 'user' ? 'flex justify-end' : ''}>
                  {m.role === 'user' ? (
                    <div className="max-w-[85%] rounded-2xl rounded-br-md px-4 py-2.5 text-sm text-hi" style={{ background: 'color-mix(in srgb, var(--accent) 16%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)' }}>
                      {m.text}
                    </div>
                  ) : (
                    <div className="max-w-[92%] text-sm leading-relaxed text-hi">
                      {m.text}
                      {!m.done && <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse align-middle" style={{ background: 'var(--accent)' }} />}
                      {!!m.actions?.length && (
                        <div className="mt-3 rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>
                          <div className="label mb-2" style={{ color: 'var(--accent)', fontSize: 10 }}>Acciones en la página</div>
                          <ul className="space-y-1">
                            {m.actions.map((a, i) => (
                              <li key={i} className="flex items-center gap-2 text-xs" style={{ color: a.done ? 'var(--text-hi)' : 'var(--text-lo)' }}>
                                <span className="grid size-4 place-items-center rounded-full text-[9px]" style={{ background: a.done ? 'var(--xp)' : 'rgba(255,255,255,0.06)', color: 'var(--bg-0)' }}>
                                  {a.done ? '✓' : ''}
                                </span>
                                {a.label}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {g.aiState === 'thinking' && (
                <div className="flex gap-1" aria-label="Nova está pensando">
                  {[0, 1, 2].map((i) => (
                    <motion.span key={i} className="size-1.5 rounded-full" style={{ background: 'var(--accent)' }} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }} />
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto px-4 pb-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" onClick={() => send(s)} disabled={g.aiState !== 'idle'} className="shrink-0 rounded-full px-3 py-1.5 text-xs text-md transition-colors hover:text-hi disabled:opacity-40" style={{ border: '1px solid var(--glass-border)' }}>
                  {s}
                </button>
              ))}
            </div>
            <form onSubmit={submit} className="flex items-center gap-2 border-t border-white/5 p-3">
              <label htmlFor="nova-input" className="sr-only">Mensaje para Nova</label>
              <input
                id="nova-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pregunta o pide algo…"
                autoComplete="off"
                className="h-11 min-w-0 flex-1 rounded-full bg-white/5 px-4 text-sm text-hi outline-none placeholder:text-lo focus:ring-1 focus:ring-[var(--accent)]"
              />
              <button type="submit" disabled={!input.trim() || g.aiState !== 'idle'} className="btn btn-primary size-11 p-0 disabled:opacity-40" aria-label="Enviar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
              </button>
            </form>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
