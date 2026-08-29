import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { avatarDataUri } from '../data/mock'

const menu = [
  { icon: '💳', label: 'Métodos de pago' },
  { icon: '🎁', label: 'Promociones' },
  { icon: '🛡️', label: 'Seguridad' },
  { icon: '⚙️', label: 'Ajustes' },
  { icon: '❓', label: 'Ayuda y soporte' },
]

export default function Profile() {
  const navigate = useNavigate()

  return (
    <div className="flex h-full flex-1 flex-col bg-white">
      <div className="bg-gradient-to-b from-brand-700 to-brand-500 px-5 pb-8 pt-8 text-white">
        <div className="flex items-center gap-4">
          <img
            src={avatarDataUri('Carlos Gallardo', 2)}
            className="h-16 w-16 rounded-full border-2 border-white object-cover"
            alt="avatar"
          />
          <div>
            <div className="text-lg font-bold">Carlos Gallardo</div>
            <div className="flex items-center gap-1 text-sm text-brand-100">
              <span>★ 4.9</span>
              <span>· 128 viajes</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="flex flex-col divide-y divide-slate-100 rounded-2xl border border-slate-100">
          {menu.map((m) => (
            <button key={m.label} className="flex items-center gap-3 px-4 py-3.5 text-left active:bg-slate-50">
              <span className="text-lg">{m.icon}</span>
              <span className="flex-1 text-sm font-semibold text-slate-700">{m.label}</span>
              <span className="text-slate-300">›</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate('/login')}
          className="mt-6 w-full rounded-2xl border border-red-100 py-3 text-sm font-semibold text-red-500"
        >
          Cerrar sesión
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
