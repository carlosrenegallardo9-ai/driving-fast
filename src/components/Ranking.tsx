import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { RIVALS } from '../lib/data'
import { useGame } from '../lib/store'
import { Countdown, nextMonday, nextMonth } from './Countdown'

type Tab = 'weekly' | 'monthly'
interface Row { name: string; xp: number; me?: boolean }

/** Simula el canal en tiempo real: rivales que suman puntos cada pocos segundos. */
function useLiveRivals() {
  const [gains, setGains] = useState<Record<string, number>>({})
  const [last, setLast] = useState<string | null>(null)
  useEffect(() => {
    const t = setInterval(() => {
      const r = RIVALS[Math.floor(Math.random() * RIVALS.length)]
      const amount = [25, 50, 100, 150, 300][Math.floor(Math.random() * 5)]
      setGains((g) => ({ ...g, [r.name]: (g[r.name] ?? 0) + amount }))
      setLast(r.name)
    }, 2600)
    return () => clearInterval(t)
  }, [])
  return { gains, last }
}

export function Ranking() {
  const [tab, setTab] = useState<Tab>('weekly')
  const { xp, username } = useGame()
  const { gains, last } = useLiveRivals()

  const rows: Row[] = [
    ...RIVALS.map((r) => ({ name: r.name, xp: r[tab] + (gains[r.name] ?? 0) })),
    { name: username ?? 'tú', xp, me: true },
  ].sort((a, b) => b.xp - a.xp)
  const myRank = rows.findIndex((r) => r.me) + 1
  const top10 = rows.slice(0, 10)
  const gap = Math.max(0, rows[9].xp - xp + 1)

  return (
    <section id="ranking" className="band gutter scroll-mt-11 py-24" aria-labelledby="ranking-title">
      <div className="mx-auto max-w-[880px]">
        <div className="text-center">
          <p className="eyebrow flex items-center justify-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full opacity-60" style={{ background: 'var(--ink)' }} />
              <span className="relative inline-flex size-2 rounded-full" style={{ background: 'var(--ink)' }} />
            </span>
            En vivo
          </p>
          <h2 id="ranking-title" className="section-title mt-1">Ranking.</h2>
          <div className="mt-8 inline-flex rounded-full p-1" style={{ background: 'var(--fill)' }} role="tablist" aria-label="Temporada">
            {(['weekly', 'monthly'] as Tab[]).map((t) => (
              <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
                className="relative rounded-full px-6 py-2 text-[15px]"
                style={{ color: tab === t ? 'var(--on-solid)' : 'var(--ink)' }}>
                {tab === t && <motion.span layoutId="rank-pill" className="absolute inset-0 rounded-full" style={{ background: 'var(--solid)' }} transition={{ type: 'spring', stiffness: 320, damping: 30 }} />}
                <span className="relative">{t === 'weekly' ? 'Semanal' : 'Mensual'}</span>
              </button>
            ))}
          </div>
          <p className="mt-10 text-[15px]">{tab === 'weekly' ? 'La semana cierra en' : 'El mes cierra en'}</p>
          <div className="mt-3 flex justify-center">
            <Countdown to={tab === 'weekly' ? nextMonday() : nextMonth()} />
          </div>
        </div>

        <ol className="mt-14">
          {top10.map((r, k) => (
            <motion.li
              layout
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              key={r.name}
              className="flex items-center gap-4 py-4"
              style={{ borderTop: '1px solid var(--line-soft)' }}
            >
              <span className={`num w-8 text-ink ${k < 3 ? 'text-[28px] font-semibold' : 'text-[17px] text-ink-3'}`}>{k + 1}</span>
              <span className={`flex-1 truncate ${k < 3 ? 'text-[21px]' : 'text-[17px]'} ${r.me ? 'font-semibold text-ink' : 'text-ink'}`}>
                @{r.name}{r.me && ' (tú)'}
              </span>
              {last === r.name && (
                <motion.span key={r.xp} initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -8 }} transition={{ duration: 2 }} className="text-[12px] text-ink-2">
                  ▲
                </motion.span>
              )}
              <span className={`num text-ink-2 ${k < 3 ? 'text-[21px]' : 'text-[17px]'}`}>{r.xp.toLocaleString('es-MX')}</span>
            </motion.li>
          ))}
        </ol>

        {myRank > 10 && (
          <div className="sticky z-10 mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-2xl px-6 py-4" style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 72px)', background: 'var(--solid)', color: 'var(--on-solid)' }}>
            <span className="num text-[21px] font-semibold">#{myRank}</span>
            <span>{username ? `@${username}` : 'Tú, sin cuenta'}</span>
            <span className="num opacity-70">{xp.toLocaleString('es-MX')} XP</span>
            <span className="ml-auto text-[15px] opacity-80">Te faltan <span className="num">{gap.toLocaleString('es-MX')}</span> XP para el Top 10</span>
          </div>
        )}
        <p className="mt-6 text-center text-[12px] text-ink-3">Jugadores de ejemplo. En producción el ranking se sincroniza en tiempo real.</p>
      </div>
    </section>
  )
}

