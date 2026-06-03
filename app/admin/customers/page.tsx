'use client'
import { useEffect, useState } from 'react'
import { adminApi, type AdminCustomer, type CustomerDetail } from '@/lib/api/admin'
import Spinner from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toast'
import { formatPrice } from '@/lib/utils/formatPrice'

export default function AdminCustomersPage() {
  const { toast } = useToast()
  const [customers, setCustomers] = useState<AdminCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [exporting, setExporting] = useState(false)
  const [detail, setDetail] = useState<CustomerDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const limit = 20

  useEffect(() => {
    setLoading(true)
    adminApi.listCustomers(page, limit)
      .then((res) => { setCustomers(res.data || []); setTotal(res.meta?.total || 0) })
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false))
  }, [page])

  async function exportAll() {
    setExporting(true)
    try {
      await adminApi.exportCustomers()
    } catch {
      toast('Export failed', 'error')
    } finally {
      setExporting(false)
    }
  }

  async function openDetail(id: string) {
    setDetailLoading(true); setDetail(null)
    try {
      const d = await adminApi.getCustomerDetail(id)
      setDetail(d)
    } catch {
      toast('Could not load customer', 'error')
    } finally {
      setDetailLoading(false)
    }
  }

  return (
    <>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-2">
        <h1 className="font-serif text-3xl text-[#0a0a0a]">Customers</h1>
        <button onClick={exportAll} disabled={exporting} className="px-4 py-2 text-sm bg-[#0a0a0a] text-white disabled:opacity-50">
          {exporting ? 'Preparing…' : '⬇ Download all user data (CSV)'}
        </button>
      </div>
      <p className="text-sm text-[#6b6b6b] mb-8">{total} registered {total === 1 ? 'customer' : 'customers'}. Click a row to view their orders. The CSV includes order count, total spent and last order for every customer.</p>

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
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-[#f0ece8] last:border-0 hover:bg-[#faf8f5] cursor-pointer" onClick={() => openDetail(c.id)}>
                  <td className="px-4 py-3 font-medium text-[#0a0a0a]">{c.name || '—'}</td>
                  <td className="px-4 py-3 text-[#6b6b6b]">{c.email || '—'}</td>
                  <td className="px-4 py-3 text-[#6b6b6b]">{c.phone || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] ${c.role === 'admin' ? 'bg-[#c8a4a5]/20 text-[#0a0a0a]' : 'bg-gray-100 text-gray-600'}`}>{c.role}</span>
                  </td>
                  <td className="px-4 py-3 text-[#6b6b6b]">{new Date(c.created_at).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3 text-right text-[11px] uppercase tracking-widest text-[#c8a4a5]">View</td>
                </tr>
              ))}
              {!customers.length && <tr><td colSpan={6} className="px-4 py-8 text-center text-[#6b6b6b]">No customers</td></tr>}
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

      {(detail || detailLoading) && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setDetail(null)}>
          <div className="bg-white w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {detailLoading || !detail ? (
              <div className="flex justify-center py-10"><Spinner size="lg" /></div>
            ) : (
              <>
                <h2 className="font-serif text-xl text-[#0a0a0a] mb-1">{detail.user.name || 'Customer'}</h2>
                <p className="text-sm text-[#6b6b6b] mb-4">{detail.user.email || '—'} · {detail.user.phone || '—'}</p>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <Stat label="Orders" value={String(detail.stats.total_orders)} />
                  <Stat label="Total spent" value={formatPrice(detail.stats.total_spent)} />
                  <Stat label="Last order" value={detail.stats.last_order_at ? new Date(detail.stats.last_order_at).toLocaleDateString('en-IN') : '—'} />
                </div>
                <h3 className="text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-2">Order history</h3>
                {detail.orders.length ? (
                  <table className="w-full text-sm">
                    <tbody>
                      {detail.orders.map((o) => (
                        <tr key={o.id} className="border-b border-[#f0ece8]">
                          <td className="py-2 text-[#0a0a0a]">{o.order_number}</td>
                          <td className="py-2 text-[#6b6b6b]">{o.status}</td>
                          <td className="py-2 text-[#6b6b6b]">{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                          <td className="py-2 text-right text-[#0a0a0a]">{formatPrice(o.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p className="text-sm text-[#6b6b6b]">No orders yet.</p>}
                <div className="flex justify-end mt-5">
                  <button onClick={() => setDetail(null)} className="px-4 py-2 text-sm border border-[#e8e4e0]">Close</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#faf8f5] border border-[#e8e4e0] p-3">
      <p className="text-[10px] uppercase tracking-widest text-[#6b6b6b]">{label}</p>
      <p className="text-base font-medium text-[#0a0a0a] mt-1">{value}</p>
    </div>
  )
}
