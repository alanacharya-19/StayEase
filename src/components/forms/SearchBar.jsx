import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Calendar, Users } from 'lucide-react'
import { useThemeStore } from '../../store'

export default function SearchBar({ variant = 'hero' }) {
  const navigate = useNavigate()
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'
  const [query, setQuery] = useState({ city: '', checkIn: '', checkOut: '', guests: 1 })

  const handleSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.city) params.set('city', query.city)
    if (query.checkIn) params.set('checkIn', query.checkIn)
    if (query.checkOut) params.set('checkOut', query.checkOut)
    if (query.guests > 1) params.set('guests', query.guests)
    navigate(`/hotels?${params.toString()}`)
  }

  const isHero = variant === 'hero'

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className={`w-full max-w-4xl mx-auto ${
        isHero
          ? 'glass rounded-2xl p-2 sm:p-3'
          : `${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'} rounded-xl p-3`
      } shadow-lg`}
    >
      <div className={`flex flex-col lg:flex-row gap-2 ${isHero ? '' : ''}`}>
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query.city}
            onChange={(e) => setQuery({ ...query, city: e.target.value })}
            placeholder="Where are you going?"
            className={`w-full pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none transition-colors ${
              isDark ? 'bg-dark-border text-white placeholder-gray-500' : 'bg-gray-50 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>
        <div className="relative">
          <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="date"
            value={query.checkIn}
            onChange={(e) => setQuery({ ...query, checkIn: e.target.value })}
            className={`w-full lg:w-36 pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none transition-colors ${
              isDark ? 'bg-dark-border text-white' : 'bg-gray-50 text-gray-900'
            }`}
          />
        </div>
        <div className="relative">
          <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="date"
            value={query.checkOut}
            onChange={(e) => setQuery({ ...query, checkOut: e.target.value })}
            className={`w-full lg:w-36 pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none transition-colors ${
              isDark ? 'bg-dark-border text-white' : 'bg-gray-50 text-gray-900'
            }`}
          />
        </div>
        <div className="relative">
          <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={query.guests}
            onChange={(e) => setQuery({ ...query, guests: e.target.value })}
            className={`w-full lg:w-28 pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none appearance-none transition-colors ${
              isDark ? 'bg-dark-border text-white' : 'bg-gray-50 text-gray-900'
            }`}
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="px-6 py-2.5 gradient-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          Search
        </button>
      </div>
    </motion.form>
  )
}
