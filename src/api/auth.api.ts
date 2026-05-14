import { httpClient } from './http.client'
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth.types'

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await httpClient.post<AuthResponse>('/auth/login', data)
    return res.data
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await httpClient.post<AuthResponse>('/auth/register', data)
    return res.data
  },
}
