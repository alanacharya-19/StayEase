import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import { Loader, ErrorBoundary } from '../components/ui'

const LandingPage = lazy(() => import('../pages/LandingPage'))
const HotelsPage = lazy(() => import('../pages/HotelsPage'))
const HotelDetailsPage = lazy(() => import('../pages/HotelDetailsPage'))
const RoomDetailsPage = lazy(() => import('../pages/RoomDetailsPage'))
const BookingPage = lazy(() => import('../pages/BookingPage'))
const PaymentPage = lazy(() => import('../pages/PaymentPage'))
const LoginPage = lazy(() => import('../pages/LoginPage'))
const RegisterPage = lazy(() => import('../pages/RegisterPage'))
const DashboardPage = lazy(() => import('../pages/DashboardPage'))
const WishlistPage = lazy(() => import('../pages/WishlistPage'))
const AboutPage = lazy(() => import('../pages/AboutPage'))
const ContactPage = lazy(() => import('../pages/ContactPage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))
const ErrorPage = lazy(() => import('../pages/ErrorPage'))
const TripToolsPage = lazy(() => import('../pages/TripToolsPage'))

export default function AppRoutes() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loader fullScreen />}>
        <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/hotels" element={<HotelsPage />} />
          <Route path="/hotels/:id" element={<HotelDetailsPage />} />
          <Route path="/hotels/:id/rooms/:roomId" element={<RoomDetailsPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/sign-in/*" element={<LoginPage />} />
          <Route path="/sign-up/*" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/trip-tools" element={<TripToolsPage />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
    </ErrorBoundary>
  )
}
