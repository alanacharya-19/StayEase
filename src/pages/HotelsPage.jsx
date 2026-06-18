import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X, Search, Star, ChevronDown } from 'lucide-react'
import { useThemeStore } from '../store'
import { useHotels } from '../hooks/useQueries'
import { HotelCard } from '../components/cards'
import { Pagination, SkeletonList } from '../components/ui'
import { amenitiesList, sortOptions, starRatings, priceRanges } from '../constants'
import Breadcrumb from '../components/ui/Breadcrumb'

export default function HotelsPage() {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'
  const [searchParams, setSearchParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    country: searchParams.get('country') || '',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    guests: searchParams.get('guests') || '',
    priceMin: searchParams.get('priceMin') || '',
    priceMax: searchParams.get('priceMax') || '',
    stars: searchParams.get('stars') || '',
    amenities: searchParams.getAll('amenities') || [],
  })
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'popularity-desc')
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1)

  const queryParams = {
    search: searchQuery || undefined,
    city: filters.city || undefined,
    country: filters.country || undefined,
    priceMin: filters.priceMin || undefined,
    priceMax: filters.priceMax || undefined,
    stars: filters.stars || undefined,
    amenities: filters.amenities.length > 0 ? filters.amenities : undefined,
    sort: sortBy,
    page,
    limit: 6,
  }

  const { data, isLoading } = useHotels(queryParams)

  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('search', searchQuery)
    if (filters.city) params.set('city', filters.city)
    if (filters.country) params.set('country', filters.country)
    if (filters.priceMin) params.set('priceMin', filters.priceMin)
    if (filters.priceMax) params.set('priceMax', filters.priceMax)
    if (filters.stars) params.set('stars', filters.stars)
    if (filters.amenities.length > 0) filters.amenities.forEach(a => params.append('amenities', a))
    if (sortBy !== 'popularity-desc') params.set('sort', sortBy)
    if (page > 1) params.set('page', page.toString())
    setSearchParams(params, { replace: true })
  }, [searchQuery, filters, sortBy, page])

  const toggleAmenity = (amenity) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({ city: '', country: '', checkIn: '', checkOut: '', guests: '', priceMin: '', priceMax: '', stars: '', amenities: [] })
    setSearchQuery('')
    setSortBy('popularity-desc')
    setPage(1)
  }

  const hasFilters = Object.values(filters).some((v) => v !== '' && v !== 0 && (Array.isArray(v) ? v.length > 0 : true))

  return (
    <div className="py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Hotels' }]} />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className={`font-display text-3xl sm:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {searchQuery ? `Results for "${searchQuery}"` : 'Browse Hotels'}
            </h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {data?.total || 0} hotels found
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1) }}
                className={`appearance-none pl-4 pr-8 py-2 rounded-lg text-sm outline-none border transition-colors ${
                  isDark ? 'bg-dark-card text-white border-dark-border' : 'bg-white text-gray-900 border-gray-200'
                }`}
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                filtersOpen || hasFilters
                  ? 'bg-primary text-white border-primary'
                  : isDark
                  ? 'border-dark-border text-gray-300 hover:bg-dark-border'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
            placeholder="Search by hotel name, city, or country..."
            className={`w-full pl-12 pr-4 py-3 rounded-xl outline-none border transition-all duration-200 ${
              isDark
                ? 'bg-dark-card/80 text-white border-dark-border/60 placeholder-gray-500 focus:border-primary/50 focus:bg-dark-card focus:shadow-lg focus:shadow-primary/5'
                : 'bg-white/80 text-gray-900 border-gray-200/60 placeholder-gray-400 focus:border-primary/30 focus:bg-white focus:shadow-lg focus:shadow-primary/5'
            }`}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {(filtersOpen || true) && (
              <motion.aside
                initial={false}
                animate={{ width: filtersOpen ? 280 : 0, opacity: filtersOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className={`shrink-0 overflow-hidden ${filtersOpen ? '' : 'hidden lg:block lg:w-0'}`}
              >
                <div className={`w-[280px] p-5 rounded-xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Filters</h3>
                    {hasFilters && (
                      <button onClick={clearFilters} className="text-xs text-primary hover:underline">Clear All</button>
                    )}
                  </div>

                  {/* Price Range */}
                  <div className="mb-5">
                    <h4 className="text-sm font-medium mb-2">Price Range</h4>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.priceMin}
                        onChange={(e) => { setFilters({ ...filters, priceMin: e.target.value }); setPage(1) }}
                        className={`w-full px-3 py-2 rounded-lg text-sm outline-none border ${
                          isDark ? 'bg-dark-border text-white border-dark-border' : 'bg-gray-50 text-gray-900 border-gray-200'
                        }`}
                      />
                      <span className="self-center text-gray-400">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.priceMax}
                        onChange={(e) => { setFilters({ ...filters, priceMax: e.target.value }); setPage(1) }}
                        className={`w-full px-3 py-2 rounded-lg text-sm outline-none border ${
                          isDark ? 'bg-dark-border text-white border-dark-border' : 'bg-gray-50 text-gray-900 border-gray-200'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div className="mb-5">
                    <h4 className="text-sm font-medium mb-2">Star Rating</h4>
                    <div className="flex gap-2">
                      {starRatings.map((s) => (
                        <button
                          key={s}
                          onClick={() => { setFilters({ ...filters, stars: filters.stars === s.toString() ? '' : s.toString() }); setPage(1) }}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            filters.stars === s.toString()
                              ? 'bg-primary text-white'
                              : isDark
                              ? 'bg-dark-border text-gray-300 hover:bg-dark-border'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <Star size={12} fill={filters.stars === s.toString() ? 'white' : 'none'} />
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* City */}
                  <div className="mb-5">
                    <h4 className="text-sm font-medium mb-2">City</h4>
                    <input
                      type="text"
                      value={filters.city}
                      onChange={(e) => { setFilters({ ...filters, city: e.target.value }); setPage(1) }}
                      placeholder="Filter by city..."
                      className={`w-full px-3 py-2 rounded-lg text-sm outline-none border ${
                        isDark ? 'bg-dark-border text-white border-dark-border' : 'bg-gray-50 text-gray-900 border-gray-200'
                      }`}
                    />
                  </div>

                  {/* Country */}
                  <div className="mb-5">
                    <h4 className="text-sm font-medium mb-2">Country</h4>
                    <input
                      type="text"
                      value={filters.country}
                      onChange={(e) => { setFilters({ ...filters, country: e.target.value }); setPage(1) }}
                      placeholder="Filter by country..."
                      className={`w-full px-3 py-2 rounded-lg text-sm outline-none border ${
                        isDark ? 'bg-dark-border text-white border-dark-border' : 'bg-gray-50 text-gray-900 border-gray-200'
                      }`}
                    />
                  </div>

                  {/* Amenities */}
                  <div className="mb-5">
                    <h4 className="text-sm font-medium mb-2">Amenities</h4>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {amenitiesList.map((amenity) => (
                        <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.amenities.includes(amenity)}
                            onChange={() => toggleAmenity(amenity)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <SkeletonList count={6} />
            ) : data?.data?.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {data.data.map((hotel, i) => (
                    <HotelCard key={hotel.id} hotel={hotel} index={i} />
                  ))}
                </div>
                <Pagination currentPage={data.page} totalPages={data.totalPages} onPageChange={setPage} />
              </>
            ) : (
              <div className="text-center py-20">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-dark-border flex items-center justify-center">
                  <Search size={24} className="text-gray-400" />
                </div>
                <h3 className={`text-lg font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>No hotels found</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Try adjusting your filters or search query
                </p>
                {hasFilters && (
                  <button onClick={clearFilters} className="mt-4 px-4 py-2 gradient-primary text-white rounded-lg text-sm font-medium">
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
