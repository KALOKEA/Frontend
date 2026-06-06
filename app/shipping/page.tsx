// Canonical URL is /shipping-policy — this page permanently redirects there.
import { redirect } from 'next/navigation'

export default function ShippingRedirect() {
  redirect('/shipping-policy')
}
