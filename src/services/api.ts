import axios from 'axios'
import type { AxiosInstance } from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('stayease-auth')
  if (stored) {
    const { state } = JSON.parse(stored)
    if (state?.user?.token) {
      config.headers.Authorization = `Bearer ${state.user.token}`
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('stayease-auth')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
