import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '../store/auth.store'

const mockUser = { id: 1, email: 'test@example.com', name: 'Test User', created_at: '2024-01-01T00:00:00Z' }
const mockToken = 'mock.jwt.token'

describe('auth.store', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, user: null, isAuthenticated: false })
  })

  it('inicia con estado vacío', () => {
    const state = useAuthStore.getState()
    expect(state.token).toBeNull()
    expect(state.user).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })

  it('login guarda token, usuario y marca autenticado', () => {
    useAuthStore.getState().login(mockToken, mockUser)
    const state = useAuthStore.getState()
    expect(state.token).toBe(mockToken)
    expect(state.user).toEqual(mockUser)
    expect(state.isAuthenticated).toBe(true)
  })

  it('logout limpia todo el estado', () => {
    useAuthStore.getState().login(mockToken, mockUser)
    useAuthStore.getState().logout()
    const state = useAuthStore.getState()
    expect(state.token).toBeNull()
    expect(state.user).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })
})
