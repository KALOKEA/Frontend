// Canonical URL is /privacy-policy — this page permanently redirects there.
// The _redirects file handles this at the Cloudflare edge (301); this is a
// fallback for any path that slips through to the static bundle.
import { redirect } from 'next/navigation'

export default function PrivacyRedirect() {
  redirect('/privacy-policy')
}
