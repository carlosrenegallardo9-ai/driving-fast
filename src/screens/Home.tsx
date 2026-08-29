import { useNavigate } from 'react-router-dom'
import MapView from '../components/MapView'
import BottomNav from '../components/BottomNav'
import { useRide } from '../context/RideContext'

const services = [
  { id: 'ride', label: 'Viajar', icon: '🚗', to: '/set-destination' },
  { id: 'delivery', label: 'Entregas', icon: '📦', to: '/set-destination' },
  { id: 'intercity', label: 'Interurbano', icon: '🛣️', to: '/set-destination' },
  { id: 'cargo', label: 'Carga', icon: '🚚', to: '/set-destination' },
]

export default function Home() {
  const navigate = useNavigate()
  const { pickup } = useRide()

  return (
    <div className="flex h-full flex-1 flex-col bg-white">
      <div className="relative h-56 shrink-0">
        <MapView className="h-full" animateCars />
        <div className="absolute inset-x-4 top-4 flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md">
            <BurgerIcon />
          </div>
          <div className="flex h-11 items-center gap-1.5 rounded-full bg-white px-3 shadow-md">
            <span className="text-sm font-bold text-brand-700">Santiago</span>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-lg">
          <span className="h-2.5 w-2.5 rounded-full bg-brand-600" />
          <span className="truncate text-sm font-medium text-slate-700">{pickup?.subtitle}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4 pt-5">
        <button
          onClick={() => navigate('/set-destination')}
          className="flex w-full items-center gap-3 rounded-2xl border-2 border-brand-500 bg-brand-50 px-4 py-4 text-left shadow-sm active:scale-[0.99]"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white">
            <SearchIcon />
          </div>
          <div>
            <div className="text-base font-semibold text-slate-900">¿A dónde vamos?</div>
            <div className="text-xs text-slate-500">Elige tu destino y ofrece tu precio</div>
          </div>
        </button>

        <div className="mt-5 grid grid-cols-4 gap-3">
          {services.map((s) => (
            <button
              key={s.id}
              onClick={() => navigate(s.to)}
              className="flex flex-col items-center gap-1.5 rounded-2xl bg-brand-50 py-3 text-brand-700 active:bg-brand-100"
            >
              <span className="text-xl">{s.icon}</span>
              <span className="text-[11px] font-semibold leading-tight">{s.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-2xl bg-gradient-to-r from-brand-700 to-brand-500 p-4 text-white">
          <div className="text-sm font-bold">Tú pones el precio</div>
          <div className="mt-1 text-xs text-brand-50">
            Ofrece cuánto quieres pagar y los conductores cercanos te envían sus ofertas.
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 text-sm font-bold text-slate-800">Direcciones frecuentes</div>
          <div className="flex flex-col divide-y divide-slate-100 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="text-lg">🏠</span>
              <div>
                <div className="text-sm font-semibold text-slate-800">Casa</div>
                <div className="text-xs text-slate-400">Av. Las Condes 8560</div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="text-lg">💼</span>
              <div>
                <div className="text-sm font-semibold text-slate-800">Trabajo</div>
                <div className="text-xs text-slate-400">Isidora Goyenechea 3477</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

function BurgerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16M4 12h16M4 18h16" stroke="#0b3378" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="6" stroke="white" strokeWidth="2" />
      <path d="M20 20l-4-4" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
