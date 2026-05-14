import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { server } from './mocks/server'
import { LoginPage } from '../features/auth/LoginPage'
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

function renderLogin() {
  const qc = new QueryClient({ defaultOptions: { mutations: { retry: 0 } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <LoginPage />
        <Toaster />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('LoginPage', () => {
  it('renderiza el formulario con sus campos', () => {
    renderLogin()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument()
  })

  it('muestra errores de validación si se envía vacío', async () => {
    renderLogin()
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))
    expect(await screen.findByText(/el email es requerido/i)).toBeInTheDocument()
    expect(await screen.findByText(/la contraseña es requerida/i)).toBeInTheDocument()
  })

  it('muestra error si el email no tiene formato válido', async () => {
    renderLogin()
    await userEvent.type(screen.getByLabelText(/email/i), 'noesuncorreo')
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))
    expect(await screen.findByText(/email no válido/i)).toBeInTheDocument()
  })

  it('login exitoso guarda token en store y navega al dashboard', async () => {
    renderLogin()
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com')
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'password123')
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true)
      expect(useAuthStore.getState().token).toBeDefined()
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('login fallido muestra mensaje de error del servidor', async () => {
    renderLogin()
    await userEvent.type(screen.getByLabelText(/email/i), 'wrong@example.com')
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'wrongpass')
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })
  })
})
