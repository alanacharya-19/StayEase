import api from './api'

export const reviewApi = {
  getByHotel: async (hotelId: number): Promise<Record<string, unknown>[]> => {
    try {
      const { data } = await api.get(`/reviews/${hotelId}`)
      return Array.isArray(data) ? data : []
    } catch {
      await new Promise((r) => setTimeout(r, 200))
      return []
    }
  },
  create: async (data: Record<string, unknown>): Promise<Record<string, unknown>> => {
    try {
      const { data: res } = await api.post('/reviews', data)
      return res
    } catch {
      await new Promise((r) => setTimeout(r, 300))
      return { id: Date.now(), ...data, date: new Date().toISOString() }
    }
  },
}
