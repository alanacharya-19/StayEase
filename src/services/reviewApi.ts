export const reviewApi = {
  getByHotel: async (hotelId: number): Promise<[]> => {
    await new Promise((r) => setTimeout(r, 200))
    return []
  },
  create: async (data: Record<string, unknown>): Promise<Record<string, unknown>> => {
    await new Promise((r) => setTimeout(r, 300))
    return { id: Date.now(), ...data, date: new Date().toISOString() }
  },
}
