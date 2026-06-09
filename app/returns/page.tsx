// Canonical URL is /refund-policy — this page permanently redirects there.
import { redirect } from 'next/navigation'

export default function ReturnsRedirect() {
  redirect('/refund-policy')
}
