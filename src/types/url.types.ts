export interface Url {
  id: number
  code: string
  original_url: string
  user_id: number
  created_at: string
}

export interface CreateUrlRequest {
  url: string
}

export interface DashboardUrl {
  code: string
  original_url: string
  created_at: string
  clicks: number
}
