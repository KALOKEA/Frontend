interface StatsCardProps {
  title: string
  value: string | number
  sub?: string
  trend?: 'up' | 'down' | 'neutral'
}

export default function StatsCard({ title, value, sub, trend }: StatsCardProps) {
  return (
    <div className="bg-white border border-[#e8e4e0] p-5">
      <p className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] mb-2">{title}</p>
      <p className="font-serif text-3xl text-[#0a0a0a] mb-1">{value}</p>
      {sub && <p className="text-xs font-sans text-[#6b6b6b]">{sub}</p>}
    </div>
  )
}
