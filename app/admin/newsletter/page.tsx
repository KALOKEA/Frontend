'use client'
import { useEffect, useState } from 'react'
import api, { getAccessToken } from '@/lib/api/client'
import Spinner from '@/components/ui/Spinner'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-73aa.up.railway.app'

interface Subscriber { email: string; is_active: boolean; created_at: string }

export default function AdminNewsletterPage() {
  const [data, setData] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [exporting, setExporting] = useState(false)
  const LIMIT = 50

  function load(p = 1, f = filter) {
    setLoading(true)
    const activeParam = f === 'all' ? '' : `&active=${f === 'active'}`
    api.get<any>(`/newsletter/admin/subscribers?page=${p}&limit=${LIMIT}${activeParam}`)
      .then(r => { setData(r.data || []); setTotal(r.meta?.total || 0) })
      .catch(() => setData([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load(1, filter) }, [filter])

  async function handleExport() {
    setExporting(true)
    try {
      const res = await fetch(`${BASE_URL}/newsletter/admin/export`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          ...(getAccessToken() ? { Authorization: `Bearer ${getAccessToken()}` } : {}),
        },
        credentials: 'include',
      })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `kalokea-subscribers-${new Date().toISOString().slice(0,10)}.csv`
      document.body.appendChild(a); a.click(); a.remove()
      URL.revokeObjectURL(url)
    } finally { setExporting(false) }
  }

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <>
      <div className="flex flex-wrap justify-between items-center mb-8 gap-3">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-[#0a0a0a]">Newsletter</h1>
          <p className="text-sm text-[#6b6b6b] mt-1">{total.toLocaleString()} subscribers total</p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="px-4 py-2 text-sm border border-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white transition-colors disabled:opacity-50"
        >
          {exporting ? 'Exporting…' : 'Export CSV'}
        </button>
      </div>

      <div className="flex gap-2 mb-5">
        {(['all','active','inactive'] as const).map(f => (
          <button
            key={f}
            onClick={() => { setFilter(f); setPage(1) }}
            className={`px-3 py-1 text-[11px] uppercase tracking-widest border transition-colors ${
              filter === f ? 'bg-[#0a0a0a] text-white border-[#0a0a0a]' : 'border-[#e8e4e0] text-[#6b6b6b] hover:border-[#0a0a0a]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="bg-white border border-[#e8e4e0] overflow-x-auto">
          <table className="w-full min-w-[400px] text-sm font-sans">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-widest text-[#6b6b6b] border-b border-[#e8e4e0]">
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {data.map(s => (
                <tr key={s.email} className="border-b border-[#f0ece8] last:border-0 hover:bg-[#faf8f5]">
                  <td className="px-4 py-3 font-mono text-sm text-[#0a0a0a]">{s.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded ${
                      s.is_active ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {s.is_active ? 'Active' : 'Unsubscribed'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#6b6b6b]">
                    {new Date(s.created_at).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
                  </td>
                </tr>
              ))}
              {!data.length && (
                <tr><td colSpan={3} className="px-4 py-10 text-center text-[#6b6b6b]">No subscribers</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button disabled={page === 1} onClick={() => { setPage(p => p-1); load(page-1) }}
            className="px-3 py-1 border border-[#e8e4e0] text-sm disabled:opacity-40 hover:bg-[#faf8f5]">←</button>
          <span className="px-3 py-1 text-sm text-[#6b6b6b]">{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => { setPage(p => p+1); load(page+1) }}
            className="px-3 py-1 border border-[#e8e4e0] text-sm disabled:opacity-40 hover:bg-[#faf8f5]">→</button>
        </div>
      )}
    </>
  )
}
