import { useEffect } from 'react'
import { MotionConfig } from 'framer-motion'
import { useGame, today } from './lib/store'
import { VARIANTS } from './lib/data'
import { Nav, TabBar } from './components/Nav'
import { Hero, Bento } from './components/Hero'
import { Showroom } from './components/Showroom'
import { Quests } from './components/Quests'
import { Ranking, Rewards } from './components/Ranking'
import { Assistant } from './components/Assistant'
import { Bursts, LevelUp, Nudge, Signup, Toast } from './components/Overlays'

export default function App() {
  const variant = useGame((s) => s.variant)

  // El acento de toda la interfaz sigue al acabado elegido
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', VARIANTS.find((v) => v.id === variant)!.accent)
  }, [variant])

  // Login diario: primera misión de la racha
  useEffect(() => {
    const t = setTimeout(() => useGame.getState().award(`login:${today()}`, 25, 'Racha diaria 🔥 5 días'), 1200)
    return () => clearTimeout(t)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <Nav />
      <main>
        <Hero />
        <Bento />
        <Showroom />
        <Quests />
        <Ranking />
        <Rewards />
      </main>
      <footer className="gutter border-t border-white/5 pt-10 pb-28 lg:pb-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-sm text-lo">
          <span className="font-display font-semibold text-md">GALLARDO TECH</span>
          <span>Vista previa del prototipo · Productos, jugadores y premios de ejemplo</span>
        </div>
      </footer>
      <TabBar />
      <Assistant />
      <Bursts />
      <Toast />
      <Nudge />
      <Signup />
      <LevelUp />
    </MotionConfig>
  )
}
