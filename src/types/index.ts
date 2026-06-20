export interface HotelRoom {
  id: number
  type: string
  bed: string
  capacity: number
  price: number
  images: string[]
  facilities: string[]
  available: boolean
  cancellationPolicy: string
}

export interface HotelReview {
  id: number
  user: string
  rating: number
  comment: string
  date: string
  avatar: string
}

export interface HotelRatings {
  overall: number
  cleanliness: number
  location: number
  service: number
  value: number
}

export interface HotelPolicies {
  checkIn: string
  checkOut: string
  cancellation: string
  children: string
  pets: string
}

export interface HotelLocation {
  lat: number
  lng: number
  address: string
}

export interface VendorPrice {
  vendor: string
  price: number
  tax: number
}

export interface Hotel {
  id: number
  name: string
  description: string
  longDescription: string
  city: string
  country: string
  images: string[]
  ratings: HotelRatings
  reviewsCount: number
  stars: number
  price: number
  currency: string
  amenities: string[]
  policies: HotelPolicies
  location: HotelLocation
  rooms: HotelRoom[]
  reviews: HotelReview[]
  popular: boolean
  featured: boolean
  luxury: boolean
  budget: boolean
  discount: number
  similarHotels?: Hotel[]
  vendorPrices?: VendorPrice[]
  makcorpsPrice?: number
}

export interface Destination {
  id: number
  name: string
  country: string
  image: string
  hotelCount: number
}

export interface Testimonial {
  id: number
  name: string
  location: string
  avatar: string
  text: string
  rating: number
}

export interface FAQ {
  q: string
  a: string
}

export interface TeamMember {
  id: number
  name: string
  role: string
  image: string
  bio: string
}

export interface User {
  id: number
  name: string
  email: string
  phone?: string
  avatar: string
  token?: string
}

export interface Booking {
  id: string
  hotelId: number
  roomId: number
  hotelName: string
  roomType: string
  city: string
  country: string
  image: string
  checkIn: string
  checkOut: string
  guests: number
  rooms: number
  price: number
  currency: string
  status: 'confirmed' | 'cancelled' | 'completed'
  createdAt: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface HotelQueryParams {
  search?: string
  city?: string
  country?: string
  priceMin?: string
  priceMax?: string
  stars?: string
  amenities?: string[]
  sort?: string
  page?: number
  limit?: number
  checkIn?: string
  checkOut?: string
  guests?: string
}

export interface PaginatedResponse {
  data: Hotel[]
  total: number
  page: number
  totalPages: number
}
