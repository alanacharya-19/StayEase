import api from './api'
import { hotels as fallbackHotels } from '../data/hotels'
import { findCityId, getHotelsByCity, getHotelPrices, findHotelId } from './makcorpsApi'
import type { Hotel, HotelQueryParams, PaginatedResponse, VendorPrice } from '../types'
import type { MakcorpsCityHotel } from './makcorpsApi'

type HotelApi = {
  getAll: (params?: HotelQueryParams) => Promise<PaginatedResponse>
  getById: (id: string | number) => Promise<Hotel>
  getFeatured: () => Promise<Hotel[]>
  getPopular: () => Promise<Hotel[]>
  getLuxury: () => Promise<Hotel[]>
  getBudget: () => Promise<Hotel[]>
  search: (query: string) => Promise<Hotel[]>
}

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

const CITIES: Array<{ name: string; country: string }> = [
  { name: 'New York', country: 'USA' },
  { name: 'Paris', country: 'France' },
  { name: 'Dubai', country: 'UAE' },
  { name: 'Tokyo', country: 'Japan' },
  { name: 'London', country: 'UK' },
  { name: 'Bali', country: 'Indonesia' },
  { name: 'Rome', country: 'Italy' },
  { name: 'Barcelona', country: 'Spain' },
  { name: 'Singapore', country: 'Singapore' },
  { name: 'Sydney', country: 'Australia' },
]

const CITY_IMAGES: Record<string, string[]> = {
  'New York': [
    'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
  ],
  'Paris': [
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=800',
  ],
  'Dubai': [
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
  ],
  'Tokyo': [
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
  ],
  'London': [
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
  ],
  'Bali': [
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
  ],
  'Rome': [
    'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
    'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800',
  ],
  'Barcelona': [
    'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
  ],
  'Singapore': [
    'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
  ],
  'Sydney': [
    'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
  ],
}

const STAR_AMENITIES: Record<number, string[]> = {
  5: ['Free WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Room Service', 'Parking', 'Concierge', 'Laundry', 'Business Center', 'Kids Club'],
  4: ['Free WiFi', 'Pool', 'Gym', 'Restaurant', 'Bar', 'Room Service', 'Parking', 'Laundry', 'Business Center'],
  3: ['Free WiFi', 'Restaurant', 'Bar', 'Room Service', 'Parking', 'Laundry'],
  2: ['Free WiFi', 'Restaurant', 'Laundry'],
}

