import type { DashboardUrl } from './url.types'

export interface DashboardSummary {
  total_urls: number
  total_clicks: number
}

export interface ClicksByDay {
  day: string
  clicks: number
}

export interface UrlsByMonth {
  month: string
  count: number
}

export interface Pagination {
  page: number
  total_pages: number
  total: number
}

export interface DashboardData {
  summary: DashboardSummary
  urls: DashboardUrl[]
  urls_pagination: Pagination
  clicks_last_30_days: ClicksByDay[]
  urls_by_month: UrlsByMonth[]
}
