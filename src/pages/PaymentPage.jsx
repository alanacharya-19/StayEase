import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CreditCard, Smartphone, Wallet, DollarSign, CheckCircle, Download, ArrowLeft } from 'lucide-react'
import { useThemeStore, useBookingStore } from '../store'
import { Breadcrumb } from '../components/ui'
import { formatCurrency } from '../utils'
import toast from 'react-hot-toast'
import { useCreateBooking } from '../hooks/useQueries'

const paymentMethods = [
  { id: 'card', label: 'Credit Card', icon: CreditCard },
  { id: 'upi', label: 'UPI', icon: Smartphone },
  { id: 'paypal', label: 'PayPal', icon: Wallet },
  { id: 'cod', label: 'Cash on Arrival', icon: DollarSign },
]

export default function PaymentPage() {
  const navigate = useNavigate()
  const { theme } = useThemeStore()
  const { currentBooking, addToHistory } = useBookingStore()
  const createBooking = useCreateBooking()
  const isDark = theme === 'dark'
  const [method, setMethod] = useState('card')
  const [processing, setProcessing] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [bookingId, setBookingId] = useState('')

  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvv: '', name: '' })

  const handlePayment = async () => {
    if (!currentBooking) return
    setProcessing(true)
    await new Promise((r) => setTimeout(r, 2000))
    const newId = 'BK' + Date.now()
    setBookingId(newId)
    setCompleted(true)
    const bookingData = { ...currentBooking, id: newId, status: 'confirmed', createdAt: new Date().toISOString() }
    addToHistory(bookingData)
    createBooking.mutate(bookingData)
    toast.success('Booking confirmed!')
    setProcessing(false)
  }

  const handleDownload = () => {
    const receipt = `StayEase Booking Receipt
Booking ID: ${bookingId}
Hotel: ${currentBooking?.hotelName || 'N/A'}
Room: ${currentBooking?.room?.type || 'Standard'}
Total: ${formatCurrency(currentBooking?.total || 0, currentBooking?.currency)}
Date: ${new Date().toLocaleDateString()}
Thank you for choosing StayEase!`
    const blob = new Blob([receipt], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `receipt-${bookingId}.txt`
    a.click(); URL.revokeObjectURL(url)
    toast.success('Receipt downloaded!')
  }

  if (!currentBooking && !completed) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">No payment data</h2>
        <button onClick={() => navigate('/hotels')} className="px-6 py-2 gradient-primary text-white rounded-lg">Browse Hotels</button>
      </div>
    )
  }

  if (completed) {
    return (
      <div className="py-20">
        <div className="max-w-lg mx-auto px-4 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500 flex items-center justify-center">
              <CheckCircle size={40} className="text-white" />
            </div>
            <h1 className={`font-display text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Booking Successful!
            </h1>
            <p className={`mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Your booking has been confirmed.</p>
            <div className={`inline-block px-6 py-3 rounded-xl mb-6 ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'}`}>
              <p className="text-xs text-gray-400">Booking ID</p>
              <p className="text-lg font-bold text-primary">{bookingId}</p>
            </div>
            <div className="space-y-3">
              <button onClick={handleDownload} className="w-full py-3 gradient-primary text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90">
                <Download size={16} /> Download Receipt
              </button>
              <button onClick={() => navigate('/dashboard')} className="w-full py-3 border border-gray-200 dark:border-dark-border rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-dark-border transition-colors">
                View My Bookings
              </button>
              <button onClick={() => navigate('/')} className="w-full py-3 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                Back to Home
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8 lg:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[
          { to: '/hotels', label: 'Hotels' },
          { to: '/booking', label: 'Booking' },
          { label: 'Payment' },
        ]} />

        <h1 className={`font-display text-3xl sm:text-4xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Payment
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`p-6 rounded-xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'}`}>
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Payment Method</h2>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {paymentMethods.map((pm) => (
                  <button key={pm.id} onClick={() => setMethod(pm.id)} className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium border transition-all ${
                    method === pm.id
                      ? 'border-primary bg-primary/5 text-primary'
                      : isDark ? 'border-dark-border text-gray-300 hover:border-gray-500' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}>
                    <pm.icon size={18} />
                    {pm.label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {method === 'card' && (
                  <motion.div key="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Card Number</label>
                      <input
                        value={cardForm.number}
                        onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
                        placeholder="4242 4242 4242 4242"
                        className={`w-full px-4 py-2.5 rounded-lg text-sm outline-none border ${isDark ? 'bg-dark-border text-white border-dark-border' : 'bg-gray-50 text-gray-900 border-gray-200'}`}
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Expiry</label>
                        <input value={cardForm.expiry} onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })} placeholder="MM/YY" className={`w-full px-4 py-2.5 rounded-lg text-sm outline-none border ${isDark ? 'bg-dark-border text-white border-dark-border' : 'bg-gray-50 text-gray-900 border-gray-200'}`} maxLength={5} />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>CVV</label>
                        <input value={cardForm.cvv} onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })} placeholder="123" className={`w-full px-4 py-2.5 rounded-lg text-sm outline-none border ${isDark ? 'bg-dark-border text-white border-dark-border' : 'bg-gray-50 text-gray-900 border-gray-200'}`} maxLength={4} />
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Cardholder Name</label>
                      <input value={cardForm.name} onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })} placeholder="John Doe" className={`w-full px-4 py-2.5 rounded-lg text-sm outline-none border ${isDark ? 'bg-dark-border text-white border-dark-border' : 'bg-gray-50 text-gray-900 border-gray-200'}`} />
                    </div>
                  </motion.div>
                )}

                {method === 'upi' && (
                  <motion.div key="upi" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-8">
                    <Smartphone size={48} className="mx-auto mb-4 text-primary" />
                    <p className={`text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Pay using any UPI app</p>
                    <div className="flex items-center justify-center gap-3">
                      <input placeholder="username@upi" className={`px-4 py-2.5 rounded-lg text-sm outline-none border ${isDark ? 'bg-dark-border text-white border-dark-border' : 'bg-gray-50 text-gray-900 border-gray-200'}`} />
                    </div>
                  </motion.div>
                )}

                {method === 'paypal' && (
                  <motion.div key="paypal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-8">
                    <Wallet size={48} className="mx-auto mb-4 text-blue-500" />
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>You will be redirected to PayPal.</p>
                  </motion.div>
                )}

                {method === 'cod' && (
                  <motion.div key="cod" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-8">
                    <DollarSign size={48} className="mx-auto mb-4 text-green-500" />
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Pay with cash when you arrive at the hotel.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full mt-6 py-3 gradient-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Processing...
                  </>
                ) : (
                  `Pay ${formatCurrency(currentBooking?.total || 0, currentBooking?.currency)}`
                )}
              </button>
            </motion.div>
          </div>

          <div className="lg:col-span-2">
            <div className={`sticky top-24 p-6 rounded-xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'} shadow-sm`}>
              <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Order Summary</h3>
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-dark-border">
                <img src={currentBooking?.hotelImage} alt="" className="w-12 h-12 rounded-lg object-cover" />
                <div>
                  <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{currentBooking?.hotelName}</p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{currentBooking?.room?.type || 'Standard'}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Subtotal</span>
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{formatCurrency(currentBooking?.subtotal || 0, currentBooking?.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Tax</span>
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{formatCurrency(currentBooking?.tax || 0, currentBooking?.currency)}</span>
                </div>
                {(currentBooking?.discount || 0) > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>Discount</span>
                    <span>-{formatCurrency(currentBooking?.discount || 0, currentBooking?.currency)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-100 dark:border-dark-border">
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>Total</span>
                  <span className="text-primary">{formatCurrency(currentBooking?.total || 0, currentBooking?.currency)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
