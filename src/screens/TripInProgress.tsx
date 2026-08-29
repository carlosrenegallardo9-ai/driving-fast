import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MapView from '../components/MapView'
import { useRide } from '../context/RideContext'

type Phase = 'arriving' | 'ongoing'

export default function TripInProgress() {
  const navigate = useNavigate()
  const { selectedDriver, destination } = useRide()
  const [phase, setPhase] = useState<Phase>('arriving')

  useEffect(() => {
    if (!selectedDriver) {
      navigate('/home')
      return
    }
    const t1 = setTimeout(() => setPhase('ongoing'), 3500)
    const t2 = setTimeout(() => navigate('/rate'), 8000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [selectedDriver, navigate])

  if (!selectedDriver) return null

  return (
    <div className="relative flex h-full flex-1 flex-col bg-white">
      <MapView className="h-full flex-1" showRoute showDestinationPin animateCars />

      <div className="absolute left-4 right-4 top-4 rounded-2xl bg-white px-4 py-3 text-center text-sm font-semibold text-brand-700 shadow-md">
        {phase === 'arriving'
          ? `${selectedDriver.name} está en camino a buscarte`
          : `En viaje hacia ${destination?.title}`}
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 rounded-t-3xl bg-white px-5 pb-8 pt-5 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3">
          <img src={selectedDriver.avatar} className="h-14 w-14 rounded-full object-cover" alt={selectedDriver.name} />
          <div className="flex-1">
            <div className="text-base font-bold text-slate-900">{selectedDriver.name}</div>
            <div className="text-xs text-slate-400">
              {selectedDriver.car} · {selectedDriver.plate}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-extrabold text-brand-700">${selectedDriver.price.toLocaleString('es-CL')}</div>
            <div className="text-xs text-slate-400">{phase === 'arriving' ? `llega en ${selectedDriver.eta} min` : 'en curso'}</div>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-50 py-3 text-sm font-semibold text-brand-700">
            <PhoneIcon /> Llamar
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-50 py-3 text-sm font-semibold text-brand-700">
            <ChatIcon /> Mensaje
          </button>
        </div>

        <button
          onClick={() => navigate('/home')}
          className="w-full rounded-2xl border border-red-100 py-3 text-sm font-semibold text-red-500"
        >
          Cancelar viaje
        </button>
      </div>
    </div>
  )
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12a8 8 0 1 1 3.3 6.4L4 20l1.3-3.6A7.96 7.96 0 0 1 4 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}
