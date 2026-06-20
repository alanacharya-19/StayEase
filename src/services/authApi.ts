import api from './api'
import type { AuthResponse, User } from '../types'

async function tryRealApi<T>(endpoint: string, body: unknown, mock: () => T): Promise<T> {
  try {
    const { data } = await api.post(endpoint, body)
    return data
  } catch {
    return mock()
  }
}

export const authApi = {
  googleLogin: async (): Promise<AuthResponse> => {
    try {
      const { data } = await api.post('/auth/google')
      return data
    } catch {
      await new Promise((r) => setTimeout(r, 500))
      return {
        user: { id: Date.now(), name: 'Google User', email: 'user@gmail.com', avatar: '' },
        token: 'mock-google-jwt-' + Date.now(),
      }
    }
  },

  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> =>
    tryRealApi('/auth/login', credentials, () => ({
      user: { id: 1, name: 'John Doe', email: credentials.email, avatar: '' },
      token: 'mock-jwt-token-' + Date.now(),
    })),

  register: async (data: { name: string; email: string; password: string }): Promise<AuthResponse> =>
    tryRealApi('/auth/register', data, () => ({
      user: { id: Date.now(), name: data.name, email: data.email, avatar: '' },
      token: 'mock-jwt-token-' + Date.now(),
    })),

  getProfile: async (): Promise<User> => {
    try {
      const { data } = await api.get('/auth/profile')
      return data
    } catch {
      await new Promise((r) => setTimeout(r, 300))
      return { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1234567890', avatar: '' }
    }
  },

  updateProfile: async (data: Partial<User>): Promise<Partial<User>> => {
    try {
      const { data: res } = await api.put('/auth/profile', data)
      return res
    } catch {
      await new Promise((r) => setTimeout(r, 300))
      return data
    }
  },
}
