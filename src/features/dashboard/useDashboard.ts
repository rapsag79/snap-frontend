import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { dashboardApi } from '../../api/dashboard.api'

export function useDashboard(page = 1) {
  return useQuery({
    queryKey: ['dashboard', page],
    queryFn: () => dashboardApi.get(page),
    staleTime: 1000 * 30,
    placeholderData: keepPreviousData,
  })
}
