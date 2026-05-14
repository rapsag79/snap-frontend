import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { useRegister } from './useAuth'
import styles from './Auth.module.css'

interface FormErrors {
  name?: string
  email?: string
  password?: string
}

function validate(name: string, email: string, password: string): FormErrors {
  const errors: FormErrors = {}
  if (!name.trim()) errors.name = 'El nombre es requerido'
  if (!email) errors.email = 'El email es requerido'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Email no válido'
  if (!password) errors.password = 'La contraseña es requerida'
  else if (password.length < 8) errors.password = 'Mínimo 8 caracteres'
  return errors
}

export function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})

  const { mutate: register, isPending } = useRegister()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const validationErrors = validate(name, email, password)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    register({ name, email, password })
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.logo}>⚡ SNAP</h1>
          <h2 className={styles.title}>Crear cuenta</h2>
          <p className={styles.subtitle}>Comienza a acortar tus enlaces hoy</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <Input
            id="name"
            label="Nombre"
            type="text"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            autoComplete="name"
          />
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            autoComplete="email"
          />
          <Input
            id="password"
            label="Contraseña"
            type="password"
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="new-password"
          />
          <Button type="submit" loading={isPending}>
            Crear cuenta
          </Button>
        </form>

        <p className={styles.switchText}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className={styles.link}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
