'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminOrderIdClient({ id }: { id: string }) {
  const router = useRouter()
  useEffect(() => {
    if (id) router.replace(`/admin/order-detail?id=${id}`)
    else    router.replace('/admin/orders')
  }, [id, router])
  return null
}
