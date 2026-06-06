import AdminOrderIdClient from './client'

export const dynamicParams = false

export function generateStaticParams() {
  // Must return at least one entry for Next.js output:export
  return [{ id: '_' }]
}

export default function AdminOrderIdPage({ params }: { params: { id: string } }) {
  return <AdminOrderIdClient id={params.id} />
}
