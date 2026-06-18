interface StatsCardProps {
  title: string
  value: string | number
  sub?: string
  trend?: 'up' | 'down' | 'neutral'
}

const TREND_STYLE = {
  up:      { color: '#15803d', arrow: '↑' },
  down:    { color: '#dc2626', arrow: '↓' },
  neutral: { color: '#6b6b6b', arrow: '→' },
}

export default function StatsCard({ title, value, sub, trend }: StatsCardProps) {
  const td = trend ? TREND_STYLE[trend] : null
  return (
    <div className="bg-white border border-[#e8e4e0] p-5">
      <p className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] mb-2">{title}</p>
      <p className="font-serif text-3xl text-[#0a0a0a] mb-1">{value}</p>
      {(sub || td) && (
        <p className="text-xs font-sans text-[#6b6b6b] flex items-center gap-1">
          {td && <span style={{ color: td.color }} aria-hidden="true">{td.arrow}</span>}
          {sub}
        </p>
      )}
    </div>
  )
}
