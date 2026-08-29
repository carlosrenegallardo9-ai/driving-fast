import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => navigate('/login'), 1800)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center bg-gradient-to-b from-brand-600 to-brand-800 text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-lg">
          <ArrowLogo />
        </div>
        <div className="text-3xl font-extrabold tracking-tight">bluDrive</div>
        <div className="text-sm font-medium text-brand-100">Tú decides el precio de tu viaje</div>
      </div>
      <div className="absolute bottom-14 flex gap-1.5">
        <span className="h-2 w-2 animate-bounce rounded-full bg-white/90 [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-white/90 [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-white/90" />
      </div>
    </div>
  )
}

function ArrowLogo() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
      <path d="M4 14 L12 4 L20 14 L14 14 L14 20 L10 20 L10 14 Z" fill="#0060f0" />
    </svg>
  )
}
