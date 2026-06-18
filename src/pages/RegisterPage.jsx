import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { UserPlus } from 'lucide-react'
import { useThemeStore, useAuthStore } from '../store'
import { useRegister } from '../hooks/useQueries'
import toast from 'react-hot-toast'

const registerSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export default function RegisterPage() {
  const navigate = useNavigate()
  const { theme } = useThemeStore()
  const { register: registerUser } = useAuthStore()
  const { mutateAsync: registerApi } = useRegister()
  const isDark = theme === 'dark'

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = async (data) => {
    try {
      const res = await registerApi(data)
      registerUser(res.user)
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch {
      toast.error('Registration failed. Please try again.')
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
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Create Account</h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Join StayEase and start booking</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
            <input {...register('name')} className={`w-full px-4 py-2.5 rounded-lg text-sm outline-none border ${errors.name ? 'border-red-500' : isDark ? 'bg-dark-border text-white border-dark-border' : 'bg-gray-50 text-gray-900 border-gray-200'}`} placeholder="John Doe" />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
            <input {...register('email')} className={`w-full px-4 py-2.5 rounded-lg text-sm outline-none border ${errors.email ? 'border-red-500' : isDark ? 'bg-dark-border text-white border-dark-border' : 'bg-gray-50 text-gray-900 border-gray-200'}`} placeholder="you@example.com" />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
            <input type="password" {...register('password')} className={`w-full px-4 py-2.5 rounded-lg text-sm outline-none border ${errors.password ? 'border-red-500' : isDark ? 'bg-dark-border text-white border-dark-border' : 'bg-gray-50 text-gray-900 border-gray-200'}`} placeholder="••••••••" />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Confirm Password</label>
            <input type="password" {...register('confirmPassword')} className={`w-full px-4 py-2.5 rounded-lg text-sm outline-none border ${errors.confirmPassword ? 'border-red-500' : isDark ? 'bg-dark-border text-white border-dark-border' : 'bg-gray-50 text-gray-900 border-gray-200'}`} placeholder="••••••••" />
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button type="submit" className="w-full py-3 gradient-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <UserPlus size={16} /> Create Account
          </button>
        </form>

        <p className={`text-center text-sm mt-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
        </p>
      </motion.div>
    </div>
  )
}
