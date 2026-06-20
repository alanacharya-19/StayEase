import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'
import { useThemeStore } from '../store'

export default function NotFoundPage() {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
        <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Page Not Found
        </h2>
        <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 gradient-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Home size={16} /> Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium border transition-colors ${
              isDark ? 'border-dark-border text-gray-300 hover:bg-dark-border' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      </motion.div>
    </div>
  )
}
