// ─── Admin RBAC (frontend mirror of BACKEND/src/common/auth/permissions.ts) ──
// Keep the permission keys in sync with the backend. The backend is the real
// security boundary; this file drives which sidebar links a staff member sees
// and which admin routes they may open.

export const GRANTABLE_PERMISSIONS = [
  'orders',
  'products',
  'categories',
  'coupons',
  'banners',
  'reviews',
  'returns',
  'exchanges',
  'shipments',
  'customers',
  'newsletter',
  'cms',
  'content',
  'homepage',
  'blog',
  'analytics',
] as const

export type Permission = (typeof GRANTABLE_PERMISSIONS)[number]

/** Human-friendly labels + descriptions for the Staff & Access screen. */
export const PERMISSION_META: Record<Permission, { label: string; description: string }> = {
  orders: { label: 'Orders', description: 'View & update orders, issue refunds' },
  products: { label: 'Products & Inventory', description: 'Create / edit products, variants and stock' },
  categories: { label: 'Categories', description: 'Manage product categories' },
  coupons: { label: 'Coupons', description: 'Create & manage discount coupons' },
  banners: { label: 'Banners', description: 'Manage homepage banners' },
  reviews: { label: 'Reviews', description: 'Moderate & reply to product reviews' },
  returns: { label: 'Returns', description: 'Manage return requests' },
  exchanges: { label: 'Exchanges', description: 'Manage exchange requests' },
  shipments: { label: 'Shipments', description: 'Shiprocket shipments & tracking' },
  customers: { label: 'Customers', description: 'View customer list & details' },
  newsletter: { label: 'Newsletter', description: 'Subscribers & email campaigns' },
  cms: { label: 'CMS Pages & Help', description: 'Edit CMS pages and Help/FAQ' },
  content: { label: 'About & Footer', description: 'Edit About page and footer content' },
  homepage: { label: 'Homepage', description: 'Edit homepage content blocks' },
  blog: { label: 'Blog / Journal', description: 'Write & publish blog posts' },
  analytics: { label: 'Analytics', description: 'View analytics dashboards' },
}

export interface MinimalUser {
  role?: string
  permissions?: string[] | null
}

/** True for full admins and staff (anyone who belongs in the admin area). */
export function isAdminAreaUser(user: MinimalUser | null | undefined): boolean {
  return user?.role === 'admin' || user?.role === 'staff'
}

/** True if the user may use a section requiring `perm`. Full admins always can. */
export function hasPermission(user: MinimalUser | null | undefined, perm: Permission): boolean {
  if (!user) return false
  if (user.role === 'admin') return true
  if (user.role === 'staff') return Array.isArray(user.permissions) && user.permissions.includes(perm)
  return false
}

// ─── Admin navigation + route access map ────────────────────────────────────
// `perm`  → requires that permission (full admins always pass).
// `owner` → owner/full-admin only (staff can never access, regardless of perms).
// neither → any admin-area user (e.g. the dashboard landing page).

export interface AdminNavItem {
  label: string
  href: string
  perm?: Permission
  owner?: boolean
}

export const ADMIN_NAV: AdminNavItem[] = [
  { label: 'Dashboard', href: '/admin/' },
  { label: 'Homepage', href: '/admin/homepage/', perm: 'homepage' },
  { label: 'About', href: '/admin/about/', perm: 'content' },
  { label: 'Footer', href: '/admin/footer/', perm: 'content' },
  { label: 'CMS Pages', href: '/admin/cms/', perm: 'cms' },
  { label: 'Help & FAQ', href: '/admin/help/', perm: 'cms' },
  { label: 'Blog', href: '/admin/blog/', perm: 'blog' },
  { label: 'Products', href: '/admin/products/', perm: 'products' },
  { label: 'Categories', href: '/admin/categories/', perm: 'categories' },
  { label: 'Orders', href: '/admin/orders/', perm: 'orders' },
  { label: 'Shipments', href: '/admin/shipments/', perm: 'shipments' },
  { label: 'Inventory', href: '/admin/inventory/', perm: 'products' },
  { label: 'Coupons', href: '/admin/coupons/', perm: 'coupons' },
  { label: 'Banners', href: '/admin/banners/', perm: 'banners' },
  { label: 'Customers', href: '/admin/customers/', perm: 'customers' },
  { label: 'Reviews', href: '/admin/reviews/', perm: 'reviews' },
  { label: 'Returns', href: '/admin/returns/', perm: 'returns' },
  { label: 'Exchanges', href: '/admin/exchanges/', perm: 'exchanges' },
  { label: 'Analytics', href: '/admin/analytics/', perm: 'analytics' },
  { label: 'Newsletter', href: '/admin/newsletter/', perm: 'newsletter' },
  { label: 'GST', href: '/admin/gst/', owner: true },
  { label: 'Email Log', href: '/admin/email-log/', owner: true },
  { label: 'Activity', href: '/admin/activity/', owner: true },
  { label: 'Staff & Access', href: '/admin/staff/', owner: true },
  { label: 'Settings', href: '/admin/settings/', owner: true },
]

// Extra path prefixes (sub-pages not in the sidebar) → their access rule.
// Checked in addition to ADMIN_NAV. Longest prefix wins.
const EXTRA_ROUTE_RULES: { prefix: string; perm?: Permission; owner?: boolean }[] = [
  { prefix: '/admin/order-detail', perm: 'orders' },
]

interface AccessRule { perm?: Permission; owner?: boolean }

/**
 * Resolve the access rule for an admin pathname by longest-prefix match.
 * Returns `{}` (any admin-area user) when nothing specific matches — e.g. the
 * dashboard. The Dashboard root (/admin/) is matched exactly.
 */
export function ruleForPath(pathname: string): AccessRule {
  const path = pathname.endsWith('/') ? pathname : pathname + '/'
  const candidates: { len: number; rule: AccessRule }[] = []

  const add = (prefix: string, rule: AccessRule) => {
    const p = prefix.endsWith('/') ? prefix : prefix + '/'
    if (p === '/admin/') {
      // Dashboard root: exact match only, so it never shadows sub-routes.
      if (path === '/admin/') candidates.push({ len: p.length, rule })
      return
    }
    if (path.startsWith(p)) candidates.push({ len: p.length, rule })
  }

  for (const item of ADMIN_NAV) add(item.href, { perm: item.perm, owner: item.owner })
  for (const r of EXTRA_ROUTE_RULES) add(r.prefix, { perm: r.perm, owner: r.owner })

  if (candidates.length === 0) return {}
  return candidates.reduce((a, b) => (b.len > a.len ? b : a)).rule
}

/** True if the user may access the given admin path. */
export function canAccessPath(user: MinimalUser | null | undefined, pathname: string): boolean {
  if (!isAdminAreaUser(user)) return false
  if (user!.role === 'admin') return true
  const rule = ruleForPath(pathname)
  if (rule.owner) return false
  if (rule.perm) return hasPermission(user, rule.perm)
  return true // any admin-area user (dashboard etc.)
}

/** First admin path this user can land on (for redirecting staff after login). */
export function firstAccessiblePath(user: MinimalUser | null | undefined): string {
  if (!isAdminAreaUser(user)) return '/'
  if (user!.role === 'admin') return '/admin/'
  const item = ADMIN_NAV.find((n) => {
    if (n.owner) return false
    if (n.perm) return hasPermission(user, n.perm)
    return true
  })
  return item ? item.href : '/admin/'
}
