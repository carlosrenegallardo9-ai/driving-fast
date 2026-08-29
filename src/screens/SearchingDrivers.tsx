import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MapView from '../components/MapView'
import { useRide } from '../context/RideContext'
import { generateOffers } from '../data/mock'

export default function SearchingDrivers() {
  const navigate = useNavigate()
  const { offeredPrice, setDriverOffers } = useRide()
  const [dots, setDots] = useState(1)

  useEffect(() => {
    if (!offeredPrice) {
      navigate('/home')
      return
    }
    const interval = setInterval(() => setDots((d) => (d % 3) + 1), 450)
    const timeout = setTimeout(() => {
      setDriverOffers(generateOffers(offeredPrice))
      navigate('/driver-offers')
    }, 2600)
    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [offeredPrice, navigate, setDriverOffers])

  return (
    <div className="relative flex h-full flex-1 flex-col bg-white">
      <MapView className="h-full flex-1" animateCars />
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 rounded-t-3xl bg-white px-6 pb-10 pt-8 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <span className="absolute h-20 w-20 animate-ping rounded-full bg-brand-400/40" />
          <span className="absolute h-14 w-14 animate-ping rounded-full bg-brand-500/40 [animation-delay:200ms]" />
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg">
            <CarIcon />
          </div>
        </div>
        <div className="text-center">
          <div className="text-base font-bold text-slate-900">Buscando conductores{'.'.repeat(dots)}</div>
          <div className="mt-1 text-sm text-slate-500">
            Tu oferta de ${offeredPrice?.toLocaleString('es-CL')} está siendo enviada a conductores cercanos
          </div>
        </div>
        <button
          onClick={() => navigate('/home')}
          className="mt-2 w-full rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-500"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

function CarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 16.5V13l1.6-4.6A2 2 0 0 1 8.5 7h7a2 2 0 0 1 1.9 1.4L19 13v3.5"
        stroke="white"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="15" r="1.2" fill="white" />
      <circle cx="16" cy="15" r="1.2" fill="white" />
    </svg>
  )
}
