import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { http, HttpResponse } from 'msw'
import { server } from './mocks/server'
import { DashboardPage } from '../features/dashboard/DashboardPage'
import { useAuthStore } from '../store/auth.store'

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  useAuthStore.setState({ token: null, user: null, isAuthenticated: false })
})
afterAll(() => server.close())

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

const mockUser = { id: 1, email: 'test@example.com', name: 'Test User', created_at: '2024-01-01T00:00:00Z' }

function renderDashboard() {
  useAuthStore.setState({ token: 'mock.token', user: mockUser, isAuthenticated: true })
  const qc = new QueryClient({ defaultOptions: { queries: { retry: 0 }, mutations: { retry: 0 } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <DashboardPage />
        <Toaster />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

// ─── DashboardPage ────────────────────────────────────────────────────────────

describe('DashboardPage', () => {
  it('muestra estado de carga inicialmente', () => {
    renderDashboard()
    expect(screen.getByText(/cargando/i)).toBeInTheDocument()
  })

  it('muestra las cards de resumen con datos correctos', async () => {
    renderDashboard()
    expect(await screen.findByText('2')).toBeInTheDocument()
    expect(await screen.findByText('142')).toBeInTheDocument()
    expect(screen.getByText(/urls creadas/i)).toBeInTheDocument()
    expect(screen.getByText(/clicks totales/i)).toBeInTheDocument()
  })

  it('muestra las URLs del usuario en la lista', async () => {
    renderDashboard()
    expect(await screen.findByText('abc123')).toBeInTheDocument()
    expect(await screen.findByText('def456')).toBeInTheDocument()
  })

  it('muestra el nombre del usuario en el navbar', async () => {
    renderDashboard()
    expect(await screen.findByText('Test User')).toBeInTheDocument()
  })

  it('muestra el formulario de nueva URL', async () => {
    renderDashboard()
    expect(await screen.findByText(/acortar nueva url/i)).toBeInTheDocument()
  })
})

// ─── Error state ──────────────────────────────────────────────────────────────

describe('DashboardPage — error state', () => {
  it('muestra error y botón de reintento cuando la API falla', async () => {
    server.use(
      http.get('http://localhost:3000/dashboard', () => {
        return HttpResponse.json({ error: 'Server error' }, { status: 500 })
      })
    )
    renderDashboard()
    expect(await screen.findByText(/no se pudo cargar/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument()
  })

  it('el botón de reintento vuelve a llamar a la API', async () => {
    let calls = 0
    server.use(
      http.get('http://localhost:3000/dashboard', () => {
        calls++
        return HttpResponse.json({ error: 'fail' }, { status: 500 })
      })
    )
    renderDashboard()
    const retryBtn = await screen.findByRole('button', { name: /reintentar/i })
    await userEvent.click(retryBtn)
    await waitFor(() => expect(calls).toBeGreaterThan(1))
  })
})

// ─── Indicadores de antigüedad ────────────────────────────────────────────────

describe('UrlList — indicadores de antigüedad', () => {
  it('muestra badge "Nueva" para URLs creadas hace menos de 7 días', async () => {
    renderDashboard()
    // abc123 tiene created_at = hace 2 días (ver handlers.ts)
    expect(await screen.findByText('abc123')).toBeInTheDocument()
    expect(screen.getAllByText('Nueva').length).toBeGreaterThan(0)
  })

  it('muestra badge "Antigua" para URLs creadas hace más de 30 días', async () => {
    renderDashboard()
    // def456 tiene created_at = hace 60 días (ver handlers.ts)
    expect(await screen.findByText('def456')).toBeInTheDocument()
    expect(screen.getAllByText('Antigua').length).toBeGreaterThan(0)
  })

  it('NO muestra badge para URLs de 7-30 días de antigüedad', async () => {
    server.use(
      http.get('http://localhost:3000/dashboard', () => {
        const midAge = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        return HttpResponse.json({
          summary: { total_urls: 1, total_clicks: 5 },
          urls: [{ code: 'mid15d', original_url: 'https://example.com', created_at: midAge, clicks: 5 }],
          urls_pagination: { page: 1, total_pages: 1, total: 1 },
          clicks_last_30_days: [],
          urls_by_month: [],
        })
      })
    )
    renderDashboard()
    expect(await screen.findByText('mid15d')).toBeInTheDocument()
    expect(screen.queryByText('Nueva')).not.toBeInTheDocument()
    expect(screen.queryByText('Antigua')).not.toBeInTheDocument()
  })

})

// ─── CreateUrlForm ─────────────────────────────────────────────────────────────

describe('CreateUrlForm', () => {
  it('muestra error si se envía vacío', async () => {
    renderDashboard()
    await screen.findByText(/acortar nueva url/i)
    fireEvent.click(screen.getByRole('button', { name: /acortar/i }))
    expect(await screen.findByText(/la url es requerida/i)).toBeInTheDocument()
  })

  it('crea una URL correctamente y limpia el input', async () => {
    renderDashboard()
    await screen.findByText(/acortar nueva url/i)
    const input = screen.getByPlaceholderText(/https:\/\/tu-url-larga/i)
    await userEvent.type(input, 'https://ejemplo.com')
    fireEvent.click(screen.getByRole('button', { name: /acortar/i }))
    await waitFor(() => expect(input).toHaveValue(''))
  })
})

// ─── UrlList — eliminar ───────────────────────────────────────────────────────

describe('UrlList — eliminar', () => {
  it('muestra botón de eliminar para cada URL', async () => {
    renderDashboard()
    const deleteButtons = await screen.findAllByRole('button', { name: /eliminar/i })
    expect(deleteButtons.length).toBeGreaterThan(0)
  })

  it('primer clic pide confirmación, no elimina', async () => {
    renderDashboard()
    const [firstDeleteBtn] = await screen.findAllByRole('button', { name: /eliminar/i })
    await userEvent.click(firstDeleteBtn)
    expect(await screen.findByRole('button', { name: /confirmar/i })).toBeInTheDocument()
  })
})

// ─── Navbar — logout ──────────────────────────────────────────────────────────

describe('Navbar — logout', () => {
  it('el botón de cerrar sesión limpia el store y redirige', async () => {
    renderDashboard()
    await screen.findByText('Test User')

    const logoutBtn = screen.getByRole('button', { name: /cerrar sesión/i })
    await userEvent.click(logoutBtn)

    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(useAuthStore.getState().token).toBeNull()
    expect(useAuthStore.getState().user).toBeNull()
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })
})
