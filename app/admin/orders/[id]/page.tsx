import AdminOrderIdClient from './client'

export const dynamicParams = false

export function generateStaticParams() {
  return []
}

export default function AdminOrderIdPage({ params }: { params: { id: string } }) {
  return <AdminOrderIdClient id={params.id} />
}
