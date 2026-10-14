import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '../lib/store'

/* ---------- +XP ---------- */
export function Bursts() {
  const bursts = useGame((s) => s.bursts)
  return (
    <div className="pointer-events-none fixed z-[60] flex flex-col items-end gap-2" style={{ top: 'calc(env(safe-area-inset-top, 0px) + 84px)', right: 'max(16px, env(safe-area-inset-right, 0px))' }} aria-live="polite">
      <AnimatePresence>
        {bursts.map((b) => (
          <motion.div
            key={b.id}
            layout
            initial={{ opacity: 0, y: 24, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            className="relative flex items-center gap-3 rounded-2xl py-2 pl-3 pr-4"
            style={{ background: 'rgba(10,14,8,0.85)', border: '1px solid rgba(182,255,61,0.35)', boxShadow: '0 0 32px -8px var(--xp)', backdropFilter: 'blur(12px)' }}
          >
            <span className="num text-lg font-medium" style={{ color: 'var(--xp)', textShadow: '0 0 12px var(--xp)' }}>+{b.amount} XP</span>
            <span className="max-w-[200px] truncate text-xs text-md">{b.label}</span>
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute left-6 top-1/2 size-1.5 rounded-full"
                style={{ background: 'var(--xp)', boxShadow: '0 0 6px var(--xp)' }}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{ x: 40 + i * 14, y: -60 - (i % 3) * 14, opacity: 0, scale: 0.4 }}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.03, ease: 'easeIn' }}
              />
            ))}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

/* ---------- Subida de nivel ---------- */
function useEscape(onEscape: () => void) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onEscape() }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [onEscape])
}

export function LevelUp() {
  const { levelUp, set } = useGame()
  useEscape(useCallback(() => set({ levelUp: null }), [set]))
  return (
    <AnimatePresence>
      {levelUp && (
        <motion.div className="fixed inset-0 z-[70] grid place-items-center gutter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="absolute inset-0" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--xp) 18%, rgba(5,6,10,0.92)), rgba(5,6,10,0.94) 60%)', backdropFilter: 'blur(6px)' }} onClick={() => set({ levelUp: null })} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="lv-title"
            initial={{ scale: 0.7, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="glass relative w-full max-w-sm p-8 text-center"
          >
            <div className="label" style={{ color: 'var(--xp)' }}>Subiste de nivel</div>
            <div id="lv-title" className="font-display text-[96px] leading-none font-semibold" style={{ color: 'var(--text-hi)', textShadow: '0 0 40px var(--xp)' }}>
              <motion.span key={levelUp} initial={{ rotateX: 90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} transition={{ delay: 0.25, duration: 0.5 }} className="inline-block">
                {levelUp}
              </motion.span>
            </div>
            <p className="mt-3 text-md">Desbloqueaste un marco nuevo para tu avatar y {levelUp >= 3 ? 'acceso a misiones bonus' : 'más misiones semanales'}.</p>
            <button type="button" className="btn btn-primary mt-6 w-full" onClick={() => set({ levelUp: null })}>Seguir</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ---------- Registro (convierte XP provisionales) ---------- */
export function Signup() {
  const { signupOpen, set, register, xp } = useGame()
  useEscape(useCallback(() => set({ signupOpen: false }), [set]))
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const submit = (e: FormEvent) => {
    e.preventDefault()
    const n = name.trim().replace(/^@/, '')
    if (!/^[a-zA-Z0-9_]{3,16}$/.test(n)) return setError('Usa de 3 a 16 letras, números o guion bajo.')
    register(n)
  }
  return (
    <AnimatePresence>
      {signupOpen && (
        <motion.div className="fixed inset-0 z-[70] grid place-items-center gutter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => set({ signupOpen: false })} />
          <motion.form
            onSubmit={submit}
            role="dialog"
            aria-modal="true"
            aria-labelledby="su-title"
            initial={{ y: 30, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            className="glass relative w-full max-w-md p-7"
          >
            <h2 id="su-title" className="font-display text-2xl font-semibold">Guarda tus {xp.toLocaleString('es-MX')} XP</h2>
            <p className="mt-2 text-sm text-md">Crea tu cuenta para conservarlos, entrar al ranking de esta semana y optar a los premios del mes.</p>
            <div className="mt-6 grid gap-2">
              <button type="button" className="btn w-full" onClick={() => setError('El inicio con Google se conecta en producción. Por ahora elige un nombre de usuario.')}>Continuar con Google</button>
              <button type="button" className="btn w-full" onClick={() => setError('Las passkeys se conectan en producción. Por ahora elige un nombre de usuario.')}>Usar passkey</button>
            </div>
            <div className="my-5 flex items-center gap-3 text-xs text-lo"><span className="h-px flex-1 bg-white/10" />o<span className="h-px flex-1 bg-white/10" /></div>
            <label htmlFor="su-name" className="label">Nombre de usuario</label>
            <input
              id="su-name"
              value={name}
              onChange={(e) => { setName(e.target.value); setError('') }}
              placeholder="carlos"
              autoComplete="username"
              className="mt-2 h-11 w-full rounded-xl bg-white/5 px-4 text-hi outline-none placeholder:text-lo focus:ring-1 focus:ring-[var(--accent)]"
            />
            {error && <p className="mt-2 text-sm" style={{ color: 'var(--danger)' }}>{error}</p>}
            <button type="submit" className="btn btn-primary mt-5 w-full">Crear cuenta y guardar XP</button>
            <p className="mt-3 text-center text-xs text-lo">Vista previa: la cuenta se guarda sólo en este navegador.</p>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ---------- Invitación a registrarse al llegar a 150 XP ---------- */
export function Nudge() {
  const { xp, username, set, signupOpen } = useGame()
  const [dismissed, setDismissed] = useState(false)
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (!username && !dismissed && xp >= 150) {
      const t = setTimeout(() => setShow(true), 2600)
      return () => clearTimeout(t)
    }
    setShow(false)
  }, [xp, username, dismissed])
  return (
    <AnimatePresence>
      {show && !signupOpen && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          className="glass fixed z-50 w-[min(360px,calc(100vw-32px))] p-5"
          style={{ left: 'max(16px, env(safe-area-inset-left, 0px))', bottom: 'calc(env(safe-area-inset-bottom, 0px) + 84px)', borderColor: 'rgba(182,255,61,0.3)' }}
        >
          <p className="text-sm text-hi">Tienes <span className="num" style={{ color: 'var(--xp)' }}>{xp.toLocaleString('es-MX')} XP</span> sin guardar.</p>
          <p className="mt-1 text-sm text-md">Crea tu cuenta para conservarlos y entrar al ranking de esta semana.</p>
          <div className="mt-4 flex gap-2">
            <button type="button" className="btn btn-primary h-9 flex-1 text-sm" onClick={() => set({ signupOpen: true })}>Guardar mis XP</button>
            <button type="button" className="btn h-9 text-sm" onClick={() => setDismissed(true)}>Ahora no</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Toast() {
  const toast = useGame((s) => s.toast)
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="glass fixed left-1/2 z-[65] w-[min(480px,calc(100vw-32px))] -translate-x-1/2 px-5 py-3 text-sm text-hi"
          style={{ top: 'calc(env(safe-area-inset-top, 0px) + 84px)', borderRadius: 16 }}
        >
          {toast}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
