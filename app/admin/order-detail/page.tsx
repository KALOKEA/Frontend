// Deprecated: order detail is now at /admin/orders/[id]
// This page is no longer linked anywhere; redirect to the orders list.
import { redirect } from 'next/navigation'

export default function OrderDetailRedirect() {
  redirect('/admin/orders')
}
