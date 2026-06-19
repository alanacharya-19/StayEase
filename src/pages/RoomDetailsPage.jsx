import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, Bed, Check, X, Calendar } from 'lucide-react'
import { useThemeStore, useBookingStore } from '../store'
import { useHotel } from '../hooks/useQueries'
import { Breadcrumb } from '../components/ui'
import { formatCurrency } from '../utils'

export default function RoomDetailsPage() {
  const { id, roomId } = useParams()
  const navigate = useNavigate()
  const { theme } = useThemeStore()
  const { setCurrentBooking } = useBookingStore()
  const isDark = theme === 'dark'
  const { data: hotel, isLoading } = useHotel(id)

  if (isLoading) return null
  if (!hotel) return <div className="text-center py-20"><h2 className="text-2xl font-bold">Room not found</h2></div>

  const room = hotel.rooms.find((r) => r.id === Number(roomId))
  if (!room) return <div className="text-center py-20"><h2 className="text-2xl font-bold">Room not found</h2></div>

  const handleBook = () => {
    setCurrentBooking({ hotel, room, hotelName: hotel.name, hotelImage: hotel.images[0], currency: hotel.currency })
    navigate('/booking')
  }

  return (
    <div className="py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[
          { to: '/hotels', label: 'Hotels' },
          { to: `/hotels/${hotel.id}`, label: hotel.name },
          { label: room.type },
        ]} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="h-72 md:h-96 rounded-2xl overflow-hidden mb-4">
                <img src={room.images[0]} alt={room.type} className="w-full h-full object-cover" />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className={`font-display text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {room.type}
                  </h1>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{hotel.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">{formatCurrency(room.price, hotel.currency)}</p>
                  <p className="text-sm text-gray-500">per night</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isDark ? 'bg-dark-border' : 'bg-gray-100'}`}>
                  <Bed size={16} className="text-gray-400" />
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{room.bed} Bed</span>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isDark ? 'bg-dark-border' : 'bg-gray-100'}`}>
                  <Users size={16} className="text-gray-400" />
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Up to {room.capacity} Guests</span>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isDark ? 'bg-dark-border' : 'bg-gray-100'}`}>
                  <Calendar size={16} className="text-gray-400" />
                  <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {room.available ? 'Available' : 'Sold Out'}
                  </span>
                </div>
              </div>

              <h2 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Facilities</h2>
              <div className="flex flex-wrap gap-3 mb-6">
                {room.facilities.map((f) => (
                  <span key={f} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm ${
                    isDark ? 'bg-dark-border text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}>
                    <Check size={14} className="text-green-500" />
                    {f}
                  </span>
                ))}
              </div>

              <h2 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Cancellation Policy</h2>
              <div className={`p-4 rounded-xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'}`}>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {room.cancellationPolicy}
                </p>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <div className={`sticky top-24 p-6 rounded-xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'} shadow-sm`}>
              <h3 className={`font-semibold text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Booking Summary</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Room Type</span>
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{room.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Bed</span>
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{room.bed}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Capacity</span>
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{room.capacity} Guests</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Price</span>
                  <span className={`font-medium text-primary`}>{formatCurrency(room.price, hotel.currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Available</span>
                  {room.available ? (
                    <span className="flex items-center gap-1 text-green-500"><Check size={14} /> Yes</span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-500"><X size={14} /> No</span>
                  )}
                </div>
              </div>
              <button
                onClick={handleBook}
                disabled={!room.available}
                className="w-full py-3 gradient-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {room.available ? 'Book This Room' : 'Sold Out'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
