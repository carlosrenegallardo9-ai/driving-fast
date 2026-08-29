import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [phone, setPhone] = useState('')
  const [step, setStep] = useState<'phone' | 'code'>('phone')
  const [code, setCode] = useState('')
  const navigate = useNavigate()

  const canContinue = step === 'phone' ? phone.replace(/\D/g, '').length >= 8 : code.length === 4

  return (
    <div className="flex h-full flex-1 flex-col bg-white px-6 pb-8 pt-14">
      <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M4 14 L12 4 L20 14 L14 14 L14 20 L10 20 L10 14 Z" fill="white" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-slate-900">
        {step === 'phone' ? 'Ingresa tu número' : 'Verifica tu número'}
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        {step === 'phone'
          ? 'Te enviaremos un código de verificación por SMS.'
          : `Enviamos un código a ${phone}`}
      </p>

      <div className="mt-8">
        {step === 'phone' ? (
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 focus-within:border-brand-500 focus-within:bg-white">
            <span className="text-base font-semibold text-slate-500">+56</span>
            <div className="h-5 w-px bg-slate-300" />
            <input
              autoFocus
              inputMode="numeric"
              placeholder="9 1234 5678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-transparent text-base font-medium text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
        ) : (
          <input
            autoFocus
            inputMode="numeric"
            maxLength={4}
            placeholder="• • • •"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-center text-2xl font-bold tracking-[0.6em] text-slate-900 outline-none focus:border-brand-500 focus:bg-white"
          />
        )}
      </div>

      <div className="flex-1" />

      <button
        disabled={!canContinue}
        onClick={() => {
          if (step === 'phone') setStep('code')
          else navigate('/home')
        }}
        className="w-full rounded-2xl bg-brand-600 py-4 text-center text-base font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
      >
        Continuar
      </button>
      <p className="mt-4 text-center text-xs text-slate-400">
        Al continuar aceptas los Términos de servicio y la Política de privacidad
      </p>
    </div>
  )
}
