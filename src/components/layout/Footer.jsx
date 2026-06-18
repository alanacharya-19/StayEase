import { Link } from 'react-router-dom'
import { useThemeStore } from '../../store'
import { Mail, Phone, MapPin, Globe, Camera, MessageCircle, Video, ChevronRight } from 'lucide-react'

const footerLinks = {
  company: [
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
    { to: '/hotels', label: 'Hotels' },
    { to: '/about', label: 'Our Team' },
  ],
  support: [
    { to: '/contact', label: 'Help Center' },
    { to: '/contact', label: 'Cancellation Options' },
    { to: '/contact', label: 'Privacy Policy' },
    { to: '/contact', label: 'Terms of Service' },
  ],
  discover: [
    { to: '/hotels', label: 'Luxury Hotels' },
    { to: '/hotels', label: 'Budget Stays' },
    { to: '/hotels', label: 'Popular Destinations' },
    { to: '/hotels', label: 'Latest Deals' },
  ],
}

export default function Footer() {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  return (
    <footer className={`${isDark ? 'bg-dark-card' : 'bg-gray-900 text-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-display text-xl font-bold">StayEase</span>
            </div>
            <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>
              Premium hotel booking platform offering the best deals on luxury and budget accommodations worldwide.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <MapPin size={16} />
                <span>123 Travel Street, New York, NY 10001</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Mail size={16} />
                <span>support@stayease.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Phone size={16} />
                <span>+1 (800) STAY-EASE</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                    <ChevronRight size={12} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                    <ChevronRight size={12} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Discover</h3>
            <ul className="space-y-3">
              {footerLinks.discover.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                    <ChevronRight size={12} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={`mt-12 pt-8 border-t ${isDark ? 'border-dark-border' : 'border-gray-800'}`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} StayEase. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                <Globe size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                <MessageCircle size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                <Camera size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                <Video size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
