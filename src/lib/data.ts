export type ProductId = 'ion-one' | 'ion-pro'
export type VariantId = 'medianoche' | 'plata' | 'blanco'
export type HotspotId = 'driver' | 'chip' | 'bateria' | 'anillo'

export interface Variant {
  id: VariantId
  name: string
  shell: string
  swatch: string
  metalness: number
  roughness: number
}

export const VARIANTS: Variant[] = [
  { id: 'medianoche', name: 'Medianoche', shell: '#3a3b40', swatch: '#2b2c30', metalness: 0.55, roughness: 0.42 },
  { id: 'plata', name: 'Plata', shell: '#e3e4e6', swatch: '#e3e4e6', metalness: 0.55, roughness: 0.28 },
  { id: 'blanco', name: 'Blanco', shell: '#f4f4f1', swatch: '#fafaf8', metalness: 0.02, roughness: 0.6 },
]

export interface Product {
  id: ProductId
  name: string
  tagline: string
  price: string
  height: number
  specs: [string, string][]
}

export const PRODUCTS: Record<ProductId, Product> = {
  'ion-one': {
    id: 'ion-one',
    name: 'Ion One',
    tagline: 'Altavoz espacial con IA local',
    price: '$249',
    height: 1,
    specs: [
      ['Procesador', 'GT-N1 · 8 TOPS'],
      ['Audio', '360° · 3 drivers'],
      ['Batería', '20 h · 4 800 mAh'],
      ['Conexión', 'Wi-Fi 7 · BT 6.0'],
      ['Peso', '780 g'],
    ],
  },
  'ion-pro': {
    id: 'ion-pro',
    name: 'Ion Pro',
    tagline: 'Estudio de sonido de sobremesa',
    price: '$449',
    height: 1.45,
    specs: [
      ['Procesador', 'GT-N2 · 24 TOPS'],
      ['Audio', '360° · 5 drivers + sub'],
      ['Batería', '32 h · 9 600 mAh'],
      ['Conexión', 'Wi-Fi 7 · BT 6.0 · UWB'],
      ['Peso', '1,3 kg'],
    ],
  },
}

export const HOTSPOTS: Record<HotspotId, { title: string; short: string; body: string }> = {
  anillo: { short: 'Anillo LED', title: 'Anillo de luz reactiva', body: '64 LEDs que siguen tu voz y el ritmo de la música.' },
  driver: { short: 'Driver', title: 'Driver de neodimio', body: 'Cono de grafeno de 52 mm, respuesta 38 Hz – 22 kHz.' },
  chip: { short: 'Chip', title: 'Chip neuronal GT', body: 'NPU dedicada: la IA corre en el equipo, sin nube.' },
  bateria: { short: 'Batería', title: 'Batería de grafeno', body: 'Carga del 0 al 80 % en 25 minutos.' },
}

export interface Rival { name: string; weekly: number; monthly: number }

export const RIVALS: Rival[] = [
  { name: 'quasar', weekly: 12400, monthly: 41200 },
  { name: 'kai', weekly: 11980, monthly: 39800 },
  { name: 'lumen', weekly: 10200, monthly: 36100 },
  { name: 'orbit', weekly: 9870, monthly: 30400 },
  { name: 'pix', weekly: 9510, monthly: 29950 },
  { name: 'rune', weekly: 8300, monthly: 27700 },
  { name: 'zed', weekly: 7900, monthly: 25010 },
  { name: 'vex', weekly: 7420, monthly: 22300 },
  { name: 'atlas', weekly: 7100, monthly: 21800 },
  { name: 'mira', weekly: 6980, monthly: 20200 },
  { name: 'sol', weekly: 2900, monthly: 9100 },
  { name: 'echo', weekly: 1800, monthly: 6400 },
  { name: 'bit', weekly: 650, monthly: 2400 },
]

export const TRIVIA = [
  {
    q: '¿Qué formato comprime la geometría de un modelo GLB?',
    options: ['Draco', 'WebP', 'Brotli'],
    answer: 0,
  },
  {
    q: '¿Qué API permite ver un modelo 3D en realidad aumentada desde el navegador?',
    options: ['WebGPU', 'WebXR', 'WebRTC'],
    answer: 1,
  },
  {
    q: '¿Cuántos TOPS tiene el chip del Ion Pro?',
    options: ['8', '16', '24'],
    answer: 2,
  },
]
