import type { ReactNode } from 'react'

export default function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-brand-950 p-0 sm:p-6">
      <div className="relative flex h-screen w-full flex-col overflow-hidden bg-white sm:h-[850px] sm:max-h-[92vh] sm:w-[400px] sm:rounded-[2.5rem] sm:border-[10px] sm:border-slate-900 sm:shadow-2xl">
        <div className="pointer-events-none absolute left-1/2 top-0 z-20 hidden h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-slate-900 sm:block" />
        <div className="flex h-full min-h-0 flex-col">{children}</div>
      </div>
    </div>
  )
}
