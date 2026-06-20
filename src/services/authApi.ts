import type { AuthResponse, User } from '../types'

export const authApi = {
  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    await new Promise((r) => setTimeout(r, 500))
    return {
      user: { id: 1, name: 'John Doe', email: credentials.email, avatar: '' },
      token: 'mock-jwt-token-' + Date.now(),
    }
  },
  register: async (data: { name: string; email: string; password: string }): Promise<AuthResponse> => {
    await new Promise((r) => setTimeout(r, 500))
    return {
      user: { id: 1, name: data.name, email: data.email, avatar: '' },
      token: 'mock-jwt-token-' + Date.now(),
    }
  },
  getProfile: async (): Promise<User> => {
    await new Promise((r) => setTimeout(r, 300))
    return { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1234567890', avatar: '' }
  },
  updateProfile: async (data: Partial<User>): Promise<Partial<User>> => {
    await new Promise((r) => setTimeout(r, 300))
    return data
  },
}
