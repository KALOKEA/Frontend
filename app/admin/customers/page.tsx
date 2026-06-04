'use client'
import { useEffect, useState, useRef } from 'react'
import { adminApi, type AdminCustomer, type CustomerDetail } from '@/lib/api/admin'
import Spinner from '@/components/ui/Spinner'
import { formatPrice } from '@/lib/utils/formatPrice'

interface UserForm {
  id?: string
  name: string
  email: string
  phone: string
  role: 'customer' | 'admin'
}

const emptyForm = (): UserForm => ({ name: '', email: '', phone: '', role: 'customer' })

function userToForm(u: AdminCustomer): UserForm {
  return {
    id: u.id,
    name: u.name || '',
    email: u.email || '',
    phone: u.phone || '',
    role: (u.role as 'customer' | 'admin') || 'customer',
  }
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [exporting, setExporting] = useState(false)

  // Search
  const [search, setSearch] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<AdminCustomer[] | null>(null)
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Modals
  const [form, setForm] = useState<UserForm | null>(null)
  const [saving, setSaving] = useState(false)
  const [formMsg, setFormMsg] = useState<string | null>(null)
  const [detail, setDetail] = useState<CustomerDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const limit = 20

  useEffect(() => {
    load(page)
  }, [page]) // eslint-disable-line react-hooks/exhaustive-deps

  function load(p = page) {
    setLoading(true)
    adminApi.listCustomers(p, limit)
      .then(res => { setCustomers((res as any).data || []); setTotal((res as any).meta?.total || 0) })
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false))
  }

  // Debounced search
  function onSearchChange(val: string) {
    setSearch(val)
    if (searchTimer.current) clearTimeout(searchTimer.current)
    if (!val.trim()) { setSearchResults(null); return }
    searchTimer.current = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await adminApi.searchCustomers(val.trim())
        setSearchResults(Array.isArray(res) ? res : (res as any)?.data || [])
      } catch { setSearchResults([]) }
      finally { setSearching(false) }
    }, 350)
  }

  async function exportAll() {
    setExporting(true)
    try { await adminApi.exportCustomers() }
    catch { /* ignore */ }
    finally { setExporting(false) }
  }

  async function openDetail(id: string) {
    setDetailLoading(true); setDetail(null)
    try { setDetail(await adminApi.getCustomerDetail(id)) }
    catch { /* ignore */ }
    finally { setDetailLoading(false) }
  }

  async function deleteCustomer(c: AdminCustomer) {
    if (!confirm(
      `Delete "${c.name || c.email || 'this user'}"?\n\nBlocked if they have any orders — deactivate those first or change their role to "banned" instead.`
    )) return
    try {
      await adminApi.deleteUser(c.id)
      load(page)
    } catch (e: any) {
      alert(e?.message || 'Delete failed')
    }
  }

  async function saveUser() {
    if (!form) return
    if (!form.email && !form.phone) { setFormMsg('Email or phone is required'); return }
    setSaving(true); setFormMsg(null)
    try {
      const payload = {
        name: form.name || undefined,
        email: form.email || undefined,
        phone: form.phone || undefined,
        role: form.role,
      }
      if (form.id) await adminApi.updateUser(form.id, payload)
      else await adminApi.createUser(payload)
      setForm(null)
      load(page)
    } catch (e: any) {
      setFormMsg(e?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const displayed = searchResults ?? customers

  return (
    <>
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-3 mb-6">
        <div>
          <h1 className="font-serif text-3xl text-[#0a0a0a]">Customers</h1>
          <p className="text-sm text-[#6b6b6b] mt-1">{total} registered users</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setForm(emptyForm()); setFormMsg(null) }}
            className="px-4 py-2 text-sm bg-[#0a0a0a] text-white hover:bg-[#333] transition-colors"
          >
            + Add user
          </button>
          <button
            onClick={exportAll}
            disabled={exporting}
            className="px-4 py-2 text-sm border border-[#e8e4e0] hover:bg-[#faf8f5] disabled:opacity-50 transition-colors"
          >
            {exporting ? 'Exporting…' : '↓ Export CSV'}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <input
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search by name, email or phone…"
          className="w-full border border-[#e8e4e0] px-4 py-2.5 text-sm focus:border-[#0a0a0a] outline-none pr-10"
        />
        {searching && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            <Spinner size="sm" />
          </span>
        )}
        {search && !searching && (
          <button
            onClick={() => { setSearch(''); setSearchResults(null) }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9b9b9b] hover:text-[#0a0a0a] text-lg leading-none"
          >
            ×
          </button>
        )}
      </div>

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
              {displayed.map(c => (
                <tr
                  key={c.id}
                  className="border-b border-[#f0ece8] last:border-0 hover:bg-[#faf8f5] transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-[#0a0a0a]">{c.name || '—'}</span>
                  </td>
                  <td className="px-4 py-3 text-[#6b6b6b]">{c.email || '—'}</td>
                  <td className="px-4 py-3 text-[#6b6b6b]">{c.phone || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded ${
                      c.role === 'admin'
                        ? 'bg-[#c8a4a5]/20 text-[#0a0a0a] font-medium'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {c.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#6b6b6b] text-xs">
                    {new Date(c.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => openDetail(c.id)}
                      className="text-[11px] uppercase tracking-widest text-[#6b6b6b] hover:underline mr-3"
                    >
                      Orders
                    </button>
                    <button
                      onClick={() => { setForm(userToForm(c)); setFormMsg(null) }}
                      className="text-[11px] uppercase tracking-widest text-[#c8a4a5] hover:underline mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCustomer(c)}
                      className="text-[11px] uppercase tracking-widest text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!displayed.length && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-[#6b6b6b]">
                    {search ? `No users matching "${search}"` : 'No customers yet'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {!searchResults && total > limit && (
        <div className="flex gap-2 mt-4 items-center text-sm">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
            className="px-3 py-1 border border-[#e8e4e0] disabled:opacity-40 hover:bg-[#faf8f5]">← Prev</button>
          <span className="text-[#6b6b6b]">Page {page} of {Math.ceil(total / limit)}</span>
          <button disabled={page >= Math.ceil(total / limit)} onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 border border-[#e8e4e0] disabled:opacity-40 hover:bg-[#faf8f5]">Next →</button>
        </div>
      )}

      {/* ── Create / Edit user modal ─────────────────────────────────────── */}
      {form && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setForm(null)}>
          <div className="bg-white w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h2 className="font-serif text-xl mb-5 text-[#0a0a0a]">
              {form.id ? 'Edit user' : 'Add user'}
            </h2>

            <Field label="Full name">
              <input
                value={form.name}
                onChange={e => setForm(f => f ? { ...f, name: e.target.value } : f)}
                className="inp"
                placeholder="Priya Sharma"
              />
            </Field>

            <Field label="Email">
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => f ? { ...f, email: e.target.value } : f)}
                className="inp"
                placeholder="priya@example.com"
              />
            </Field>

            <Field label="Phone">
              <input
                value={form.phone}
                onChange={e => setForm(f => f ? { ...f, phone: e.target.value } : f)}
                className="inp"
                placeholder="+91 98765 43210"
              />
            </Field>

            <Field label="Role">
              <select
                value={form.role}
                onChange={e => setForm(f => f ? { ...f, role: e.target.value as 'customer' | 'admin' } : f)}
                className="inp bg-white"
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
              {form.role === 'admin' && (
                <p className="text-[11px] text-amber-600 mt-1">
                  Admin users can access the full admin panel.
                </p>
              )}
            </Field>

            {formMsg && <p className="text-sm text-red-600 mb-3">{formMsg}</p>}

            <div className="flex gap-2 justify-end mt-2">
              <button onClick={() => setForm(null)} className="px-4 py-2 text-sm border border-[#e8e4e0] hover:bg-[#faf8f5]">Cancel</button>
              <button
                onClick={saveUser}
                disabled={saving}
                className="px-4 py-2 text-sm bg-[#0a0a0a] text-white hover:bg-[#333] disabled:opacity-50"
              >
                {saving ? 'Saving…' : form.id ? 'Save changes' : 'Create user'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Customer detail / order history modal ───────────────────────── */}
      {(detail || detailLoading) && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setDetail(null)}>
          <div className="bg-white w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {detailLoading || !detail ? (
              <div className="flex justify-center py-10"><Spinner size="lg" /></div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="font-serif text-xl text-[#0a0a0a]">{detail.user.name || 'Customer'}</h2>
                    <p className="text-sm text-[#6b6b6b] mt-0.5">
                      {detail.user.email || '—'}{detail.user.phone ? ` · ${detail.user.phone}` : ''}
                    </p>
                  </div>
                  <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded ${
                    detail.user.role === 'admin' ? 'bg-[#c8a4a5]/20 text-[#0a0a0a]' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {detail.user.role}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  <Stat label="Orders" value={String(detail.stats.total_orders)} />
                  <Stat label="Total spent" value={formatPrice(detail.stats.total_spent)} />
                  <Stat label="Last order" value={detail.stats.last_order_at
                    ? new Date(detail.stats.last_order_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
                    : '—'} />
                </div>

                <h3 className="text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-2">Order history</h3>
                {detail.orders.length ? (
                  <div className="divide-y divide-[#f0ece8]">
                    {detail.orders.map(o => (
                      <div key={o.id} className="flex justify-between items-center py-2.5">
                        <div>
                          <p className="text-sm text-[#0a0a0a]">{o.order_number}</p>
                          <p className="text-[11px] text-[#9b9b9b]">
                            {new Date(o.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            {' · '}
                            <span className="capitalize">{o.status}</span>
                          </p>
                        </div>
                        <p className="text-sm font-medium">{formatPrice(o.total)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#6b6b6b] py-4 text-center">No orders yet.</p>
                )}

                <div className="flex justify-between mt-5 pt-4 border-t border-[#f0ece8]">
                  <button
                    onClick={() => { setDetail(null); setForm(userToForm(detail.user)); setFormMsg(null) }}
                    className="px-4 py-2 text-sm border border-[#e8e4e0] hover:bg-[#faf8f5]"
                  >
                    Edit user
                  </button>
                  <button onClick={() => setDetail(null)} className="px-4 py-2 text-sm bg-[#0a0a0a] text-white hover:bg-[#333]">
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        :global(.inp) {
          width: 100%;
          border: 1px solid #e8e4e0;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        :global(.inp:focus) { border-color: #0a0a0a; }
      `}</style>
    </>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">{label}</label>
      {children}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#faf8f5] border border-[#e8e4e0] p-3 text-center">
      <p className="text-[10px] uppercase tracking-widest text-[#6b6b6b]">{label}</p>
      <p className="text-base font-medium text-[#0a0a0a] mt-1">{value}</p>
    </div>
  )
}
