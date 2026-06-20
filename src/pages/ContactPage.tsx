import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import { useThemeStore } from '../store'
import { Breadcrumb } from '../components/ui'
import toast from 'react-hot-toast'
import type { FormEvent } from 'react'

export default function ContactPage() {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    toast.success('Message sent! We will get back to you soon.')
  }

  return (
    <div className="py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ to: '/', label: 'Home' }, { label: 'Contact' }]} />

        <div className="text-center mb-12">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Contact</span>
          <h1 className={`font-display text-4xl sm:text-5xl font-bold mt-2 mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Get In Touch
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            We&apos;d love to hear from you. Drop us a message anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            {[
              { icon: Mail, title: 'Email', value: 'support@stayease.com', desc: 'We respond within 24 hours' },
              { icon: Phone, title: 'Phone', value: '+1 (800) STAY-EASE', desc: 'Mon-Fri 9am-6pm EST' },
              { icon: MapPin, title: 'Office', value: '123 Travel Street, New York, NY 10001', desc: 'Visit our headquarters' },
              { icon: Clock, title: 'Hours', value: '24/7 Support', desc: 'Always here to help' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-5 rounded-xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center shrink-0">
                    <item.icon size={18} className="text-white" />
                  </div>
                  <div>
                    <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{item.value}</p>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className={`p-6 rounded-xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
                  <input required className={`w-full px-4 py-2.5 rounded-lg text-sm outline-none border ${isDark ? 'bg-dark-border text-white border-dark-border' : 'bg-gray-50 text-gray-900 border-gray-200'}`} placeholder="John Doe" />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                  <input type="email" required className={`w-full px-4 py-2.5 rounded-lg text-sm outline-none border ${isDark ? 'bg-dark-border text-white border-dark-border' : 'bg-gray-50 text-gray-900 border-gray-200'}`} placeholder="john@example.com" />
                </div>
              </div>
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Subject</label>
                <input required className={`w-full px-4 py-2.5 rounded-lg text-sm outline-none border ${isDark ? 'bg-dark-border text-white border-dark-border' : 'bg-gray-50 text-gray-900 border-gray-200'}`} placeholder="How can we help?" />
              </div>
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Message</label>
                <textarea required rows={5} className={`w-full px-4 py-2.5 rounded-lg text-sm outline-none border ${isDark ? 'bg-dark-border text-white border-dark-border' : 'bg-gray-50 text-gray-900 border-gray-200'}`} placeholder="Tell us more about your inquiry..." />
              </div>
              <button type="submit" className="flex items-center gap-2 px-6 py-3 gradient-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                <Send size={16} /> Send Message
              </button>
            </form>

            {/* Map */}
            <div className={`mt-6 rounded-xl overflow-hidden h-64 ${isDark ? 'border border-dark-border' : 'border border-gray-100'}`}>
              <iframe
                title="map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-74.0060%2C40.7128%2C-73.9860%2C40.7228&layer=mapnik"
                width="100%"
                height="100%"
                style={{ border: 'none' }}
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
