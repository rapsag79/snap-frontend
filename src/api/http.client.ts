import axios from 'axios'
import { toast } from 'sonner'
import { useAuthStore } from '../store/auth.store'

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

httpClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Solo intercepta 401 cuando ya había un token activo (sesión expirada).
    // Si no había token, el 401 proviene del propio login/register y lo
    // maneja el onError del mutation correspondiente.
    const hadToken = useAuthStore.getState().token !== null
    if (error.response?.status === 401 && hadToken) {
      useAuthStore.getState().logout()
      toast.error('Tu sesión expiró. Inicia sesión de nuevo.')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
