import type { Booking } from '../types'

let bookingCounter = 1000

export const bookingApi = {
  create: async (bookingData: Omit<Booking, 'id' | 'status' | 'createdAt'>): Promise<Booking> => {
    await new Promise((r) => setTimeout(r, 500))
    bookingCounter++
    return {
      ...bookingData,
      id: 'BK' + bookingCounter,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    }
  },
  getAll: async (): Promise<Booking[]> => {
    await new Promise((r) => setTimeout(r, 300))
    return []
  },
  getById: async (id: string): Promise<Booking | null> => {
    await new Promise((r) => setTimeout(r, 200))
    return null
  },
}
