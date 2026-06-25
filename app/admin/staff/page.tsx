'use client'
import { useEffect, useRef, useState } from 'react'
import { staffApi, type StaffMember } from '@/lib/api/staff'
import { GRANTABLE_PERMISSIONS, PERMISSION_META, type Permission } from '@/lib/permissions'
import Spinner from '@/components/ui/Spinner'

interface FormState {
  id?: string
  name: string
  email: string
  phone: string
  permissions: string[]
}

const emptyForm = (): FormState => ({ name: '', email: '', phone: '', permissions: [] })

export default function AdminStaffPage() {
  const [members, setMembers] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm]       = useState<FormState | null>(null)
  const [saving, setSaving]   = useState(false)
  const [toast, setToast]     = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)
  const toastTimer            = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current) }, [])

  function showToast(msg: string, type: 'ok' | 'err' = 'ok') {
    setToast({ msg, type })
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 3000)
  }

  function load() {
    setLoading(true)
    staffApi.list()
      .then((res) => setMembers(Array.isArray(res) ? res : []))
      .catch(() => setMembers([]))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  function openNew() { setForm(emptyForm()) }
  function openEdit(m: StaffMember) {
    setForm({ id: m.id, name: m.name || '', email: m.email || '', phone: m.phone || '', permissions: [...(m.permissions || [])] })
  }

  function togglePerm(p: Permission) {
    setForm((f) => {
      if (!f) return f
      const has = f.permissions.includes(p)
      return { ...f, permissions: has ? f.permissions.filter((x) => x !== p) : [...f.permissions, p] }
    })
  }

  function selectAll() {
    setForm((f) => (f ? { ...f, permissions: [...GRANTABLE_PERMISSIONS] } : f))
  }
  function clearAll() {
    setForm((f) => (f ? { ...f, permissions: [] } : f))
  }

  async function save() {
    if (!form) return
    if (form.permissions.length === 0) { showToast('Select at least one section.', 'err'); return }
    setSaving(true)
    try {
      if (form.id) {
        await staffApi.update(form.id, { name: form.name.trim() || undefined, permissions: form.permissions })
        showToast('Staff member updated')
      } else {
        if (!form.email.trim() && !form.phone.trim()) {
          showToast('Email or phone is required.', 'err'); setSaving(false); return
        }
        await staffApi.create({
          name: form.name.trim() || undefined,
          email: form.email.trim() || undefined,
          phone: form.phone.trim() || undefined,
          permissions: form.permissions,
        })
        showToast('Staff member added')
      }
      setForm(null)
      load()
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Save failed', 'err')
    } finally {
      setSaving(false)
    }
  }

  async function revoke(m: StaffMember) {
    if (!confirm(`Revoke admin access for ${m.name || m.email || m.phone}? They will become a normal customer.`)) return
    try {
      await staffApi.revoke(m.id)
      showToast('Access revoked')
      load()
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Failed', 'err')
    }
  }

  const staff = members.filter((m) => m.role === 'staff')
  const owners = members.filter((m) => m.role === 'admin')

  return (
    <>
      {toast && (
        <div className={`fixed top-4 right-4 z-[60] px-4 py-3 text-sm shadow-lg max-w-xs ${
          toast.type === 'ok' ? 'bg-[#0a0a0a] text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.msg}
        </div>
      )}

      <div className="flex flex-wrap justify-between items-center mb-8 gap-3">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-[#0a0a0a]">Staff &amp; Access</h1>
          <p className="text-sm text-[#6b6b6b] mt-1">
            {staff.length} staff · {owners.length} full admin{owners.length === 1 ? '' : 's'}
          </p>
        </div>
        <button
          onClick={openNew}
          className="px-4 py-2 text-sm bg-[#0a0a0a] text-white hover:bg-[#333] transition-colors"
        >
          + Add staff
        </button>
      </div>

      <p className="text-sm text-[#6b6b6b] mb-6 max-w-2xl">
        Staff sign in with the email or phone you set here (one-time code, same as customers). They will only
        see and be able to use the sections you tick. Full admins always have complete access and cannot be limited here.
      </p>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="bg-white border border-[#e8e4e0] overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm font-sans">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-widest text-[#6b6b6b] border-b border-[#e8e4e0]">
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Access</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center text-[#6b6b6b]">
                    <p className="font-serif text-lg mb-1">No staff yet</p>
                    <p className="text-xs">Click &quot;+ Add staff&quot; to give a team member limited access.</p>
                  </td>
                </tr>
              ) : members.map((m) => (
                <tr key={m.id} className="border-b border-[#f0ece8] last:border-0 hover:bg-[#faf8f5] transition-colors align-top">
                  <td className="px-4 py-3 font-medium text-[#0a0a0a]">{m.name || '—'}</td>
                  <td className="px-4 py-3 text-[#6b6b6b] text-xs">
                    <div>{m.email || '—'}</div>
                    {m.phone && <div>{m.phone}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 ${
                      m.role === 'admin' ? 'bg-[#f5f0e8] text-[#8a6a00]' : 'bg-[#e8f5e9] text-[#2e7d32]'
                    }`}>
                      {m.role === 'admin' ? 'Full Admin' : 'Staff'}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-w-[280px]">
                    {m.role === 'admin' ? (
                      <span className="text-xs text-[#6b6b6b]">All sections</span>
                    ) : m.permissions.length === 0 ? (
                      <span className="text-xs text-[#6b6b6b]">No access</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {m.permissions.map((p) => (
                          <span key={p} className="text-[10px] px-1.5 py-0.5 bg-[#f4f2ef] text-[#6b6b6b] rounded-sm">
                            {PERMISSION_META[p as Permission]?.label || p}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {m.role === 'staff' ? (
                      <>
                        <button onClick={() => openEdit(m)} className="text-[11px] uppercase tracking-widest text-[#c8a4a5] hover:underline mr-4">Edit</button>
                        <button onClick={() => revoke(m)} className="text-[11px] uppercase tracking-widest text-red-500 hover:underline">Revoke</button>
                      </>
                    ) : (
                      <span className="text-[11px] text-[#6b6b6b]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Add / Edit modal ────────────────────────────────────────────── */}
      {form && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto">
          <div aria-hidden="true" className="fixed inset-0 bg-black/50" onClick={() => setForm(null)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={form.id ? 'Edit staff member' : 'Add staff member'}
            className="relative bg-white w-full max-w-lg p-6 my-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-serif text-xl mb-5 text-[#0a0a0a]">
              {form.id ? 'Edit staff access' : 'Add staff member'}
            </h2>

            <label className="block mb-3">
              <span className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Name</span>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => f ? { ...f, name: e.target.value } : f)}
                className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:border-[#0a0a0a] outline-none"
                placeholder="e.g. Priya (support)"
              />
            </label>

            {!form.id && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <label className="block">
                  <span className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Email</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => f ? { ...f, email: e.target.value } : f)}
                    className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:border-[#0a0a0a] outline-none"
                    placeholder="staff@example.com"
                  />
                </label>
                <label className="block">
                  <span className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Phone</span>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((f) => f ? { ...f, phone: e.target.value } : f)}
                    className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:border-[#0a0a0a] outline-none"
                    placeholder="+91…"
                  />
                </label>
                <p className="sm:col-span-2 text-[11px] text-[#6b6b6b] -mt-1">
                  They log in with this email or phone via a one-time code. At least one is required.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-widest text-[#6b6b6b]">Sections this person can access</span>
              <span className="text-[11px]">
                <button type="button" onClick={selectAll} className="text-[#c8a4a5] hover:underline mr-3">All</button>
                <button type="button" onClick={clearAll} className="text-[#6b6b6b] hover:underline">None</button>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-5 max-h-72 overflow-y-auto pr-1">
              {GRANTABLE_PERMISSIONS.map((p) => {
                const checked = form.permissions.includes(p)
                return (
                  <label
                    key={p}
                    className={`flex items-start gap-2 px-3 py-2 border cursor-pointer transition-colors ${
                      checked ? 'border-[#c8a4a5] bg-[#faf8f5]' : 'border-[#e8e4e0] hover:bg-[#faf8f5]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => togglePerm(p)}
                      className="mt-0.5 shrink-0"
                    />
                    <span>
                      <span className="block text-sm text-[#0a0a0a]">{PERMISSION_META[p].label}</span>
                      <span className="block text-[11px] text-[#6b6b6b]">{PERMISSION_META[p].description}</span>
                    </span>
                  </label>
                )
              })}
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setForm(null)}
                className="px-4 py-2 text-sm border border-[#e8e4e0] hover:bg-[#faf8f5] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="px-4 py-2 text-sm bg-[#0a0a0a] text-white hover:bg-[#333] disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving…' : form.id ? 'Save access' : 'Add staff'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
