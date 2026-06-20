import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, Bed, Check, X } from 'lucide-react'
import { useThemeStore } from '../../store'
import { formatCurrency } from '../../utils'
import type { HotelRoom } from '../../types'

interface RoomCardProps {
  room: HotelRoom
  hotelId: number
  hotelName: string
  index?: number
}

export default function RoomCard({ room, hotelId, hotelName, index = 0 }: RoomCardProps) {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`rounded-xl overflow-hidden transition-all duration-300 ${
        isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'
      }`}
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-72 h-48 md:h-auto shrink-0">
          <img
            src={room.images[0]}
            alt={room.type}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h3 className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {room.type}
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {hotelName}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xl font-bold text-primary">{formatCurrency(room.price)}</p>
                <p className="text-xs text-gray-400">per night</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-3">
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <Bed size={15} />
                <span>{room.bed}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <Users size={15} />
                <span>Up to {room.capacity} guests</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {room.facilities.map((f) => (
                <span key={f} className={`text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                  isDark ? 'bg-dark-border text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}>
                  <Check size={10} className="text-green-500" />
                  {f}
                </span>
              ))}
            </div>

            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {room.cancellationPolicy}
            </p>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-dark-border">
            <div className="flex items-center gap-2">
              {room.available ? (
                <span className="flex items-center gap-1 text-xs text-green-500">
                  <Check size={12} /> Available
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-red-500">
                  <X size={12} /> Sold Out
                </span>
              )}
            </div>
            <Link
              to={`/hotels/${hotelId}/rooms/${room.id}`}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                room.available
                  ? 'gradient-primary text-white hover:opacity-90'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={(e) => !room.available && e.preventDefault()}
            >
              View Room
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
