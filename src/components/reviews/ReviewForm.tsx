import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Star, Camera, X, Loader2 } from 'lucide-react'
import { useThemeStore, useAuthStore } from '../../store'
import toast from 'react-hot-toast'

interface ReviewFormProps {
  hotelId: number
  hotelName: string
  bookingId?: string
  onSubmit: (data: ReviewFormData) => void
  onCancel?: () => void
}

export interface ReviewFormData {
  rating: number
  cleanliness: number
  location: number
  service: number
  value: number
  comment: string
  photos: string[]
  bookingId?: string
}

const ratings = [
  { key: 'cleanliness', label: 'Cleanliness' },
  { key: 'location', label: 'Location' },
  { key: 'service', label: 'Service' },
  { key: 'value', label: 'Value for Money' },
]

export default function ReviewForm({ hotelId, hotelName, bookingId, onSubmit, onCancel }: ReviewFormProps) {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const isDark = theme === 'dark'
  const fileRef = useRef<HTMLInputElement>(null)

  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [subRatings, setSubRatings] = useState<Record<string, number>>({
    cleanliness: 0, location: 0, service: 0, value: 0,
  })
  const [comment, setComment] = useState('')
  const [photos, setPhotos] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    if (photos.length + files.length > 3) {
      toast.error('Maximum 3 photos allowed')
      return
    }
    setUploading(true)
    const remaining = 3 - photos.length
    const toProcess = Array.from(files).slice(0, remaining)
    let loaded = 0
    for (const file of toProcess) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 2MB)`)
        continue
      }
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPhotos((prev) => [...prev, reader.result as string])
        }
        loaded++
        if (loaded === toProcess.length) setUploading(false)
      }
      reader.readAsDataURL(file)
    }
    if (e.target) e.target.value = ''
  }

  const removePhoto = (idx: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async () => {
    if (rating === 0) { toast.error('Please select an overall rating'); return }
    if (!comment.trim()) { toast.error('Please write a review comment'); return }
    if (comment.trim().length < 10) { toast.error('Review must be at least 10 characters'); return }

    setSubmitting(true)
    onSubmit({
      rating,
      cleanliness: subRatings.cleanliness || rating,
      location: subRatings.location || rating,
      service: subRatings.service || rating,
      value: subRatings.value || rating,
      comment: comment.trim(),
      photos,
      bookingId,
    })
    setSubmitting(false)
  }

  const valid = rating > 0 && comment.trim().length >= 10

  return (
    <div className={`p-5 rounded-xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'}`}>
      <h3 className={`font-semibold text-base mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Write a Review for {hotelName}
      </h3>

      {!user && (
        <div className={`p-3 rounded-lg mb-4 text-sm ${isDark ? 'bg-dark-border text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
          Please sign in to submit a review.
        </div>
      )}

      {/* Overall Rating */}
      <div className="mb-5">
        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Overall Rating <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-0.5 transition-transform hover:scale-110"
            >
              <Star
                size={28}
                className={star <= (hoverRating || rating) ? 'text-accent fill-accent' : 'text-gray-300 dark:text-gray-600'}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Sub-ratings */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {ratings.map((r) => (
          <div key={r.key}>
            <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{r.label}</label>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSubRatings((p) => ({ ...p, [r.key]: star === p[r.key] ? 0 : star }))}
                >
                  <Star
                    size={14}
                    className={star <= (subRatings[r.key] || rating) ? 'text-accent fill-accent' : 'text-gray-300 dark:text-gray-600'}
                  />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience at this hotel..."
          rows={4}
          maxLength={2000}
          className={`w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none ${
            isDark ? 'bg-dark-border text-white placeholder-gray-500' : 'bg-gray-100 text-gray-900 placeholder-gray-400'
          }`}
        />
        <p className={`text-xs mt-1 text-right ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          {comment.length}/2000
        </p>
      </div>

      {/* Photo Upload */}
      <div className="mb-5">
        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Photos (optional, max 3)
        </label>
        <div className="flex flex-wrap gap-2">
          {photos.map((photo, i) => (
            <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden group">
              <img src={photo} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => removePhoto(i)}
                className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
            </div>
          ))}
          {photos.length < 3 && (
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className={`w-20 h-20 rounded-lg border-2 border-dashed flex items-center justify-center transition-colors ${
                isDark ? 'border-dark-border text-gray-500 hover:border-primary' : 'border-gray-200 text-gray-400 hover:border-primary'
              }`}
            >
              {uploading ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
            </button>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {onCancel && (
          <button
            onClick={onCancel}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isDark ? 'bg-dark-border text-gray-300 hover:text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={!valid || submitting || !user}
          className="flex-1 px-4 py-2.5 gradient-primary text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {submitting ? <Loader2 size={16} className="animate-spin" /> : <Star size={16} />}
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </div>
  )
}
