import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, MapPin, Check, X, Share2, Heart, ChevronLeft, ChevronRight } from 'lucide-react'
import { useThemeStore, useWishlistStore, useRecentStore } from '../store'
import { useHotel } from '../hooks/useQueries'
import { HotelCard, ReviewCard, RoomCard } from '../components/cards'
import { SkeletonHotelDetail, Rating } from '../components/ui'
import Breadcrumb from '../components/ui/Breadcrumb'
import { formatCurrency } from '../utils'
import toast from 'react-hot-toast'

export default function HotelDetailsPage() {
  const { id } = useParams()
  const { theme } = useThemeStore()
  const { isInWishlist, toggleItem } = useWishlistStore()
  const isDark = theme === 'dark'
  const { data: hotel, isLoading } = useHotel(id)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showAllAmenities, setShowAllAmenities] = useState(false)

  const { addItem } = useRecentStore()

  useEffect(() => {
    if (!hotel) return
    addItem({
      id: hotel.id,
      name: hotel.name,
      city: hotel.city,
      country: hotel.country,
      price: hotel.price,
      currency: hotel.currency,
      rating: hotel.ratings.overall,
      stars: hotel.stars,
      image: hotel.images[0],
    })
  }, [hotel?.id])

  if (isLoading) return <div className="max-w-7xl mx-auto px-4 py-8"><SkeletonHotelDetail /></div>
  if (!hotel) return <div className="text-center py-20"><h2 className="text-2xl font-bold">Hotel not found</h2></div>

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: hotel.name, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const inWishlist = isInWishlist(hotel.id)

  return (
    <div className="py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[
          { to: '/hotels', label: 'Hotels' },
          { label: hotel.name },
        ]} />

        {/* Image Gallery */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <div className="relative rounded-2xl overflow-hidden h-64 md:h-96 mb-2">
            <img src={hotel.images[selectedImage]} alt={hotel.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            {hotel.images.length > 1 && (
              <>
                <button onClick={() => setSelectedImage((p) => (p === 0 ? hotel.images.length - 1 : p - 1))} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 text-gray-800 flex items-center justify-center hover:bg-white transition-all shadow">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={() => setSelectedImage((p) => (p === hotel.images.length - 1 ? 0 : p + 1))} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 text-gray-800 flex items-center justify-center hover:bg-white transition-all shadow">
                  <ChevronRight size={20} />
                </button>
              </>
            )}
            <div className="absolute top-4 right-4 flex gap-2">
              <button onClick={() => { toggleItem(hotel); toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist') }} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${inWishlist ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-700 hover:bg-white'}`}>
                <Heart size={18} fill={inWishlist ? 'white' : 'none'} />
              </button>
              <button onClick={handleShare} className="w-10 h-10 rounded-full bg-white/80 text-gray-700 flex items-center justify-center hover:bg-white transition-all">
                <Share2 size={18} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {hotel.images.slice(0, 4).map((img, i) => (
              <button key={i} onClick={() => setSelectedImage(i)} className={`rounded-xl overflow-hidden h-20 transition-all ${selectedImage === i ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hotel Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {Array.from({ length: hotel.stars }).map((_, i) => (
                      <Star key={i} size={16} className="text-accent fill-accent" />
                    ))}
                  </div>
                  <h1 className={`font-display text-3xl sm:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {hotel.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin size={14} className="text-gray-400" />
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {hotel.location.address}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-xl">
                  <Rating value={hotel.ratings.overall} size={14} />
                  <span className="text-sm text-gray-500">({hotel.reviewsCount} reviews)</span>
                </div>
              </div>

              <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {hotel.longDescription}
              </p>
            </motion.div>

            {/* Amenities */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Amenities</h2>
              <div className="flex flex-wrap gap-3">
                {(showAllAmenities ? hotel.amenities : hotel.amenities.slice(0, 8)).map((amenity) => (
                  <span key={amenity} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                    isDark ? 'bg-dark-border text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}>
                    <Check size={14} className="text-green-500" />
                    {amenity}
                  </span>
                ))}
                {hotel.amenities.length > 8 && (
                  <button onClick={() => setShowAllAmenities(!showAllAmenities)} className={`px-4 py-2 rounded-lg text-sm font-medium ${isDark ? 'text-primary hover:bg-dark-border' : 'text-primary hover:bg-gray-100'}`}>
                    {showAllAmenities ? 'Show Less' : `+${hotel.amenities.length - 8} More`}
                  </button>
                )}
              </div>
            </motion.div>

            {/* Policies */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Hotel Policies</h2>
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'}`}>
                {[
                  { label: 'Check-in', value: hotel.policies.checkIn },
                  { label: 'Check-out', value: hotel.policies.checkOut },
                  { label: 'Cancellation', value: hotel.policies.cancellation },
                  { label: 'Children', value: hotel.policies.children },
                  { label: 'Pets', value: hotel.policies.pets },
                ].map((policy) => (
                  <div key={policy.label}>
                    <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{policy.label}</p>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{policy.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Map */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Location</h2>
              <div className={`rounded-xl overflow-hidden h-64 ${isDark ? 'border border-dark-border' : 'border border-gray-100'}`}>
                <iframe
                  title="map"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${hotel.location.lng - 0.01}%2C${hotel.location.lat - 0.01}%2C${hotel.location.lng + 0.01}%2C${hotel.location.lat + 0.01}&layer=mapnik`}
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                  loading="lazy"
                />
              </div>
            </motion.div>

            {/* Available Rooms */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Available Rooms
              </h2>
              <div className="space-y-4">
                {hotel.rooms.map((room, i) => (
                  <RoomCard key={room.id} room={room} hotelId={hotel.id} hotelName={hotel.name} index={i} />
                ))}
              </div>
            </motion.div>

            {/* Reviews */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Guest Reviews
                </h2>
                <div className="flex items-center gap-2">
                  <Rating value={hotel.ratings.overall} size={14} />
                  <span className="text-2xl font-bold text-primary">{hotel.ratings.overall}</span>
                </div>
              </div>

              {/* Rating Breakdown */}
              <div className={`grid grid-cols-2 gap-3 mb-6 p-4 rounded-xl ${isDark ? 'bg-dark-border/50' : 'bg-gray-50'}`}>
                {[
                  { label: 'Cleanliness', value: hotel.ratings.cleanliness },
                  { label: 'Location', value: hotel.ratings.location },
                  { label: 'Service', value: hotel.ratings.service },
                  { label: 'Value for Money', value: hotel.ratings.value },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.label}</span>
                      <span className="text-xs font-semibold text-primary">{item.value.toFixed(1)}</span>
                    </div>
                    <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-dark-border' : 'bg-gray-200'}`}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(item.value / 5) * 100}%` }}
                        viewport={{ once: true }}
                        className="h-full rounded-full bg-primary"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hotel.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Price Card */}
          <div className="lg:col-span-1">
            <div className={`sticky top-24 p-6 rounded-xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'} shadow-sm`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden">
                  <img src={hotel.images[0]} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{hotel.name}</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{hotel.city}, {hotel.country}</p>
                </div>
              </div>
              <div className="text-center py-4 border-y border-gray-100 dark:border-dark-border mb-4">
                <p className="text-3xl font-bold text-primary">
                  {formatCurrency(hotel.price, hotel.currency)}
                  <span className={`text-sm font-normal ${isDark ? 'text-gray-400' : 'text-gray-500'}`}> / night</span>
                </p>
                {hotel.discount > 0 && (
                  <p className="text-sm text-green-500 mt-1">Save {hotel.discount}% on this booking</p>
                )}
              </div>
              <div className="space-y-3 mb-6">
                {[
                  { label: 'Free cancellation', available: true },
                  { label: 'No prepayment needed', available: true },
                  { label: '24/7 customer support', available: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-sm">
                    {item.available ? (
                      <Check size={14} className="text-green-500 shrink-0" />
                    ) : (
                      <X size={14} className="text-red-500 shrink-0" />
                    )}
                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>{item.label}</span>
                  </div>
                ))}
              </div>
              <Link
                to={`/hotels/${hotel.id}#rooms`}
                className="block w-full py-3 gradient-primary text-white rounded-lg text-sm font-medium text-center hover:opacity-90 transition-opacity"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>

        {/* Similar Hotels */}
        {hotel.similarHotels && hotel.similarHotels.length > 0 && (
          <section className="mt-12">
            <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Similar Hotels</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotel.similarHotels.map((h, i) => (
                <HotelCard key={h.id} hotel={h} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
