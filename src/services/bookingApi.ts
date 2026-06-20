import api from './api'
import type { Booking } from '../types'

let bookingCounter = 1000

function mockBooking(bookingData: Omit<Booking, 'id' | 'status' | 'createdAt'>): Booking {
  bookingCounter++
  return {
    ...bookingData,
    id: 'BK' + bookingCounter,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  }
}

export const bookingApi = {
  create: async (bookingData: Omit<Booking, 'id' | 'status' | 'createdAt'>): Promise<Booking> => {
    try {
      const { data } = await api.post('/bookings', bookingData)
      return data
    } catch {
      await new Promise((r) => setTimeout(r, 500))
      return mockBooking(bookingData)
    }
  },
  getAll: async (): Promise<Booking[]> => {
    try {
      const { data } = await api.get('/bookings')
      return Array.isArray(data) ? data : []
    } catch {
      await new Promise((r) => setTimeout(r, 300))
      return []
    }
  },
  getById: async (id: string): Promise<Booking | null> => {
    try {
      const { data } = await api.get(`/bookings/${id}`)
      return data
    } catch {
      await new Promise((r) => setTimeout(r, 200))
      return null
    }
  },
}
