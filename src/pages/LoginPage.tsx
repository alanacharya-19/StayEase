import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { useThemeStore, useAuthStore } from '../store'
import { useLogin } from '../hooks/useQueries'
import toast from 'react-hot-toast'
import type { AuthResponse } from '../types'

const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
})

export default function LoginPage() {
  const navigate = useNavigate()
  const { theme } = useThemeStore()
  const { login } = useAuthStore()
  const { mutateAsync: loginApi } = useLogin()
  const isDark = theme === 'dark'
  const [showPw, setShowPw] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: false },
  })

  const onSubmit = async (data: { email: string; password: string; remember?: boolean }) => {
    try {
      const res = await loginApi(data)
      login(res.user)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch {
      toast.error('Login failed. Please try again.')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`w-full max-w-md p-8 rounded-2xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'} shadow-sm`}>
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-display text-xl font-bold">StayEase</span>
          </Link>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Welcome Back</h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
            <input {...register('email')} className={`w-full px-4 py-2.5 rounded-lg text-sm outline-none border ${errors.email ? 'border-red-500' : isDark ? 'bg-dark-border text-white border-dark-border' : 'bg-gray-50 text-gray-900 border-gray-200'}`} placeholder="you@example.com" />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} {...register('password')} className={`w-full px-4 py-2.5 pr-10 rounded-lg text-sm outline-none border ${errors.password ? 'border-red-500' : isDark ? 'bg-dark-border text-white border-dark-border' : 'bg-gray-50 text-gray-900 border-gray-200'}`} placeholder="••••••••" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPw ? <Eye size={16} /> : <EyeOff size={16} />}</button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('remember')} className="rounded border-gray-300 text-primary focus:ring-primary" />
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Remember me</span>
            </label>
            <button type="button" className="text-sm text-primary hover:underline">Forgot Password?</button>
          </div>

          <button type="submit" className="w-full py-3 gradient-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <LogIn size={16} /> Sign In
          </button>
        </form>

        <p className={`text-center text-sm mt-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Don&apos;t have an account? <Link to="/register" className="text-primary font-medium hover:underline">Sign Up</Link>
        </p>
      </motion.div>
    </div>
  )
}
