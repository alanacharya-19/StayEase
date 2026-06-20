import api from './api'
import { hotels as fallbackHotels } from '../data/hotels'
import { findHotelId, findCityId, getHotelsByCity, getHotelPrices } from './makcorpsApi'
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

function matchByName(mockHotel: Hotel, makcorpsHotels: MakcorpsCityHotel[]): MakcorpsCityHotel | undefined {
  const normalized = mockHotel.name.toLowerCase()
  return makcorpsHotels.find((mh) => normalized.includes(mh.name.toLowerCase()) || mh.name.toLowerCase().includes(normalized))
}

async function enrichWithMakcorpsPrices(hotelList: Hotel[], params: HotelQueryParams = {}): Promise<Hotel[]> {
  if (!import.meta.env.VITE_MAKCORPS_API_KEY || hotelList.length === 0) return hotelList
  const enriched = [...hotelList]
  try {
    const uniqueCities = [...new Set(enriched.map((h) => h.city))]
    const cityIds = await Promise.allSettled(uniqueCities.map(findCityId))
    const makcorpsParams: { checkin?: string; checkout?: string; rooms: number; adults: number } = {
      checkin: params.checkIn,
      checkout: params.checkOut,
      rooms: 1,
      adults: params.guests ? Number(params.guests) : 2,
    }
    const cityResults = await Promise.allSettled(
      cityIds.map((c) => {
        if (c.status !== 'fulfilled' || !c.value) return Promise.resolve([] as MakcorpsCityHotel[])
        return getHotelsByCity(c.value, makcorpsParams)
      })
    )
    const cityToMakcorps: Record<string, MakcorpsCityHotel[]> = {}
    uniqueCities.forEach((city, i) => {
      if (cityResults[i].status === 'fulfilled') {
        cityToMakcorps[city] = cityResults[i].value as MakcorpsCityHotel[]
      }
    })
    for (let i = 0; i < enriched.length; i++) {
      const makHotels = cityToMakcorps[enriched[i].city]
      if (makHotels && makHotels.length > 0) {
        const match = matchByName(enriched[i], makHotels)
        if (match && match.price > 0) {
          enriched[i] = { ...enriched[i], price: match.price, makcorpsPrice: match.price }
        }
      }
    }
  } catch {
    // fall back to mock prices
  }
  return enriched
}

async function tryApiHotels(fallback: () => Hotel[]): Promise<Hotel[]> {
  try {
    const { data } = await api.get('/hotels')
    return Array.isArray(data) ? data : (data.data ?? data.hotels ?? fallback())
  } catch {
    return fallback()
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
  if (params.city) { const city = params.city; result = result.filter((h) => h.city.toLowerCase() === city.toLowerCase()) }
  if (params.country) { const country = params.country; result = result.filter((h) => h.country.toLowerCase() === country.toLowerCase()) }
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
  if (!sort) return result
  switch (sort) {
    case 'price-asc': return result.sort((a, b) => a.price - b.price)
    case 'price-desc': return result.sort((a, b) => b.price - a.price)
    case 'rating-desc': return result.sort((a, b) => b.ratings.overall - a.ratings.overall)
    case 'popularity-desc': return result.sort((a, b) => b.reviewsCount - a.reviewsCount)
    default: return result
  }
}

export const hotelApi: HotelApi = {
  getAll: async (params: HotelQueryParams = {}): Promise<PaginatedResponse> => {
    await delay(200)
    const hotels = await tryApiHotels(() => fallbackHotels)
    let result = filterHotels(hotels, params)
    result = await enrichWithMakcorpsPrices(result, params)
    result = sortHotels(result, params.sort)
    return paginate(result, params)
  },

  getById: async (id: string | number): Promise<Hotel> => {
    await delay(200)
    try {
      const { data } = await api.get(`/hotels/${id}`)
      return data
    } catch {
      const hotel = fallbackHotels.find((h) => h.id === Number(id))
      if (!hotel) throw new Error('Hotel not found')
      let vendorPrices: VendorPrice[] = []
      try {
        const makId = await findHotelId(hotel.name)
        if (makId) {
          vendorPrices = await getHotelPrices(makId)
        }
      } catch {
        // fall back to mock
      }
      const similarHotels = fallbackHotels
        .filter((h) => h.id !== hotel.id && (h.city === hotel.city || h.country === hotel.country || h.stars === hotel.stars))
        .slice(0, 3)
      return { ...hotel, similarHotels, vendorPrices }
    }
  },

  getFeatured: async (): Promise<Hotel[]> => {
    await delay(200)
    const hotels = await tryApiHotels(() => fallbackHotels.filter((h) => h.featured))
    return enrichWithMakcorpsPrices(hotels)
  },

  getPopular: async (): Promise<Hotel[]> => {
    await delay(200)
    const hotels = await tryApiHotels(() => fallbackHotels.filter((h) => h.popular))
    return enrichWithMakcorpsPrices(hotels)
  },

  getLuxury: async (): Promise<Hotel[]> => {
    await delay(200)
    const hotels = await tryApiHotels(() => fallbackHotels.filter((h) => h.luxury))
    return enrichWithMakcorpsPrices(hotels)
  },

  getBudget: async (): Promise<Hotel[]> => {
    await delay(200)
    const hotels = await tryApiHotels(() => fallbackHotels.filter((h) => h.budget))
    return enrichWithMakcorpsPrices(hotels)
  },

  search: async (query: string): Promise<Hotel[]> => {
    await delay(150)
    try {
      const { data } = await api.get('/hotels/search', { params: { q: query } })
      return Array.isArray(data) ? data : (data.data ?? data.hotels ?? [])
    } catch {
      const q = query.toLowerCase()
      return fallbackHotels.filter(
        (h) => h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q) || h.country.toLowerCase().includes(q)
      ).slice(0, 5)
    }
  },
}
