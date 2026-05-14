import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore } from '../../store/auth.store'
import styles from './Navbar.module.css'

export function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
    toast.success('Sesión cerrada correctamente')
  }

  return (
    <nav className={styles.navbar}>
      <span className={styles.logo}>⚡ SNAP</span>
      <div className={styles.right}>
        <span className={styles.userName}>{user?.name}</span>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  )
}
