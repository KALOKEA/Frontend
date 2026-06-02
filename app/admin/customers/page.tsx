'use client'
import { useEffect, useState } from 'react'
import { adminApi, type AdminCustomer } from '@/lib/api/admin'
import Spinner from '@/components/ui/Spinner'

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 20

  useEffect(() => {
    setLoading(true)
    adminApi.listCustomers(page, limit)
      .then((res) => { setCustomers(res.data || []); setTotal(res.meta?.total || 0) })
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false))
  }, [page])

  return (
    <>
      <h1 className="font-serif text-3xl text-[#0a0a0a] mb-8">Customers</h1>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="bg-white border border-[#e8e4e0]">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-widest text-[#6b6b6b] border-b border-[#e8e4e0]">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-[#f0ece8] last:border-0">
                  <td className="px-4 py-3 font-medium text-[#0a0a0a]">{c.name || '—'}</td>
                  <td className="px-4 py-3 text-[#6b6b6b]">{c.email || '—'}</td>
                  <td className="px-4 py-3 text-[#6b6b6b]">{c.phone || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] ${c.role === 'admin' ? 'bg-[#c8a4a5]/20 text-[#0a0a0a]' : 'bg-gray-100 text-gray-600'}`}>{c.role}</span>
                  </td>
                  <td className="px-4 py-3 text-[#6b6b6b]">{new Date(c.created_at).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
              {!customers.length && <tr><td colSpan={5} className="px-4 py-8 text-center text-[#6b6b6b]">No customers</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {total > limit && (
        <div className="flex gap-2 mt-4 items-center text-sm">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 border border-[#e8e4e0] disabled:opacity-40">Prev</button>
          <span className="text-[#6b6b6b]">Page {page} of {Math.ceil(total / limit)}</span>
          <button disabled={page >= Math.ceil(total / limit)} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 border border-[#e8e4e0] disabled:opacity-40">Next</button>
        </div>
      )}
    </>
  )
}
