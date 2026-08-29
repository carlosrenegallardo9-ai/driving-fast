import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRide } from '../context/RideContext'

export default function RateTrip() {
  const navigate = useNavigate()
  const { selectedDriver, reset } = useRide()
  const [rating, setRating] = useState(5)
  const [sent, setSent] = useState(false)

  if (!selectedDriver) {
    navigate('/home')
    return null
  }

  function finish() {
    reset()
    navigate('/home')
  }

  return (
    <div className="flex h-full flex-1 flex-col items-center bg-white px-6 pb-8 pt-16">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
        <CheckIcon />
      </div>
      <div className="mt-4 text-xl font-bold text-slate-900">¡Llegaste a tu destino!</div>
      <div className="mt-1 text-sm text-slate-500">Califica tu viaje con {selectedDriver.name}</div>

      <img src={selectedDriver.avatar} className="mt-6 h-20 w-20 rounded-full object-cover" alt={selectedDriver.name} />
      <div className="mt-2 text-base font-bold text-slate-900">{selectedDriver.name}</div>
      <div className="text-xs text-slate-400">
        {selectedDriver.car} · {selectedDriver.plate}
      </div>

      <div className="mt-6 flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => setRating(n)} className="active:scale-90">
            <StarIcon filled={n <= rating} />
          </button>
        ))}
      </div>

      <div className="mt-8 w-full rounded-2xl bg-brand-50 p-4 text-center">
        <div className="text-xs text-brand-700">Total pagado</div>
        <div className="text-2xl font-extrabold text-brand-800">${selectedDriver.price.toLocaleString('es-CL')}</div>
      </div>

      <div className="flex-1" />

      {!sent ? (
        <button
          onClick={() => setSent(true)}
          className="w-full rounded-2xl bg-brand-600 py-4 text-base font-semibold text-white active:bg-brand-700"
        >
          Enviar calificación
        </button>
      ) : (
        <button
          onClick={finish}
          className="w-full rounded-2xl bg-brand-600 py-4 text-base font-semibold text-white active:bg-brand-700"
        >
          Volver al inicio
        </button>
      )}
    </div>
  )
}

function CheckIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <path d="M5 13l4 4L19 7" stroke="#0060f0" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill={filled ? '#f5a623' : '#e2e8f0'}>
      <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 6.9L12 17.6 5.7 20.8l1.7-6.9L2 9.2l7.1-.6L12 2Z" />
    </svg>
  )
}
