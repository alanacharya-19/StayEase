import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Calendar, Users, Edit3 } from 'lucide-react'
import { useThemeStore, useBookingStore } from '../store'
import { Breadcrumb } from '../components/ui'
import { formatCurrency, formatDate, calculateTotal } from '../utils'
import toast from 'react-hot-toast'

const bookingSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  checkIn: z.string().min(1, 'Check-in date is required'),
  checkOut: z.string().min(1, 'Check-out date is required'),
  guests: z.string().min(1, 'Number of guests is required'),
  specialRequest: z.string().optional(),
}).refine((data) => {
  if (data.checkIn && data.checkOut) {
    return new Date(data.checkOut) > new Date(data.checkIn)
  }
  return true
}, { message: 'Check-out must be after check-in', path: ['checkOut'] })

export default function BookingPage() {
  const navigate = useNavigate()
  const { theme } = useThemeStore()
  const { currentBooking, setCurrentBooking } = useBookingStore()
  const isDark = theme === 'dark'

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      checkIn: '',
      checkOut: '',
      guests: '1',
      specialRequest: '',
    },
  })

  const watchCheckIn = watch('checkIn')
  const watchCheckOut = watch('checkOut')
  const watchGuests = watch('guests')

  const nights = watchCheckIn && watchCheckOut
    ? Math.max(1, Math.ceil((new Date(watchCheckOut) - new Date(watchCheckIn)) / (1000 * 60 * 60 * 24)))
    : 1

  const price = currentBooking?.room?.price || currentBooking?.hotel?.price || 0
  const discount = currentBooking?.hotel?.discount || 0
  const { subtotal, tax, total } = calculateTotal(price, nights, 0.12, discount)
  const currency = currentBooking?.currency || 'USD'

  const onSubmit = (data) => {
    const bookingData = {
      ...data,
      ...currentBooking,
      nights,
      subtotal,
      tax,
      discount,
      total,
      currency,
      roomType: currentBooking?.room?.type || 'Standard',
      hotelName: currentBooking?.hotelName || 'Hotel',
      hotelImage: currentBooking?.hotelImage || '',
    }
    setCurrentBooking(bookingData)
    navigate('/payment')
  }

  if (!currentBooking) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">No booking selected</h2>
        <button onClick={() => navigate('/hotels')} className="px-6 py-2 gradient-primary text-white rounded-lg">
          Browse Hotels
        </button>
      </div>
    )
  }

  return (
    <div className="py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[
          { to: '/hotels', label: 'Hotels' },
          { to: `/hotels/${currentBooking.hotel?.id}`, label: currentBooking.hotelName },
          { label: 'Booking' },
        ]} />

        <h1 className={`font-display text-3xl sm:text-4xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Complete Your Booking
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit(onSubmit)}
              className={`p-6 rounded-xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'}`}
            >
              <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Personal Information</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Full Name *</label>
                  <input {...register('name')} className={`w-full px-4 py-2.5 rounded-lg text-sm outline-none border ${
                    errors.name ? 'border-red-500' : isDark ? 'bg-dark-border text-white border-dark-border' : 'bg-gray-50 text-gray-900 border-gray-200'
                  }`} placeholder="John Doe" />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email *</label>
                  <input {...register('email')} className={`w-full px-4 py-2.5 rounded-lg text-sm outline-none border ${
                    errors.email ? 'border-red-500' : isDark ? 'bg-dark-border text-white border-dark-border' : 'bg-gray-50 text-gray-900 border-gray-200'
                  }`} placeholder="john@example.com" />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Phone *</label>
                  <input {...register('phone')} className={`w-full px-4 py-2.5 rounded-lg text-sm outline-none border ${
                    errors.phone ? 'border-red-500' : isDark ? 'bg-dark-border text-white border-dark-border' : 'bg-gray-50 text-gray-900 border-gray-200'
                  }`} placeholder="+1 234 567 8900" />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Guests *</label>
                  <select {...register('guests')} className={`w-full px-4 py-2.5 rounded-lg text-sm outline-none border ${
                    isDark ? 'bg-dark-border text-white border-dark-border' : 'bg-gray-50 text-gray-900 border-gray-200'
                  }`}>
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
              </div>

              <h2 className={`text-xl font-semibold mb-4 mt-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Booking Dates</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Check-in *</label>
                  <input type="date" {...register('checkIn')} className={`w-full px-4 py-2.5 rounded-lg text-sm outline-none border ${
                    errors.checkIn ? 'border-red-500' : isDark ? 'bg-dark-border text-white border-dark-border' : 'bg-gray-50 text-gray-900 border-gray-200'
                  }`} />
                  {errors.checkIn && <p className="text-xs text-red-500 mt-1">{errors.checkIn.message}</p>}
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Check-out *</label>
                  <input type="date" {...register('checkOut')} className={`w-full px-4 py-2.5 rounded-lg text-sm outline-none border ${
                    errors.checkOut ? 'border-red-500' : isDark ? 'bg-dark-border text-white border-dark-border' : 'bg-gray-50 text-gray-900 border-gray-200'
                  }`} />
                  {errors.checkOut && <p className="text-xs text-red-500 mt-1">{errors.checkOut.message}</p>}
                </div>
              </div>

              <div className="mt-6">
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Special Request</label>
                <textarea {...register('specialRequest')} rows={3} className={`w-full px-4 py-2.5 rounded-lg text-sm outline-none border ${
                  isDark ? 'bg-dark-border text-white border-dark-border' : 'bg-gray-50 text-gray-900 border-gray-200'
                }`} placeholder="Any special requests? (optional)" />
              </div>

              <button type="submit" className="w-full mt-6 py-3 gradient-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                Proceed to Payment
              </button>
            </motion.form>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className={`sticky top-24 p-6 rounded-xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'} shadow-sm`}>
              <h3 className={`font-semibold text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Booking Summary</h3>
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-dark-border">
                <img src={currentBooking.hotelImage} alt="" className="w-14 h-14 rounded-lg object-cover" />
                <div>
                  <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{currentBooking.hotelName}</p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{currentBooking.room?.type || 'Standard Room'}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={14} className="text-gray-400" />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    {watchCheckIn ? formatDate(watchCheckIn) : 'Check-in'} - {watchCheckOut ? formatDate(watchCheckOut) : 'Check-out'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users size={14} className="text-gray-400" />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>{watchGuests || 1} Guest{(watchGuests || 1) > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Edit3 size={14} className="text-gray-400" />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>{nights} Night{nights > 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-dark-border">
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Price per night</span>
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{formatCurrency(price, currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Nights</span>
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{nights}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Subtotal</span>
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{formatCurrency(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Tax (12%)</span>
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{formatCurrency(tax, currency)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-500">
                    <span>Discount ({discount}%)</span>
                    <span>-{formatCurrency(discount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-100 dark:border-dark-border">
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>Total</span>
                  <span className="text-primary">{formatCurrency(total, currency)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
