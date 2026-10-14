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

function QuestRow({ q, first }: { q: Quest; first: boolean }) {
  const done = useGame((s) => s.done)
  const prog = questProgress(q, done)
  const complete = !!done[`quest:${q.id}`]
  return (
    <li className="flex items-center gap-4 py-3.5" style={{ borderTop: first ? undefined : '1px solid var(--line-soft)' }}>
      <span
        className="grid size-[22px] shrink-0 place-items-center rounded-full text-[12px]"
        style={{ border: complete ? 'none' : '1.5px solid var(--line)', background: complete ? 'var(--ink)' : 'transparent', color: 'var(--bg)' }}
        aria-hidden
      >
        {complete && '✓'}
      </span>
      <div className="min-w-0 flex-1">
        <div className={`text-[15px] ${complete ? 'text-ink-3 line-through' : 'text-ink'}`}>{q.title}</div>
        {q.target > 1 && !complete && (
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full" style={{ background: 'var(--line-soft)' }}>
              <motion.div className="h-full rounded-full" style={{ background: 'var(--ink)' }} animate={{ width: `${(prog / q.target) * 100}%` }} />
            </div>
            <span className="num text-[12px] text-ink-3">{prog}/{q.target}</span>
          </div>
        )}
      </div>
      <span className="num shrink-0 text-[15px] text-ink-2">+{q.xp}</span>
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
      <div className="flex h-full flex-col items-center justify-center py-8 text-center">
        <div className="num text-[56px] leading-none font-semibold text-ink">{correct}/{TRIVIA.length}</div>
        <p className="mt-3 text-[15px]">Trivia completada. La próxima llega el lunes.</p>
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
      <div className="flex items-center justify-between text-[12px] text-ink-3">
        <span>Pregunta {i + 1} de {TRIVIA.length}</span>
        <span className="num">+100 XP por acierto</span>
      </div>
      <p className="mt-3 text-[19px] leading-snug font-semibold text-ink">{t.q}</p>
      <div className="mt-5 flex flex-col gap-2">
        {t.options.map((o, k) => {
          const state = picked === null ? null : k === t.answer ? 'ok' : k === picked ? 'bad' : null
          return (
            <motion.button
              key={o}
              type="button"
              onClick={() => choose(k)}
              animate={state === 'bad' ? { x: [0, -6, 6, -4, 0] } : {}}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-left text-[15px] transition-colors"
              style={{
                border: '1px solid',
                borderColor: state === 'ok' ? 'var(--ink)' : 'var(--line)',
                background: state === 'ok' ? 'var(--ink)' : 'transparent',
                color: state === 'ok' ? 'var(--bg)' : state === 'bad' ? 'var(--ink-3)' : 'var(--ink)',
                textDecoration: state === 'bad' ? 'line-through' : undefined,
              }}
            >
              {o}
              {state === 'ok' && <span aria-label="Correcta">✓</span>}
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
    <section id="quests" className="band-alt gutter scroll-mt-11 py-24" aria-labelledby="quests-title">
      <div className="mx-auto max-w-[1100px]">
        <div className="text-center">
          <p className="eyebrow">Gamificación</p>
          <h2 id="quests-title" className="section-title mt-1">Tech Quests.</h2>
          <p className="subhead mx-auto mt-3 max-w-[36ch]">Cada misión suma XP al ranking de la temporada. Tu nivel no se reinicia nunca.</p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-[1fr_1.3fr_1.1fr]">
          <div className="card flex flex-col gap-8 p-7">
            <div className="flex flex-col items-center text-center">
              <LevelRing size={120} stroke={6} />
              <div className="mt-4 text-[28px] font-semibold text-ink">Nivel {lv}</div>
              <div className="num text-[15px]">{xp.toLocaleString('es-MX')} de {threshold(lv + 1).toLocaleString('es-MX')} XP</div>
            </div>
            <div>
              <div className="flex items-center justify-between text-[15px]">
                <span className="text-ink">Racha de 5 días</span>
                <span className="num text-ink-3">×1.0</span>
              </div>
              <div className="mt-3 grid grid-cols-7 gap-1.5">
                {days.map((d, k) => (
                  <div key={d} className="text-center">
                    <div className="h-7 rounded-md" style={{ background: k < 5 ? 'var(--ink)' : 'var(--line-soft)' }} />
                    <span className="text-[11px] text-ink-3">{d}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[13px] text-ink-3">A los 7 días tu multiplicador sube a ×1.5. Tienes un escudo de racha esta semana.</p>
            </div>
          </div>

          <div className="card p-7">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-[21px] font-semibold">Diarias</h3>
              <span className="text-[12px] text-ink-3">Se renuevan en <Countdown to={midnight()} compact /></span>
            </div>
            <ul className="mt-2">{QUESTS.filter((q) => q.kind === 'daily').map((q, k) => <QuestRow key={q.id} q={q} first={k === 0} />)}</ul>
            <div className="mt-6 flex items-baseline justify-between gap-2">
              <h3 className="text-[21px] font-semibold">Semanales</h3>
              <span className="text-[12px] text-ink-3">Cierran en <Countdown to={nextMonday()} compact /></span>
            </div>
            <ul className="mt-2">{QUESTS.filter((q) => q.kind === 'weekly').map((q, k) => <QuestRow key={q.id} q={q} first={k === 0} />)}</ul>
          </div>

          <div className="card p-7">
            <h3 className="mb-4 text-[21px] font-semibold">Trivia de la semana</h3>
            <Trivia />
          </div>
        </div>
      </div>
    </section>
  )
}
