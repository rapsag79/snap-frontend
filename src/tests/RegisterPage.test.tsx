import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { server } from './mocks/server'
import { RegisterPage } from '../features/auth/RegisterPage'
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

function renderRegister() {
  const qc = new QueryClient({ defaultOptions: { mutations: { retry: 0 } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <RegisterPage />
        <Toaster />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('RegisterPage', () => {
  it('renderiza el formulario con sus campos', () => {
    renderRegister()
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /crear cuenta/i })).toBeInTheDocument()
  })

  it('muestra errores si se envía vacío', async () => {
    renderRegister()
    fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }))
    expect(await screen.findByText(/el nombre es requerido/i)).toBeInTheDocument()
    expect(await screen.findByText(/el email es requerido/i)).toBeInTheDocument()
    expect(await screen.findByText(/la contraseña es requerida/i)).toBeInTheDocument()
  })

  it('muestra error si la contraseña tiene menos de 8 caracteres', async () => {
    renderRegister()
    await userEvent.type(screen.getByLabelText(/nombre/i), 'Juan')
    await userEvent.type(screen.getByLabelText(/email/i), 'juan@example.com')
    await userEvent.type(screen.getByLabelText(/contraseña/i), '123')
    fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }))
    expect(await screen.findByText(/mínimo 8 caracteres/i)).toBeInTheDocument()
  })

  it('registro exitoso guarda token en store y navega al dashboard', async () => {
    renderRegister()
    await userEvent.type(screen.getByLabelText(/nombre/i), 'Nuevo Usuario')
    await userEvent.type(screen.getByLabelText(/email/i), 'nuevo@example.com')
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'password123')
    fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }))

    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true)
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('muestra error 409 si el email ya está registrado', async () => {
    renderRegister()
    await userEvent.type(screen.getByLabelText(/nombre/i), 'Alguien')
    await userEvent.type(screen.getByLabelText(/email/i), 'existing@example.com')
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'password123')
    fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }))

    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })
  })
})
