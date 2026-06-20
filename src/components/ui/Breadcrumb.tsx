import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { useThemeStore } from '../../store'

interface BreadcrumbItem {
  to?: string
  label: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  return (
    <nav className="flex items-center gap-1.5 text-sm mb-6">
      <Link to="/" className={`flex items-center gap-1 hover:text-primary transition-colors ${
        isDark ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <Home size={14} />
        Home
      </Link>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <ChevronRight size={12} className="text-gray-400" />
          {item.to ? (
            <Link to={item.to} className="text-gray-400 hover:text-primary transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}
