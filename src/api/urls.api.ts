import { httpClient } from './http.client'
import type { Url, CreateUrlRequest } from '../types/url.types'

export const urlsApi = {
  create: async (data: CreateUrlRequest): Promise<Url> => {
    const res = await httpClient.post<Url>('/urls', data)
    return res.data
  },

  delete: async (code: string): Promise<void> => {
    await httpClient.delete(`/urls/${code}`)
  },
}
