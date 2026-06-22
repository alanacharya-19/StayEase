import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Star, SortAsc, Filter } from 'lucide-react'
import { useThemeStore, useAuthStore, useBookingStore, useReviewStore } from '../../store'
import ReviewForm from './ReviewForm'
import UserReviewCard from './UserReviewCard'
import type { HotelReview, UserReview } from '../../types'
import { generateId } from '../../utils'
import toast from 'react-hot-toast'

interface ReviewsSectionProps {
  hotelId: number
  hotelName: string
  staticReviews: HotelReview[]
  ratings: {
    overall: number
    cleanliness: number
    location: number
    service: number
    value: number
  }
  reviewsCount: number
}

type SortMode = 'newest' | 'highest' | 'lowest' | 'helpful'

export default function ReviewsSection({ hotelId, hotelName, staticReviews, ratings, reviewsCount }: ReviewsSectionProps) {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const { bookingHistory } = useBookingStore()
  const { reviews: allReviews, addReview, hasUserReviewed, getReviewsByHotel } = useReviewStore()
  const isDark = theme === 'dark'
  const [showForm, setShowForm] = useState(false)
  const [sortMode, setSortMode] = useState<SortMode>('newest')

  const userReviews = getReviewsByHotel(hotelId)
  const alreadyReviewed = user ? hasUserReviewed(hotelId, user.id) : false
  const allMerged = useMemo(() => {
    const mapped: UserReview[] = userReviews.map((r) => ({
      ...r,
      upvotes: r.upvotes ?? 0,
      upvotedBy: r.upvotedBy ?? [],
    }))
    const staticMapped: UserReview[] = staticReviews.map((r) => ({
      id: `static-${r.id}`,
      hotelId,
      userId: r.user,
      userName: r.user,
      userAvatar: r.avatar || '',
      rating: r.rating,
      cleanliness: ratings.cleanliness,
      location: ratings.location,
      service: ratings.service,
      value: ratings.value,
      comment: r.comment,
      photos: [],
      createdAt: r.date,
      upvotes: 0,
      upvotedBy: [],
    }))
    const combined = [...mapped, ...staticMapped]
    switch (sortMode) {
      case 'newest': return combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      case 'highest': return combined.sort((a, b) => b.rating - a.rating)
      case 'lowest': return combined.sort((a, b) => a.rating - b.rating)
      case 'helpful': return combined.sort((a, b) => b.upvotes - a.upvotes)
      default: return combined
    }
  }, [userReviews, staticReviews, sortMode])

  // Check if user has completed bookings for this hotel
  const completedBookings = useMemo(() => {
    if (!user) return []
    const now = new Date()
    return bookingHistory.filter(
      (b) => b.hotelId === hotelId && new Date(b.checkOut) < now && b.status !== 'cancelled'
    )
  }, [bookingHistory, hotelId, user])

  const canReview = user && !alreadyReviewed && completedBookings.length > 0

  const handleSubmit = (data: { rating: number; cleanliness: number; location: number; service: number; value: number; comment: string; photos: string[]; bookingId?: string }) => {
    if (!user) return
    addReview({
      id: generateId(),
      hotelId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar || '',
      rating: data.rating,
      cleanliness: data.cleanliness || data.rating,
      location: data.location || data.rating,
      service: data.service || data.rating,
      value: data.value || data.rating,
      comment: data.comment,
      photos: data.photos,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      upvotedBy: [],
      bookingId: data.bookingId,
    })
    setShowForm(false)
    toast.success('Review submitted! Thank you for your feedback.')
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Guest Reviews
          <span className={`text-sm font-normal ml-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            ({reviewsCount + userReviews.length})
          </span>
        </h2>
        <div className="flex items-center gap-2">
          <RatingBadge value={ratings.overall} />
        </div>
      </div>

      {/* Rating Breakdown */}
      <div className={`grid grid-cols-2 gap-3 mb-6 p-4 rounded-xl ${isDark ? 'bg-dark-border/50' : 'bg-gray-50'}`}>
        {[
          { label: 'Cleanliness', value: ratings.cleanliness },
          { label: 'Location', value: ratings.location },
          { label: 'Service', value: ratings.service },
          { label: 'Value for Money', value: ratings.value },
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

      {/* Sort & Review Button */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <SortAsc size={14} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
            className={`text-xs outline-none rounded-lg px-2 py-1.5 ${
              isDark ? 'bg-dark-border text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <option value="newest">Newest</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>

        {user && !showForm && (
          <button
            onClick={() => {
              if (alreadyReviewed) { toast.error('You have already reviewed this hotel'); return }
              if (!canReview && completedBookings.length === 0) { toast.error('You can only review hotels after your stay is complete'); return }
              setShowForm(true)
            }}
            disabled={alreadyReviewed}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              alreadyReviewed
                ? isDark ? 'bg-dark-border text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'gradient-primary text-white hover:opacity-90'
            }`}
          >
            <Star size={13} />
            {alreadyReviewed ? 'Already Reviewed' : 'Write a Review'}
          </button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="mb-6">
          <ReviewForm
            hotelId={hotelId}
            hotelName={hotelName}
            bookingId={completedBookings[0]?.id}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Review List */}
      {allMerged.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allMerged.map((review, i) => (
            <UserReviewCard key={review.id} review={review} index={i} />
          ))}
        </div>
      ) : (
        <div className={`text-sm py-8 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          No reviews yet. Be the first to share your experience!
        </div>
      )}

      {!user && (
        <div className={`mt-4 p-3 rounded-lg text-sm text-center ${isDark ? 'bg-dark-border text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
          <a href="/login" className="text-primary font-medium hover:underline">Sign in</a> to write a review.
        </div>
      )}
    </motion.div>
  )
}

function RatingBadge({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-xl">
      <Star size={14} className="text-accent fill-accent" />
      <span className="text-sm font-semibold text-primary">{value.toFixed(1)}</span>
    </div>
  )
}
