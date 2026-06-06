'use client'
import { Suspense } from 'react'
import AdminOrderDetailInner from '@/components/admin/OrderDetailInner'
import Spinner from '@/components/ui/Spinner'

// Flat page (no dynamic segment) — works with output:'export'.
// Order ID is passed as ?id=<uuid> query param so Next.js can statically export it.
export default function AdminOrderDetailPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Spinner size="lg" /></div>}>
      <AdminOrderDetailInner />
    </Suspense>
  )
}
