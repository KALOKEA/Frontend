'use client'
import { useEffect, useState } from 'react'
import { settingsApi, type GstReport } from '@/lib/api/settings'
import StatsCard from '@/components/admin/StatsCard'
import Spinner from '@/components/ui/Spinner'
import { formatPrice } from '@/lib/utils/formatPrice'

function currentMonth() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export default function AdminGstPage() {
  const [month, setMonth] = useState(currentMonth())
  const [report, setReport] = useState<GstReport | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    settingsApi.gstReport(month)
      .then(setReport)
      .catch(() => setReport(null))
      .finally(() => setLoading(false))
  }, [month])

  return (
    <>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-2">
        <h1 className="font-serif text-3xl text-[#0a0a0a]">GST collected</h1>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border border-[#e8e4e0] px-3 py-2 text-sm"
        />
      </div>
      <p className="text-sm text-[#6b6b6b] mb-8">
        GST included in paid orders for the selected month. Based on your registered state and GST rate in Settings.
      </p>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : report ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatsCard title="Paid Orders" value={report.orders} />
            <StatsCard title="Gross Sales" value={formatPrice(report.gross_sales)} />
            <StatsCard title="Taxable Value (ex-GST)" value={formatPrice(report.net_value)} />
            <StatsCard title={`Total GST (${report.gst_rate}%)`} value={formatPrice(report.total_gst)} />
          </div>

          <div className="bg-white border border-[#e8e4e0] p-6 max-w-lg">
            <h2 className="font-serif text-lg text-[#0a0a0a] mb-4">Tax breakdown</h2>
            <table className="w-full text-sm font-sans">
              <tbody>
                <Row label="CGST (intra-state)" value={formatPrice(report.cgst)} />
                <Row label="SGST (intra-state)" value={formatPrice(report.sgst)} />
                <Row label="IGST (inter-state)" value={formatPrice(report.igst)} />
                <tr className="border-t-2 border-[#0a0a0a]">
                  <td className="py-2 font-medium text-[#0a0a0a]">Total GST</td>
                  <td className="py-2 text-right font-medium text-[#0a0a0a]">{formatPrice(report.total_gst)}</td>
                </tr>
              </tbody>
            </table>
            <p className="text-[11px] text-[#6b6b6b] mt-4">
              Figures are GST-inclusive (tax is the portion within each price). Use for reference; verify against your accounting before filing.
            </p>
          </div>
        </>
      ) : (
        <p className="text-sm text-[#6b6b6b]">No data for this month.</p>
      )}
    </>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-[#f0ece8]">
      <td className="py-2 text-[#6b6b6b]">{label}</td>
      <td className="py-2 text-right text-[#0a0a0a]">{value}</td>
    </tr>
  )
}
