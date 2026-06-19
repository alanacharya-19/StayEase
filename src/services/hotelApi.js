import api from './api'
import { hotels } from '../data/hotels'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

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
    return hotel
  },

  getFeatured: async () => {
    await delay(200)
    return hotels.filter((h) => h.featured)
  },

  getPopular: async () => {
    await delay(200)
    return hotels.filter((h) => h.popular)
  },

  getLuxury: async () => {
    await delay(200)
    return hotels.filter((h) => h.luxury)
  },

  getBudget: async () => {
    await delay(200)
    return hotels.filter((h) => h.budget)
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
