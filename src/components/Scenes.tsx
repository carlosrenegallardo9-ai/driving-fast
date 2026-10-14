import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Float, Lightformer, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { Device, focusY } from './Device'
import { PRODUCTS } from '../lib/data'
import { useGame } from '../lib/store'

/** Pausa el render cuando el canvas sale de pantalla. */
function useInView<T extends Element>() {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(true)
  useEffect(() => {
    if (!ref.current) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '100px' })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return [ref, inView] as const
}

function Studio() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 5, 2]} intensity={1.6} />
      <pointLight position={[-3, 1, -2]} intensity={8} color="#8b5cff" />
      {/* Entorno generado localmente, sin descargar HDRIs */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 4, -3]} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={2} position={[-4, 1, 2]} rotation-y={Math.PI / 2} scale={[4, 1, 1]} />
        <Lightformer form="ring" intensity={1.5} color="#3df5ff" position={[4, 2, 2]} rotation-y={-Math.PI / 2} scale={2} />
      </Environment>
    </>
  )
}

function Frame({ children, className, label }: { children: ReactNode; className?: string; label: string }) {
  const [ref, inView] = useInView<HTMLDivElement>()
  return (
    <div ref={ref} className={className} role="img" aria-label={label}>
      <Canvas
        frameloop={inView ? 'always' : 'never'}
        dpr={[1, 2]}
        camera={{ position: [4, 2.4, 4.6], fov: 35 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        {children}
      </Canvas>
    </div>
  )
}

/* ---------- Hero: producto flotando y girando ---------- */
function Spinner({ children }: { children: ReactNode }) {
  const g = useRef<THREE.Group>(null)
  useFrame((_, dt) => { if (g.current) g.current.rotation.y += dt * 0.35 })
  return <group ref={g}>{children}</group>
}

export function HeroScene() {
  const variant = useGame((s) => s.variant)
  return (
    <Frame className="h-full w-full" label="Ion One girando en 3D">
      <Studio />
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
        <group rotation={[0.35, 0, 0.08]} scale={1.05}>
          <Spinner>
            <Device variant={variant} height={1} />
          </Spinner>
        </group>
      </Float>
      <ContactShadows position={[0, -1.35, 0]} opacity={0.5} scale={8} blur={2.6} far={3} />
    </Frame>
  )
}

/* ---------- Showroom: control orbital, despiece y hotspots ---------- */
const HOME = { pos: new THREE.Vector3(4, 2.4, 4.6), target: new THREE.Vector3(0, 0, 0) }

function CameraRig() {
  const { camera } = useThree()
  const controls = useThree((s) => s.controls) as OrbitControlsImpl | null
  const { focus, exploded, product, resetNonce } = useGame()
  const goal = useRef<{ pos: THREE.Vector3; target: THREE.Vector3 } | null>(null)

  useEffect(() => {
    const h = PRODUCTS[product].height
    if (focus) {
      const y = focusY(h, focus, exploded)
      goal.current = { pos: new THREE.Vector3(2.4, y + 0.9, 3.1), target: new THREE.Vector3(0, y, 0) }
    } else {
      const lift = exploded ? 0.3 * h : 0
      const dist = exploded ? 1.45 + 0.25 * h : 1
      goal.current = {
        pos: HOME.pos.clone().multiplyScalar(dist).add(new THREE.Vector3(0, lift, 0)),
        target: new THREE.Vector3(0, lift, 0),
      }
    }
  }, [focus, exploded, product, resetNonce])

  // si el usuario arrastra, cede el control de la cámara
  useEffect(() => {
    if (!controls) return
    const stop = () => { goal.current = null }
    controls.addEventListener('start', stop)
    return () => controls.removeEventListener('start', stop)
  }, [controls])

  useFrame((_, dt) => {
    const g = goal.current
    if (!g || !controls) return
    camera.position.x = THREE.MathUtils.damp(camera.position.x, g.pos.x, 3, dt)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, g.pos.y, 3, dt)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, g.pos.z, 3, dt)
    controls.target.lerp(g.target, 1 - Math.exp(-3 * dt))
    controls.update()
    if (camera.position.distanceTo(g.pos) < 0.02) goal.current = null
  })
  return null
}

export function ShowroomScene() {
  const { product, variant, exploded, focus, setFocus, award } = useGame()
  const p = PRODUCTS[product]
  return (
    <Frame className="absolute inset-0" label={`Visor 3D interactivo de ${p.name}`}>
      <Studio />
      <group position={[0, exploded ? 0 : -0.1, 0]}>
        <Device
          variant={variant}
          height={p.height}
          exploded={exploded}
          focus={focus}
          showHotspots
          onHotspot={(h) => setFocus(focus === h ? null : h)}
        />
      </group>
      <ContactShadows position={[0, -0.95 * p.height - (exploded ? 1.1 * p.height : 0), 0]} opacity={0.45} scale={9} blur={2.8} far={4} />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={2.2}
        maxDistance={11}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 1.9}
        onStart={() => {
          award(`explore:${product}`, 50, `Exploraste ${p.name} en 3D`)
        }}
      />
      <CameraRig />
    </Frame>
  )
}
