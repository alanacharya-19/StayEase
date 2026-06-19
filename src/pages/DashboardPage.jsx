import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Calendar, Heart, Star, Bell, Settings, LogOut, Clock } from 'lucide-react'
import { useThemeStore, useAuthStore, useBookingStore, useWishlistStore } from '../store'
import { BookingCard, HotelCard } from '../components/cards'
import { Breadcrumb } from '../components/ui'
import toast from 'react-hot-toast'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
  { id: 'trips', label: 'Upcoming Trips', icon: Clock },
  { id: 'wishlist', label: 'Saved Hotels', icon: Heart },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const { theme } = useThemeStore()
  const { user, isAuthenticated, logout, updateProfile } = useAuthStore()
  const { bookingHistory } = useBookingStore()
  const { items: wishlistItems } = useWishlistStore()
  const isDark = theme === 'dark'
  const [activeTab, setActiveTab] = useState('profile')
  const [editing, setEditing] = useState(false)
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' })

  if (!isAuthenticated) {
    return (
      <div className="py-20 text-center">
        <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Please sign in</h2>
        <button onClick={() => navigate('/login')} className="px-6 py-2 gradient-primary text-white rounded-lg">Sign In</button>
      </div>
    )
  }

  const handleSaveProfile = () => {
    updateProfile(profileForm)
    setEditing(false)
    toast.success('Profile updated!')
  }

  const upcomingTrips = bookingHistory.filter(b => new Date(b.checkIn) > new Date())

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className={`p-6 rounded-xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Profile Information</h3>
              <button onClick={() => setEditing(!editing)} className="text-sm text-primary hover:underline">
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center text-2xl font-bold text-white">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{user?.name}</h4>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{user?.email}</p>
              </div>
            </div>
            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Name</label>
                  <input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className={`w-full px-4 py-2 rounded-lg text-sm outline-none border ${isDark ? 'bg-dark-border text-white border-dark-border' : 'bg-gray-50 text-gray-900 border-gray-200'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                  <input value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} className={`w-full px-4 py-2 rounded-lg text-sm outline-none border ${isDark ? 'bg-dark-border text-white border-dark-border' : 'bg-gray-50 text-gray-900 border-gray-200'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Phone</label>
                  <input value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} className={`w-full px-4 py-2 rounded-lg text-sm outline-none border ${isDark ? 'bg-dark-border text-white border-dark-border' : 'bg-gray-50 text-gray-900 border-gray-200'}`} />
                </div>
                <button onClick={handleSaveProfile} className="px-6 py-2 gradient-primary text-white rounded-lg text-sm font-medium">Save Changes</button>
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { label: 'Email', value: user?.email },
                  { label: 'Phone', value: user?.phone || 'Not set' },
                  { label: 'Member Since', value: 'January 2025' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-sm">
                    <span className={`w-20 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.label}</span>
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      case 'bookings':
        return (
          <div>
            {bookingHistory.length > 0 ? (
              <div className="space-y-4">
                {bookingHistory.map((booking, i) => (
                  <BookingCard key={booking.id || i} booking={booking} index={i} />
                ))}
              </div>
            ) : (
              <div className={`p-8 text-center rounded-xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'}`}>
                <Calendar size={40} className="mx-auto mb-3 text-gray-400" />
                <p className={`text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>No bookings yet</p>
                <button onClick={() => navigate('/hotels')} className="text-sm text-primary hover:underline">Browse Hotels</button>
              </div>
            )}
          </div>
        )
      case 'trips':
        return (
          <div>
            {upcomingTrips.length > 0 ? (
              <div className="space-y-4">
                {upcomingTrips.map((trip, i) => (
                  <BookingCard key={trip.id || i} booking={trip} index={i} />
                ))}
              </div>
            ) : (
              <div className={`p-8 text-center rounded-xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'}`}>
                <Clock size={40} className="mx-auto mb-3 text-gray-400" />
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>No upcoming trips</p>
              </div>
            )}
          </div>
        )
      case 'wishlist':
        return (
          <div>
            {wishlistItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {wishlistItems.map((hotel, i) => (
                  <HotelCard key={hotel.id} hotel={hotel} index={i} />
                ))}
              </div>
            ) : (
              <div className={`p-8 text-center rounded-xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'}`}>
                <Heart size={40} className="mx-auto mb-3 text-gray-400" />
                <p className={`text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>No saved hotels</p>
                <button onClick={() => navigate('/hotels')} className="text-sm text-primary hover:underline">Discover Hotels</button>
              </div>
            )}
          </div>
        )
      case 'reviews':
        return (
          <div className={`p-6 text-center rounded-xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'}`}>
            <Star size={40} className="mx-auto mb-3 text-gray-400" />
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>No reviews yet. Your reviews will appear here.</p>
          </div>
        )
      case 'notifications':
        return (
          <div className={`p-6 text-center rounded-xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'}`}>
            <Bell size={40} className="mx-auto mb-3 text-gray-400" />
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>No notifications yet.</p>
          </div>
        )
      case 'settings':
        return (
          <div className={`p-6 rounded-xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Account Settings</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-dark-border">
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email Notifications</span>
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary focus:ring-primary" />
              </label>
              <label className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-dark-border">
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>SMS Notifications</span>
                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
              </label>
              <label className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-dark-border">
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Promotional Emails</span>
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary focus:ring-primary" />
              </label>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-dark-border">
              <button onClick={() => { logout(); toast.success('Logged out'); navigate('/') }} className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600">
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ to: '/', label: 'Home' }, { label: 'Dashboard' }]} />
        <h1 className={`font-display text-3xl sm:text-4xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          My Dashboard
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 shrink-0">
            <div className={`rounded-xl overflow-hidden ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'}`}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary border-l-2 border-primary'
                      : isDark ? 'text-gray-400 hover:bg-dark-border hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <tab.icon size={18} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className={`mt-4 p-4 rounded-xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'}`}>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{bookingHistory.length}</p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Bookings</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{wishlistItems.length}</p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Saved</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
