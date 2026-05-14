import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { useLogin } from './useAuth'
import styles from './Auth.module.css'

interface FormErrors {
  email?: string
  password?: string
}

function validate(email: string, password: string): FormErrors {
  const errors: FormErrors = {}
  if (!email) errors.email = 'El email es requerido'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Email no válido'
  if (!password) errors.password = 'La contraseña es requerida'
  return errors
}

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})

  const { mutate: login, isPending } = useLogin()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const validationErrors = validate(email, password)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    login({ email, password })
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.logo}>⚡ SNAP</h1>
          <h2 className={styles.title}>Iniciar sesión</h2>
          <p className={styles.subtitle}>Accede a tus enlaces y analíticas</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="current-password"
          />
          <Button type="submit" loading={isPending}>
            Iniciar sesión
          </Button>
        </form>

        <p className={styles.switchText}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" className={styles.link}>Regístrate aquí</Link>
        </p>
      </div>
    </div>
  )
}
