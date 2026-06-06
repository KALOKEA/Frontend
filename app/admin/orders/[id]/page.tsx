// Server component — no 'use client'.
// generateStaticParams() is required for dynamic routes with output:'export'.
// Returns [] because admin order IDs are runtime UUIDs, not build-time known.

import AdminOrderIdClient from './client'

export function generateStaticParams() {
  return []
}

export default function AdminOrderIdPage({ params }: { params: { id: string } }) {
  return <AdminOrderIdClient id={params.id} />
}
