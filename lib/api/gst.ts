import api, { getAccessToken, BASE_URL } from './client'

export interface GstLedgerRow {
  id: string
  txn_type: 'sale' | 'return' | 'exchange'
  txn_date: string
  order_number?: string
  customer_name?: string
  customer_gstin?: string
  hsn_code?: string
  description?: string
  quantity: number
  gst_rate: number
  place_of_supply?: string
  is_intra_state: boolean
  taxable_value: number
  cgst: number
  sgst: number
  igst: number
  total_gst: number
  gross: number
}

export interface GstTotals {
  taxable: number
  cgst: number
  sgst: number
  igst: number
  total_gst: number
  gross: number
}

export interface GstSummary {
  from: string | null
  to: string | null
  totals: GstTotals
  by_type: { sale: GstTotals; return: GstTotals; exchange: GstTotals }
  by_rate: ({ gst_rate: number } & GstTotals)[]
  count: number
}

function qs(params: Record<string, string | undefined>): string {
  const p = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => { if (v) p.set(k, v) })
  const s = p.toString()
  return s ? `?${s}` : ''
}

/** Authenticated CSV download → triggers a browser file save. */
async function downloadCsv(path: string, filename: string) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: getAccessToken() ? { Authorization: `Bearer ${getAccessToken()}` } : {},
    credentials: 'include',
  })
  if (!res.ok) throw new Error(`Download failed (${res.status})`)
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export const gstApi = {
  ledger: (params: { from?: string; to?: string; type?: string }) =>
    api.get<GstLedgerRow[]>(`/gst/ledger${qs(params)}`),
  summary: (params: { from?: string; to?: string }) =>
    api.get<GstSummary>(`/gst/summary${qs(params)}`),

  downloadTransactions: (params: { from?: string; to?: string; type?: string }) =>
    downloadCsv(`/gst/export/transactions${qs(params)}`, `gst-transactions${params.from ? '-' + params.from : ''}.csv`),
  downloadSummary: (params: { from?: string; to?: string }) =>
    downloadCsv(`/gst/export/summary${qs(params)}`, `gst-summary${params.from ? '-' + params.from : ''}.csv`),
}
