import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'stayease-theme' }
  )
)

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (userData) => set({ user: userData, isAuthenticated: true }),
      register: (userData) => set({ user: userData, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateProfile: (data) => set((state) => ({ user: { ...state.user, ...data } })),
    }),
    { name: 'stayease-auth' }
  )
)

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (hotel) => set((state) => ({ items: [...state.items, hotel] })),
      removeItem: (hotelId) => set((state) => ({ items: state.items.filter((i) => i.id !== hotelId) })),
      isInWishlist: (hotelId) => get().items.some((i) => i.id === hotelId),
      toggleItem: (hotel) => {
        const { items, isInWishlist } = get()
        if (isInWishlist(hotel.id)) {
          set({ items: items.filter((i) => i.id !== hotel.id) })
        } else {
          set({ items: [...items, hotel] })
        }
      },
      clearWishlist: () => set({ items: [] }),
    }),
    { name: 'stayease-wishlist' }
  )
)

export const useBookingStore = create(
  persist(
    (set) => ({
      currentBooking: null,
      bookingHistory: [],
      setCurrentBooking: (booking) => set({ currentBooking: booking }),
      addToHistory: (booking) =>
        set((state) => ({ bookingHistory: [booking, ...state.bookingHistory], currentBooking: null })),
      clearCurrentBooking: () => set({ currentBooking: null }),
    }),
    { name: 'stayease-booking' }
  )
)

export const useHotelStore = create((set) => ({
  searchQuery: '',
  filters: {
    city: '',
    country: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    priceMin: 0,
    priceMax: 10000,
    stars: 0,
    amenities: [],
  },
  sortBy: 'popularity-desc',
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilters: (filters) => set({ filters: { ...filters } }),
  updateFilter: (key, value) =>
    set((state) => ({ filters: { ...state.filters, [key]: value } })),
  resetFilters: () =>
    set({
      filters: { city: '', country: '', checkIn: '', checkOut: '', guests: 1, priceMin: 0, priceMax: 10000, stars: 0, amenities: [] },
    }),
  setSortBy: (sortBy) => set({ sortBy }),
}))
