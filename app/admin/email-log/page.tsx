'use client'
import { useEffect, useState } from 'react'
import { adminApi } from '@/lib/api/admin'
import Spinner from '@/components/ui/Spinner'

const STATUS_COLORS: Record<string, string> = {
  sent: 'bg-[#e8f5e9] text-[#2e7d32]',
  failed: 'bg-[#fdecea] text-[#c62828]',
  retrying: 'bg-[#fff8e1] text-[#f57f17]',
}

const EMAIL_TYPES = [
  'order_confirmation','order_shipped','order_cancelled',
  'return_filed','admin_return_filed',
  'newsletter_welcome','password_reset','contact_form',
]

export default function AdminEmailLogPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [status, setStatus] = useState('')
  const [emailType, setEmailType] = useState('')
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

  return (
    <>
      <div className="mb-8">
        <h1 className="font-serif text-2xl md:text-3xl text-[#0a0a0a]">Email Log</h1>
        <p className="text-sm text-[#6b6b6b] mt-1">{total.toLocaleString()} entries</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="text-sm border border-[#e8e4e0] px-3 py-1.5 bg-white text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a]"
        >
          <option value="">All statuses</option>
          <option value="sent">Sent</option>
          <option value="failed">Failed</option>
          <option value="retrying">Retrying</option>
        </select>
        <select
          value={emailType}
          onChange={e => setEmailType(e.target.value)}
          className="text-sm border border-[#e8e4e0] px-3 py-1.5 bg-white text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a]"
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
          <table className="w-full min-w-[700px] text-sm font-sans">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-widest text-[#6b6b6b] border-b border-[#e8e4e0]">
                <th className="px-4 py-3">Recipient</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Retries</th>
                <th className="px-4 py-3">Sent</th>
              </tr>
            </thead>
            <tbody>
              {data.map(row => (
                <tr key={row.id} className="border-b border-[#f0ece8] last:border-0 hover:bg-[#faf8f5]">
                  <td className="px-4 py-3 font-mono text-xs text-[#0a0a0a] max-w-[200px] truncate">{row.recipient}</td>
                  <td className="px-4 py-3 text-[11px] uppercase tracking-wider text-[#6b6b6b]">
                    {(row.email_type || '').replace(/_/g, ' ')}
                  </td>
                  <td className="px-4 py-3 text-[#0a0a0a] max-w-[200px] truncate">{row.subject}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded ${STATUS_COLORS[row.status] || 'bg-gray-100 text-gray-500'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-[#6b6b6b]">{row.retry_count ?? 0}</td>
                  <td className="px-4 py-3 text-[#6b6b6b] whitespace-nowrap">
                    {new Date(row.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}{' '}
                    <span className="text-[11px]">{new Date(row.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                  </td>
                </tr>
              ))}
              {!data.length && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-[#6b6b6b]">No emails logged</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button disabled={page === 1} onClick={() => { const p = page - 1; setPage(p); load(p) }}
            className="px-3 py-1 border border-[#e8e4e0] text-sm disabled:opacity-40 hover:bg-[#faf8f5]">←</button>
          <span className="px-3 py-1 text-sm text-[#6b6b6b]">{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => { const p = page + 1; setPage(p); load(p) }}
            className="px-3 py-1 border border-[#e8e4e0] text-sm disabled:opacity-40 hover:bg-[#faf8f5]">→</button>
        </div>
      )}

      {/* Error details for failed emails */}
      {data.some(r => r.status === 'failed' && r.error_message) && (
        <div className="mt-6">
          <h2 className="text-sm font-medium text-[#0a0a0a] mb-3">Failed Email Errors</h2>
          <div className="space-y-2">
            {data.filter(r => r.status === 'failed' && r.error_message).map(r => (
              <div key={r.id} className="bg-[#fdecea] border border-[#ef9a9a] px-4 py-3 text-xs font-mono text-[#c62828]">
                <span className="font-medium">{r.recipient}</span> — {r.error_message}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
