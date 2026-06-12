'use client'
import { useEffect, useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { adminApi } from '@/lib/api/admin'
import { useToast } from '@/components/ui/Toast'
import Spinner from '@/components/ui/Spinner'

const STATUS_COLORS: Record<string, string> = {
  sent:     'bg-green-100 text-green-800',
  failed:   'bg-red-100 text-red-700',
  retrying: 'bg-amber-100 text-amber-700',
}

const EMAIL_TYPES = [
  'order_confirmation','order_shipped','order_cancelled',
  'return_filed','admin_return_filed','return_approved','return_rejected',
  'newsletter_welcome','password_reset','contact_form',
  'otp','back_in_stock',
]

export default function AdminEmailLogPage() {
  const { toast } = useToast()
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [status, setStatus] = useState('')
  const [emailType, setEmailType] = useState('')
  const [viewing, setViewing] = useState<any | null>(null)
  const [viewLoading, setViewLoading] = useState(false)
  const [resending, setResending] = useState<string | null>(null)
  const LIMIT = 50

  function load(p = 1) {
    setLoading(true)
    adminApi.getEmailLog(p, LIMIT, status || undefined, emailType || undefined)
      .then(r => {
        setData(r.data)
        setTotal(r.meta.total)
        setTotalPages(r.meta.total_pages)
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { setPage(1); load(1) }, [status, emailType])

  async function openView(row: any) {
    setViewing(row)
    setViewLoading(true)
    try {
      const detail = await adminApi.getEmailLogEntry(row.id)
      setViewing(detail)
    } catch {
      // Use cached row data if fetch fails
    } finally {
      setViewLoading(false)
    }
  }

  async function handleResend(row: any) {
    if (!confirm(`Resend this email to ${row.recipient}?`)) return
    setResending(row.id)
    try {
      const result = await adminApi.resendEmail(row.id)
      toast(result.message || 'Email resent successfully')
      load(page)
      if (viewing?.id === row.id) setViewing(null)
    } catch (e: any) {
      toast(e?.message || 'Failed to resend email')
    } finally {
      setResending(null)
    }
  }

  // Stat counts
  const sentCount = data.filter(r => r.status === 'sent').length
  const failedCount = data.filter(r => r.status === 'failed').length
  const retryCount = data.filter(r => r.status === 'retrying').length

  return (
    <>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-[#0a0a0a]">Email Log</h1>
          <p className="text-sm text-[#6b6b6b] mt-1">{total.toLocaleString()} total entries</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total (page)', value: data.length, color: 'bg-gray-50 text-gray-700' },
          { label: 'Sent', value: sentCount, color: 'bg-green-50 text-green-700' },
          { label: 'Failed', value: failedCount, color: 'bg-red-50 text-red-700' },
          { label: 'Retrying', value: retryCount, color: 'bg-amber-50 text-amber-700' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`${color} rounded-lg p-4 border border-current/10`}>
            <p className="text-xs font-sans opacity-70 mb-1">{label}</p>
            <p className="text-2xl font-serif font-semibold">{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="text-sm border border-[#e8e4e0] px-3 py-2 bg-white text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a]"
        >
          <option value="">All statuses</option>
          <option value="sent">Sent</option>
          <option value="failed">Failed</option>
          <option value="retrying">Retrying</option>
        </select>
        <select
          value={emailType}
          onChange={e => setEmailType(e.target.value)}
          className="text-sm border border-[#e8e4e0] px-3 py-2 bg-white text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a]"
        >
          <option value="">All types</option>
          {EMAIL_TYPES.map(t => (
            <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="bg-white border border-[#e8e4e0] overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm font-sans">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-widest text-[#6b6b6b] border-b border-[#e8e4e0] bg-[#faf8f5]">
                <th className="px-4 py-3">Recipient</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Retries</th>
                <th className="px-4 py-3">Sent</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map(row => (
                <tr key={row.id} className="border-b border-[#f0ece8] last:border-0 hover:bg-[#faf8f5] transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-[#0a0a0a] max-w-[180px] truncate">{row.recipient}</td>
                  <td className="px-4 py-3 text-[11px] uppercase tracking-wider text-[#6b6b6b] whitespace-nowrap">
                    {(row.email_type || '').replace(/_/g, ' ')}
                  </td>
                  <td className="px-4 py-3 text-[#0a0a0a] max-w-[200px] truncate">{row.subject || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded ${STATUS_COLORS[row.status] || 'bg-gray-100 text-gray-500'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-[#6b6b6b]">{row.retry_count ?? 0}</td>
                  <td className="px-4 py-3 text-[#6b6b6b] whitespace-nowrap text-xs">
                    {new Date(row.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}{' '}
                    {new Date(row.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openView(row)}
                        className="text-[10px] uppercase tracking-widest px-2.5 py-1.5 border border-[#e8e4e0] text-[#0a0a0a] hover:border-[#0a0a0a] whitespace-nowrap"
                      >
                        Details
                      </button>
                      {row.status === 'failed' && (
                        <button
                          onClick={() => handleResend(row)}
                          disabled={resending === row.id}
                          className="text-[10px] uppercase tracking-widest px-2.5 py-1.5 bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 whitespace-nowrap"
                        >
                          {resending === row.id ? '…' : 'Resend'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!data.length && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-[#6b6b6b]">No emails logged</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button disabled={page === 1} onClick={() => { const p = page - 1; setPage(p); load(p) }}
            className="px-3 py-1 border border-[#e8e4e0] text-sm disabled:opacity-40 hover:bg-[#faf8f5]"><ChevronLeft size={14} /></button>
          <span className="px-3 py-1 text-sm text-[#6b6b6b]">{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => { const p = page + 1; setPage(p); load(p) }}
            className="px-3 py-1 border border-[#e8e4e0] text-sm disabled:opacity-40 hover:bg-[#faf8f5]"><ChevronRight size={14} /></button>
        </div>
      )}

      {/* View/Details Modal */}
      {viewing && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setViewing(null)}
        >
          <div
            className="bg-white w-full max-w-lg max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-[#e8e4e0] sticky top-0 bg-white">
              <div>
                <h2 className="font-serif text-xl text-[#0a0a0a]">Email Details</h2>
                <p className="text-xs text-[#6b6b6b] mt-0.5 font-mono">{viewing.id}</p>
              </div>
              <button
                onClick={() => setViewing(null)}
                className="text-[#6b6b6b] hover:text-[#0a0a0a] text-xl leading-none ml-4 mt-0.5"
              >
                <X size={18} />
              </button>
            </div>

            {viewLoading ? (
              <div className="flex justify-center py-12"><Spinner size="lg" /></div>
            ) : (
              <div className="p-6 space-y-4 text-sm">
                {/* Fields */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-0.5">Recipient</p>
                    <p className="font-mono text-xs text-[#0a0a0a] break-all">{viewing.recipient || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-0.5">Type</p>
                    <p className="text-[#0a0a0a]">{(viewing.email_type || '—').replace(/_/g, ' ')}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-0.5">Status</p>
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded inline-block ${STATUS_COLORS[viewing.status] || 'bg-gray-100 text-gray-500'}`}>
                      {viewing.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-0.5">Retries</p>
                    <p className="text-[#0a0a0a]">{viewing.retry_count ?? 0}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-0.5">Subject</p>
                    <p className="text-[#0a0a0a]">{viewing.subject || '—'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-0.5">Sent At</p>
                    <p className="text-[#0a0a0a]">{new Date(viewing.created_at).toLocaleString('en-IN')}</p>
                  </div>
                </div>

                {/* Error message */}
                {viewing.error_message && (
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <p className="text-[10px] uppercase tracking-widest text-red-700 mb-1">Error</p>
                    <p className="font-mono text-xs text-red-700 whitespace-pre-wrap break-all">{viewing.error_message}</p>
                  </div>
                )}

                {/* Metadata */}
                {viewing.metadata && Object.keys(viewing.metadata).length > 0 && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-1">Metadata</p>
                    <pre className="bg-[#faf8f5] border border-[#e8e4e0] p-3 text-xs font-mono overflow-x-auto rounded text-[#0a0a0a] whitespace-pre-wrap">
                      {JSON.stringify(viewing.metadata, null, 2)}
                    </pre>
                  </div>
                )}

                {/* HTML body preview */}
                {viewing.body_html && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-1">Email Body</p>
                    <div
                      className="border border-[#e8e4e0] rounded overflow-hidden"
                      style={{ maxHeight: 300, overflowY: 'auto' }}
                    >
                      <iframe
                        srcDoc={viewing.body_html}
                        title="Email preview"
                        style={{ width: '100%', minHeight: 200, border: 'none' }}
                        sandbox="allow-same-origin"
                      />
                    </div>
                  </div>
                )}

                {/* Footer actions */}
                <div className="flex gap-2 justify-end pt-2 border-t border-[#e8e4e0]">
                  <button
                    onClick={() => setViewing(null)}
                    className="px-4 py-2 text-sm border border-[#e8e4e0] text-[#0a0a0a] hover:bg-[#faf8f5]"
                  >
                    Close
                  </button>
                  {viewing.status === 'failed' && (
                    <button
                      onClick={() => handleResend(viewing)}
                      disabled={resending === viewing.id}
                      className="px-4 py-2 text-sm bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50"
                    >
                      {resending === viewing.id ? 'Resending…' : 'Resend Email'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
