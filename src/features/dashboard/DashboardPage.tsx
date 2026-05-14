import { useState } from 'react'
import { Navbar } from '../../components/ui/Navbar'
import { Pagination } from '../../components/ui/Pagination'
import { SummaryCards } from './SummaryCards'
import { CreateUrlForm } from '../urls/CreateUrlForm'
import { UrlList } from '../urls/UrlList'
import { ClicksChart } from '../../components/charts/ClicksChart'
import { useDashboard } from './useDashboard'
import styles from './DashboardPage.module.css'

function LoadingState() {
  return (
    <div className={styles.centered}>
      <div className={styles.spinner} />
      <p>Cargando tu dashboard…</p>
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className={styles.centered}>
      <p className={styles.errorText}>⚠ No se pudo cargar el dashboard.</p>
      <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
        Verifica tu conexión o que el servidor esté activo.
      </p>
      <button className={styles.retryBtn} onClick={onRetry}>
        Reintentar
      </button>
    </div>
  )
}

export function DashboardPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, refetch } = useDashboard(page)

  function handlePageChange(newPage: number) {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleUrlCreated() {
    setPage(1)
  }

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        {isLoading && <LoadingState />}
        {isError && <ErrorState onRetry={refetch} />}
        {data && (
          <>
            <SummaryCards summary={data.summary} />
            <CreateUrlForm onSuccess={handleUrlCreated} />
            <section>
              <h2 className={styles.sectionTitle}>Mis enlaces</h2>
              <UrlList urls={data.urls} />
              <Pagination
                page={data.urls_pagination.page}
                totalPages={data.urls_pagination.total_pages}
                onPageChange={handlePageChange}
              />
            </section>
            <section>
              <h2 className={styles.sectionTitle}>Clicks — últimos 30 días</h2>
              <div className={styles.chartCard}>
                <ClicksChart data={data.clicks_last_30_days} />
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}
