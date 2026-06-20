import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Shield, Headphones, CreditCard, ChevronDown } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import toast from 'react-hot-toast'
import { useThemeStore } from '../store'
import { useFeaturedHotels, usePopularHotels, useLuxuryHotels, useBudgetHotels } from '../hooks/useQueries'
import { popularDestinations, testimonials, faqs } from '../data/content'
import { HotelCard, RecentlyViewed } from '../components/cards'
import { SkeletonList } from '../components/ui'
import SearchBar from '../components/forms/SearchBar'

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6 },
}

const stagger = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { staggerChildren: 0.1, duration: 0.5 },
}

export default function LandingPage() {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'
  const { data: featured, isLoading: loadingFeatured } = useFeaturedHotels()
  const { data: popular } = usePopularHotels()
  const { data: luxury } = useLuxuryHotels()
  const { data: budget } = useBudgetHotels()
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [email, setEmail] = useState('')

  const handleNewsletter = (e: FormEvent) => {
    e.preventDefault()
    if (email) toast.success('Subscribed successfully!')
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mb-8"
          >
            <span className="inline-block px-3 py-1 text-xs font-medium text-accent bg-accent/10 rounded-full mb-4">
              ✦ Premium Hotel Booking Platform
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl text-white font-bold leading-tight mb-6">
              Find Your Perfect
              <span className="text-gradient"> Stay</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl leading-relaxed">
              Discover extraordinary hotels, resorts, and boutique stays worldwide. 
              Your journey begins with a single click.
            </p>
          </motion.div>

          <SearchBar variant="hero" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center gap-6 mt-8 text-sm text-gray-400"
          >
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-green-400" />
              <span>Best Price Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Headphones size={16} className="text-blue-400" />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard size={16} className="text-purple-400" />
              <span>Secure Payments</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-primary text-sm font-semibold uppercase tracking-wider">Destinations</span>
              <h2 className={`font-display text-3xl sm:text-4xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Popular Destinations
              </h2>
            </div>
            <Link to="/hotels" className="flex items-center gap-1 text-primary text-sm font-medium hover:gap-2 transition-all">
              View All <ArrowRight size={14} />
            </Link>
          </motion.div>

          <motion.div {...stagger} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularDestinations.map((dest) => (
              <motion.div
                key={dest.id}
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                }}
              >
                <Link
                  to={`/hotels?city=${dest.name}`}
                  className={`group block rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                    isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'
                  } shadow-sm hover:shadow-md`}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{dest.name}</h3>
                    <p className="text-xs text-gray-500">{dest.country}</p>
                    <p className="text-xs text-primary font-medium mt-1">{dest.hotelCount} Hotels</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className={`py-16 lg:py-24 ${isDark ? 'bg-dark-card/50' : 'bg-gray-100/50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-primary text-sm font-semibold uppercase tracking-wider">Featured</span>
              <h2 className={`font-display text-3xl sm:text-4xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Featured Hotels
              </h2>
            </div>
            <Link to="/hotels" className="flex items-center gap-1 text-primary text-sm font-medium hover:gap-2 transition-all">
              View All <ArrowRight size={14} />
            </Link>
          </motion.div>

          {loadingFeatured ? (
            <SkeletonList count={3} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured?.slice(0, 3).map((hotel, i) => (
                <HotelCard key={hotel.id} hotel={hotel} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recently Viewed */}
      <RecentlyViewed />

      {/* Luxury Hotels */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-primary text-sm font-semibold uppercase tracking-wider">Luxury</span>
              <h2 className={`font-display text-3xl sm:text-4xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Luxury Hotels
              </h2>
              <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Experience the finest accommodations
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {luxury?.slice(0, 3).map((hotel, i) => (
              <HotelCard key={hotel.id} hotel={hotel} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Budget Hotels */}
      <section className={`py-16 lg:py-24 ${isDark ? 'bg-dark-card/50' : 'bg-gray-100/50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-primary text-sm font-semibold uppercase tracking-wider">Budget</span>
              <h2 className={`font-display text-3xl sm:text-4xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Budget-Friendly Stays
              </h2>
              <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Great quality at affordable prices
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {budget?.slice(0, 3).map((hotel, i) => (
              <HotelCard key={hotel.id} hotel={hotel} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Deals */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="mb-10 text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Deals</span>
            <h2 className={`font-display text-3xl sm:text-4xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Latest Deals & Offers
            </h2>
            <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Don&apos;t miss out on these amazing offers
            </p>
          </motion.div>

          {loadingFeatured ? (
            <SkeletonList count={3} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured?.filter(h => h.discount > 0).slice(0, 3).map((hotel, i) => (
                <HotelCard key={hotel.id} hotel={hotel} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features / Trust */}
      <section className={`py-16 lg:py-24 ${isDark ? 'bg-dark-card/50' : 'bg-gray-100/50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Best Price Guarantee', desc: 'We match any lower price' },
              { icon: Headphones, title: '24/7 Customer Support', desc: 'Always here to help' },
              { icon: CreditCard, title: 'Secure Payments', desc: '256-bit encrypted' },
              { icon: Star, title: 'Verified Reviews', desc: 'Real guest experiences' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-xl text-center ${
                  isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'
                } shadow-sm`}
              >
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon size={22} className="text-white" />
                </div>
                <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="mb-10 text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Testimonials</span>
            <h2 className={`font-display text-3xl sm:text-4xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              What Our Guests Say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-xl ${
                  isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'
                } shadow-sm`}
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={14} className={j < t.rating ? 'text-accent fill-accent' : 'text-gray-300'} />
                  ))}
                </div>
                <p className={`text-sm leading-relaxed mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">{t.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{t.name}</p>
                    <p className="text-xs text-gray-500">{t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={`py-16 lg:py-24 ${isDark ? 'bg-dark-card/50' : 'bg-gray-100/50'}`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="mb-10 text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">FAQ</span>
            <h2 className={`font-display text-3xl sm:text-4xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-xl overflow-hidden transition-all ${
                  isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                <div className={`overflow-hidden transition-all duration-200 ${
                  openFaq === i ? 'max-h-40 pb-4 px-4' : 'max-h-0'
                }`}>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{faq.a}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl gradient-primary p-8 sm:p-12 text-center"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
                Get Exclusive Deals
              </h2>
              <p className="text-white/80 mb-8">
                Subscribe to our newsletter and receive exclusive offers, travel tips, and insider access to the best hotel deals.
              </p>
              <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-4 py-3 rounded-lg text-sm outline-none text-gray-900"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-white text-primary font-semibold rounded-lg text-sm hover:bg-gray-100 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
