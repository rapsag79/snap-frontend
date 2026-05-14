import { useState } from 'react'
import { toast } from 'sonner'
import { useDeleteUrl } from './useUrls'
import type { DashboardUrl } from '../../types/url.types'
import styles from './UrlList.module.css'

const BASE_URL = import.meta.env.VITE_API_URL as string

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' })
}

function truncate(text: string, max = 48) {
  return text.length > max ? text.slice(0, max) + '…' : text
}

// El backend no tiene expiración. Usamos antigüedad como indicador visual:
// < 7 días → "Nueva"  |  > 30 días → "Antigua"
function getUrlAge(createdAt: string): 'new' | 'normal' | 'old' {
  const days = Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24))
  if (days < 7) return 'new'
  if (days > 30) return 'old'
  return 'normal'
}

function AgeBadge({ age }: { age: ReturnType<typeof getUrlAge> }) {
  if (age === 'new') return <span className={styles.badgeNew}>Nueva</span>
  if (age === 'old') return <span className={styles.badgeOld}>Antigua</span>
  return null
}

function UrlRow({ url }: { url: DashboardUrl }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const { mutate: deleteUrl, isPending } = useDeleteUrl()
  const shortUrl = `${BASE_URL}/${url.code}`
  const age = getUrlAge(url.created_at)

  async function copyShortUrl() {
    try {
      await navigator.clipboard.writeText(shortUrl)
      toast.success('URL copiada al portapapeles')
    } catch {
      toast.error('No se pudo copiar la URL')
    }
  }

  function handleDeleteClick() {
    if (!confirmDelete) {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
      return
    }
    deleteUrl(url.code)
  }

  return (
    <div className={`${styles.row} ${age === 'old' ? styles.rowOld : ''}`}>
      <div className={styles.codeCell}>
        <span className={`${styles.code} ${age === 'old' ? styles.codeOld : ''}`}>{url.code}</span>
        <AgeBadge age={age} />
        <button className={styles.copyBtn} onClick={copyShortUrl} title="Copiar URL corta">
          Copiar
        </button>
      </div>
      <div className={styles.urlCell} title={url.original_url}>
        <a href={url.original_url} target="_blank" rel="noopener noreferrer" className={styles.originalUrl}>
          {truncate(url.original_url)}
        </a>
      </div>
      <div className={styles.clicksCell}>
        <span className={styles.clicksBadge}>{url.clicks}</span>
        <span className={styles.clicksLabel}>clicks</span>
      </div>
      <div className={styles.dateCell}>{formatDate(url.created_at)}</div>
      <div className={styles.actionsCell}>
        <button
          className={`${styles.deleteBtn} ${confirmDelete ? styles.deleteBtnConfirm : ''}`}
          onClick={handleDeleteClick}
          disabled={isPending}
          title={confirmDelete ? 'Haz clic de nuevo para confirmar' : 'Eliminar URL'}
        >
          {confirmDelete ? '¿Confirmar?' : 'Eliminar'}
        </button>
      </div>
    </div>
  )
}

interface Props {
  urls: DashboardUrl[]
}

export function UrlList({ urls }: Props) {
  if (urls.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>🔗</span>
        <p>Aún no tienes URLs acortadas.</p>
        <p>¡Crea la primera usando el formulario de arriba!</p>
      </div>
    )
  }

  return (
    <div className={styles.list}>
      <div className={styles.header}>
        <span>Código</span>
        <span>URL original</span>
        <span>Clicks</span>
        <span>Creada</span>
        <span></span>
      </div>
      {urls.map((url) => (
        <UrlRow key={url.code} url={url} />
      ))}
    </div>
  )
}
