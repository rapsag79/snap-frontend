import { httpClient } from './http.client'
import type { DashboardData } from '../types/dashboard.types'

export const dashboardApi = {
  get: async (page = 1): Promise<DashboardData> => {
    const res = await httpClient.get<DashboardData>('/dashboard', { params: { page } })
    return res.data
  },
}
