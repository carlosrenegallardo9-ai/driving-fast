import BottomNav from '../components/BottomNav'
import { tripHistory } from '../data/mock'

export default function Activity() {
  return (
    <div className="flex h-full flex-1 flex-col bg-white">
      <div className="border-b border-slate-100 px-5 py-5">
        <div className="text-xl font-bold text-slate-900">Actividad</div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-3">
        <div className="flex flex-col divide-y divide-slate-100">
          {tripHistory.map((t) => (
            <div key={t.id} className="flex items-center gap-3 py-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <CarIcon />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-slate-800">
                  {t.from} → {t.to}
                </div>
                <div className="text-xs text-slate-400">
                  {t.date} · {t.driver}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-slate-900">${t.price.toLocaleString('es-CL')}</div>
                <div className="text-xs text-amber-500">{'★'.repeat(t.rating)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}

function CarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 16.5V13l1.6-4.6A2 2 0 0 1 8.5 7h7a2 2 0 0 1 1.9 1.4L19 13v3.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="15" r="1.2" fill="currentColor" />
      <circle cx="16" cy="15" r="1.2" fill="currentColor" />
    </svg>
  )
}
