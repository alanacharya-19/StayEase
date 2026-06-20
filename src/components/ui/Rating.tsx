import { Star } from 'lucide-react'

export default function Rating({ value = 0, size = 16, showValue = true }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.round(value) ? 'text-accent fill-accent' : 'text-gray-300'}
        />
      ))}
      {showValue && <span className="text-sm font-medium text-gray-600 dark:text-gray-400 ml-1">{value}</span>}
    </div>
  )
}
