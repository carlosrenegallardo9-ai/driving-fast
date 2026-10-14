import { useEffect } from 'react'
import { MotionConfig } from 'framer-motion'
import { useGame, today } from './lib/store'
import { scrollTo } from './lib/execute'
import { Nav, TabBar } from './components/Nav'
import { Hero, ProBand, Tiles } from './components/Hero'
import { Showroom } from './components/Showroom'
import { Quests } from './components/Quests'
import { Ranking, Rewards } from './components/Ranking'
import { Assistant } from './components/Assistant'
import { Bursts, LevelUp, Nudge, Signup, Toast } from './components/Overlays'

const FOOTER: [string, [string, string][]][] = [
  ['Productos', [['Ion One', 'showroom'], ['Ion Pro', 'showroom'], ['Comparar', 'showroom']]],
  ['Tech Quests', [['Misiones', 'quests'], ['Trivia', 'quests'], ['Ranking', 'ranking']]],
  ['Recompensas', [['Premios del mes', 'recompensas'], ['Medallas', 'recompensas']]],
]

function Footer() {
  return (
    <footer className="band-alt gutter pt-10 pb-28 text-[12px] md:pb-10">
      <div className="mx-auto max-w-[980px]">
        <p className="pb-4 text-ink-3" style={{ borderBottom: '1px solid var(--line)' }}>
          Esta es una vista previa del prototipo. Los productos, precios, jugadores y premios son de ejemplo. El progreso se guarda sólo en este navegador.
        </p>
        <div className="grid grid-cols-2 gap-6 py-6 sm:grid-cols-3">
          {FOOTER.map(([title, links]) => (
            <div key={title}>
              <h3 className="text-[12px] font-semibold">{title}</h3>
              <ul className="mt-2 space-y-1.5">
                {links.map(([label, id]) => (
                  <li key={label}>
                    <a href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id) }} className="text-ink-2 hover:text-ink hover:underline">{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="pt-4 text-ink-3" style={{ borderTop: '1px solid var(--line)' }}>Copyright © 2026 Gallardo Tech. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

export default function App() {
  // Login diario: primera misión de la racha
  useEffect(() => {
    const t = setTimeout(() => useGame.getState().award(`login:${today()}`, 25, 'Racha diaria · 5 días'), 1200)
    return () => clearTimeout(t)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <Nav />
      <main>
        <Hero />
        <ProBand />
        <Tiles />
        <Showroom />
        <Quests />
        <Ranking />
        <Rewards />
      </main>
      <Footer />
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
