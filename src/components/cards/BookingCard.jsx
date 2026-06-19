import { motion } from 'framer-motion'
import { Calendar, Users } from 'lucide-react'
import { useThemeStore } from '../../store'
import { formatCurrency, formatDate } from '../../utils'

export default function BookingCard({ booking, index = 0 }) {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-xl p-4 transition-all ${
        isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'
      }`}
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
                : booking.status === 'pending'
                ? 'bg-yellow-500/10 text-yellow-500'
                : 'bg-red-500/10 text-red-500'
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
            <span className="font-bold text-primary">
              {formatCurrency(booking.total, booking.currency)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
