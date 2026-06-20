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
    (set, get) => ({
      currentBooking: null,
      bookingHistory: [],
      setCurrentBooking: (booking) => set({ currentBooking: booking }),
      addToHistory: (booking) =>
        set((state) => ({ bookingHistory: [booking, ...state.bookingHistory], currentBooking: null })),
      clearCurrentBooking: () => set({ currentBooking: null }),
      cancelBooking: (bookingId) =>
        set((state) => ({
          bookingHistory: state.bookingHistory.map((b) =>
            b.id === bookingId ? { ...b, status: 'cancelled' } : b
          ),
        })),
    }),
    { name: 'stayease-booking' }
  )
)

export const useRecentStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (hotel) => {
        const filtered = get().items.filter((i) => i.id !== hotel.id)
        set({ items: [hotel, ...filtered].slice(0, 5) })
      },
      clearItems: () => set({ items: [] }),
    }),
    { name: 'stayease-recent' }
  )
)


