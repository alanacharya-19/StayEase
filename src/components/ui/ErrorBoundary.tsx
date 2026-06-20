import { Component } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
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
            <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              Something went wrong
            </h1>
            <p className="mb-6 text-gray-500 dark:text-gray-400">
              {this.props.fallbackMessage || 'An unexpected error occurred. Please try again.'}
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                to="/"
                onClick={() => this.setState({ hasError: false, error: null })}
                className="flex items-center gap-2 px-6 py-3 gradient-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Home size={16} /> Go Home
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium border border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-border transition-colors"
              >
                <RefreshCw size={16} /> Reload
              </button>
            </div>
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}
