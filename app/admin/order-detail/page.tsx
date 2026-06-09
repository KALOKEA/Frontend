import { Suspense } from 'react'
import AdminOrderDetailInner from '@/components/admin/OrderDetailInner'
import Spinner from '@/components/ui/Spinner'

// This page is reached from the admin orders list as /admin/order-detail?id=<uuid>.
// AdminOrderDetailInner reads the id from useSearchParams() when no idOverride is given.
export default function AdminOrderDetailPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Spinner /></div>}>
      <AdminOrderDetailInner />
    </Suspense>
  )
}
