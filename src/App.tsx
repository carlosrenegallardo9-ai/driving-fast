import { Navigate, Route, Routes } from 'react-router-dom'
import PhoneFrame from './components/PhoneFrame'
import { RideProvider } from './context/RideContext'
import Splash from './screens/Splash'
import Login from './screens/Login'
import Home from './screens/Home'
import SetDestination from './screens/SetDestination'
import OfferPrice from './screens/OfferPrice'
import SearchingDrivers from './screens/SearchingDrivers'
import DriverOffers from './screens/DriverOffers'
import TripInProgress from './screens/TripInProgress'
import RateTrip from './screens/RateTrip'
import Activity from './screens/Activity'
import Profile from './screens/Profile'

export default function App() {
  return (
    <RideProvider>
      <PhoneFrame>
        <Routes>
          <Route path="/" element={<Navigate to="/splash" replace />} />
          <Route path="/splash" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/set-destination" element={<SetDestination />} />
          <Route path="/offer-price" element={<OfferPrice />} />
          <Route path="/searching" element={<SearchingDrivers />} />
          <Route path="/driver-offers" element={<DriverOffers />} />
          <Route path="/trip" element={<TripInProgress />} />
          <Route path="/rate" element={<RateTrip />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/splash" replace />} />
        </Routes>
      </PhoneFrame>
    </RideProvider>
  )
}
