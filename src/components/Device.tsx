import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { HOTSPOTS, VARIANTS, type HotspotId, type VariantId } from '../lib/data'

interface Layer {
  id: string
  y: number
  ey: number // posición en despiece
  hotspot?: HotspotId
  hx: number // distancia del hotspot al eje
}

export const layersFor = (h: number): Layer[] => [
  { id: 'base', y: -0.62 * h, ey: -1.7 * h, hx: 1.2 },
  { id: 'bateria', y: -0.36 * h, ey: -0.9 * h, hotspot: 'bateria', hx: 0.9 },
  { id: 'placa', y: -0.16 * h, ey: -0.05 * h, hotspot: 'chip', hx: 0.3 },
  { id: 'driver', y: 0.08 * h, ey: 0.8 * h, hotspot: 'driver', hx: 0.82 },
  { id: 'anillo', y: 0.38 * h, ey: 1.55 * h, hotspot: 'anillo', hx: 1.12 },
  { id: 'tapa', y: 0.46 * h, ey: 2.25 * h, hx: 0 },
]

export function focusY(h: number, hotspot: HotspotId, exploded: boolean) {
  const l = layersFor(h).find((x) => x.hotspot === hotspot)!
  return exploded ? l.ey : l.y
}

interface Props {
  variant: VariantId
  height: number
  exploded?: boolean
  focus?: HotspotId | null
  showHotspots?: boolean
  onHotspot?: (h: HotspotId) => void
}

