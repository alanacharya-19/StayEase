import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { hotelApi } from '../services/hotelApi'
import { authApi } from '../services/authApi'
import { bookingApi } from '../services/bookingApi'
import { reviewApi } from '../services/reviewApi'
import type { HotelQueryParams, Hotel, AuthResponse, Booking } from '../types'
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query'

export function useHotels(params: HotelQueryParams = {}): UseQueryResult<{ data: Hotel[]; total: number; page: number; totalPages: number }> {
  return useQuery({
    queryKey: ['hotels', params],
    queryFn: () => hotelApi.getAll(params),
  })
}

export function useHotel(id: string | undefined): UseQueryResult<Hotel> {
  return useQuery({
    queryKey: ['hotel', id],
    queryFn: () => hotelApi.getById(id!),
    enabled: !!id,
  })
}

export function useFeaturedHotels(): UseQueryResult<Hotel[]> {
  return useQuery({ queryKey: ['hotels', 'featured'], queryFn: () => hotelApi.getFeatured() })
}

export function usePopularHotels(): UseQueryResult<Hotel[]> {
  return useQuery({ queryKey: ['hotels', 'popular'], queryFn: () => hotelApi.getPopular() })
}

export function useLuxuryHotels(): UseQueryResult<Hotel[]> {
  return useQuery({ queryKey: ['hotels', 'luxury'], queryFn: () => hotelApi.getLuxury() })
}

export function useBudgetHotels(): UseQueryResult<Hotel[]> {
  return useQuery({ queryKey: ['hotels', 'budget'], queryFn: () => hotelApi.getBudget() })
}

export function useSearchSuggestions(query: string): UseQueryResult<Hotel[]> {
  return useQuery({
    queryKey: ['hotels', 'search', query],
    queryFn: () => hotelApi.search(query),
    enabled: query?.length > 1,
  })
}

export function useLogin(): UseMutationResult<AuthResponse, Error, { email: string; password: string }> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['auth'] }),
  })
}

export function useRegister(): UseMutationResult<AuthResponse, Error, { name: string; email: string; password: string }> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['auth'] }),
  })
}

export function useCreateBooking(): UseMutationResult<Booking, Error, Omit<Booking, 'id' | 'status' | 'createdAt'>> {
  return useMutation({ mutationFn: bookingApi.create })
}

export function useCreateReview(): UseMutationResult<Record<string, unknown>, Error, Record<string, unknown>> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: reviewApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reviews'] }),
  })
}
