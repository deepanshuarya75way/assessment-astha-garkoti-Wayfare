import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Landing from './pages/Landing.jsx'
import Explore from './pages/Explore.jsx'
import Favorites from './pages/Favorites.jsx'
import ListingDetail from './pages/ListingDetail.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Checkout from './pages/Checkout.jsx'
import AdminAddListing from './pages/AdminAddListing.jsx'
import HostApplication from './pages/HostApplication.jsx'
import MyTrips from './pages/MyTrips.jsx'
import HostBookings from './pages/HostBookings.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

function App() {
  return (
    <div className="min-h-screen bg-parchment text-ink">
      <Navbar />
      <main>
        <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/listing/:id" element={<ListingDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/checkout" element={<Checkout />} />

          <Route
            path="/host/apply"
            element={
              <ProtectedRoute>
                <HostApplication />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trips"
            element={
              <ProtectedRoute>
                <MyTrips />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/listings/new"
            element={
              <ProtectedRoute roles={['host', 'admin']}>
                <AdminAddListing />
              </ProtectedRoute>
            }
          />

          <Route
            path="/host/bookings"
            element={
              <ProtectedRoute roles={['host', 'admin']}>
                <HostBookings />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Landing />} />
        </Routes>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}

export default App