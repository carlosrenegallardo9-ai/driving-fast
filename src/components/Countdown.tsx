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
  if (compact) {
    return (
      <span className="num">
        {parts[0][0]} d {String(parts[1][0]).padStart(2, '0')} h {String(parts[2][0]).padStart(2, '0')} min
      </span>
    )
  }
  return (
    <div className="flex items-start gap-4 sm:gap-6" aria-label="Tiempo restante de la temporada">
      {parts.map(([v, u]) => (
        <div key={u} className="text-center">
          <div className="num text-[40px] leading-none font-semibold text-ink sm:text-[48px]">{String(v).padStart(2, '0')}</div>
          <div className="mt-1 text-[12px] text-ink-3">{{ d: 'días', h: 'horas', m: 'min', s: 'seg' }[u]}</div>
        </div>
      ))}
    </div>
  )
}
