export type Address = {
  id: string
  title: string
  subtitle: string
  lat: number
  lng: number
}

export const savedPlaces: Address[] = [
  { id: 'home', title: 'Casa', subtitle: 'Av. Las Condes 8560, Las Condes', lat: -33.4076, lng: -70.5686 },
  { id: 'work', title: 'Trabajo', subtitle: 'Isidora Goyenechea 3477, Las Condes', lat: -33.4145, lng: -70.6013 },
]

export const recentAddresses: Address[] = [
  { id: 'r1', title: 'Costanera Center', subtitle: 'Av. Andrés Bello 2425, Providencia', lat: -33.4176, lng: -70.6068 },
  { id: 'r2', title: 'Aeropuerto SCL', subtitle: 'Av. Armando Cortínez, Pudahuel', lat: -33.393, lng: -70.7858 },
  { id: 'r3', title: 'Parque Bicentenario', subtitle: 'Av. Bicentenario, Vitacura', lat: -33.3928, lng: -70.5997 },
  { id: 'r4', title: 'Mall Plaza Vespucio', subtitle: 'Av. Vicuña Mackenna 7110, La Florida', lat: -33.5305, lng: -70.5985 },
]

export type Driver = {
  id: string
  name: string
  rating: number
  trips: number
  car: string
  plate: string
  color: string
  eta: number
  price: number
  avatar: string
}

const firstNames = ['Marcelo', 'Fernanda', 'Ignacio', 'Camila', 'Rodrigo', 'Valentina', 'Sebastián', 'Javiera']
const cars = ['Chevrolet Sail', 'Hyundai Accent', 'Suzuki Baleno', 'Kia Rio', 'Nissan Versa', 'Toyota Yaris']
const colors = ['blanco', 'gris', 'plata', 'azul', 'negro']

function seedRandom(seed: number) {
  let value = seed
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

const avatarPalette = ['#0060f0', '#0b3378', '#157dff', '#073d99', '#3f9dff']

export function avatarDataUri(name: string, seedIndex: number) {
  const initials = name.slice(0, 2).toUpperCase()
  const bg = avatarPalette[seedIndex % avatarPalette.length]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96">
    <rect width="96" height="96" rx="48" fill="${bg}" />
    <text x="48" y="56" font-family="Manrope, Arial, sans-serif" font-size="34" font-weight="700" fill="white" text-anchor="middle">${initials}</text>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export function generateOffers(basePrice: number, seed = Date.now()): Driver[] {
  const rand = seedRandom(seed)
  const count = 4
  return Array.from({ length: count }).map((_, i) => {
    const variance = Math.round((rand() - 0.35) * basePrice * 0.18)
    const name = firstNames[Math.floor(rand() * firstNames.length)]
    return {
      id: `d${i}-${seed}`,
      name,
      rating: Math.round((4.6 + rand() * 0.4) * 10) / 10,
      trips: Math.floor(800 + rand() * 4000),
      car: cars[Math.floor(rand() * cars.length)],
      plate: `${String.fromCharCode(65 + Math.floor(rand() * 26))}${String.fromCharCode(65 + Math.floor(rand() * 26))}${String.fromCharCode(65 + Math.floor(rand() * 26))}-${Math.floor(10 + rand() * 89)}`,
      color: colors[Math.floor(rand() * colors.length)],
      eta: Math.max(1, Math.round(2 + rand() * 8)),
      price: Math.max(500, basePrice + variance),
      avatar: avatarDataUri(name, i),
    }
  }).sort((a, b) => a.eta - b.eta)
}

export function estimateBasePrice(distanceKm: number) {
  return Math.round((1200 + distanceKm * 480) / 100) * 100
}

export type TripRecord = {
  id: string
  date: string
  from: string
  to: string
  price: number
  driver: string
  rating: number
}

export const tripHistory: TripRecord[] = [
  { id: 't1', date: 'Ayer, 18:42', from: 'Casa', to: 'Costanera Center', price: 3200, driver: 'Marcelo', rating: 5 },
  { id: 't2', date: '24 ago, 09:10', from: 'Trabajo', to: 'Aeropuerto SCL', price: 12500, driver: 'Fernanda', rating: 5 },
  { id: 't3', date: '19 ago, 21:05', from: 'Parque Bicentenario', to: 'Casa', price: 4100, driver: 'Ignacio', rating: 4 },
]
