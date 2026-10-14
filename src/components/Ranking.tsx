import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { RIVALS } from '../lib/data'
import { useGame } from '../lib/store'
import { Countdown, nextMonday, nextMonth } from './Countdown'

type Tab = 'weekly' | 'monthly'
interface Row { name: string; xp: number; me?: boolean; delta: number }

/** Simula el canal Realtime: rivales que suman puntos cada pocos segundos. */
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
    ...RIVALS.map((r) => ({ name: r.name, xp: r[tab] + (gains[r.name] ?? 0), delta: gains[r.name] ?? 0 })),
    { name: username ?? 'tú', xp, me: true, delta: 0 },
  ].sort((a, b) => b.xp - a.xp)
  const myRank = rows.findIndex((r) => r.me) + 1
  const me = rows[myRank - 1]
  const top10 = rows.slice(0, 10)
  const podium = [top10[1], top10[0], top10[2]]
  const gap = Math.max(0, rows[9].xp - xp + 1)

  return (
    <section id="ranking" className="gutter scroll-mt-20 pb-24" aria-labelledby="ranking-title">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label flex items-center gap-2">
              <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full opacity-75" style={{ background: 'var(--danger)' }} /><span className="relative inline-flex size-2 rounded-full" style={{ background: 'var(--danger)' }} /></span>
              En vivo
            </p>
            <h2 id="ranking-title" className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Ranking</h2>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <span className="label">{tab === 'weekly' ? 'La semana cierra en' : 'El mes cierra en'}</span>
            <Countdown to={tab === 'weekly' ? nextMonday() : nextMonth()} />
          </div>
        </div>

        <div className="glass overflow-hidden">
          <div className="flex gap-1 border-b border-white/5 p-2" role="tablist" aria-label="Temporada">
            {(['weekly', 'monthly'] as Tab[]).map((t) => (
              <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
                className="rounded-full px-4 py-1.5 text-sm transition-colors"
                style={{ background: tab === t ? 'rgba(255,255,255,0.08)' : 'transparent', color: tab === t ? 'var(--text-hi)' : 'var(--text-md)' }}>
                {t === 'weekly' ? 'Semanal' : 'Mensual'}
              </button>
            ))}
          </div>

          {/* Podio */}
          <div className="grid grid-cols-3 items-end gap-2 px-4 pt-8 sm:gap-6 sm:px-10">
            {podium.map((r, k) => {
              const place = [2, 1, 3][k]
              const h = [96, 132, 72][k]
              return (
                <motion.div layout key={r.name} className="flex min-w-0 flex-col items-center">
                  {place === 1 && <span aria-hidden className="mb-1 text-xl">👑</span>}
                  <span className={`max-w-full truncate text-sm ${r.me ? '' : 'text-hi'}`} style={r.me ? { color: 'var(--xp)' } : undefined}>@{r.name}</span>
                  <span className="num mb-2 text-xs text-md">{r.xp.toLocaleString('es-MX')}</span>
                  <div
                    className="grid w-full place-items-center rounded-t-2xl font-display text-3xl font-semibold"
                    style={{
                      height: h,
                      color: place === 1 ? 'var(--gold)' : 'var(--text-md)',
                      background: `linear-gradient(180deg, ${place === 1 ? 'rgba(255,200,61,0.18)' : 'rgba(255,255,255,0.06)'}, transparent)`,
                      borderTop: `1px solid ${place === 1 ? 'var(--gold)' : 'var(--glass-border)'}`,
                      boxShadow: place === 1 ? '0 -12px 40px -16px var(--gold)' : undefined,
                    }}
                  >
                    {place}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* 4–10 */}
          <ol className="grid gap-x-6 border-t border-white/5 px-4 py-3 sm:px-6 md:grid-cols-2">
            {top10.slice(3).map((r, k) => (
              <motion.li
                layout
                transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                key={r.name}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                style={{ background: r.me ? 'rgba(182,255,61,0.08)' : undefined }}
              >
                <span className="num w-6 text-sm text-lo">{k + 4}</span>
                <span className="flex-1 truncate text-sm" style={{ color: r.me ? 'var(--xp)' : 'var(--text-hi)' }}>@{r.name}</span>
                {last === r.name && (
                  <motion.span key={r.xp} initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -10 }} transition={{ duration: 2 }} className="num text-xs" style={{ color: 'var(--xp)' }}>
                    ▲
                  </motion.span>
                )}
                <span className="num text-sm text-md">{r.xp.toLocaleString('es-MX')}</span>
              </motion.li>
            ))}
          </ol>

          {/* Fila fija del usuario */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t px-6 py-4" style={{ borderColor: 'rgba(182,255,61,0.25)', background: 'rgba(182,255,61,0.06)' }}>
            <span className="num text-lg" style={{ color: 'var(--xp)' }}>#{myRank}</span>
            <span className="text-hi">{username ? `@${username}` : 'Tú (sin cuenta)'}</span>
            <span className="num text-md">{me.xp.toLocaleString('es-MX')} XP</span>
            <span className="ml-auto text-sm text-md">
              {myRank <= 10 ? '¡Estás en el Top 10!' : <>Te faltan <span className="num" style={{ color: 'var(--xp)' }}>{gap.toLocaleString('es-MX')} XP</span> para el Top 10</>}
            </span>
          </div>
        </div>
        <p className="mt-3 text-xs text-lo">Vista previa con jugadores de ejemplo. En producción el ranking se sincroniza en tiempo real con Supabase.</p>
      </div>
    </section>
  )
}

export function Rewards() {
  const tiers = [
    { rank: '#1', title: 'Ion Pro Founders Edition', body: 'Hardware exclusivo grabado con tu nombre, fuera de venta.', color: 'var(--gold)' },
    { rank: '#2 – #3', title: 'Merch edición limitada', body: 'Chaqueta técnica y kit de escritorio numerados.', color: '#c9d4e3' },
    { rank: '#4 – #10', title: 'Cupón del 20 %', body: 'Válido en cualquier producto durante 60 días.', color: 'var(--accent)' },
    { rank: 'Top 100', title: 'Insignia coleccionable', body: 'Una medalla única de la temporada para tu vitrina.', color: 'var(--accent-2)' },
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
    <section id="recompensas" className="gutter scroll-mt-20 pb-28" aria-labelledby="rewards-title">
      <div className="mx-auto max-w-7xl">
        <p className="label">Ciclo mensual</p>
        <h2 id="rewards-title" className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">Recompensas</h2>
        <p className="mt-2 max-w-[60ch] text-md">El día 1 de cada mes el ranking vuelve a cero. Los premios se entregan al cierre y tus medallas se quedan para siempre en tu perfil.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((t) => (
            <div key={t.rank} className="glass p-6">
              <div className="num text-sm" style={{ color: t.color }}>{t.rank}</div>
              <h3 className="mt-3 font-display text-xl font-semibold">{t.title}</h3>
              <p className="mt-2 text-sm text-md">{t.body}</p>
            </div>
          ))}
        </div>
        <div className="glass mt-4 p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display text-lg font-semibold">Tu vitrina de medallas</h3>
            <span className="text-xs text-lo">Se desbloquean con misiones</span>
          </div>
          <ul className="mt-5 grid grid-cols-3 gap-4 sm:grid-cols-6">
            {badges.map(([name, key]) => {
              const on = !!done[key]
              return (
                <li key={name} className="flex flex-col items-center gap-2 text-center">
                  <motion.div
                    initial={false}
                    animate={on ? { scale: [0.6, 1.15, 1], rotate: [0, -8, 0] } : { scale: 1 }}
                    className="grid size-16 place-items-center"
                    style={{
                      clipPath: 'polygon(50% 0, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
                      background: on ? 'linear-gradient(135deg, var(--accent), var(--accent-2))' : 'rgba(255,255,255,0.05)',
                    }}
                  >
                    <span className="text-lg" style={{ color: on ? 'var(--bg-0)' : 'var(--text-lo)' }} aria-hidden>{on ? '★' : '🔒'}</span>
                  </motion.div>
                  <span className={`text-xs ${on ? 'text-hi' : 'text-lo'}`}>{name}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
