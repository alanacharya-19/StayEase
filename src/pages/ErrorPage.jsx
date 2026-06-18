import { Link, useRouteError } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'
import { useThemeStore } from '../store'

export default function ErrorPage() {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'
  const error = useRouteError()

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <AlertTriangle size={32} className="text-red-500" />
        </div>
        <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Something went wrong
        </h1>
        <p className={`mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          An unexpected error occurred. Please try again.
        </p>
        {error?.statusText && (
          <p className={`text-sm mb-6 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {error.statusText}
          </p>
        )}
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 gradient-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Home size={16} /> Go Home
          </Link>
          <button
            onClick={() => window.location.reload()}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium border transition-colors ${
              isDark ? 'border-dark-border text-gray-300 hover:bg-dark-border' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <RefreshCw size={16} /> Reload
          </button>
        </div>
      </motion.div>
    </div>
  )
}
