import { useState } from 'react'
import { motion } from 'framer-motion'
import { levelFor, questProgress, QUESTS, threshold, useGame, type Quest } from '../lib/store'
import { TRIVIA } from '../lib/data'
import { LevelRing } from './Nav'
import { Countdown, nextMonday } from './Countdown'

function midnight() {
  const d = new Date()
  d.setHours(24, 0, 0, 0)
  return d
}

function QuestRow({ q }: { q: Quest }) {
  const done = useGame((s) => s.done)
  const prog = questProgress(q, done)
  const complete = !!done[`quest:${q.id}`]
  return (
    <li className="flex items-center gap-4 rounded-2xl px-4 py-3" style={{ background: complete ? 'rgba(182,255,61,0.05)' : 'rgba(255,255,255,0.025)' }}>
      <span
        className="grid size-6 shrink-0 place-items-center rounded-lg text-xs"
        style={{ border: `1.5px solid ${complete ? 'var(--xp)' : 'var(--glass-border)'}`, background: complete ? 'var(--xp)' : 'transparent', color: 'var(--bg-0)' }}
        aria-hidden
      >
        {complete && '✓'}
      </span>
      <div className="min-w-0 flex-1">
        <div className={`text-sm ${complete ? 'text-md line-through decoration-white/20' : 'text-hi'}`}>{q.title}</div>
        {q.target > 1 && (
          <div className="mt-1.5 flex items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/5">
              <motion.div className="h-full rounded-full" style={{ background: 'var(--xp)' }} animate={{ width: `${(prog / q.target) * 100}%` }} />
            </div>
            <span className="num text-xs text-lo">{prog}/{q.target}</span>
          </div>
        )}
      </div>
      <span className="num shrink-0 text-sm" style={{ color: complete ? 'var(--text-lo)' : 'var(--xp)' }}>+{q.xp}</span>
    </li>
  )
}

function Trivia() {
  const { done, award } = useGame()
  const [i, setI] = useState(() => TRIVIA.findIndex((_, k) => !done[`trivia:${k}`] && !done[`trivia-miss:${k}`]))
  const [picked, setPicked] = useState<number | null>(null)
  const finished = i === -1 || i >= TRIVIA.length
  const correct = TRIVIA.filter((_, k) => done[`trivia:${k}`]).length

  if (finished) {
    return (
      <div className="flex h-full flex-col justify-center text-center">
        <div className="num text-4xl" style={{ color: 'var(--xp)' }}>{correct}/{TRIVIA.length}</div>
        <p className="mt-2 text-sm text-md">Trivia completada. Vuelve el lunes por la siguiente.</p>
      </div>
    )
  }
  const t = TRIVIA[i]
  const choose = (k: number) => {
    if (picked !== null) return
    setPicked(k)
    if (k === t.answer) award(`trivia:${i}`, 100, 'Respuesta correcta')
    else useGame.getState().set({ done: { ...useGame.getState().done, [`trivia-miss:${i}`]: true } })
    setTimeout(() => { setPicked(null); setI(i + 1) }, 1300)
  }
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="label">Pregunta {i + 1} de {TRIVIA.length}</span>
        <span className="num text-xs" style={{ color: 'var(--xp)' }}>+100 c/u</span>
      </div>
      <p className="mt-3 font-medium text-hi">{t.q}</p>
      <div className="mt-4 flex flex-col gap-2">
        {t.options.map((o, k) => {
          const state = picked === null ? null : k === t.answer ? 'ok' : k === picked ? 'bad' : null
          return (
            <motion.button
              key={o}
              type="button"
              onClick={() => choose(k)}
              animate={state === 'bad' ? { x: [0, -6, 6, -4, 0] } : {}}
              className="rounded-xl px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/5"
              style={{
                border: '1px solid',
                borderColor: state === 'ok' ? 'var(--xp)' : state === 'bad' ? 'var(--danger)' : 'var(--glass-border)',
                color: state === 'ok' ? 'var(--xp)' : state === 'bad' ? 'var(--danger)' : 'var(--text-hi)',
              }}
            >
              {o}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export function Quests() {
  const xp = useGame((s) => s.xp)
  const lv = levelFor(xp)
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
  return (
    <section id="quests" className="gutter scroll-mt-20 pb-24" aria-labelledby="quests-title">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label">Gamificación</p>
            <h2 id="quests-title" className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Tech Quests</h2>
          </div>
          <p className="max-w-[44ch] text-md">Cada misión suma XP al ranking de la temporada. Tu nivel no se reinicia nunca.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[320px_1fr_1fr]">
          <div className="glass flex flex-col gap-6 p-6">
            <div className="flex items-center gap-5">
              <LevelRing size={88} stroke={6} />
              <div>
                <div className="label">Tu nivel</div>
                <div className="font-display text-3xl font-semibold text-hi">Nivel {lv}</div>
                <div className="num text-sm text-md">{xp.toLocaleString('es-MX')} / {threshold(lv + 1).toLocaleString('es-MX')} XP</div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="label">Racha</span>
                <span className="text-sm text-hi">🔥 5 días · ×1.0</span>
              </div>
              <div className="mt-3 grid grid-cols-7 gap-1.5">
                {days.map((d, k) => (
                  <div key={d} className="text-center">
                    <div className="h-8 rounded-lg" style={{ background: k < 5 ? 'linear-gradient(180deg, #ff9f3d, #ff4d6d)' : 'rgba(255,255,255,0.05)', boxShadow: k === 4 ? '0 0 16px #ff6a3d' : undefined }} />
                    <span className="label" style={{ fontSize: 10 }}>{d}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-lo">A los 7 días el multiplicador sube a ×1.5. Tienes 1 escudo de racha esta semana.</p>
            </div>
          </div>

          <div className="glass p-6">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-lg font-semibold">Diarias</h3>
              <span className="text-xs text-lo">Se renuevan en <Countdown to={midnight()} compact /></span>
            </div>
            <ul className="mt-4 flex flex-col gap-2">{QUESTS.filter((q) => q.kind === 'daily').map((q) => <QuestRow key={q.id} q={q} />)}</ul>
            <h3 className="mt-6 flex items-center justify-between gap-2 font-display text-lg font-semibold">
              Semanales <span className="text-xs font-normal text-lo">Cierran en <Countdown to={nextMonday()} compact /></span>
            </h3>
            <ul className="mt-4 flex flex-col gap-2">{QUESTS.filter((q) => q.kind === 'weekly').map((q) => <QuestRow key={q.id} q={q} />)}</ul>
          </div>

          <div className="glass p-6">
            <h3 className="mb-4 font-display text-lg font-semibold">Trivia técnica semanal</h3>
            <Trivia />
          </div>
        </div>
      </div>
    </section>
  )
}
