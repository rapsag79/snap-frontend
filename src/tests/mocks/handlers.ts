import { http, HttpResponse } from 'msw'

const BASE = 'http://localhost:3000'

const mockUser = { id: 1, email: 'test@example.com', name: 'Test User', created_at: '2024-01-01T00:00:00Z' }
const mockToken = 'eyJhbGciOiJIUzI1NiJ9.mocktoken'

function daysAgo(n: number) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString()
}

const mockUrls = [
  { code: 'abc123', original_url: 'https://google.com', created_at: daysAgo(2), clicks: 97 },   // < 7d → "Nueva"
  { code: 'def456', original_url: 'https://github.com', created_at: daysAgo(60), clicks: 45 },  // > 30d → "Antigua"
]

const mockDashboard = {
  summary: { total_urls: 2, total_clicks: 142 },
  urls: mockUrls,
  urls_pagination: { page: 1, total_pages: 1, total: 2 },
  clicks_last_30_days: Array.from({ length: 30 }, (_, i) => ({
    day: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    clicks: i % 5 === 0 ? 12 : i % 3 === 0 ? 5 : 0,
  })),
  urls_by_month: [{ month: '2024-01', count: 2 }],
}

export const handlers = [
  // Auth
  http.post(`${BASE}/auth/login`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string }
    if (body.email === 'test@example.com' && body.password === 'password123') {
      return HttpResponse.json({ token: mockToken, user: mockUser }, { status: 200 })
    }
    return HttpResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })
  }),

  http.post(`${BASE}/auth/register`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string; name: string }
    if (body.email === 'existing@example.com') {
      return HttpResponse.json({ error: 'El email ya está registrado' }, { status: 409 })
    }
    return HttpResponse.json({ token: mockToken, user: { ...mockUser, email: body.email, name: body.name } }, { status: 201 })
  }),

  // Dashboard
  http.get(`${BASE}/dashboard`, () => {
    return HttpResponse.json(mockDashboard)
  }),

  // URLs
  http.post(`${BASE}/urls`, async ({ request }) => {
    const body = await request.json() as { url: string }
    if (!body.url) {
      return HttpResponse.json({ error: 'URL requerida' }, { status: 400 })
    }
    return HttpResponse.json(
      { id: 3, code: 'new123', original_url: body.url, user_id: 1, created_at: new Date().toISOString() },
      { status: 201 }
    )
  }),

  http.delete(`${BASE}/urls/:code`, ({ params }) => {
    if (params.code === 'forbidden') {
      return HttpResponse.json({ error: 'No tienes permiso para eliminar esta URL' }, { status: 403 })
    }
    return new HttpResponse(null, { status: 204 })
  }),
]
