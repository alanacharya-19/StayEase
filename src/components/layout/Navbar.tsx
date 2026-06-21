import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, Moon, Sun, Heart, User, ChevronDown, Search } from 'lucide-react'
import { useThemeStore, useAuthStore, useWishlistStore } from '../../store'
import { useSearchSuggestions } from '../../hooks/useQueries'
import AuthModal from '../auth/AuthModal'

const navLinks: Array<{ to: string; label: string }> = [
  { to: '/', label: 'Home' },
  { to: '/hotels', label: 'Hotels' },
  { to: '/trip-tools', label: 'Trip Tools' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const { theme, toggleTheme } = useThemeStore()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { items } = useWishlistStore()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { data: suggestions } = useSearchSuggestions(searchTerm)

  const isDark = theme === 'dark'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isDark
        ? 'bg-dark-bg/85 backdrop-blur-lg border-b border-dark-border/40'
        : 'bg-white/90 backdrop-blur-lg border-b border-gray-200/50 shadow-sm shadow-black/5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className={`font-display text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Stay<span className="text-primary">Ease</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'text-primary'
                    : isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-dark-border text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Search size={18} />
            </button>

            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-dark-border text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link
              to="/wishlist"
              className={`relative p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-dark-border text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Heart size={18} />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-medium">
                  {items.length}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  onBlur={() => setTimeout(() => setShowUserMenu(false), 200)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isDark ? 'hover:bg-dark-border text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <User size={18} />
                  <span className="text-sm font-medium max-w-[120px] truncate">{user?.name || user?.email}</span>
                  <ChevronDown size={14} className={`transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg overflow-hidden ${
                        isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'
                      }`}
                    >
                      <Link
                        to="/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm transition-colors ${
                          isDark ? 'hover:bg-dark-border text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => { logout(); setShowUserMenu(false); navigate('/') }}
                        className={`w-full flex items-center gap-2 px-4 py-3 text-sm transition-colors ${
                          isDark ? 'hover:bg-dark-border text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="hidden sm:flex items-center gap-2 px-4 py-2 gradient-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Sign In
              </button>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-dark-border text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`border-t ${
              isDark ? 'border-dark-border/40 bg-dark-bg/85' : 'border-gray-200/50 bg-white/90'
            }`}
          >
            <div className="max-w-3xl mx-auto px-4 py-4">
              <form
                onSubmit={(e: FormEvent) => { e.preventDefault(); if (searchTerm.trim()) { navigate(`/hotels?search=${encodeURIComponent(searchTerm.trim())}`); setSearchOpen(false); setSearchTerm('') } }}
                className="relative"
              >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search hotels, destinations..."
                  className={`w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-colors ${
                    isDark ? 'bg-dark-card text-white placeholder-gray-500 border-dark-border' : 'bg-gray-50 text-gray-900 placeholder-gray-400 border-gray-200'
                  } border focus:border-primary`}
                  autoFocus
                />
                {suggestions && suggestions.length > 0 && (
                  <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl shadow-lg overflow-hidden ${
                    isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'
                  }`}>
                    {suggestions.map((hotel) => (
                      <Link
                        key={hotel.id}
                        to={`/hotels/${hotel.id}`}
                        onClick={() => { setSearchOpen(false); setSearchTerm('') }}
                        className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                          isDark ? 'hover:bg-dark-border text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <img src={hotel.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="font-medium">{hotel.name}</p>
                          <p className="text-xs text-gray-500">{hotel.city}, {hotel.country}</p>
                        </div>
                        <span className="ml-auto font-semibold text-primary">${hotel.price}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`lg:hidden border-t ${
              isDark ? 'border-dark-border/40 bg-dark-bg/95' : 'border-gray-200/50 bg-white/95'
            }`}
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-2 text-sm font-medium ${
                    location.pathname === link.to
                      ? 'text-primary'
                      : isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated ? (
                <button
                  onClick={() => { setMobileOpen(false); setAuthModalOpen(true) }}
                  className="block py-2 text-sm font-medium text-primary"
                >
                  Sign In
                </button>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 text-sm font-medium text-primary"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileOpen(false); navigate('/') }}
                    className="block py-2 text-sm font-medium text-red-500"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </nav>
  )
}
