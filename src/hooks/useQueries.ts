import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { hotelApi } from '../services/hotelApi'
import { authApi } from '../services/authApi'
import { bookingApi } from '../services/bookingApi'
import { reviewApi } from '../services/reviewApi'

export function useHotels(params = {}) {
  return useQuery({
    queryKey: ['hotels', params],
    queryFn: () => hotelApi.getAll(params),
  })
}

export function useHotel(id) {
  return useQuery({
    queryKey: ['hotel', id],
    queryFn: () => hotelApi.getById(id),
    enabled: !!id,
  })
}

export function useFeaturedHotels() {
  return useQuery({ queryKey: ['hotels', 'featured'], queryFn: () => hotelApi.getFeatured() })
}

export function usePopularHotels() {
  return useQuery({ queryKey: ['hotels', 'popular'], queryFn: () => hotelApi.getPopular() })
}

export function useLuxuryHotels() {
  return useQuery({ queryKey: ['hotels', 'luxury'], queryFn: () => hotelApi.getLuxury() })
}

export function useBudgetHotels() {
  return useQuery({ queryKey: ['hotels', 'budget'], queryFn: () => hotelApi.getBudget() })
}

export function useSearchSuggestions(query) {
  return useQuery({
    queryKey: ['hotels', 'search', query],
    queryFn: () => hotelApi.search(query),
    enabled: query?.length > 1,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['auth'] }),
  })
}

export function useRegister() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['auth'] }),
  })
}

export function useCreateBooking() {
  return useMutation({ mutationFn: bookingApi.create })
}

export function useCreateReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: reviewApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reviews'] }),
  })
}
