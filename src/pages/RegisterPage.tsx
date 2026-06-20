import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useThemeStore, useAuthStore } from '../store'
import { useRegister } from '../hooks/useQueries'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const { theme } = useThemeStore()
  const { login: setAuth } = useAuthStore()
  const navigate = useNavigate()
  const registerMutation = useRegister()
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })

  const isDark = theme === 'dark'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    try {
      const res = await registerMutation.mutateAsync({ name: form.name, email: form.email, password: form.password })
      setAuth(res.user)
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch {
      toast.error('Registration failed. Please try again.')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-md rounded-2xl p-8 ${
          isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100 shadow-sm'
        }`}
      >
        <div className="text-center mb-8">
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Create Account</h1>
          <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Join StayEase and start booking
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe"
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg outline-none text-sm transition-colors ${
                  isDark
                    ? 'bg-dark-border text-white placeholder-gray-500 border-dark-border'
                    : 'bg-gray-50 text-gray-900 placeholder-gray-400 border-gray-200'
                } border focus:border-primary`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg outline-none text-sm transition-colors ${
                  isDark
                    ? 'bg-dark-border text-white placeholder-gray-500 border-dark-border'
                    : 'bg-gray-50 text-gray-900 placeholder-gray-400 border-gray-200'
                } border focus:border-primary`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Create a password"
                className={`w-full pl-10 pr-10 py-2.5 rounded-lg outline-none text-sm transition-colors ${
                  isDark
                    ? 'bg-dark-border text-white placeholder-gray-500 border-dark-border'
                    : 'bg-gray-50 text-gray-900 placeholder-gray-400 border-gray-200'
                } border focus:border-primary`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                required
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Confirm your password"
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg outline-none text-sm transition-colors ${
                  isDark
                    ? 'bg-dark-border text-white placeholder-gray-500 border-dark-border'
                    : 'bg-gray-50 text-gray-900 placeholder-gray-400 border-gray-200'
                } border focus:border-primary`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 gradient-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {registerMutation.isPending ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Create Account <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p className={`mt-6 text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
