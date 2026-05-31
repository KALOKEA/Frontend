'use client'
// Placeholder chart — will be replaced with recharts or Chart.js in Phase 3
export default function RevenueChart({ data }: { data?: { date: string; amount: number }[] }) {
  if (!data?.length) return (
    <div className="h-48 bg-[#f4f2ef] flex items-center justify-center">
      <p className="text-xs font-sans text-[#6b6b6b]">No revenue data available</p>
    </div>
  )
  const max = Math.max(...data.map((d) => d.amount))
  return (
    <div className="h-48 flex items-end gap-1">
      {data.map((d) => (
        <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full bg-[#c8a4a5] transition-all"
            style={{ height: `${max ? (d.amount / max) * 100 : 0}%` }}
          />
          <p className="text-[8px] font-sans text-[#6b6b6b] truncate w-full text-center">{d.date.slice(5)}</p>
        </div>
      ))}
    </div>
  )
}
