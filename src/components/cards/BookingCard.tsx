import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Users, XCircle } from 'lucide-react'
import { useThemeStore, useBookingStore } from '../../store'
import { formatCurrency, formatDate } from '../../utils'
import { Modal } from '../ui'
import toast from 'react-hot-toast'
import type { Booking } from '../../types'

interface BookingCardProps {
  booking: Booking & { hotelImage?: string; total?: number }
  index?: number
}

export default function BookingCard({ booking, index = 0 }: BookingCardProps) {
  const { theme } = useThemeStore()
  const { cancelBooking } = useBookingStore()
  const isDark = theme === 'dark'
  const [showCancelModal, setShowCancelModal] = useState(false)

  const isCancelled = booking.status === 'cancelled'

  const handleCancel = () => {
    cancelBooking(booking.id)
    setShowCancelModal(false)
    toast.success('Booking cancelled successfully')
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`rounded-xl p-4 transition-all ${
          isCancelled ? 'opacity-60' : ''
        } ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'}`}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          {booking.hotelImage && (
            <img src={booking.hotelImage} alt="" className="w-full sm:w-28 h-24 rounded-lg object-cover shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {booking.hotelName || 'Hotel Booking'}
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {booking.roomType}
                </p>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                booking.status === 'confirmed'
                  ? 'bg-green-500/10 text-green-500'
                  : booking.status === 'cancelled'
                  ? 'bg-red-500/10 text-red-500'
                  : 'bg-yellow-500/10 text-yellow-500'
              }`}>
                {booking.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <span className={`flex items-center gap-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <Calendar size={14} />
                {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
              </span>
              <span className={`flex items-center gap-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <Users size={14} />
                {booking.guests} guests
              </span>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-dark-border">
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Booking ID: {booking.id}
              </span>
              <div className="flex items-center gap-3">
                {!isCancelled && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
                  >
                    <XCircle size={14} />
                    Cancel
                  </button>
                )}
                <span className="font-bold text-primary">
                  {formatCurrency(booking.total ?? 0, booking.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <Modal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)} title="Cancel Booking">
        <div className="space-y-4">
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Are you sure you want to cancel your booking at <strong>{booking.hotelName}</strong>?
            This action cannot be undone.
          </p>
          <div className={`p-3 rounded-lg text-sm ${isDark ? 'bg-dark-border/50' : 'bg-gray-50'}`}>
            <div className="flex justify-between mb-1">
              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Check-in</span>
              <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatDate(booking.checkIn)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Check-out</span>
              <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatDate(booking.checkOut)}</span>
            </div>
            <div className="flex justify-between">
              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Total</span>
              <span className="font-semibold text-primary">{formatCurrency(booking.total ?? 0, booking.currency)}</span>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowCancelModal(false)}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isDark ? 'bg-dark-border text-gray-300 hover:text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Keep Booking
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
            >
              Yes, Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
