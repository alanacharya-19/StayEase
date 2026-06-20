export const amenitiesList: string[] = ['Free WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Room Service', 'Parking', 'Beach Access', 'Airport Shuttle', 'Business Center', 'Kids Club', 'Pet Friendly', 'Air Conditioning', 'Heating', 'Kitchen', 'Balcony', 'Garden View']

export interface SortOption {
  value: string
  label: string
}

export interface PriceRange {
  label: string
  min: number
  max: number
}

export const sortOptions: SortOption[] = [
  { value: 'price-asc', label: 'Lowest Price' },
  { value: 'price-desc', label: 'Highest Price' },
  { value: 'rating-desc', label: 'Best Rated' },
  { value: 'popularity-desc', label: 'Most Popular' },
]

export const starRatings: number[] = [5, 4, 3, 2, 1]

export const priceRanges: PriceRange[] = [
  { label: 'Under $100', min: 0, max: 100 },
  { label: '$100 - $200', min: 100, max: 200 },
  { label: '$200 - $500', min: 200, max: 500 },
  { label: '$500 - $1000', min: 500, max: 1000 },
  { label: 'Over $1000', min: 1000, max: 10000 },
]
