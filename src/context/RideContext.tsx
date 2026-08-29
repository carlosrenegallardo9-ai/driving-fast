import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Address, Driver } from '../data/mock'

type RideState = {
  pickup: Address | null
  destination: Address | null
  offeredPrice: number | null
  basePrice: number
  driverOffers: Driver[]
  selectedDriver: Driver | null
  setPickup: (a: Address) => void
  setDestination: (a: Address) => void
  setOfferedPrice: (p: number) => void
  setBasePrice: (p: number) => void
  setDriverOffers: (d: Driver[]) => void
  selectDriver: (d: Driver) => void
  reset: () => void
}

const RideContext = createContext<RideState | null>(null)

export function RideProvider({ children }: { children: ReactNode }) {
  const [pickup, setPickup] = useState<Address | null>({
    id: 'current',
    title: 'Mi ubicación actual',
    subtitle: 'Av. Providencia 1760, Providencia',
    lat: -33.4264,
    lng: -70.6172,
  })
  const [destination, setDestination] = useState<Address | null>(null)
  const [offeredPrice, setOfferedPrice] = useState<number | null>(null)
  const [basePrice, setBasePrice] = useState<number>(0)
  const [driverOffers, setDriverOffers] = useState<Driver[]>([])
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)

  const value = useMemo(
    () => ({
      pickup,
      destination,
      offeredPrice,
      basePrice,
      driverOffers,
      selectedDriver,
      setPickup,
      setDestination,
      setOfferedPrice,
      setBasePrice,
      setDriverOffers,
      selectDriver: setSelectedDriver,
      reset: () => {
        setDestination(null)
        setOfferedPrice(null)
        setBasePrice(0)
        setDriverOffers([])
        setSelectedDriver(null)
      },
    }),
    [pickup, destination, offeredPrice, basePrice, driverOffers, selectedDriver],
  )

  return <RideContext.Provider value={value}>{children}</RideContext.Provider>
}

export function useRide() {
  const ctx = useContext(RideContext)
  if (!ctx) throw new Error('useRide must be used within RideProvider')
  return ctx
}
