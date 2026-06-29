'use client'
import { useEffect, useState, useCallback } from 'react'
import { gstApi, type GstSummary, type GstLedgerRow, type GstCashflow } from '@/lib/api/gst'
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
  const [cashflow, setCashflow] = useState<GstCashflow | null>(null)
  const [rows, setRows] = useState<GstLedgerRow[]>([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    Promise.all([
      gstApi.summary({ from, to }),
      gstApi.ledger({ from, to, type: type || undefined }),
      gstApi.cashflow({ from, to }),
    ])
      .then(([s, r, cf]) => { setSummary(s); setRows(r); setCashflow(cf) })
      .catch(() => { setSummary(null); setRows([]); setCashflow(null) })
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

  // When admin selects a specific type, stat cards should reflect only that type.
  // summary.by_type already has per-type aggregates from the backend — no extra
  // network call needed; we just pick the right slice.
  const t = type && summary?.by_type?.[type as 'sale' | 'return' | 'exchange']
    ? summary.by_type[type as 'sale' | 'return' | 'exchange']
    : summary?.totals
  // rows is already filtered by type (passed via ledger endpoint), so rows.length
  // gives the correct entry count for the active filter.
  const entryCount = rows.length

  // Rate-wise breakdown — when a type filter is active, compute from the
  // already-filtered rows so the rate table is consistent with the stat cards.
  // When "All", use the backend-aggregated by_rate (net of all types).
  const byRate: { gst_rate: number; taxable: number; cgst: number; sgst: number; igst: number; total_gst: number }[] = (() => {
    // No type filter → use backend-aggregated net (all types).
    if (!type) return summary?.by_rate || []
    // Type is filtered but no rows for this type → show empty (not all-type fallback).
    if (!rows.length) return []
    const map = new Map<number, { gst_rate: number; taxable: number; cgst: number; sgst: number; igst: number; total_gst: number }>()
    for (const r of rows) {
      const rate = Number(r.gst_rate) || 0
      if (!map.has(rate)) map.set(rate, { gst_rate: rate, taxable: 0, cgst: 0, sgst: 0, igst: 0, total_gst: 0 })
      const e = map.get(rate)!
      e.taxable += Number(r.taxable_value) || 0
      e.cgst += Number(r.cgst) || 0
      e.sgst += Number(r.sgst) || 0
      e.igst += Number(r.igst) || 0
      e.total_gst += Number(r.total_gst) || 0
    }
    return [...map.values()].sort((a, b) => a.gst_rate - b.gst_rate)
  })()

  return (
    <>
      <div className="flex flex-wrap justify-between items-end gap-4 mb-2">
        <h1 className="font-serif text-2xl md:text-3xl text-[#0a0a0a]">GST &amp; Tax Tracking</h1>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="gst-from" className="block text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-1">From</label>
            <input id="gst-from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="border border-[#e8e4e0] px-3 py-2 text-sm" />
          </div>
          <div>
            <label htmlFor="gst-to" className="block text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-1">To</label>
            <input id="gst-to" type="date" value={to} onChange={(e) => setTo(e.target.value)} className="border border-[#e8e4e0] px-3 py-2 text-sm" />
          </div>
          <div>
            <label htmlFor="gst-type" className="block text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-1">Type</label>
            <select id="gst-type" value={type} onChange={(e) => setType(e.target.value)} className="border border-[#e8e4e0] px-3 py-2 text-sm">
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
          {type && (
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${TYPE_BADGE[type] || 'bg-gray-100 text-gray-600'}`}>
                {type.charAt(0).toUpperCase() + type.slice(1)}s only
              </span>
              <span className="text-xs text-[#6b6b6b]">Cards and rate-wise table reflect this filter. "All" shows net totals.</span>
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatsCard title="Taxable Value" value={formatPrice(t!.taxable)} />
            <StatsCard title="Net GST Payable" value={formatPrice(t!.total_gst)} />
            <StatsCard title="Gross (incl. GST)" value={formatPrice(t!.gross)} />
            <StatsCard title="Ledger Entries" value={entryCount} />
          </div>

          {/* ── Cash flow / settlement — the 3 money scenarios ── */}
          {cashflow && (
            <div className="bg-white border border-[#e8e4e0] p-6 mb-8">
              <h2 className="font-serif text-lg text-[#0a0a0a] mb-1">Cash flow &amp; settlement</h2>
              <p className="text-xs text-[#6b6b6b] mb-4">
                Money view (not tax). COD cash is counted as received once the order is marked <strong>delivered</strong>.
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="border border-[#e8e4e0] p-4">
                  <p className="text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-1">Money received</p>
                  <p className="text-2xl font-serif text-green-700">{formatPrice(cashflow.collected)}</p>
                  <p className="text-[11px] text-[#6b6b6b] mt-1">Prepaid {formatPrice(cashflow.prepaid_collected)} · COD {formatPrice(cashflow.cod_collected)}</p>
                </div>
                <div className="border border-[#e8e4e0] p-4">
                  <p className="text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-1">COD outstanding</p>
                  <p className="text-2xl font-serif text-amber-700">{formatPrice(cashflow.cod_outstanding)}</p>
                  <p className="text-[11px] text-[#6b6b6b] mt-1">{cashflow.counts.cod_outstanding} order(s) sold, cash not yet collected</p>
                </div>
                <div className="border border-[#e8e4e0] p-4">
                  <p className="text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-1">Refunded (paid out)</p>
                  <p className="text-2xl font-serif text-red-600">{formatPrice(cashflow.refunded)}</p>
                  <p className="text-[11px] text-[#6b6b6b] mt-1">{cashflow.counts.refunded} return/exchange refund(s)</p>
                </div>
                <div className="border border-[#e8e4e0] p-4 bg-[#faf8f5]">
                  <p className="text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-1">Net in hand</p>
                  <p className="text-2xl font-serif text-[#0a0a0a]">{formatPrice(cashflow.net_in_hand)}</p>
                  <p className="text-[11px] text-[#6b6b6b] mt-1">Received − refunded</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* CGST / SGST / IGST */}
            <div className="bg-white border border-[#e8e4e0] p-6">
              <h2 className="font-serif text-lg text-[#0a0a0a] mb-4">
                Net tax breakdown{type ? <span className="text-sm font-sans font-normal text-[#6b6b6b] ml-2">({type}s)</span> : ''}
              </h2>
              <table className="w-full text-sm font-sans">
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
              <table className="w-full text-sm font-sans">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-widest text-[#6b6b6b] border-b border-[#e8e4e0]">
                    <th className="py-2">Type</th><th className="py-2 text-right">Taxable</th><th className="py-2 text-right">GST</th>
                  </tr>
                </thead>
                <tbody>
                  {(['sale', 'return', 'exchange'] as const).map((k) => (
                    <tr key={k} className={`border-b border-[#f0ece8] ${type === k ? 'bg-[#faf8f5] font-medium' : ''}`}>
                      <td className="py-2 capitalize text-[#0a0a0a]">
                        {k}s
                        {type === k && <span className="ml-1.5 text-[9px] uppercase tracking-widest text-[#c8a4a5]">active</span>}
                      </td>
                      <td className="py-2 text-right text-[#6b6b6b]">{formatPrice(summary.by_type[k].taxable)}</td>
                      <td className="py-2 text-right text-[#6b6b6b]">{formatPrice(summary.by_type[k].total_gst)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rate-wise (GSTR-1 style) */}
          {byRate.length > 0 && (
            <div className="bg-white border border-[#e8e4e0] mb-8 overflow-x-auto">
              <h2 className="font-serif text-lg text-[#0a0a0a] px-6 pt-5 pb-3">
                Rate-wise summary (GSTR-1)
                {type && <span className="text-sm font-sans font-normal text-[#6b6b6b] ml-2">— {type}s</span>}
              </h2>
              <table className="w-full min-w-[540px] text-sm font-sans">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-widest text-[#6b6b6b] border-b border-[#e8e4e0]">
                    <th className="px-6 py-3">Rate</th><th className="px-4 py-3 text-right">Taxable</th>
                    <th className="px-4 py-3 text-right">CGST</th><th className="px-4 py-3 text-right">SGST</th>
                    <th className="px-4 py-3 text-right">IGST</th><th className="px-6 py-3 text-right">Total GST</th>
                  </tr>
                </thead>
                <tbody>
                  {byRate.map((r) => (
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
