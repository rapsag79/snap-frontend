import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import type { AxiosError } from 'axios'
import { authApi } from '../../api/auth.api'
import { useAuthStore } from '../../store/auth.store'
import type { ApiError } from '../../types/auth.types'

export function useLogin() {
  const { login } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ token, user }) => {
      login(token, user)
      toast.success(`¡Bienvenido de vuelta, ${user.name}!`)
      navigate('/dashboard')
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error.response?.data?.error ?? 'Error al iniciar sesión'
      toast.error(message)
    },
  })
}

export function useRegister() {
  const { login } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: ({ token, user }) => {
      login(token, user)
      toast.success(`¡Cuenta creada! Bienvenido, ${user.name}`)
      navigate('/dashboard')
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error.response?.data?.error ?? 'Error al registrarse'
      toast.error(message)
    },
  })
}
