import { Suspense } from 'react'
import CmsEditor from '@/components/admin/CmsEditor'
import Spinner from '@/components/ui/Spinner'

export default function AdminCmsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Spinner size="lg" /></div>}>
      <CmsEditor />
    </Suspense>
  )
}
