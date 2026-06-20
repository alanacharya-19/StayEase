import { motion } from 'framer-motion'
import { useThemeStore } from '../store'
import { teamMembers } from '../data/content'
import { Breadcrumb } from '../components/ui'
import { Target, Eye, Heart } from 'lucide-react'

export default function AboutPage() {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  return (
    <div className="py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ to: '/', label: 'Home' }, { label: 'About' }]} />

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">About Us</span>
          <h1 className={`font-display text-4xl sm:text-5xl font-bold mt-2 mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Your Journey, <span className="text-gradient">Simplified</span>
          </h1>
          <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            StayEase is a premium hotel booking platform dedicated to making travel accessible, 
            enjoyable, and stress-free. We connect travelers with the perfect accommodations worldwide.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {[
            { icon: Target, title: 'Our Mission', desc: 'To revolutionize the way people book hotels by providing a seamless, transparent, and delightful experience that makes every journey memorable.' },
            { icon: Eye, title: 'Our Vision', desc: 'To become the world most trusted travel companion, empowering millions of travelers to explore the world with confidence and ease.' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-8 rounded-2xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'} shadow-sm`}
            >
              <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center mb-4">
                <item.icon size={28} className="text-white" />
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
              <p className={`leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {[
            { value: '50K+', label: 'Hotels' },
            { value: '100K+', label: 'Happy Guests' },
            { value: '200+', label: 'Destinations' },
            { value: '4.8', label: 'Average Rating' },
          ].map((stat, i) => (
            <div key={i} className={`text-center p-6 rounded-xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'}`}>
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Team */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className={`font-display text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Meet Our Team</h2>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Passionate people behind StayEase</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-xl text-center ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'} shadow-sm hover:-translate-y-1 transition-all duration-300`}
              >
                <img src={member.image} alt={member.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-4" loading="lazy" />
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{member.name}</h3>
                <p className="text-sm text-primary font-medium mb-2">{member.role}</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`p-8 rounded-2xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'} shadow-sm text-center`}
        >
          <Heart size={40} className="text-primary mx-auto mb-4" />
          <h2 className={`font-display text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { title: 'Trust', desc: 'We prioritize transparency and honesty in every interaction.' },
              { title: 'Innovation', desc: 'We continuously evolve to serve you better.' },
              { title: 'Hospitality', desc: 'Every traveler deserves a warm welcome.' },
            ].map((v, i) => (
              <div key={i}>
                <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{v.title}</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{v.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