function generateHotel(m: MakcorpsCityHotel, city: string, country: string, idx: number): Hotel {
  const id = idx + 1
  const stars = m.rating ? Math.min(5, Math.max(1, Math.round(m.rating / 2))) : 4
  const images = CITY_IMAGES[city] || CITY_IMAGES['New York']
  return {
    id,
    name: m.name,
    description: `Experience ${m.name} in the heart of ${city}. Book your stay with StayEase for the best rates and exceptional service.`,
    longDescription: `Welcome to ${m.name}, a premier hotel located in beautiful ${city}, ${country}. Our dedicated team ensures a memorable stay with top-notch hospitality and comfort.`,
    city,
    country,
    images,
    ratings: {
      overall: m.rating || 4.0,
      cleanliness: (m.rating || 4.0) - 0.1,
      location: (m.rating || 4.0) + 0.2,
      service: (m.rating || 4.0) - 0.05,
      value: (m.rating || 4.0) - 0.2,
    },
    reviewsCount: m.reviewsCount || Math.floor(Math.random() * 500) + 50,
    stars,
    price: m.price,
    currency: 'USD',
    amenities: STAR_AMENITIES[stars as keyof typeof STAR_AMENITIES] || STAR_AMENITIES[3],
    policies: {
      checkIn: '2:00 PM',
      checkOut: '11:00 AM',
      cancellation: 'Free cancellation up to 48 hours before check-in',
      children: 'Children welcome',
      pets: 'Pets allowed with prior notice',
    },
    location: {
      lat: 0,
      lng: 0,
      address: `${city}, ${country}`,
    },
    rooms: [
      { id: 1, type: 'Standard Room', bed: 'Queen', capacity: 2, price: m.price, images, facilities: ['WiFi', 'TV', 'Air Conditioning'], available: true, cancellationPolicy: 'Free cancellation 24h before' },
      { id: 2, type: 'Deluxe Room', bed: 'King', capacity: 3, price: Math.round(m.price * 1.4), images, facilities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar'], available: true, cancellationPolicy: 'Free cancellation 48h before' },
      { id: 3, type: 'Suite', bed: 'King', capacity: 4, price: Math.round(m.price * 2), images, facilities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Living Area'], available: true, cancellationPolicy: 'Free cancellation 72h before' },
    ],
    reviews: [],
    popular: m.rating !== null && m.rating >= 4.0,
    featured: m.rating !== null && m.rating >= 4.5,
    luxury: stars >= 5,
    budget: stars <= 2,
    discount: Math.random() > 0.7 ? Math.floor(Math.random() * 20) + 5 : 0,
    makcorpsPrice: m.price,
  }
}

function paginate(result: Hotel[], params: HotelQueryParams): PaginatedResponse {
  const page = Number(params.page) || 1
  const limit = Number(params.limit) || 6
  const total = result.length
  const paginated = result.slice((page - 1) * limit, page * limit)
  return { data: paginated, total, page, totalPages: Math.ceil(total / limit) }
}

function filterHotels(hotels: Hotel[], params: HotelQueryParams): Hotel[] {
  let result = [...hotels]
  if (params.search) {
    const q = params.search.toLowerCase()
    result = result.filter((h) => h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q) || h.country.toLowerCase().includes(q))
  }
  if (params.city) result = result.filter((h) => h.city.toLowerCase() === params.city!.toLowerCase())
  if (params.country) result = result.filter((h) => h.country.toLowerCase() === params.country!.toLowerCase())
  if (params.priceMin) result = result.filter((h) => h.price >= Number(params.priceMin))
  if (params.priceMax) result = result.filter((h) => h.price <= Number(params.priceMax))
  if (params.stars) result = result.filter((h) => h.stars >= Number(params.stars))
  if (params.amenities) {
    const selected = Array.isArray(params.amenities) ? params.amenities : [params.amenities]
    result = result.filter((h) => selected.every((a) => h.amenities.includes(a)))
  }
  return result
}

function sortHotels(result: Hotel[], sort?: string): Hotel[] {
  if (!sort || sort === 'popularity-desc') return result
  const sorted = [...result]
  switch (sort) {
    case 'price-asc': sorted.sort((a, b) => a.price - b.price); break
    case 'price-desc': sorted.sort((a, b) => b.price - a.price); break
    case 'rating-desc': sorted.sort((a, b) => b.ratings.overall - a.ratings.overall); break
  }
  return sorted
}

async function fetchMakcorpsHotels(): Promise<Hotel[]> {
  if (!import.meta.env.VITE_MAKCORPS_API_KEY) return []
  const all: Hotel[] = []
  let idCounter = 0
  for (const c of CITIES) {
    try {
      const cityId = await findCityId(c.name)
      if (!cityId) continue
      const hotels = await getHotelsByCity(cityId)
      for (const h of hotels) {
        if (h.price > 0) {
          all.push(generateHotel(h, c.name, c.country, idCounter))
          idCounter++
        }
      }
    } catch {
      // skip this city
    }
  }
  return all
}

async function getPrimaryHotels(): Promise<Hotel[]> {
  // 1) Try real backend API
  try {
    const { data } = await api.get('/hotels')
    const list = Array.isArray(data) ? data : (data.data ?? data.hotels ?? null)
    if (list && list.length >= 5) return list
  } catch {
    // fall through
  }
  // 2) Try Makcorps API
  const makcorps = await fetchMakcorpsHotels()
  if (makcorps.length >= 5) return makcorps
  // 3) Fall back to static data
  return fallbackHotels
}

let cachedHotels: Hotel[] | null = null
let cachePromise: Promise<Hotel[]> | null = null

async function getCachedHotels(): Promise<Hotel[]> {
  if (cachedHotels) return cachedHotels
  if (cachePromise) return cachePromise
  cachePromise = getPrimaryHotels().then((h) => {
    cachedHotels = h
    cachePromise = null
    return h
  })
  return cachePromise
}

export const hotelApi: HotelApi = {
  getAll: async (params: HotelQueryParams = {}): Promise<PaginatedResponse> => {
    await delay(200)
    const hotels = await getCachedHotels()
    let result = sortHotels(filterHotels(hotels, params), params.sort)
    return paginate(result, params)
  },

  getById: async (id: string | number): Promise<Hotel> => {
    await delay(200)
    // Try real API first
    try {
      const { data } = await api.get(`/hotels/${id}`)
      if (data) return data
    } catch {
      // fall through
    }
    const hotels = await getCachedHotels()
    const hotel = hotels.find((h) => h.id === Number(id))
    if (!hotel) throw new Error('Hotel not found')
    let vendorPrices: VendorPrice[] = []
    try {
      const makId = await findHotelId(hotel.name)
      if (makId) vendorPrices = await getHotelPrices(makId)
    } catch {
      // ignore
    }
    const similarHotels = hotels
      .filter((h) => h.id !== hotel.id && (h.city === hotel.city || h.country === hotel.country || h.stars === hotel.stars))
      .slice(0, 3)
    return { ...hotel, similarHotels, vendorPrices }
  },

  getFeatured: async (): Promise<Hotel[]> => {
    await delay(200)
    const hotels = await getCachedHotels()
    return hotels.filter((h) => h.featured)
  },

  getPopular: async (): Promise<Hotel[]> => {
    await delay(200)
    const hotels = await getCachedHotels()
    return hotels.filter((h) => h.popular)
  },

  getLuxury: async (): Promise<Hotel[]> => {
    await delay(200)
    const hotels = await getCachedHotels()
    return hotels.filter((h) => h.luxury)
  },

  getBudget: async (): Promise<Hotel[]> => {
    await delay(200)
    const hotels = await getCachedHotels()
    return hotels.filter((h) => h.budget)
  },

  search: async (query: string): Promise<Hotel[]> => {
    await delay(150)
    try {
      const { data } = await api.get('/hotels/search', { params: { q: query } })
      const list = Array.isArray(data) ? data : (data.data ?? data.hotels ?? null)
      if (list) return list.slice(0, 5)
    } catch {
      // fall through
    }
    const hotels = await getCachedHotels()
    const q = query.toLowerCase()
    return hotels.filter(
      (h) => h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q) || h.country.toLowerCase().includes(q)
    ).slice(0, 5)
  },
}
