import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, Star, MapPin } from 'lucide-react'
import { useThemeStore, useRecentStore } from '../../store'
import { formatCurrency } from '../../utils'

export default function RecentlyViewed() {
  const { theme } = useThemeStore()
  const { items } = useRecentStore()
  const isDark = theme === 'dark'

  if (items.length === 0) return null

  return (
    <section className={`py-16 lg:py-24 ${isDark ? 'bg-dark-card/30' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-dark-border' : 'bg-gray-100'}`}>
              <Clock size={18} className="text-primary" />
            </div>
            <div>
              <span className="text-primary text-sm font-semibold uppercase tracking-wider">Recent</span>
              <h2 className={`font-display text-3xl sm:text-4xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Recently Viewed
              </h2>
            </div>
          </div>
          <Link to="/hotels" className="flex items-center gap-1 text-primary text-sm font-medium hover:gap-2 transition-all">
            View All <ArrowRight size={14} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((hotel, i) => (
            <motion.div
              key={hotel.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/hotels/${hotel.id}`}
                className={`group block rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                  isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'
                } shadow-sm hover:shadow-md`}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <Star size={10} className="text-accent fill-accent" />
                    <span className="text-xs font-medium text-gray-500">{hotel.ratings?.overall || hotel.rating}</span>
                  </div>
                  <h3 className={`font-semibold text-sm leading-tight mb-0.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {hotel.name}
                  </h3>
                  <div className="flex items-center gap-1 mb-1">
                    <MapPin size={10} className="text-gray-400" />
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {hotel.city}, {hotel.country}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-primary">
                    {formatCurrency(hotel.price, hotel.currency)}
                    <span className={`text-xs font-normal ${isDark ? 'text-gray-500' : 'text-gray-400'}`}> /night</span>
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
