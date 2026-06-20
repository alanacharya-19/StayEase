import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Calendar, Users } from 'lucide-react'
import { useThemeStore } from '../../store'

interface SearchBarProps {
  variant?: 'hero' | 'inline'
}

interface SearchQuery {
  city: string
  checkIn: string
  checkOut: string
  guests: number | string
}

export default function SearchBar({ variant = 'hero' }: SearchBarProps) {
  const navigate = useNavigate()
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'
  const [query, setQuery] = useState<SearchQuery>({ city: '', checkIn: '', checkOut: '', guests: 1 })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.city) params.set('city', query.city)
    if (query.checkIn) params.set('checkIn', query.checkIn)
    if (query.checkOut) params.set('checkOut', query.checkOut)
    const guestNum = Number(query.guests)
    if (guestNum > 1) params.set('guests', String(guestNum))
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
          ? isDark
            ? 'bg-dark-card/90 backdrop-blur-md border border-dark-border/60 rounded-2xl p-2 sm:p-3'
            : 'bg-white/90 backdrop-blur-md border border-white/20 rounded-2xl p-2 sm:p-3'
          : `${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-200'} rounded-xl p-3`
      } shadow-lg shadow-black/5`}
    >
      <div className="flex flex-col lg:flex-row items-end gap-2">
        <div className="flex-1 w-full flex flex-col gap-1">
          <span className={`text-[11px] font-medium tracking-wide uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Destination</span>
          <div className="relative">
            <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              value={query.city}
              onChange={(e) => setQuery({ ...query, city: e.target.value })}
              placeholder="Where are you going?"
              className={`w-full pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none transition-all duration-200 ${
                isDark
                  ? 'bg-dark-border/80 text-white placeholder-gray-500 border border-transparent focus:border-primary/50 focus:bg-dark-border'
                  : 'bg-gray-100/80 text-gray-900 placeholder-gray-400 border border-transparent focus:border-primary/30 focus:bg-white'
              }`}
            />
          </div>
        </div>
        <div className="w-full lg:w-auto flex flex-col gap-1">
          <span className={`text-[11px] font-medium tracking-wide uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Check in</span>
          <div className="relative">
            <Calendar size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="date"
              value={query.checkIn}
              onChange={(e) => setQuery({ ...query, checkIn: e.target.value })}
              className={`w-full lg:w-36 pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none transition-all duration-200 ${
                isDark
                  ? 'bg-dark-border/80 text-white border border-transparent focus:border-primary/50 focus:bg-dark-border'
                  : 'bg-gray-100/80 text-gray-900 border border-transparent focus:border-primary/30 focus:bg-white'
              }`}
            />
          </div>
        </div>
        <div className="w-full lg:w-auto flex flex-col gap-1">
          <span className={`text-[11px] font-medium tracking-wide uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Check out</span>
          <div className="relative">
            <Calendar size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="date"
              value={query.checkOut}
              onChange={(e) => setQuery({ ...query, checkOut: e.target.value })}
              className={`w-full lg:w-36 pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none transition-all duration-200 ${
                isDark
                  ? 'bg-dark-border/80 text-white border border-transparent focus:border-primary/50 focus:bg-dark-border'
                  : 'bg-gray-100/80 text-gray-900 border border-transparent focus:border-primary/30 focus:bg-white'
              }`}
            />
          </div>
        </div>
        <div className="w-full lg:w-auto flex flex-col gap-1">
          <span className={`text-[11px] font-medium tracking-wide uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Guests</span>
          <div className="relative">
            <Users size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            <select
              value={query.guests}
              onChange={(e) => setQuery({ ...query, guests: e.target.value })}
              className={`w-full lg:w-28 pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none appearance-none transition-all duration-200 ${
                isDark
                  ? 'bg-dark-border/80 text-white border border-transparent focus:border-primary/50 focus:bg-dark-border'
                  : 'bg-gray-100/80 text-gray-900 border border-transparent focus:border-primary/30 focus:bg-white'
              }`}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="w-full lg:w-auto px-6 py-2.5 gradient-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-all duration-200 whitespace-nowrap hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
        >
          Search
        </button>
      </div>
    </motion.form>
  )
}
