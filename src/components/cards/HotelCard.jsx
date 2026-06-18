import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, MapPin, Heart, Share2 } from 'lucide-react'
import { useThemeStore, useWishlistStore } from '../../store'
import { formatCurrency } from '../../utils'
import toast from 'react-hot-toast'

export default function HotelCard({ hotel, index = 0 }) {
  const { theme } = useThemeStore()
  const { isInWishlist, toggleItem } = useWishlistStore()
  const isDark = theme === 'dark'
  const inWishlist = isInWishlist(hotel.id)

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleItem(hotel)
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist')
  }

  const handleShare = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (navigator.share) {
      navigator.share({ title: hotel.name, url: `/hotels/${hotel.id}` })
    } else {
      navigator.clipboard.writeText(window.location.origin + '/hotels/' + hotel.id)
      toast.success('Link copied to clipboard!')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        to={`/hotels/${hotel.id}`}
        className={`group block rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
          isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'
        } shadow-sm hover:shadow-xl`}
      >
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={hotel.images[0]}
            alt={hotel.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          {hotel.discount > 0 && (
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-red-500 text-white text-xs font-semibold rounded-lg">
              -{hotel.discount}%
            </div>
          )}
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={handleWishlist}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                inWishlist ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-700 hover:bg-white'
              }`}
            >
              <Heart size={14} fill={inWishlist ? 'white' : 'none'} />
            </button>
            <button
              onClick={handleShare}
              className="w-8 h-8 rounded-full bg-white/80 text-gray-700 flex items-center justify-center hover:bg-white transition-all"
            >
              <Share2 size={14} />
            </button>
          </div>
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
            <div className="flex">
              {Array.from({ length: hotel.stars }).map((_, i) => (
                <Star key={i} size={12} className="text-accent fill-accent" />
              ))}
            </div>
            <span className="text-white text-xs font-medium">{hotel.stars} Star</span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className={`font-semibold text-base leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {hotel.name}
            </h3>
            <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded-lg text-xs font-semibold shrink-0">
              <Star size={12} fill="currentColor" />
              <span>{hotel.rating}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 mb-3">
            <MapPin size={12} className="text-gray-400" />
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {hotel.city}, {hotel.country}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {hotel.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className={`text-xs px-2 py-0.5 rounded-full ${
                  isDark ? 'bg-dark-border text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {amenity}
              </span>
            ))}
            {hotel.amenities.length > 3 && (
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                +{hotel.amenities.length - 3}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-dark-border">
            <div>
              <span className="text-lg font-bold text-primary">{formatCurrency(hotel.price, hotel.currency)}</span>
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}> / night</span>
            </div>
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {hotel.reviewsCount} reviews
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
