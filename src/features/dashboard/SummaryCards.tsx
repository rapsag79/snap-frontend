import type { DashboardSummary } from '../../types/dashboard.types'
import styles from './SummaryCards.module.css'

interface Props {
  summary: DashboardSummary
}

export function SummaryCards({ summary }: Props) {
  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <span className={styles.icon}>🔗</span>
        <div>
          <p className={styles.value}>{summary.total_urls}</p>
          <p className={styles.label}>URLs creadas</p>
        </div>
      </div>
      <div className={styles.card}>
        <span className={styles.icon}>📈</span>
        <div>
          <p className={styles.value}>{summary.total_clicks.toLocaleString('es')}</p>
          <p className={styles.label}>Clicks totales</p>
        </div>
      </div>
    </div>
  )
}
