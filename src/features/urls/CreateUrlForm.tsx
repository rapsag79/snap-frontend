import { useState, type FormEvent } from 'react'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { useCreateUrl } from './useUrls'
import styles from './CreateUrlForm.module.css'

interface Props {
  onSuccess?: () => void
}

export function CreateUrlForm({ onSuccess }: Props) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

  const { mutate: createUrl, isPending } = useCreateUrl()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!url.trim()) {
      setError('La URL es requerida')
      return
    }
    setError('')
    createUrl({ url }, {
      onSuccess: () => {
        setUrl('')
        onSuccess?.()
      },
    })
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Acortar nueva URL</h2>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.row}>
          <div className={styles.inputWrap}>
            <Input
              id="new-url"
              label="URL a acortar"
              type="url"
              placeholder="https://tu-url-larga.com/ejemplo/de/ruta"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              error={error}
              autoComplete="off"
            />
          </div>
          <Button type="submit" loading={isPending} style={{ width: 'auto', paddingInline: '1.5rem' }}>
            Acortar
          </Button>
        </div>
      </form>
    </section>
  )
}
