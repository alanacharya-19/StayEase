import api from './api'

export const authApi = {
  login: async (credentials) => {
    await new Promise((r) => setTimeout(r, 500))
    return {
      user: { id: 1, name: 'John Doe', email: credentials.email, avatar: '' },
      token: 'mock-jwt-token-' + Date.now(),
    }
  },
  register: async (data) => {
    await new Promise((r) => setTimeout(r, 500))
    return {
      user: { id: 1, name: data.name, email: data.email, avatar: '' },
      token: 'mock-jwt-token-' + Date.now(),
    }
  },
  getProfile: async () => {
    await new Promise((r) => setTimeout(r, 300))
    return { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1234567890', avatar: '' }
  },
  updateProfile: async (data) => {
    await new Promise((r) => setTimeout(r, 300))
    return data
  },
}