export function Device({ variant, height, exploded = false, focus = null, showHotspots = false, onHotspot }: Props) {
  const v = VARIANTS.find((x) => x.id === variant)!
  const layers = useMemo(() => layersFor(height), [height])
  const refs = useRef<Record<string, THREE.Group | null>>({})

  const mats = useMemo(
    () => ({
      shell: new THREE.MeshStandardMaterial({ color: v.shell, metalness: v.metalness, roughness: v.roughness, transparent: true, side: THREE.DoubleSide }),
      glass: new THREE.MeshStandardMaterial({ color: '#ffffff', metalness: 0.1, roughness: 0.05, transparent: true, opacity: 0.12, depthWrite: false }),
      dark: new THREE.MeshStandardMaterial({ color: '#15181f', metalness: 0.9, roughness: 0.35 }),
      battery: new THREE.MeshStandardMaterial({ color: '#2a2b2f', metalness: 0.6, roughness: 0.45, emissive: '#ffffff', emissiveIntensity: 0 }),
      pcb: new THREE.MeshStandardMaterial({ color: '#3a3c42', metalness: 0.5, roughness: 0.5, emissive: '#ffffff', emissiveIntensity: 0 }),
      chip: new THREE.MeshStandardMaterial({ color: '#0a0b0e', metalness: 0.95, roughness: 0.15 }),
      cone: new THREE.MeshStandardMaterial({ color: '#2b2c30', metalness: 0.4, roughness: 0.7, side: THREE.DoubleSide, emissive: '#ffffff', emissiveIntensity: 0 }),
      ring: new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 1.4, toneMapped: false }),
    }),
    // los materiales se crean una vez; los colores se interpolan en useFrame
    [],
  )

  const target = useMemo(() => new THREE.Color(), [])

  useFrame((_, dt) => {
    target.set(v.shell)
    const k = 1 - Math.exp(-6 * dt)
    mats.shell.color.lerp(target, k)
    mats.shell.metalness = THREE.MathUtils.lerp(mats.shell.metalness, v.metalness, k)
    mats.shell.roughness = THREE.MathUtils.lerp(mats.shell.roughness, v.roughness, k)
    mats.shell.opacity = THREE.MathUtils.damp(mats.shell.opacity, exploded ? 0.07 : 1, 6, dt)
    mats.shell.depthWrite = mats.shell.opacity > 0.9

    const t = performance.now() / 1000
    const pulse = 0.35 + 0.25 * Math.sin(t * 4)
    mats.battery.emissiveIntensity = focus === 'bateria' ? pulse * 0.5 : 0
    mats.pcb.emissiveIntensity = focus === 'chip' ? pulse * 0.4 : 0
    mats.cone.emissiveIntensity = focus === 'driver' ? pulse * 0.35 : 0
    mats.ring.emissiveIntensity = focus === 'anillo' ? 2.2 + Math.sin(t * 4) : 1.4

    layers.forEach((l, i) => {
      const g = refs.current[l.id]
      if (!g) return
      // retraso escalonado: las capas exteriores se mueven primero
      const lambda = 5 - Math.abs(i - 2.5) * 0.4
      g.position.y = THREE.MathUtils.damp(g.position.y, exploded ? l.ey : l.y, lambda, dt)
    })
  })

  const h = height
  const shellH = 1.16 * h

  return (
    <group>
      {/* Carcasa exterior (se vuelve translúcida en despiece) */}
      <mesh material={mats.shell} position={[0, -0.12 * h, 0]}>
        <cylinderGeometry args={[1.26, 1.3, shellH, 96, 1, true]} />
      </mesh>
      {Array.from({ length: Math.round(9 * h) }).map((_, i) => (
        <mesh key={i} material={mats.shell} position={[0, -0.6 * h + 0.06 + i * 0.105, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.285 - i * 0.002, 0.008, 6, 96]} />
        </mesh>
      ))}

      {layers.map((l) => (
        <group key={l.id} ref={(el) => { refs.current[l.id] = el }} position={[0, l.y, 0]}>
          {l.id === 'base' && (
            <mesh material={mats.dark}>
              <cylinderGeometry args={[1.22, 1.28, 0.16, 96]} />
            </mesh>
          )}
          {l.id === 'bateria' && (
            <group>
              <mesh material={mats.battery}>
                <cylinderGeometry args={[0.86, 0.86, 0.26 * h, 64]} />
              </mesh>
              <mesh material={mats.dark} position={[0, 0.14 * h, 0]}>
                <cylinderGeometry args={[0.3, 0.3, 0.03, 32]} />
              </mesh>
            </group>
          )}
          {l.id === 'placa' && (
            <group>
              <mesh material={mats.pcb}>
                <cylinderGeometry args={[1.02, 1.02, 0.04, 64]} />
              </mesh>
              <mesh material={mats.chip} position={[0, 0.05, 0]}>
                <boxGeometry args={[0.38, 0.06, 0.38]} />
              </mesh>
              {[-0.55, 0.55].map((x) => (
                <mesh key={x} material={mats.dark} position={[x, 0.04, 0.2]}>
                  <boxGeometry args={[0.18, 0.05, 0.12]} />
                </mesh>
              ))}
            </group>
          )}
          {l.id === 'driver' && (
            <group>
              <mesh material={mats.cone}>
                <cylinderGeometry args={[0.84, 0.32, 0.26, 64, 1, true]} />
              </mesh>
              <mesh material={mats.dark} position={[0, -0.05, 0]}>
                <sphereGeometry args={[0.24, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              </mesh>
              <mesh material={mats.dark} position={[0, 0.13, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.84, 0.03, 8, 64]} />
              </mesh>
            </group>
          )}
          {l.id === 'anillo' && (
            <mesh material={mats.ring} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[1.12, 0.035, 12, 128]} />
            </mesh>
          )}
          {l.id === 'tapa' && (
            <mesh material={mats.glass}>
              <cylinderGeometry args={[1.25, 1.25, 0.05, 96]} />
            </mesh>
          )}

          {showHotspots && l.hotspot && (
            <Html position={[l.hx, 0.04, 0.35]} center zIndexRange={[20, 0]}>
              <div className="flex items-center gap-2" style={{ pointerEvents: 'auto' }}>
                <button
                  type="button"
                  className="hotspot"
                  aria-label={HOTSPOTS[l.hotspot].title}
                  aria-pressed={focus === l.hotspot}
                  onClick={(e) => { e.stopPropagation(); onHotspot?.(l.hotspot!) }}
                >
                  {focus === l.hotspot ? '−' : '+'}
                </button>
                {focus === l.hotspot && (
                  <div className="w-56 rounded-2xl p-3.5 text-left shadow-xl" style={{ background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(20px)' }}>
                    <div className="text-[14px] font-semibold" style={{ color: '#1d1d1f' }}>{HOTSPOTS[l.hotspot].title}</div>
                    <div className="mt-0.5 text-[13px] leading-snug" style={{ color: '#6e6e73' }}>{HOTSPOTS[l.hotspot].body}</div>
                  </div>
                )}
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  )
}
