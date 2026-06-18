import { Star, ThumbsUp } from 'lucide-react'
import { useThemeStore } from '../../store'

export default function ReviewCard({ review }) {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  return (
    <div className={`p-4 rounded-xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center shrink-0">
          <span className="text-white font-medium text-sm">
            {review.user?.charAt(0) || 'U'}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {review.user}
            </h4>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={i < review.rating ? 'text-accent fill-accent' : 'text-gray-300'}
                />
              ))}
            </div>
          </div>
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{review.date}</p>
        </div>
      </div>
      <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        {review.comment}
      </p>
      <button className={`mt-3 flex items-center gap-1.5 text-xs transition-colors ${
        isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
      }`}>
        <ThumbsUp size={12} />
        Helpful
      </button>
    </div>
  )
}
