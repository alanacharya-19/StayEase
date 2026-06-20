import { motion } from 'framer-motion'
import { SignIn } from '@clerk/react'
import { useThemeStore } from '../store'

export default function LoginPage() {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <SignIn
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: `w-full max-w-md p-8 rounded-2xl shadow-sm ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'}`,
              headerTitle: isDark ? 'text-white' : 'text-gray-900',
              headerSubtitle: isDark ? 'text-gray-400' : 'text-gray-500',
              socialButtonsBlockButton: isDark ? 'bg-dark-border border-dark-border text-white hover:bg-dark-border/80' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50',
              formFieldLabel: isDark ? 'text-gray-300' : 'text-gray-700',
              formFieldInput: `text-sm ${isDark ? 'bg-dark-border text-white border-dark-border' : 'bg-gray-50 text-gray-900 border-gray-200'}`,
              footerActionLink: 'text-primary hover:underline',
              formButtonPrimary: 'gradient-primary text-white rounded-lg text-sm font-medium hover:opacity-90',
              identityPreviewText: isDark ? 'text-gray-300' : 'text-gray-700',
              identityPreviewEditButton: 'text-primary',
            },
          }}
          redirectUrl="/dashboard"
          signUpUrl="/register"
        />
      </motion.div>
    </div>
  )
}
