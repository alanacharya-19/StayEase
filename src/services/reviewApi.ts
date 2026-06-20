import api from './api'

export const reviewApi = {
  getByHotel: async (hotelId) => {
    await new Promise((r) => setTimeout(r, 200))
    return []
  },
  create: async (data) => {
    await new Promise((r) => setTimeout(r, 300))
    return { id: Date.now(), ...data, date: new Date().toISOString() }
  },
}
