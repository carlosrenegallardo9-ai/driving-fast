import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MapView from '../components/MapView'
import { useRide } from '../context/RideContext'
import { estimateBasePrice } from '../data/mock'

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const lat1 = (a.lat * Math.PI) / 180
  const lat2 = (b.lat * Math.PI) / 180
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
}

export default function OfferPrice() {
  const navigate = useNavigate()
  const { pickup, destination, setOfferedPrice, setBasePrice, basePrice } = useRide()
  const [price, setPrice] = useState(0)

  useEffect(() => {
    if (!pickup || !destination) {
      navigate('/set-destination')
      return
    }
    const distanceKm = Math.max(1.2, haversineKm(pickup, destination))
    const base = estimateBasePrice(distanceKm)
    setBasePrice(base)
    setPrice(base)
  }, [pickup, destination, navigate, setBasePrice])

  if (!pickup || !destination) return null

  const distanceKm = Math.max(1.2, haversineKm(pickup, destination))
  const step = 100

  function requestRide() {
    setOfferedPrice(price)
    navigate('/searching')
  }

  return (
    <div className="flex h-full flex-1 flex-col bg-white">
      <div className="relative h-40 shrink-0">
        <MapView className="h-full" showRoute showDestinationPin animateCars={false} />
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md"
        >
          <BackIcon />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="rounded-2xl border border-slate-100 p-4">
          <div className="flex items-start gap-3">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-600" />
            <div className="text-sm font-medium text-slate-700">{pickup.subtitle}</div>
          </div>
          <div className="my-2 ml-1 h-4 w-px border-l border-dashed border-slate-300" />
          <div className="flex items-start gap-3">
            <span className="mt-1 h-2.5 w-2.5 rounded-sm bg-brand-900" />
            <div className="text-sm font-medium text-slate-700">{destination.subtitle}</div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
          <span>{distanceKm.toFixed(1)} km aprox.</span>
          <span>Tarifa sugerida: ${basePrice.toLocaleString('es-CL')}</span>
        </div>

        <div className="mt-6 rounded-3xl bg-brand-50 p-6 text-center">
          <div className="text-sm font-semibold text-brand-700">Ofrece cuánto quieres pagar</div>
          <div className="mt-4 flex items-center justify-center gap-5">
            <button
              onClick={() => setPrice((p) => Math.max(step, p - step))}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl font-bold text-brand-600 shadow active:scale-95"
            >
              −
            </button>
            <div className="text-4xl font-extrabold text-brand-800">${price.toLocaleString('es-CL')}</div>
            <button
              onClick={() => setPrice((p) => p + step)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl font-bold text-brand-600 shadow active:scale-95"
            >
              +
            </button>
          </div>
          <div className="mt-4 flex justify-center gap-2">
            {[-500, 0, 500, 1000].map((delta) => (
              <button
                key={delta}
                onClick={() => setPrice(Math.max(step, basePrice + delta))}
                className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-brand-700 shadow-sm active:bg-brand-100"
              >
                {delta === 0 ? 'Sugerida' : delta > 0 ? `+${delta}` : delta}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          Los conductores cercanos verán tu oferta y podrán aceptarla o proponerte un nuevo precio.
        </p>
      </div>

      <div className="border-t border-slate-100 p-4">
        <button
          onClick={requestRide}
          className="w-full rounded-2xl bg-brand-600 py-4 text-base font-semibold text-white active:bg-brand-700"
        >
          Buscar conductor
        </button>
      </div>
    </div>
  )
}

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M15 18l-6-6 6-6" stroke="#0b3378" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
