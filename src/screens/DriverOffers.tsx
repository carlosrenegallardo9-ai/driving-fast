import { useNavigate } from 'react-router-dom'
import { useRide } from '../context/RideContext'
import type { Driver } from '../data/mock'

export default function DriverOffers() {
  const navigate = useNavigate()
  const { driverOffers, offeredPrice, selectDriver } = useRide()

  function accept(driver: Driver) {
    selectDriver(driver)
    navigate('/trip')
  }

  return (
    <div className="flex h-full flex-1 flex-col bg-white">
      <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4">
        <button onClick={() => navigate('/home')} className="text-slate-500">
          <BackIcon />
        </button>
        <div>
          <div className="text-base font-bold text-slate-900">Ofertas de conductores</div>
          <div className="text-xs text-slate-400">Tu oferta: ${offeredPrice?.toLocaleString('es-CL')}</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {driverOffers.length === 0 && (
          <div className="mt-10 text-center text-sm text-slate-400">No hay ofertas disponibles.</div>
        )}
        <div className="flex flex-col gap-3">
          {driverOffers.map((d) => (
            <div key={d.id} className="rounded-2xl border border-slate-100 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <img src={d.avatar} alt={d.name} className="h-12 w-12 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-900">{d.name}</span>
                    <StarIcon />
                    <span className="text-xs font-semibold text-slate-500">{d.rating}</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {d.car} · {d.color} · {d.plate}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-extrabold text-brand-700">${d.price.toLocaleString('es-CL')}</div>
                  <div className="text-xs text-slate-400">{d.eta} min</div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => accept(d)}
                  className="flex-1 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white active:bg-brand-700"
                >
                  Aceptar oferta
                </button>
                <button className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-500">
                  Chat
                </button>
              </div>
            </div>
          ))}
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

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#f5a623">
      <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 6.9L12 17.6 5.7 20.8l1.7-6.9L2 9.2l7.1-.6L12 2Z" />
    </svg>
  )
}
