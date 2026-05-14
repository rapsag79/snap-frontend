import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { server } from './mocks/server'
import { authApi } from '../api/auth.api'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('authApi.login', () => {
  it('retorna token y usuario con credenciales correctas', async () => {
    const result = await authApi.login({ email: 'test@example.com', password: 'password123' })
    expect(result.token).toBeDefined()
    expect(result.user.email).toBe('test@example.com')
    expect(result.user.name).toBe('Test User')
  })

  it('lanza error 401 con credenciales incorrectas', async () => {
    await expect(
      authApi.login({ email: 'wrong@example.com', password: 'wrongpassword' })
    ).rejects.toMatchObject({ response: { status: 401, data: { error: 'Credenciales incorrectas' } } })
  })
})

describe('authApi.register', () => {
  it('retorna token y usuario al registrar nuevo email', async () => {
    const result = await authApi.register({ name: 'Nuevo Usuario', email: 'nuevo@example.com', password: 'password123' })
    expect(result.token).toBeDefined()
    expect(result.user.email).toBe('nuevo@example.com')
    expect(result.user.name).toBe('Nuevo Usuario')
  })

  it('lanza error 409 si el email ya existe', async () => {
    await expect(
      authApi.register({ name: 'Alguien', email: 'existing@example.com', password: 'password123' })
    ).rejects.toMatchObject({ response: { status: 409, data: { error: 'El email ya está registrado' } } })
  })
})
