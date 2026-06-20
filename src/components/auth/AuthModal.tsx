import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, X } from 'lucide-react'
import { useThemeStore, useAuthStore } from '../../store'
import { useLogin, useRegister } from '../../hooks/useQueries'
import toast from 'react-hot-toast'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

type Mode = 'login' | 'register'

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { theme } = useThemeStore()
  const { login: setAuth } = useAuthStore()
  const navigate = useNavigate()
  const loginMutation = useLogin()
  const registerMutation = useRegister()

  const [mode, setMode] = useState<Mode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })

  const isDark = theme === 'dark'

  const resetForm = () => {
    setForm({ name: '', email: '', password: '', confirmPassword: '' })
    setShowPassword(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    resetForm()
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await loginMutation.mutateAsync({ email: form.email, password: form.password })
      setAuth(res.user)
      toast.success('Welcome back!')
      handleClose()
      navigate('/dashboard')
    } catch {
      toast.error('Invalid email or password')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    try {
      const res = await registerMutation.mutateAsync({ name: form.name, email: form.email, password: form.password })
      setAuth(res.user)
      toast.success('Account created successfully!')
      handleClose()
      navigate('/dashboard')
    } catch {
      toast.error('Registration failed. Please try again.')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className={`relative w-full max-w-md rounded-2xl p-8 shadow-2xl ${
              isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'
            }`}
          >
            <button
              onClick={handleClose}
              className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors ${
                isDark ? 'hover:bg-dark-border text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <X size={18} />
            </button>

            <div className="text-center mb-8">
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {mode === 'login' ? 'Sign in to your StayEase account' : 'Join StayEase and start booking'}
              </p>
            </div>

            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-5">
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
                      placeholder="Enter your password"
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
                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 gradient-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {loginMutation.isPending ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>Sign In <ArrowRight size={16} /></>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-5">
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
                    <>Create Account <ArrowRight size={16} /></>
                  )}
                </button>
              </form>
            )}

            <p className={`mt-6 text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {mode === 'login' ? (
                <>Don't have an account?{' '}
                  <button onClick={switchMode} className="text-primary font-medium hover:underline">
                    Create one
                  </button>
                </>
              ) : (
                <>Already have an account?{' '}
                  <button onClick={switchMode} className="text-primary font-medium hover:underline">
                    Sign in
                  </button>
                </>
              )}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