export function Rewards() {
  const tiers = [
    { rank: '#1', title: 'Ion Pro Founders Edition', body: 'Hardware exclusivo grabado con tu nombre. No está a la venta.' },
    { rank: '#2 – #3', title: 'Edición limitada', body: 'Chaqueta técnica y kit de escritorio numerados.' },
    { rank: '#4 – #10', title: 'Cupón del 20 %', body: 'Para cualquier producto durante 60 días.' },
    { rank: 'Top 100', title: 'Insignia coleccionable', body: 'Una medalla única de la temporada para tu perfil.' },
  ]
  const badges = [
    ['Pionero', 'signup'],
    ['Explorador', 'quest:d-explore'],
    ['Desarmador', 'quest:w-exploded'],
    ['Curioso', 'quest:d-ai'],
    ['Visionario AR', 'quest:w-ar'],
    ['Cerebrito', 'quest:w-trivia'],
  ] as const
  const done = useGame((s) => s.done)
  return (
    <section id="recompensas" className="band-alt gutter scroll-mt-11 py-24" aria-labelledby="rewards-title">
      <div className="mx-auto max-w-[1100px]">
        <div className="text-center">
          <p className="eyebrow">Ciclo mensual</p>
          <h2 id="rewards-title" className="section-title mt-1">Recompensas.</h2>
          <p className="subhead mx-auto mt-3 max-w-[40ch]">El día 1 de cada mes el ranking vuelve a cero. Tus medallas se quedan para siempre.</p>
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((t) => (
            <div key={t.rank} className="card p-7">
              <div className="num text-[15px] text-ink-3">{t.rank}</div>
              <h3 className="mt-2 text-[21px] leading-tight font-semibold">{t.title}</h3>
              <p className="mt-2 text-[15px]">{t.body}</p>
            </div>
          ))}
        </div>
        <div className="card mt-4 p-7">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-[21px] font-semibold">Tus medallas</h3>
            <span className="text-[12px] text-ink-3">Se desbloquean con misiones</span>
          </div>
          <ul className="mt-6 grid grid-cols-3 gap-6 sm:grid-cols-6">
            {badges.map(([name, key]) => {
              const on = !!done[key]
              return (
                <li key={name} className="flex flex-col items-center gap-2 text-center">
                  <motion.div
                    initial={false}
                    animate={on ? { scale: [0.7, 1.1, 1] } : { scale: 1 }}
                    className="grid size-16 place-items-center rounded-full"
                    style={{
                      background: on ? 'linear-gradient(145deg, #3a3a3c, #1d1d1f)' : 'var(--bg-alt)',
                      boxShadow: on ? 'inset 0 1px 1px rgba(255,255,255,0.25), 0 4px 12px rgba(0,0,0,0.18)' : 'inset 0 0 0 1px var(--line)',
                    }}
                  >
                    {on ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="#f5f5f7" aria-hidden><path d="m12 2 3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" /></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2" aria-hidden><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
                    )}
                  </motion.div>
                  <span className={`text-[12px] ${on ? 'text-ink' : 'text-ink-3'}`}>{name}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
