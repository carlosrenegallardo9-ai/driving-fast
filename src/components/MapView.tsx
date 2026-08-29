type MapViewProps = {
  showRoute?: boolean
  showDestinationPin?: boolean
  animateCars?: boolean
  className?: string
}

export default function MapView({
  showRoute = false,
  showDestinationPin = false,
  animateCars = true,
  className = '',
}: MapViewProps) {
  return (
    <div className={`relative w-full overflow-hidden bg-brand-100 ${className}`}>
      <svg viewBox="0 0 400 400" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="400" fill="#dceafe" />
        {Array.from({ length: 9 }).map((_, i) => (
          <rect key={`h${i}`} x="0" y={i * 46} width="400" height="10" fill="#c3daf7" />
        ))}
        {Array.from({ length: 9 }).map((_, i) => (
          <rect key={`v${i}`} x={i * 46} y="0" width="10" height="400" fill="#c3daf7" />
        ))}
        <rect x="0" y="180" width="400" height="26" fill="#a9c9f2" />
        <rect x="150" y="0" width="26" height="400" fill="#a9c9f2" />

        {showRoute && (
          <path
            d="M 60 320 C 120 260, 140 200, 163 193 C 220 175, 260 140, 300 90"
            stroke="#0060f0"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            strokeDasharray="2 14"
          />
        )}

        <g transform="translate(60,320)">
          <circle r="10" fill="#0060f0" opacity="0.18" />
          <circle r="6" fill="#0060f0" stroke="white" strokeWidth="2" />
        </g>

        {showDestinationPin && (
          <g transform="translate(300,90)">
            <path
              d="M0 -22 C10 -22 18 -14 18 -4 C18 10 0 22 0 22 C0 22 -18 10 -18 -4 C-18 -14 -10 -22 0 -22 Z"
              fill="#0b3378"
            />
            <circle r="5" fill="white" />
          </g>
        )}

        {animateCars && (
          <>
            <g>
              <rect x="-6" y="-3" width="12" height="6" rx="2" fill="#157dff">
                <animateMotion dur="6s" repeatCount="indefinite" path="M40 40 L360 40 L360 220" rotate="auto" />
              </rect>
            </g>
            <g>
              <rect x="-6" y="-3" width="12" height="6" rx="2" fill="#0b3378">
                <animateMotion dur="8s" repeatCount="indefinite" path="M20 360 L220 360 L220 20" rotate="auto" />
              </rect>
            </g>
          </>
        )}
      </svg>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
    </div>
  )
}
