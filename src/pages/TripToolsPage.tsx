import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  MapPin, CloudSun, DollarSign, Calculator, Share2, Download, Calendar,
  Loader2, ChevronRight, Copy, Check, Trash2, Archive, Wifi, WifiOff,
  Sparkles, Hotel, Compass,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useThemeStore, useItineraryStore, type SavedItinerary } from '../store'
import { generateItinerary, getHotelRecommendations, getNearbyAttractions } from '../services/ai'
import { getWeather } from '../services/weatherApi'
import { convertCurrency, getSupportedCurrencies, getCurrencySymbol } from '../services/currencyApi'
import { generateId } from '../utils'

const cities = ['New York', 'Paris', 'Dubai', 'Tokyo', 'London', 'Bali', 'Rome', 'Barcelona', 'Singapore', 'Sydney']
const budgets = ['Budget ($50-100/night)', 'Moderate ($100-250/night)', 'Luxury ($250-500/night)', 'Premium ($500+/night)']

export default function TripToolsPage() {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'
  const navigate = useNavigate()
  const { savedItineraries, saveItinerary, removeItinerary, offlineMode, setOfflineMode } = useItineraryStore()

  const [activeTab, setActiveTab] = useState('itinerary')

  return (
    <div className="py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Tools</span>
          <h1 className={`font-display text-3xl sm:text-4xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Trip Planner Tools
          </h1>
          <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Plan your perfect trip with AI-powered tools
          </p>
        </motion.div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {[
            { id: 'itinerary', label: 'AI Itinerary', icon: Sparkles },
            { id: 'hotels', label: 'Hotel Picks', icon: Hotel },
            { id: 'attractions', label: 'Attractions', icon: Compass },
            { id: 'weather', label: 'Weather', icon: CloudSun },
            { id: 'currency', label: 'Currency', icon: DollarSign },
            { id: 'expenses', label: 'Expenses', icon: Calculator },
            { id: 'saved', label: 'Saved Trips', icon: Archive },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'gradient-primary text-white shadow-sm'
                  : isDark ? 'text-gray-300 hover:bg-dark-border' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setOfflineMode(!offlineMode)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all ${
                offlineMode
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {offlineMode ? <WifiOff size={15} /> : <Wifi size={15} />}
              {offlineMode ? 'Offline' : 'Online'}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'itinerary' && <ItineraryPlanner isDark={isDark} />}
        {activeTab === 'hotels' && <HotelPicks isDark={isDark} />}
        {activeTab === 'attractions' && <AttractionsPanel isDark={isDark} />}
        {activeTab === 'weather' && <WeatherPanel isDark={isDark} />}
        {activeTab === 'currency' && <CurrencyPanel isDark={isDark} />}
        {activeTab === 'expenses' && <ExpensePanel isDark={isDark} />}
        {activeTab === 'saved' && <SavedTrips isDark={isDark} savedItineraries={savedItineraries} onRemove={removeItinerary} />}
      </div>
    </div>
  )
}

function ItineraryPlanner({ isDark }: { isDark: boolean }) {
  const [destination, setDestination] = useState('')
  const [days, setDays] = useState(3)
  const [budget, setBudget] = useState(budgets[1])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const { saveItinerary } = useItineraryStore()
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!destination.trim()) return
    setLoading(true)
    setResult('')
    const itinerary = await generateItinerary(destination.trim(), days, budget)
    setResult(itinerary)
    setLoading(false)
  }

  const handleSave = () => {
    if (!result) return
    saveItinerary({
      id: generateId(),
      destination: destination.trim(),
      days,
      budget,
      content: result,
      createdAt: new Date().toISOString(),
    })
    toast.success('Itinerary saved!')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Copied!')
  }

  const handleShare = () => {
    const text = `Trip to ${destination} (${days} days, ${budget})\n\n${result}`
    if (navigator.share) {
      navigator.share({ title: `Trip to ${destination}`, text })
    } else {
      navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard — share it!')
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className={`lg:col-span-1 p-6 rounded-xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'} shadow-sm`}>
        <h3 className={`font-semibold text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Plan Your Trip</h3>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Destination</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Paris, Tokyo..."
              className={`w-full px-3 py-2.5 rounded-lg text-sm outline-none ${
                isDark ? 'bg-dark-border text-white placeholder-gray-500' : 'bg-gray-100 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Duration (days)</label>
            <input
              type="number"
              min={1}
              max={30}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className={`w-full px-3 py-2.5 rounded-lg text-sm outline-none ${
                isDark ? 'bg-dark-border text-white' : 'bg-gray-100 text-gray-900'
              }`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Budget</label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className={`w-full px-3 py-2.5 rounded-lg text-sm outline-none ${
                isDark ? 'bg-dark-border text-white' : 'bg-gray-100 text-gray-900'
              }`}
            >
              {budgets.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !destination.trim()}
            className="w-full py-2.5 gradient-primary text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {loading ? 'Generating...' : 'Generate Itinerary'}
          </button>
        </div>
      </div>

      <div className={`lg:col-span-2 p-6 rounded-xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'} shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {result ? `Your ${destination} Trip` : 'Your Itinerary'}
          </h3>
          {result && (
            <div className="flex items-center gap-2">
              <button onClick={handleCopy} className={`p-2 rounded-lg text-sm ${isDark ? 'hover:bg-dark-border text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
              <button onClick={handleSave} className={`p-2 rounded-lg text-sm ${isDark ? 'hover:bg-dark-border text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <Download size={16} />
              </button>
              <button onClick={handleShare} className={`p-2 rounded-lg text-sm ${isDark ? 'hover:bg-dark-border text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <Share2 size={16} />
              </button>
            </div>
          )}
        </div>
        {result ? (
          <div className={`text-sm leading-relaxed whitespace-pre-line ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {result}
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        ) : (
          <div className={`text-sm py-12 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Enter a destination and generate your AI itinerary
          </div>
        )}
      </div>
    </motion.div>
  )
}

function HotelPicks({ isDark }: { isDark: boolean }) {
  const [destination, setDestination] = useState('')
  const [budget, setBudget] = useState(budgets[1])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  const handleGenerate = async () => {
    if (!destination.trim()) return
    setLoading(true)
    setResult('')
    const recs = await getHotelRecommendations(destination.trim(), budget)
    setResult(recs)
    setLoading(false)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-6 rounded-xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'} shadow-sm`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <h3 className={`font-semibold text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Hotel Recommendations</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Destination"
              className={`w-full px-3 py-2.5 rounded-lg text-sm outline-none ${
                isDark ? 'bg-dark-border text-white placeholder-gray-500' : 'bg-gray-100 text-gray-900 placeholder-gray-400'
              }`}
            />
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className={`w-full px-3 py-2.5 rounded-lg text-sm outline-none ${
                isDark ? 'bg-dark-border text-white' : 'bg-gray-100 text-gray-900'
              }`}
            >
              {budgets.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
            <button
              onClick={handleGenerate}
              disabled={loading || !destination.trim()}
              className="w-full py-2.5 gradient-primary text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Hotel size={16} />}
              {loading ? 'Thinking...' : 'Get Recommendations'}
            </button>
          </div>
        </div>
        <div className="lg:col-span-2">
          {result ? (
            <div className={`text-sm leading-relaxed whitespace-pre-line ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{result}</div>
          ) : loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 size={24} className="animate-spin text-primary" /></div>
          ) : (
            <div className={`text-sm py-12 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Pick a destination to get AI hotel recommendations based on your budget</div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function AttractionsPanel({ isDark }: { isDark: boolean }) {
  const [destination, setDestination] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  const handleGenerate = async () => {
    if (!destination.trim()) return
    setLoading(true)
    setResult('')
    const attractions = await getNearbyAttractions(destination.trim())
    setResult(attractions)
    setLoading(false)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-6 rounded-xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'} shadow-sm`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <h3 className={`font-semibold text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Nearby Attractions</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="City name"
              className={`w-full px-3 py-2.5 rounded-lg text-sm outline-none ${
                isDark ? 'bg-dark-border text-white placeholder-gray-500' : 'bg-gray-100 text-gray-900 placeholder-gray-400'
              }`}
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !destination.trim()}
              className="w-full py-2.5 gradient-primary text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Compass size={16} />}
              {loading ? 'Searching...' : 'Find Attractions'}
            </button>
          </div>
        </div>
        <div className="lg:col-span-2">
          {result ? (
            <div className={`text-sm leading-relaxed whitespace-pre-line ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{result}</div>
          ) : loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 size={24} className="animate-spin text-primary" /></div>
          ) : (
            <div className={`text-sm py-12 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Discover top attractions for any city</div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function WeatherPanel({ isDark }: { isDark: boolean }) {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState<Awaited<ReturnType<typeof getWeather>> | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!city.trim()) return
    setLoading(true)
    const data = await getWeather(city.trim())
    setWeather(data)
    setLoading(false)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-6 rounded-xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'} shadow-sm`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <h3 className={`font-semibold text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Weather Forecast</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className={`w-full px-3 py-2.5 rounded-lg text-sm outline-none ${
                isDark ? 'bg-dark-border text-white placeholder-gray-500' : 'bg-gray-100 text-gray-900 placeholder-gray-400'
              }`}
            />
            <button
              onClick={handleSearch}
              disabled={loading || !city.trim()}
              className="w-full py-2.5 gradient-primary text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <CloudSun size={16} />}
              {loading ? 'Loading...' : 'Get Weather'}
            </button>
          </div>
        </div>
        <div className="lg:col-span-2">
          {weather ? (
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl">{weather.icon}</span>
                <div>
                  <p className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{weather.temp}°C</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{weather.condition} • {weather.city}, {weather.country}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: 'Feels Like', value: `${weather.feelsLike}°C` },
                  { label: 'Humidity', value: `${weather.humidity}%` },
                  { label: 'Wind', value: `${weather.wind} km/h` },
                ].map((item) => (
                  <div key={item.label} className={`p-3 rounded-lg ${isDark ? 'bg-dark-border' : 'bg-gray-100'}`}>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-5 gap-2">
                {weather.forecast.map((day) => (
                  <div key={day.day} className={`p-2 rounded-lg text-center ${isDark ? 'bg-dark-border' : 'bg-gray-100'}`}>
                    <p className="text-xs text-gray-500">{day.day}</p>
                    <span className="text-lg">{day.icon}</span>
                    <p className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{day.temp}°</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={`text-sm py-12 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Check weather for your destination</div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function CurrencyPanel({ isDark }: { isDark: boolean }) {
  const currencies = getSupportedCurrencies()
  const [amount, setAmount] = useState('100')
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('INR')
  const result = amount ? convertCurrency(Number(amount), from, to) : 0

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-6 rounded-xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'} shadow-sm`}>
      <h3 className={`font-semibold text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Currency Converter</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`w-full px-3 py-2.5 rounded-lg text-sm outline-none ${
              isDark ? 'bg-dark-border text-white' : 'bg-gray-100 text-gray-900'
            }`}
          />
        </div>
        <div>
          <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>From</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)}
            className={`w-full px-3 py-2.5 rounded-lg text-sm outline-none ${isDark ? 'bg-dark-border text-white' : 'bg-gray-100 text-gray-900'}`}>
            {currencies.map((c) => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
          </select>
        </div>
        <div>
          <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>To</label>
          <select value={to} onChange={(e) => setTo(e.target.value)}
            className={`w-full px-3 py-2.5 rounded-lg text-sm outline-none ${isDark ? 'bg-dark-border text-white' : 'bg-gray-100 text-gray-900'}`}>
            {currencies.map((c) => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <div className={`w-full px-3 py-2.5 rounded-lg text-sm font-semibold ${isDark ? 'bg-primary/10 text-primary' : 'bg-primary/5 text-primary'}`}>
            {getCurrencySymbol(to)}{result.toLocaleString()}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {currencies.filter((c) => c.code !== from).slice(0, 10).map((c) => (
          <button
            key={c.code}
            onClick={() => setTo(c.code)}
            className={`p-2 rounded-lg text-center text-xs transition-all ${
              to === c.code
                ? 'gradient-primary text-white'
                : isDark ? 'bg-dark-border text-gray-300 hover:bg-dark-border/80' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span className="font-semibold">{c.code}</span>
            <p className="opacity-80">{getCurrencySymbol(c)}{convertCurrency(Number(amount || 1), from, c.code).toLocaleString()}</p>
          </button>
        ))}
      </div>
    </motion.div>
  )
}

function ExpensePanel({ isDark }: { isDark: boolean }) {
  const categories = [
    { name: 'Hotel', icon: '🏨', default: 500 },
    { name: 'Flights', icon: '✈️', default: 300 },
    { name: 'Food', icon: '🍽️', default: 200 },
    { name: 'Activities', icon: '🎯', default: 150 },
    { name: 'Transport', icon: '🚕', default: 100 },
    { name: 'Shopping', icon: '🛍️', default: 100 },
    { name: 'Misc', icon: '📦', default: 50 },
  ]

  const [expenses, setExpenses] = useState(categories.map((c) => c.default))
  const currency = 'USD'

  const total = expenses.reduce((a, b) => a + b, 0)
  const buffer = Math.round(total * 0.15)
  const estimated = total + buffer

  const updateExpense = (idx: number, val: number) => {
    const next = [...expenses]
    next[idx] = val
    setExpenses(next)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-6 rounded-xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'} shadow-sm`}>
      <h3 className={`font-semibold text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Expense Estimator</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          {categories.map((cat, i) => (
            <div key={cat.name} className="flex items-center gap-3">
              <span className="text-lg">{cat.icon}</span>
              <span className={`text-sm w-20 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{cat.name}</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">$</span>
                <input
                  type="number"
                  min={0}
                  value={expenses[i]}
                  onChange={(e) => updateExpense(i, Math.max(0, Number(e.target.value)))}
                  className={`w-full pl-7 pr-3 py-2 rounded-lg text-sm outline-none ${
                    isDark ? 'bg-dark-border text-white' : 'bg-gray-100 text-gray-900'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
        <div className={`p-6 rounded-xl ${isDark ? 'bg-dark-border' : 'bg-gray-100'}`}>
          <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Estimated Total</h4>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Base Cost</span>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>${total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Buffer (15%)</span>
              <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>+${buffer.toLocaleString()}</span>
            </div>
            <div className={`border-t pt-3 flex justify-between font-semibold ${isDark ? 'border-dark-border' : 'border-gray-200'}`}>
              <span className={isDark ? 'text-white' : 'text-gray-900'}>Estimated Total</span>
              <span className="text-primary">${estimated.toLocaleString()}</span>
            </div>
          </div>
          <p className={`text-xs mt-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Add a 15% buffer for unexpected expenses
          </p>
        </div>
      </div>
    </motion.div>
  )
}

function SavedTrips({ isDark, savedItineraries, onRemove }: { isDark: boolean; savedItineraries: SavedItinerary[]; onRemove: (id: string) => void }) {
  const [copiedId, setCopiedId] = useState('')

  const handleCopy = (it: SavedItinerary) => {
    const text = `Trip to ${it.destination} (${it.days} days)\n\n${it.content}`
    navigator.clipboard.writeText(text)
    setCopiedId(it.id)
    setTimeout(() => setCopiedId(''), 2000)
    toast.success('Copied!')
  }

  const handleShare = (it: SavedItinerary) => {
    const text = `Trip to ${it.destination} (${it.days} days)\n\n${it.content}`
    if (navigator.share) {
      navigator.share({ title: `Trip to ${it.destination}`, text })
    } else {
      navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard — share it!')
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-6 rounded-xl ${isDark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'} shadow-sm`}>
      <h3 className={`font-semibold text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Saved Trips</h3>
      {savedItineraries.length === 0 ? (
        <div className={`text-sm py-12 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          No saved trips yet. Generate and save an itinerary!
        </div>
      ) : (
        <div className="space-y-3">
          {savedItineraries.map((it) => (
            <div key={it.id} className={`p-4 rounded-lg ${isDark ? 'bg-dark-border' : 'bg-gray-100'}`}>
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h4 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{it.destination}</h4>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{it.days} days • {it.budget}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleCopy(it)} className={`p-1.5 rounded ${isDark ? 'hover:bg-dark-card text-gray-400' : 'hover:bg-white text-gray-500'}`}>
                    {copiedId === it.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  </button>
                  <button onClick={() => handleShare(it)} className={`p-1.5 rounded ${isDark ? 'hover:bg-dark-card text-gray-400' : 'hover:bg-white text-gray-500'}`}>
                    <Share2 size={14} />
                  </button>
                  <button onClick={() => onRemove(it.id)} className={`p-1.5 rounded ${isDark ? 'hover:bg-dark-card text-red-400' : 'hover:bg-white text-red-500'}`}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className={`text-xs leading-relaxed line-clamp-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{it.content}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
