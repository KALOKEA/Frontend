'use client'
import { Suspense } from 'react'
import AdminOrderDetailInner from '@/components/admin/OrderDetailInner'
import Spinner from '@/components/ui/Spinner'

export default function AdminOrderIdClient({ id }: { id: string }) {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Spinner size="lg" /></div>}>
      <AdminOrderDetailInner idOverride={id} />
    </Suspense>
  )
}
