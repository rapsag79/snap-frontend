import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { AxiosError } from 'axios'
import { urlsApi } from '../../api/urls.api'
import type { ApiError } from '../../types/auth.types'

export function useCreateUrl() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: urlsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('¡URL acortada exitosamente!')
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error.response?.data?.error ?? 'Error al crear la URL'
      toast.error(message)
    },
  })
}

export function useDeleteUrl() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: urlsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('URL eliminada')
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error.response?.data?.error ?? 'Error al eliminar la URL'
      toast.error(message)
    },
  })
}
