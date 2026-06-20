import api from './api'

let bookingCounter = 1000

export const bookingApi = {
  create: async (bookingData) => {
    await new Promise((r) => setTimeout(r, 500))
    bookingCounter++
    return {
      ...bookingData,
      id: 'BK' + bookingCounter,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    }
  },
  getAll: async () => {
    await new Promise((r) => setTimeout(r, 300))
    return []
  },
  getById: async (id) => {
    await new Promise((r) => setTimeout(r, 200))
    return null
  },
}
