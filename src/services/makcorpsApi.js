import axios from 'axios'

const API_KEY = import.meta.env.VITE_MAKCORPS_API_KEY
const BASE_URL = 'https://api.makcorps.com'

const makcorps = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
})

// In-memory cache: maps hotel name -> Makcorps hotel ID, city name -> Makcorps city ID
const idCache = { hotels: {}, cities: {} }

function defaultDates() {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const fmt = (d) => d.toISOString().split('T')[0]
  return { checkin: fmt(today), checkout: fmt(tomorrow) }
}

export async function mapping(query) {
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

export async function findCityId(cityName) {
  if (!API_KEY) return null
  if (idCache.cities[cityName]) return idCache.cities[cityName]
  const results = await mapping(cityName)
  const geo = results.find((r) => r.type === 'GEO')
  if (geo) {
    idCache.cities[cityName] = geo.document_id
    return geo.document_id
  }
  return null
}

export async function findHotelId(hotelName) {
  if (!API_KEY) return null
  if (idCache.hotels[hotelName]) return idCache.hotels[hotelName]
  const results = await mapping(hotelName)
  const hotel = results.find((r) => r.type === 'HOTEL')
  if (hotel) {
    idCache.hotels[hotelName] = hotel.document_id
    return hotel.document_id
  }
  return null
}

export async function getHotelsByCity(cityId, params = {}) {
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
    const hotels = Array.isArray(data) ? data : [data]
    return hotels.map((h) => ({
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

export async function getHotelPrices(hotelId, params = {}) {
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
    const entries = Array.isArray(data) ? data : [data]
    return entries.map((e) => ({
      vendor: e.vendor,
      price: parseFloat(String(e.price || '0').replace(/[^0-9.]/g, '')),
      tax: parseFloat(String(e.tax || '0').replace(/[^0-9.]/g, '')),
    }))
  } catch {
    return []
  }
}

export async function getRoomTypes(hotelId, params = {}) {
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
