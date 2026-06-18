'use client'
import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { adminApi } from '@/lib/api/admin'
import api from '@/lib/api/client'
import { useToast } from '@/components/ui/Toast'
import Spinner from '@/components/ui/Spinner'

interface Subscriber { email: string; is_active: boolean; created_at: string }
type Tab = 'subscribers' | 'campaign' | 'history'

export default function AdminNewsletterPage() {
  const { toast } = useToast()
  const [tab, setTab] = useState<Tab>('subscribers')

  // Subscriber state
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [exporting, setExporting] = useState(false)
  const LIMIT = 50

  // Stats
  const [stats, setStats] = useState<{
    total_subscribers: number; active_subscribers: number; unsubscribed: number; total_campaigns: number
  } | null>(null)

  // Campaign builder
  const [subject, setSubject] = useState('')
  const [previewText, setPreviewText] = useState('')
  const [bodyHtml, setBodyHtml] = useState('')
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ sent: number; failed: number; message: string } | null>(null)
  const [previewMode, setPreviewMode] = useState(false)

  // Campaign history
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [camLoading, setCamLoading] = useState(false)

  function loadSubscribers(p = 1, f = filter) {
    setLoading(true)
    const activeParam = f === 'all' ? '' : `&active=${f === 'active'}`
    api.get<any>(`/newsletter/admin/subscribers?page=${p}&limit=${LIMIT}${activeParam}`)
      .then(r => { setSubscribers(r.data || []); setTotal(r.meta?.total || 0) })
      .catch(() => setSubscribers([]))
      .finally(() => setLoading(false))
  }

  function loadStats() {
    adminApi.getNewsletterStats().then(setStats).catch(() => {})
  }

  function loadCampaigns() {
    setCamLoading(true)
    adminApi.listNewsletterCampaigns(1, 20)
      .then(r => setCampaigns((r as any).data || []))
      .catch(() => setCampaigns([]))
      .finally(() => setCamLoading(false))
  }

  useEffect(() => {
    loadStats()
    loadSubscribers(1, filter)
  }, [])

  useEffect(() => { loadSubscribers(1, filter); setPage(1) }, [filter])

  function switchTab(t: Tab) {
    setTab(t)
    if (t === 'history') loadCampaigns()
  }

  async function handleExport() {
    setExporting(true)
    try {
      await adminApi.exportNewsletterSubscribers()
    } catch { toast('Export failed') } finally { setExporting(false) }
  }

  async function handleSendCampaign() {
    if (!subject.trim() || !bodyHtml.trim()) {
      toast('Subject and body are required')
      return
    }
    const confirmMsg = `Send campaign to ${stats?.active_subscribers ?? '?'} active subscribers?`
    if (!confirm(confirmMsg)) return

    setSending(true)
    setSendResult(null)
    try {
      const result = await adminApi.sendNewsletterCampaign(subject, bodyHtml, previewText || undefined)
      setSendResult(result)
      toast(`Campaign sent: ${result.sent} delivered`)
      loadStats()
    } catch (e: any) {
      toast(e?.message || 'Failed to send campaign')
    } finally { setSending(false) }
  }

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-[#0a0a0a]">Newsletter</h1>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="px-4 py-2 text-sm border border-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white transition-colors disabled:opacity-50"
        >
          {exporting ? 'Exporting…' : 'Export CSV'}
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Subscribers', value: stats?.total_subscribers ?? '—', color: 'bg-gray-50 text-gray-700' },
          { label: 'Active', value: stats?.active_subscribers ?? '—', color: 'bg-green-50 text-green-700' },
          { label: 'Unsubscribed', value: stats?.unsubscribed ?? '—', color: 'bg-red-50 text-red-700' },
          { label: 'Campaigns Sent', value: stats?.total_campaigns ?? '—', color: 'bg-blue-50 text-blue-700' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`${color} rounded-lg p-4 border border-current/10`}>
            <p className="text-xs font-sans opacity-70 mb-1">{label}</p>
            <p className="text-2xl font-serif font-semibold">{value?.toLocaleString?.() ?? value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 mb-6 border-b border-[#e8e4e0]">
        {(['subscribers', 'campaign', 'history'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => switchTab(t)}
            className={`px-5 py-2.5 text-[11px] uppercase tracking-widest border-b-2 -mb-px transition-colors ${
              tab === t
                ? 'border-[#0a0a0a] text-[#0a0a0a] font-medium'
                : 'border-transparent text-[#6b6b6b] hover:text-[#0a0a0a]'
            }`}
          >
            {t === 'campaign' ? 'Send Campaign' : t === 'history' ? 'Campaign History' : 'Subscribers'}
          </button>
        ))}
      </div>

      {/* ── Subscribers tab ──────────────────────────────────────── */}
      {tab === 'subscribers' && (
        <>
          <div className="flex gap-2 mb-5">
            {(['all', 'active', 'inactive'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
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
                  <tr className="text-left text-[11px] uppercase tracking-widest text-[#6b6b6b] border-b border-[#e8e4e0] bg-[#faf8f5]">
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Subscribed</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map(s => (
                    <tr key={s.email} className="border-b border-[#f0ece8] last:border-0 hover:bg-[#faf8f5] transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-[#0a0a0a]">{s.email}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded ${
                          s.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {s.is_active ? 'Active' : 'Unsubscribed'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#6b6b6b] text-xs">
                        {new Date(s.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                  {!subscribers.length && (
                    <tr><td colSpan={3} className="px-4 py-10 text-center text-[#6b6b6b]">No subscribers</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button disabled={page === 1} onClick={() => { setPage(p => p - 1); loadSubscribers(page - 1) }}
                aria-label="Previous page"
                className="px-3 py-1 border border-[#e8e4e0] text-sm disabled:opacity-40 hover:bg-[#faf8f5]"><ChevronLeft size={14} aria-hidden="true" /></button>
              <span className="px-3 py-1 text-sm text-[#6b6b6b]">{page} / {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => { setPage(p => p + 1); loadSubscribers(page + 1) }}
                aria-label="Next page"
                className="px-3 py-1 border border-[#e8e4e0] text-sm disabled:opacity-40 hover:bg-[#faf8f5]"><ChevronRight size={14} aria-hidden="true" /></button>
            </div>
          )}
        </>
      )}

      {/* ── Send Campaign tab ────────────────────────────────────── */}
      {tab === 'campaign' && (
        <div className="max-w-2xl">
          {sendResult && (
            <div className="bg-green-50 border border-green-200 px-4 py-3 mb-5 rounded">
              <p className="text-sm font-medium text-green-800">{sendResult.message}</p>
              {sendResult.failed > 0 && (
                <p className="text-xs text-green-700 mt-0.5">{sendResult.failed} failed (check email log)</p>
              )}
            </div>
          )}

          <div className="bg-white border border-[#e8e4e0] p-6 space-y-5">
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Subject Line *</label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="e.g. New Arrivals This Week ✨"
                className="w-full border border-[#e8e4e0] px-3 py-2.5 text-sm focus:outline-none focus:border-[#0a0a0a]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Preview Text</label>
              <input
                type="text"
                value={previewText}
                onChange={e => setPreviewText(e.target.value)}
                placeholder="Shown in email client preview…"
                className="w-full border border-[#e8e4e0] px-3 py-2.5 text-sm focus:outline-none focus:border-[#0a0a0a]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] uppercase tracking-widest text-[#6b6b6b]">Email Body (HTML) *</label>
                <button
                  onClick={() => setPreviewMode(m => !m)}
                  className="text-[10px] uppercase tracking-widest text-[#6b6b6b] hover:text-[#0a0a0a] border border-[#e8e4e0] px-2 py-1"
                >
                  {previewMode ? 'Edit' : 'Preview'}
                </button>
              </div>
              {previewMode ? (
                <div
                  className="border border-[#e8e4e0] bg-white rounded overflow-auto"
                  style={{ minHeight: 300 }}
                >
                  {bodyHtml ? (
                    <iframe
                      srcDoc={bodyHtml}
                      title="Campaign preview"
                      style={{ width: '100%', minHeight: 300, border: 'none' }}
                      sandbox="allow-same-origin"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-40 text-sm text-[#6b6b6b]">
                      No HTML content yet
                    </div>
                  )}
                </div>
              ) : (
                <textarea
                  value={bodyHtml}
                  onChange={e => setBodyHtml(e.target.value)}
                  rows={14}
                  placeholder="<p>Dear subscriber,</p><p>...</p>"
                  className="w-full border border-[#e8e4e0] px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-[#0a0a0a] resize-y"
                />
              )}
              <p className="text-[10px] text-[#9a9a9a] mt-1">
                HTML is wrapped in Kalokea's email template automatically. Unsubscribe link is appended.
              </p>
            </div>

            <div className="pt-2 border-t border-[#f0ece8] flex items-center justify-between">
              <p className="text-xs text-[#6b6b6b]">
                Will be sent to <strong>{stats?.active_subscribers?.toLocaleString() ?? '?'}</strong> active subscribers
              </p>
              <button
                onClick={handleSendCampaign}
                disabled={sending || !subject.trim() || !bodyHtml.trim()}
                className="px-6 py-2.5 text-sm bg-[#0a0a0a] text-white hover:bg-[#333] disabled:opacity-50 transition-colors"
              >
                {sending ? 'Sending…' : 'Send Campaign'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Campaign History tab ─────────────────────────────────── */}
      {tab === 'history' && (
        camLoading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : (
          <div className="bg-white border border-[#e8e4e0] overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm font-sans">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-widest text-[#6b6b6b] border-b border-[#e8e4e0] bg-[#faf8f5]">
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3 text-center">Recipients</th>
                  <th className="px-4 py-3 text-center">Sent</th>
                  <th className="px-4 py-3 text-center">Failed</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Sent At</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map(c => (
                  <tr key={c.id} className="border-b border-[#f0ece8] last:border-0 hover:bg-[#faf8f5] transition-colors">
                    <td className="px-4 py-3 text-[#0a0a0a] max-w-[240px] truncate">{c.subject}</td>
                    <td className="px-4 py-3 text-center text-[#6b6b6b]">{c.recipient_count ?? '—'}</td>
                    <td className="px-4 py-3 text-center text-green-700 font-medium">{c.sent_count ?? '—'}</td>
                    <td className="px-4 py-3 text-center text-red-600">{c.failed_count ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded ${
                        c.status === 'sent' ? 'bg-green-100 text-green-800'
                        : c.status === 'sending' ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-600'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#6b6b6b] text-xs whitespace-nowrap">
                      {c.sent_at ? new Date(c.sent_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                  </tr>
                ))}
                {!campaigns.length && (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-[#6b6b6b]">No campaigns sent yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )
      )}
    </>
  )
}
