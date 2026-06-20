import { Outlet } from 'react-router-dom'
import { Navbar, Footer } from '../components/layout'
import { useThemeStore } from '../store'
import { motion } from 'framer-motion'

export default function MainLayout() {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  return (
    <div className={isDark ? 'dark bg-dark-bg text-white' : 'bg-gray-50 text-gray-900'}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16 lg:pt-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
