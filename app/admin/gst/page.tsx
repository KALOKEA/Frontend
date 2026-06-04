'use client'
import { useEffect, useState, useCallback } from 'react'
import { gstApi, type GstSummary, type GstLedgerRow } from '@/lib/api/gst'
import StatsCard from '@/components/admin/StatsCard'
import Spinner from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toast'
import { formatPrice } from '@/lib/utils/formatPrice'

// Default to the current financial-month-to-date.
function monthStart() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
}
function today() {
  return new Date().toISOString().slice(0, 10)
}

const TYPE_BADGE: Record<string, string> = {
  sale: 'bg-green-100 text-green-800',
  return: 'bg-red-100 text-red-700',
  exchange: 'bg-amber-100 text-amber-800',
}

export default function AdminGstPage() {
  const { toast } = useToast()
  const [from, setFrom] = useState(monthStart())
  const [to, setTo] = useState(today())
  const [type, setType] = useState('')
  const [summary, setSummary] = useState<GstSummary | null>(null)
  const [rows, setRows] = useState<GstLedgerRow[]>([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    Promise.all([
      gstApi.summary({ from, to }),
      gstApi.ledger({ from, to, type: type || undefined }),
    ])
      .then(([s, r]) => { setSummary(s); setRows(r) })
      .catch(() => { setSummary(null); setRows([]) })
      .finally(() => setLoading(false))
  }, [from, to, type])

  useEffect(() => { load() }, [load])

  async function download(kind: 'transactions' | 'summary') {
    setDownloading(true)
    try {
      if (kind === 'transactions') await gstApi.downloadTransactions({ from, to, type: type || undefined })
      else await gstApi.downloadSummary({ from, to })
    } catch {
      toast('Download failed', 'error')
    } finally {
      setDownloading(false)
    }
  }

  const t = summary?.totals

  return (
    <>
      <div className="flex flex-wrap justify-between items-end gap-4 mb-2">
        <h1 className="font-serif text-2xl md:text-3xl text-[#0a0a0a]">GST &amp; Tax Tracking</h1>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-1">From</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="border border-[#e8e4e0] px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-1">To</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="border border-[#e8e4e0] px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-1">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="border border-[#e8e4e0] px-3 py-2 text-sm">
              <option value="">All</option>
              <option value="sale">Sales</option>
              <option value="return">Returns</option>
              <option value="exchange">Exchanges</option>
            </select>
          </div>
        </div>
      </div>
      <p className="text-sm text-[#6b6b6b] mb-6">
        Net GST after returns &amp; exchanges, by place of supply. Export the full ledger or a rate-wise summary for your CA / GSTR &amp; ITR filing.
      </p>

      <div className="flex flex-wrap gap-3 mb-8">
        <button onClick={() => download('transactions')} disabled={downloading} className="px-4 py-2 text-sm bg-[#0a0a0a] text-white disabled:opacity-50">
          {downloading ? 'Preparing…' : 'Download transactions (CSV / Excel)'}
        </button>
        <button onClick={() => download('summary')} disabled={downloading} className="px-4 py-2 text-sm border border-[#0a0a0a] text-[#0a0a0a] disabled:opacity-50">
          Download rate-wise summary (CSV / Excel)
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : !summary ? (
        <p className="text-sm text-[#6b6b6b]">No data for this period.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatsCard title="Taxable Value" value={formatPrice(t!.taxable)} />
            <StatsCard title="Net GST Payable" value={formatPrice(t!.total_gst)} />
            <StatsCard title="Gross (incl. GST)" value={formatPrice(t!.gross)} />
            <StatsCard title="Ledger Entries" value={summary.count} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* CGST / SGST / IGST */}
            <div className="bg-white border border-[#e8e4e0] p-6">
              <h2 className="font-serif text-lg text-[#0a0a0a] mb-4">Net tax breakdown</h2>
              <table className="w-full min-w-[540px] text-sm font-sans">
                <tbody>
                  <Row label="CGST (intra-state)" value={formatPrice(t!.cgst)} />
                  <Row label="SGST (intra-state)" value={formatPrice(t!.sgst)} />
                  <Row label="IGST (inter-state)" value={formatPrice(t!.igst)} />
                  <tr className="border-t-2 border-[#0a0a0a]">
                    <td className="py-2 font-medium text-[#0a0a0a]">Total GST</td>
                    <td className="py-2 text-right font-medium text-[#0a0a0a]">{formatPrice(t!.total_gst)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* By transaction type */}
            <div className="bg-white border border-[#e8e4e0] p-6">
              <h2 className="font-serif text-lg text-[#0a0a0a] mb-4">By transaction type</h2>
              <table className="w-full min-w-[540px] text-sm font-sans">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-widest text-[#6b6b6b] border-b border-[#e8e4e0]">
                    <th className="py-2">Type</th><th className="py-2 text-right">Taxable</th><th className="py-2 text-right">GST</th>
                  </tr>
                </thead>
                <tbody>
                  {(['sale', 'return', 'exchange'] as const).map((k) => (
                    <tr key={k} className="border-b border-[#f0ece8]">
                      <td className="py-2 capitalize text-[#0a0a0a]">{k}s</td>
                      <td className="py-2 text-right text-[#6b6b6b]">{formatPrice(summary.by_type[k].taxable)}</td>
                      <td className="py-2 text-right text-[#6b6b6b]">{formatPrice(summary.by_type[k].total_gst)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rate-wise (GSTR-1 style) */}
          {summary.by_rate.length > 0 && (
            <div className="bg-white border border-[#e8e4e0] mb-8">
              <h2 className="font-serif text-lg text-[#0a0a0a] px-6 pt-5 pb-3">Rate-wise summary (GSTR-1)</h2>
              <table className="w-full min-w-[540px] text-sm font-sans">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-widest text-[#6b6b6b] border-b border-[#e8e4e0]">
                    <th className="px-6 py-3">Rate</th><th className="px-4 py-3 text-right">Taxable</th>
                    <th className="px-4 py-3 text-right">CGST</th><th className="px-4 py-3 text-right">SGST</th>
                    <th className="px-4 py-3 text-right">IGST</th><th className="px-6 py-3 text-right">Total GST</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.by_rate.map((r) => (
                    <tr key={r.gst_rate} className="border-b border-[#f0ece8] last:border-0">
                      <td className="px-6 py-3 text-[#0a0a0a]">{r.gst_rate}%</td>
                      <td className="px-4 py-3 text-right text-[#6b6b6b]">{formatPrice(r.taxable)}</td>
                      <td className="px-4 py-3 text-right text-[#6b6b6b]">{formatPrice(r.cgst)}</td>
                      <td className="px-4 py-3 text-right text-[#6b6b6b]">{formatPrice(r.sgst)}</td>
                      <td className="px-4 py-3 text-right text-[#6b6b6b]">{formatPrice(r.igst)}</td>
                      <td className="px-6 py-3 text-right text-[#0a0a0a]">{formatPrice(r.total_gst)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Transaction ledger */}
          <h2 className="font-serif text-lg text-[#0a0a0a] mb-3">Transaction ledger</h2>
          <div className="bg-white border border-[#e8e4e0] overflow-x-auto">
            <table className="w-full min-w-[540px] text-sm font-sans whitespace-nowrap">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-widest text-[#6b6b6b] border-b border-[#e8e4e0]">
                  <th className="px-4 py-3">Date</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Item</th><th className="px-4 py-3">HSN</th><th className="px-4 py-3 text-right">Rate</th>
                  <th className="px-4 py-3 text-right">Taxable</th><th className="px-4 py-3 text-right">CGST</th>
                  <th className="px-4 py-3 text-right">SGST</th><th className="px-4 py-3 text-right">IGST</th>
                  <th className="px-4 py-3 text-right">Total GST</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-[#f0ece8] last:border-0">
                    <td className="px-4 py-2.5 text-[#6b6b6b]">{new Date(r.txn_date).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-2.5"><span className={`px-2 py-0.5 rounded text-[11px] ${TYPE_BADGE[r.txn_type] || 'bg-gray-100'}`}>{r.txn_type}</span></td>
                    <td className="px-4 py-2.5 text-[#0a0a0a]">{r.order_number || '—'}</td>
                    <td className="px-4 py-2.5 text-[#6b6b6b] max-w-[200px] truncate">{r.description}</td>
                    <td className="px-4 py-2.5 text-[#6b6b6b]">{r.hsn_code || '—'}</td>
                    <td className="px-4 py-2.5 text-right text-[#6b6b6b]">{r.gst_rate}%</td>
                    <td className="px-4 py-2.5 text-right text-[#6b6b6b]">{formatPrice(r.taxable_value)}</td>
                    <td className="px-4 py-2.5 text-right text-[#6b6b6b]">{formatPrice(r.cgst)}</td>
                    <td className="px-4 py-2.5 text-right text-[#6b6b6b]">{formatPrice(r.sgst)}</td>
                    <td className="px-4 py-2.5 text-right text-[#6b6b6b]">{formatPrice(r.igst)}</td>
                    <td className="px-4 py-2.5 text-right text-[#0a0a0a]">{formatPrice(r.total_gst)}</td>
                  </tr>
                ))}
                {!rows.length && <tr><td colSpan={11} className="px-4 py-8 text-center text-[#6b6b6b]">No transactions in this period</td></tr>}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-[#6b6b6b] mt-4 max-w-3xl">
            Returns and exchanges appear as negative (credit) entries, so totals are net of refunds. Figures are a bookkeeping aid —
            reconcile against your accounting before filing GSTR / ITR. Confirm HSN codes and rates with your CA.
          </p>
        </>
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
