import axios from 'axios'
import type { VendorPrice } from '../types'

const API_KEY: string | undefined = import.meta.env.VITE_MAKCORPS_API_KEY
const BASE_URL = 'https://api.makcorps.com'

const makcorps = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
})

interface MappingResult {
  type: string
  document_id: string
  title?: string
  scope?: string
}

interface MakcorpsHotel {
  hotelId: string
  name: string
  price: string
  vendor: string
  rating?: string
  count?: string
  telephone?: string
  geocode?: string
}

interface MakcorpsPriceEntry {
  vendor?: string
  price?: string
  tax?: string
}

interface MakcorpsRoomTypeResponse {
  hotelid?: string
  [key: string]: unknown
}

interface MakcorpsParams {
  checkin?: string
  checkout?: string
  rooms?: number
  adults?: number
}

const idCache: { hotels: Record<string, string>; cities: Record<string, string> } = { hotels: {}, cities: {} }

function defaultDates(): { checkin: string; checkout: string } {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const fmt = (d: Date): string => d.toISOString().split('T')[0]
  return { checkin: fmt(today), checkout: fmt(tomorrow) }
}

export async function mapping(query: string): Promise<MappingResult[]> {
  if (!API_KEY) return []
  try {
    const { data } = await makcorps.get('/mapping', {
      params: { api_key: API_KEY, name: query },
    })
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export async function findCityId(cityName: string): Promise<string | null> {
  if (!API_KEY) return null
  if (idCache.cities[cityName]) return idCache.cities[cityName]
  const results = await mapping(cityName)
  const geo = results.find((r: MappingResult) => r.type === 'GEO')
  if (geo) {
    idCache.cities[cityName] = geo.document_id
    return geo.document_id
  }
  return null
}

export async function findHotelId(hotelName: string): Promise<string | null> {
  if (!API_KEY) return null
  if (idCache.hotels[hotelName]) return idCache.hotels[hotelName]
  const results = await mapping(hotelName)
  const hotel = results.find((r: MappingResult) => r.type === 'HOTEL')
  if (hotel) {
    idCache.hotels[hotelName] = hotel.document_id
    return hotel.document_id
  }
  return null
}

export interface MakcorpsCityHotel {
  makcorpsId: string
  name: string
  price: number
  vendor: string
  rating: number | null
  reviewsCount: number | null
  telephone?: string
  geocode?: string
}

export async function getHotelsByCity(cityId: string, params: MakcorpsParams = {}): Promise<MakcorpsCityHotel[]> {
  if (!API_KEY) return []
  const { checkin, checkout } = defaultDates()
  try {
    const { data } = await makcorps.get('/city', {
      params: {
        api_key: API_KEY,
        cityid: cityId,
        pagination: 0,
        cur: 'USD',
        rooms: params.rooms || 1,
        adults: params.adults || 2,
        checkin: params.checkin || checkin,
        checkout: params.checkout || checkout,
      },
    })
    if (!data) return []
    const hotels: MakcorpsHotel[] = Array.isArray(data) ? data : [data]
    return hotels.map((h: MakcorpsHotel) => ({
      makcorpsId: h.hotelId,
      name: h.name,
      price: parseFloat(String(h.price).replace(/[^0-9.]/g, '')),
      vendor: h.vendor,
      rating: h.rating ? parseFloat(h.rating) : null,
      reviewsCount: h.count ? parseInt(h.count) : null,
      telephone: h.telephone,
      geocode: h.geocode,
    }))
  } catch {
    return []
  }
}

export async function getHotelPrices(hotelId: string, params: MakcorpsParams = {}): Promise<VendorPrice[]> {
  if (!API_KEY) return []
  const { checkin, checkout } = defaultDates()
  try {
    const { data } = await makcorps.get('/hotel', {
      params: {
        api_key: API_KEY,
        hotelid: hotelId,
        rooms: params.rooms || 1,
        adults: params.adults || 2,
        cur: 'USD',
        checkin: params.checkin || checkin,
        checkout: params.checkout || checkout,
      },
    })
    if (!data) return []
    const entries: MakcorpsPriceEntry[] = Array.isArray(data) ? data : [data]
    return entries.map((e: MakcorpsPriceEntry) => ({
      vendor: e.vendor || '',
      price: parseFloat(String(e.price || '0').replace(/[^0-9.]/g, '')),
      tax: parseFloat(String(e.tax || '0').replace(/[^0-9.]/g, '')),
    }))
  } catch {
    return []
  }
}

export async function getRoomTypes(hotelId: string, params: MakcorpsParams = {}): Promise<MakcorpsRoomTypeResponse[]> {
  if (!API_KEY) return []
  const { checkin, checkout } = defaultDates()
  try {
    const { data } = await makcorps.get('/roomtype', {
      params: {
        api_key: API_KEY,
        hotelid: hotelId,
        rooms: params.rooms || 1,
        adults: params.adults || 2,
        checkin: params.checkin || checkin,
        checkout: params.checkout || checkout,
      },
    })
    if (!data?.hotelid) return []
    return data
  } catch {
    return []
  }
}
