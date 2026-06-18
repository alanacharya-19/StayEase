import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Trash2 } from 'lucide-react'
import { useThemeStore, useWishlistStore } from '../store'
import { HotelCard } from '../components/cards'
import { Breadcrumb } from '../components/ui'
import toast from 'react-hot-toast'

export default function WishlistPage() {
  const { theme } = useThemeStore()
  const { items, removeItem, clearWishlist } = useWishlistStore()
  const isDark = theme === 'dark'

  return (
    <div className="py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ to: '/', label: 'Home' }, { label: 'Wishlist' }]} />

        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className={`font-display text-3xl sm:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              My Wishlist
            </h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {items.length} {items.length === 1 ? 'hotel' : 'hotels'} saved
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={() => { clearWishlist(); toast.success('Wishlist cleared') }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-500 border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 size={16} /> Clear All
            </button>
          )}
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((hotel, i) => (
              <div key={hotel.id} className="relative group">
                <HotelCard hotel={hotel} index={i} />
                <button
                  onClick={() => { removeItem(hotel.id); toast.success('Removed from wishlist') }}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-center py-20 rounded-2xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'}`}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-dark-border flex items-center justify-center">
              <Heart size={28} className="text-gray-400" />
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Your wishlist is empty
            </h3>
            <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Start saving hotels you love by clicking the heart icon.
            </p>
            <Link
              to="/hotels"
              className="inline-flex px-6 py-3 gradient-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Explore Hotels
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
