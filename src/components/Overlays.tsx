import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '../lib/store'

/* ---------- +XP ---------- */
export function Bursts() {
  const bursts = useGame((s) => s.bursts)
  return (
    <div className="pointer-events-none fixed z-[60] flex flex-col items-end gap-2" style={{ top: 'calc(env(safe-area-inset-top, 0px) + 56px)', right: 'max(16px, env(safe-area-inset-right, 0px))' }} aria-live="polite">
      <AnimatePresence>
        {bursts.map((b) => (
          <motion.div
            key={b.id}
            layout
            initial={{ opacity: 0, y: 24, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            className="relative flex items-center gap-3 rounded-full py-2 pl-4 pr-5"
            style={{ background: 'rgba(29,29,31,0.92)', color: '#f5f5f7', boxShadow: '0 10px 30px rgba(0,0,0,0.25)', backdropFilter: 'blur(20px)' }}
          >
            <span className="num text-[17px] font-semibold">+{b.amount} XP</span>
            <span className="max-w-[200px] truncate text-[13px]" style={{ color: '#a1a1a6' }}>{b.label}</span>
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute left-6 top-1/2 size-1.5 rounded-full"
                style={{ background: '#1d1d1f' }}
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
          <motion.div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(14px)' }} onClick={() => set({ levelUp: null })} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="lv-title"
            initial={{ scale: 0.7, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="card relative w-full max-w-sm p-10 text-center shadow-2xl"
          >
            <div className="eyebrow">Subiste de nivel</div>
            <div id="lv-title" className="num mt-2 text-[112px] leading-none font-semibold text-ink">
              <motion.span key={levelUp} initial={{ rotateX: 90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} transition={{ delay: 0.25, duration: 0.5 }} className="inline-block">
                {levelUp}
              </motion.span>
            </div>
            <p className="mt-4 text-[17px]">Desbloqueaste un marco nuevo para tu avatar y {levelUp >= 3 ? 'acceso a misiones bonus' : 'más misiones semanales'}.</p>
            <button type="button" className="btn btn-solid mt-7 w-full" onClick={() => set({ levelUp: null })}>Continuar</button>
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
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(14px)' }} onClick={() => set({ signupOpen: false })} />
          <motion.form
            onSubmit={submit}
            role="dialog"
            aria-modal="true"
            aria-labelledby="su-title"
            initial={{ y: 30, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            className="card relative w-full max-w-md p-8 shadow-2xl"
          >
            <h2 id="su-title" className="text-[28px] leading-tight font-semibold">Guarda tus {xp.toLocaleString('es-MX')} XP</h2>
            <p className="mt-2 text-[15px]">Crea tu cuenta para conservarlos, entrar al ranking de esta semana y optar a los premios del mes.</p>
            <div className="mt-6 grid gap-2">
              <button type="button" className="btn btn-ghost w-full" onClick={() => setError('El inicio con Google se conecta en producción. Por ahora elige un nombre de usuario.')}>Continuar con Google</button>
              <button type="button" className="btn btn-ghost w-full" onClick={() => setError('Las passkeys se conectan en producción. Por ahora elige un nombre de usuario.')}>Usar passkey</button>
            </div>
            <div className="my-5 flex items-center gap-3 text-[12px] text-ink-3"><span className="h-px flex-1" style={{ background: 'var(--line)' }} />o<span className="h-px flex-1" style={{ background: 'var(--line)' }} /></div>
            <label htmlFor="su-name" className="text-[14px] text-ink">Nombre de usuario</label>
            <input
              id="su-name"
              value={name}
              onChange={(e) => { setName(e.target.value); setError('') }}
              placeholder="carlos"
              autoComplete="username"
              className="mt-2 h-12 w-full rounded-xl px-4 text-ink outline-none placeholder:text-ink-3 focus:ring-2 focus:ring-[var(--ink)]"
              style={{ border: '1px solid var(--line)' }}
            />
            {error && <p className="mt-2 text-[13px]" style={{ color: 'var(--error)' }}>{error}</p>}
            <button type="submit" className="btn btn-solid mt-5 w-full">Crear cuenta y guardar XP</button>
            <p className="mt-3 text-center text-[12px] text-ink-3">Vista previa: la cuenta se guarda sólo en este navegador.</p>
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
          className="sheet fixed z-50 w-[min(360px,calc(100vw-32px))] rounded-[18px] p-5"
          style={{ left: 'max(16px, env(safe-area-inset-left, 0px))', bottom: 'calc(env(safe-area-inset-bottom, 0px) + 84px)', boxShadow: '0 12px 40px rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.05)' }}
        >
          <p className="text-[15px] font-semibold text-ink">Tienes <span className="num">{xp.toLocaleString('es-MX')} XP</span> sin guardar.</p>
          <p className="mt-1 text-[14px]">Crea tu cuenta para conservarlos y entrar al ranking de esta semana.</p>
          <div className="mt-4 flex gap-2">
            <button type="button" className="btn btn-solid btn-sm flex-1" onClick={() => set({ signupOpen: true })}>Guardar mis XP</button>
            <button type="button" className="btn btn-sm text-ink" onClick={() => setDismissed(true)}>Ahora no</button>
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
          className="fixed left-1/2 z-[65] w-[min(480px,calc(100vw-32px))] -translate-x-1/2 rounded-2xl px-5 py-3 text-[14px]"
          style={{ top: 'calc(env(safe-area-inset-top, 0px) + 56px)', background: 'rgba(29,29,31,0.92)', color: '#f5f5f7', backdropFilter: 'blur(20px)', boxShadow: '0 10px 30px rgba(0,0,0,0.25)' }}
        >
          {toast}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
