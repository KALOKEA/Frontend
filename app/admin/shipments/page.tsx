import { Suspense } from 'react'
import ShipmentsManager from '@/components/admin/ShipmentsManager'
import Spinner from '@/components/ui/Spinner'

export default function ShipmentsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Spinner size="lg" /></div>}>
      <ShipmentsManager />
    </Suspense>
  )
}
