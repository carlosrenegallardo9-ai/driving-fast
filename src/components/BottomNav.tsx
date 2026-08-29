import { NavLink } from 'react-router-dom'

const items = [
  { to: '/home', label: 'Viajar', icon: CarIcon },
  { to: '/activity', label: 'Actividad', icon: ClockIcon },
  { to: '/profile', label: 'Perfil', icon: UserIcon },
]

export default function BottomNav() {
  return (
    <nav className="flex shrink-0 items-stretch border-t border-brand-100 bg-white/95 backdrop-blur">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors ${
              isActive ? 'text-brand-600' : 'text-slate-400'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon active={isActive} />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

function CarIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 16.5V13l1.6-4.6A2 2 0 0 1 8.5 7h7a2 2 0 0 1 1.9 1.4L19 13v3.5M5 16.5a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V15H5v1.5Zm14 0a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V15h3v1.5ZM5 13h14"
        stroke={active ? '#0060f0' : '#94a3b8'}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="15" r="1.2" fill={active ? '#0060f0' : '#94a3b8'} />
      <circle cx="16" cy="15" r="1.2" fill={active ? '#0060f0' : '#94a3b8'} />
    </svg>
  )
}

function ClockIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke={active ? '#0060f0' : '#94a3b8'} strokeWidth="1.7" />
      <path d="M12 8v4l3 2" stroke={active ? '#0060f0' : '#94a3b8'} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function UserIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8.5" r="3.3" stroke={active ? '#0060f0' : '#94a3b8'} strokeWidth="1.7" />
      <path d="M5 19.5c1.2-3.4 4-5 7-5s5.8 1.6 7 5" stroke={active ? '#0060f0' : '#94a3b8'} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}
