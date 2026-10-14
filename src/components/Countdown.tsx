import { useEffect, useState } from 'react'

export function nextMonday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + (((8 - d.getDay()) % 7) || 7))
  return d
}
export function nextMonth() {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth() + 1, 1)
}

function useNow() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  return now
}

export function Countdown({ to, compact = false }: { to: Date; compact?: boolean }) {
  const now = useNow()
  const ms = Math.max(0, to.getTime() - now)
  const parts = [
    [Math.floor(ms / 86400000), 'd'],
    [Math.floor(ms / 3600000) % 24, 'h'],
    [Math.floor(ms / 60000) % 60, 'm'],
    [Math.floor(ms / 1000) % 60, 's'],
  ] as const
  const urgent = ms < 86400000
  const color = urgent ? 'var(--danger)' : 'var(--text-hi)'

  if (compact) {
    return (
      <span className="num" style={{ color }}>
        {parts[0][0]}d {String(parts[1][0]).padStart(2, '0')}h {String(parts[2][0]).padStart(2, '0')}m
      </span>
    )
  }
  return (
    <div className="flex items-end gap-1.5" aria-label="Tiempo restante de la temporada">
      {parts.map(([v, u], i) => (
        <div key={u} className="flex items-end gap-1.5">
          <div className="text-center">
            <div
              className="num rounded-lg px-2 py-1 text-xl font-medium sm:text-2xl"
              style={{ color, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}
            >
              {String(v).padStart(2, '0')}
            </div>
            <div className="label mt-1" style={{ fontSize: 10 }}>{u}</div>
          </div>
          {i < 3 && <span className="num pb-6 text-lo">:</span>}
        </div>
      ))}
    </div>
  )
}
