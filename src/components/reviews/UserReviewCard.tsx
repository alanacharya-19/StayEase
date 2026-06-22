import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, ThumbsUp, ChevronLeft, ChevronRight } from 'lucide-react'
import { useThemeStore, useAuthStore, useReviewStore } from '../../store'
import type { UserReview } from '../../types'
import { formatDate } from '../../utils'

interface UserReviewCardProps {
  review: UserReview
  index?: number
}

export default function UserReviewCard({ review, index = 0 }: UserReviewCardProps) {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const { upvoteReview } = useReviewStore()
  const isDark = theme === 'dark'
  const [photoIdx, setPhotoIdx] = useState(0)

  const isUpvoted = user ? review.upvotedBy.includes(user.id) : false
  const isOwn = user ? review.userId === user.id : false

  const categoryRatings = [
    { label: 'Cleanliness', value: review.cleanliness },
    { label: 'Location', value: review.location },
    { label: 'Service', value: review.service },
    { label: 'Value', value: review.value },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`p-4 rounded-xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'}`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center shrink-0">
          <span className="text-white font-medium text-sm">
            {review.userName?.charAt(0) || 'U'}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h4 className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {review.userName}
                {isOwn && <span className="text-primary text-xs ml-1.5">(You)</span>}
              </h4>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={11} className={i < review.rating ? 'text-accent fill-accent' : 'text-gray-300'} />
                ))}
                <span className={`text-xs ml-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  {formatDate(review.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-ratings */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
        {categoryRatings.map((cr) => (
          <div key={cr.label} className="flex items-center gap-1">
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{cr.label}</span>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={9} className={i < cr.value ? 'text-accent fill-accent' : 'text-gray-300 dark:text-gray-600'} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className={`text-sm leading-relaxed mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        {review.comment}
      </p>

      {/* Photos */}
      {review.photos.length > 0 && (
        <div className="relative mb-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {review.photos.map((photo, i) => (
              <img
                key={i}
                src={photo}
                alt=""
                className="w-28 h-20 rounded-lg object-cover shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setPhotoIdx(photoIdx === i ? -1 : i)}
              />
            ))}
          </div>
          {photoIdx >= 0 && review.photos[photoIdx] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
              onClick={() => setPhotoIdx(-1)}
            >
              <button
                onClick={(e) => { e.stopPropagation(); setPhotoIdx(photoIdx > 0 ? photoIdx - 1 : review.photos.length - 1) }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30"
              >
                <ChevronLeft size={20} />
              </button>
              <img src={review.photos[photoIdx]} alt="" className="max-h-[80vh] max-w-[90vw] rounded-lg object-contain" onClick={(e) => e.stopPropagation()} />
              <button
                onClick={(e) => { e.stopPropagation(); setPhotoIdx(photoIdx < review.photos.length - 1 ? photoIdx + 1 : 0) }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30"
              >
                <ChevronRight size={20} />
              </button>
              <button onClick={() => setPhotoIdx(-1)} className="absolute top-4 right-4 text-white/80 hover:text-white text-lg">✕</button>
            </motion.div>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-dark-border">
        <button
          onClick={() => { if (user) upvoteReview(review.id, user.id); else toast.error('Sign in to upvote') }}
          className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
            isUpvoted ? 'text-primary' : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <ThumbsUp size={13} className={isUpvoted ? 'fill-primary' : ''} />
          Helpful ({review.upvotes})
        </button>
      </div>
    </motion.div>
  )
}
