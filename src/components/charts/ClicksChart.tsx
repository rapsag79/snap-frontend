import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { ClicksByDay } from '../../types/dashboard.types'

interface Props {
  data: ClicksByDay[]
}

function formatDay(day: string) {
  return day.slice(5).replace('-', '/')
}

export function ClicksChart({ data }: Props) {
  if (data.every((d) => d.clicks === 0)) {
    return (
      <p style={{ color: '#9ca3af', fontSize: '0.875rem', padding: '1rem 0' }}>
        Aún no hay clicks registrados en los últimos 30 días.
      </p>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis
          dataKey="day"
          tickFormatter={formatDay}
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          interval={4}
        />
        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
        <Tooltip
          formatter={(value: number) => [value, 'Clicks']}
          labelFormatter={(label: string) => `Día: ${label}`}
          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '0.8rem' }}
        />
        <Bar dataKey="clicks" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={32} />
      </BarChart>
    </ResponsiveContainer>
  )
}
