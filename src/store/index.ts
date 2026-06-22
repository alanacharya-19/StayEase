import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Hotel, Booking, UserReview } from '../types'

interface ThemeState {
  theme: string
  toggleTheme: () => void
  setTheme: (theme: string) => void
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (userData: User) => void
  register: (userData: User) => void
  logout: () => void
  updateProfile: (data: Partial<User>) => void
}

interface WishlistState {
  items: Hotel[]
  addItem: (hotel: Hotel) => void
  removeItem: (hotelId: number) => void
  isInWishlist: (hotelId: number) => boolean
  toggleItem: (hotel: Hotel) => void
  clearWishlist: () => void
}

interface BookingState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentBooking: any | null
  bookingHistory: Booking[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setCurrentBooking: (booking: any) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addToHistory: (booking: any) => void
  clearCurrentBooking: () => void
  cancelBooking: (bookingId: string) => void
}

interface RecentItem {
  id: number
  name: string
  city: string
  country: string
  price: number
  currency: string
  rating: number
  stars: number
  image: string
  ratings?: { overall: number }
}

interface RecentState {
  items: RecentItem[]
  addItem: (hotel: RecentItem) => void
  clearItems: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setTheme: (theme: string) => set({ theme }),
    }),
    { name: 'stayease-theme' }
  )
)

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (userData: User) => set({ user: userData, isAuthenticated: true }),
      register: (userData: User) => set({ user: userData, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateProfile: (data: Partial<User>) => set((state) => ({ user: state.user ? { ...state.user, ...data } : null })),
    }),
    { name: 'stayease-auth' }
  )
)

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (hotel: Hotel) => set((state) => ({ items: [...state.items, hotel] })),
      removeItem: (hotelId: number) => set((state) => ({ items: state.items.filter((i) => i.id !== hotelId) })),
      isInWishlist: (hotelId: number) => get().items.some((i: Hotel) => i.id === hotelId),
      toggleItem: (hotel: Hotel) => {
        const { items, isInWishlist } = get()
        if (isInWishlist(hotel.id)) {
          set({ items: items.filter((i: Hotel) => i.id !== hotel.id) })
        } else {
          set({ items: [...items, hotel] })
        }
      },
      clearWishlist: () => set({ items: [] }),
    }),
    { name: 'stayease-wishlist' }
  )
)

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      currentBooking: null,
      bookingHistory: [],
      setCurrentBooking: (booking: Booking) => set({ currentBooking: booking }),
      addToHistory: (booking: Booking) =>
        set((state) => ({ bookingHistory: [booking, ...state.bookingHistory], currentBooking: null })),
      clearCurrentBooking: () => set({ currentBooking: null }),
      cancelBooking: (bookingId: string) =>
        set((state) => ({
          bookingHistory: state.bookingHistory.map((b: Booking) =>
            b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
          ),
        })),
    }),
    { name: 'stayease-booking' }
  )
)

export const useRecentStore = create<RecentState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (hotel: RecentItem) => {
        const filtered = get().items.filter((i: RecentItem) => i.id !== hotel.id)
        set({ items: [hotel, ...filtered].slice(0, 5) })
      },
      clearItems: () => set({ items: [] }),
    }),
    { name: 'stayease-recent' }
  )
)

export interface SavedItinerary {
  id: string
  destination: string
  days: number
  budget: string
  content: string
  createdAt: string
}

interface ItineraryState {
  savedItineraries: SavedItinerary[]
  saveItinerary: (itinerary: SavedItinerary) => void
  removeItinerary: (id: string) => void
  getItinerary: (id: string) => SavedItinerary | undefined
  offlineMode: boolean
  setOfflineMode: (val: boolean) => void
}

export const useItineraryStore = create<ItineraryState>()(
  persist(
    (set, get) => ({
      savedItineraries: [],
      offlineMode: false,
      saveItinerary: (itinerary) =>
        set((state) => ({ savedItineraries: [itinerary, ...state.savedItineraries] })),
      removeItinerary: (id) =>
        set((state) => ({ savedItineraries: state.savedItineraries.filter((i) => i.id !== id) })),
      getItinerary: (id) => get().savedItineraries.find((i) => i.id === id),
      setOfflineMode: (val) => set({ offlineMode: val }),
    }),
    { name: 'stayease-itineraries' }
  )
)

interface ReviewState {
  reviews: UserReview[]
  addReview: (review: UserReview) => void
  getReviewsByHotel: (hotelId: number) => UserReview[]
  upvoteReview: (reviewId: string, userId: string | number) => void
  hasUserReviewed: (hotelId: number, userId: string | number) => boolean
  getUserReviews: (userId: string | number) => UserReview[]
  getCompletedBookingIds: (userId: string | number) => string[]
  markCompleted: (bookingId: string) => void
  completedBookingIds: string[]
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      reviews: [],
      completedBookingIds: [],
      addReview: (review) =>
        set((state) => ({ reviews: [review, ...state.reviews] })),
      getReviewsByHotel: (hotelId) =>
        get().reviews.filter((r) => r.hotelId === hotelId),
      upvoteReview: (reviewId, userId) =>
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === reviewId
              ? r.upvotedBy.includes(userId)
                ? { ...r, upvotes: r.upvotes - 1, upvotedBy: r.upvotedBy.filter((u) => u !== userId) }
                : { ...r, upvotes: r.upvotes + 1, upvotedBy: [...r.upvotedBy, userId] }
              : r
          ),
        })),
      hasUserReviewed: (hotelId, userId) =>
        get().reviews.some((r) => r.hotelId === hotelId && r.userId === userId),
      getUserReviews: (userId) =>
        get().reviews.filter((r) => r.userId === userId),
      getCompletedBookingIds: (userId) =>
        get().completedBookingIds,
      markCompleted: (bookingId) =>
        set((state) => ({
          completedBookingIds: state.completedBookingIds.includes(bookingId)
            ? state.completedBookingIds
            : [...state.completedBookingIds, bookingId],
        })),
    }),
    { name: 'stayease-reviews' }
  )
)


