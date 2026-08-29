import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { recentAddresses, savedPlaces, type Address } from '../data/mock'
import { useRide } from '../context/RideContext'

export default function SetDestination() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { setDestination } = useRide()

  const results = useMemo(() => {
    const all = [...savedPlaces, ...recentAddresses]
    if (!query.trim()) return recentAddresses
    return all.filter(
      (a) => a.title.toLowerCase().includes(query.toLowerCase()) || a.subtitle.toLowerCase().includes(query.toLowerCase()),
    )
  }, [query])

  function choose(addr: Address) {
    setDestination(addr)
    navigate('/offer-price')
  }

  return (
    <div className="flex h-full flex-1 flex-col bg-white">
      <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4">
        <button onClick={() => navigate(-1)} className="text-slate-500">
          <BackIcon />
        </button>
        <div className="text-base font-bold text-slate-900">¿A dónde vamos?</div>
      </div>

      <div className="px-4 py-4">
        <div className="relative flex flex-col gap-2 rounded-2xl bg-slate-50 p-3">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-600" />
            <div className="text-sm font-medium text-slate-600">Mi ubicación actual</div>
          </div>
          <div className="ml-1 h-4 w-px border-l border-dashed border-slate-300" />
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-sm bg-brand-900" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ingresa tu destino"
              className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        {!query.trim() && (
          <div className="mb-4 flex gap-3">
            {savedPlaces.map((p) => (
              <button
                key={p.id}
                onClick={() => choose(p)}
                className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-100 px-3 py-3 text-left active:bg-slate-50"
              >
                <span>{p.id === 'home' ? '🏠' : '💼'}</span>
                <span className="text-sm font-semibold text-slate-700">{p.title}</span>
              </button>
            ))}
          </div>
        )}

        <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
          {query.trim() ? 'Resultados' : 'Recientes'}
        </div>
        <div className="flex flex-col divide-y divide-slate-100">
          {results.map((r) => (
            <button
              key={r.id}
              onClick={() => choose(r)}
              className="flex items-center gap-3 py-3 text-left active:bg-slate-50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <PinIcon />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-800">{r.title}</div>
                <div className="text-xs text-slate-400">{r.subtitle}</div>
              </div>
            </button>
          ))}
          {results.length === 0 && (
            <div className="py-8 text-center text-sm text-slate-400">Sin resultados para "{query}"</div>
          )}
        </div>
      </div>
    </div>
  )
}

function BackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C7.6 2 4 5.6 4 10c0 6 8 12 8 12s8-6 8-12c0-4.4-3.6-8-8-8Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}
