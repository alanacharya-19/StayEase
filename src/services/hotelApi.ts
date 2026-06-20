import api from './api'
import { hotels } from '../data/hotels'
import { findHotelId, findCityId, getHotelsByCity, getHotelPrices } from './makcorpsApi'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function matchByName(mockHotel, makcorpsHotels) {
  const normalized = mockHotel.name.toLowerCase()
  return makcorpsHotels.find((mh) => normalized.includes(mh.name.toLowerCase()) || mh.name.toLowerCase().includes(normalized))
}

async function enrichWithMakcorpsPrices(hotelList, params = {}) {
  if (!import.meta.env.VITE_MAKCORPS_API_KEY || hotelList.length === 0) return hotelList
  const enriched = [...hotelList]
  try {
    const uniqueCities = [...new Set(enriched.map((h) => h.city))]
    const cityIds = await Promise.allSettled(uniqueCities.map(findCityId))
    const makcorpsParams = {
      checkin: params.checkIn || params.checkin,
      checkout: params.checkOut || params.checkout,
      rooms: params.rooms || 1,
      adults: params.adults || params.guests || 2,
    }
    const cityResults = await Promise.allSettled(
      cityIds.map((c, i) => {
        if (c.status !== 'fulfilled' || !c.value) return Promise.resolve([])
        return getHotelsByCity(c.value, makcorpsParams)
      })
    )
    const cityToMakcorps = {}
    uniqueCities.forEach((city, i) => {
      if (cityResults[i].status === 'fulfilled') {
        cityToMakcorps[city] = cityResults[i].value
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

export const hotelApi = {
  getAll: async (params = {}) => {
    await delay(300)
    let result = [...hotels]
    if (params.search) {
      const q = params.search.toLowerCase()
      result = result.filter((h) => h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q) || h.country.toLowerCase().includes(q))
    }
    if (params.city) result = result.filter((h) => h.city.toLowerCase() === params.city.toLowerCase())
    if (params.country) result = result.filter((h) => h.country.toLowerCase() === params.country.toLowerCase())
    if (params.priceMin) result = result.filter((h) => h.price >= Number(params.priceMin))
    if (params.priceMax) result = result.filter((h) => h.price <= Number(params.priceMax))
    if (params.stars) result = result.filter((h) => h.stars >= Number(params.stars))
    if (params.amenities) {
      const selected = Array.isArray(params.amenities) ? params.amenities : [params.amenities]
      result = result.filter((h) => selected.every((a) => h.amenities.includes(a)))
    }
    // Apply Makcorps prices before sorting
    result = await enrichWithMakcorpsPrices(result, params)
    if (params.sort) {
      switch (params.sort) {
        case 'price-asc': result.sort((a, b) => a.price - b.price); break
        case 'price-desc': result.sort((a, b) => b.price - a.price); break
        case 'rating-desc': result.sort((a, b) => b.ratings.overall - a.ratings.overall); break
        case 'popularity-desc': result.sort((a, b) => b.reviewsCount - a.reviewsCount); break
      }
    }
    const page = Number(params.page) || 1
    const limit = Number(params.limit) || 6
    const total = result.length
    const paginated = result.slice((page - 1) * limit, page * limit)
    return { data: paginated, total, page, totalPages: Math.ceil(total / limit) }
  },

  getById: async (id) => {
    await delay(200)
    const hotel = hotels.find((h) => h.id === Number(id))
    if (!hotel) throw new Error('Hotel not found')
    // Try to fetch Makcorps vendor prices
    let vendorPrices = []
    try {
      const makId = await findHotelId(hotel.name)
      if (makId) {
        vendorPrices = await getHotelPrices(makId)
      }
    } catch {
      // fall back to mock
    }
    const similarHotels = hotels
      .filter((h) => h.id !== hotel.id && (h.city === hotel.city || h.country === hotel.country || h.stars === hotel.stars))
      .slice(0, 3)
    return { ...hotel, similarHotels, vendorPrices }
  },

  getFeatured: async () => {
    await delay(200)
    const featured = hotels.filter((h) => h.featured)
    return enrichWithMakcorpsPrices(featured)
  },

  getPopular: async () => {
    await delay(200)
    const popular = hotels.filter((h) => h.popular)
    return enrichWithMakcorpsPrices(popular)
  },

  getLuxury: async () => {
    await delay(200)
    const luxury = hotels.filter((h) => h.luxury)
    return enrichWithMakcorpsPrices(luxury)
  },

  getBudget: async () => {
    await delay(200)
    const budget = hotels.filter((h) => h.budget)
    return enrichWithMakcorpsPrices(budget)
  },

  search: async (query) => {
    await delay(150)
    const q = query.toLowerCase()
    return hotels.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.country.toLowerCase().includes(q)
    ).slice(0, 5)
  },
}
