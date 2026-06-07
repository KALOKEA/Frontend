// GA4 e-commerce event helpers. All no-op safely if GA isn't configured
// (NEXT_PUBLIC_GA_MEASUREMENT_ID unset) or gtag hasn't loaded yet, so callers
// never need to guard. Money is stored in paise everywhere → converted to
// rupees here because GA expects major currency units.

export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

type AnyRecord = Record<string, unknown>

function ga(event: string, params: AnyRecord) {
  if (typeof window === 'undefined') return
  const w = window as unknown as { gtag?: (...args: unknown[]) => void }
  if (typeof w.gtag !== 'function') return
  w.gtag('event', event, params)
}

const toRupees = (paise: number) => Math.round(paise) / 100

interface GAItemInput {
  product_id?: string
  variant_id?: string
  name: string
  price: number // paise
  quantity?: number
  size?: string
  colour?: string
  category?: string
}

function toGaItem(it: GAItemInput) {
  return {
    item_id: it.product_id || it.variant_id,
    item_name: it.name,
    item_variant: [it.colour, it.size].filter(Boolean).join(' / ') || undefined,
    item_category: it.category,
    price: toRupees(it.price),
    quantity: it.quantity ?? 1,
  }
}

export function trackViewItem(p: { product_id: string; name: string; price: number; category?: string }) {
  ga('view_item', {
    currency: 'INR',
    value: toRupees(p.price),
    items: [toGaItem(p)],
  })
}

export function trackAddToCart(p: GAItemInput) {
  ga('add_to_cart', {
    currency: 'INR',
    value: toRupees(p.price * (p.quantity ?? 1)),
    items: [toGaItem(p)],
  })
}

export function trackRemoveFromCart(p: GAItemInput) {
  ga('remove_from_cart', {
    currency: 'INR',
    value: toRupees(p.price * (p.quantity ?? 1)),
    items: [toGaItem(p)],
  })
}

export function trackViewItemList(items: GAItemInput[], listName: string) {
  ga('view_item_list', {
    item_list_name: listName,
    items: items.map(toGaItem),
  })
}

export function trackSearch(searchTerm: string) {
  ga('search', { search_term: searchTerm })
}

export function trackBeginCheckout(items: GAItemInput[], valuePaise: number) {
  ga('begin_checkout', {
    currency: 'INR',
    value: toRupees(valuePaise),
    items: items.map(toGaItem),
  })
}

export function trackPurchase(orderId: string, valuePaise: number, items: GAItemInput[]) {
  ga('purchase', {
    transaction_id: orderId,
    currency: 'INR',
    value: toRupees(valuePaise),
    items: items.map(toGaItem),
  })
}

// ── Meta Pixel helpers ──────────────────────────────────────────────────────
// All no-op safely if fbq hasn't loaded. Money converted paise → rupees same as GA.

function fbq(event: 'track' | 'trackCustom', name: string, params?: AnyRecord) {
  if (typeof window === 'undefined') return
  const w = window as unknown as { fbq?: (...args: unknown[]) => void }
  if (typeof w.fbq !== 'function') return
  w.fbq(event, name, params)
}

export function metaViewContent(p: { name: string; price: number; category?: string; product_id?: string }) {
  fbq('track', 'ViewContent', {
    content_name: p.name,
    content_category: p.category,
    content_ids: p.product_id ? [p.product_id] : undefined,
    content_type: 'product',
    value: toRupees(p.price),
    currency: 'INR',
  })
}

export function metaAddToCart(p: { name: string; price: number; quantity?: number; product_id?: string }) {
  fbq('track', 'AddToCart', {
    content_name: p.name,
    content_ids: p.product_id ? [p.product_id] : undefined,
    content_type: 'product',
    value: toRupees(p.price * (p.quantity ?? 1)),
    currency: 'INR',
    num_items: p.quantity ?? 1,
  })
}

export function metaInitiateCheckout(valuePaise: number, numItems: number) {
  fbq('track', 'InitiateCheckout', {
    value: toRupees(valuePaise),
    currency: 'INR',
    num_items: numItems,
  })
}

export function metaPurchase(orderId: string, valuePaise: number) {
  fbq('track', 'Purchase', {
    value: toRupees(valuePaise),
    currency: 'INR',
    content_type: 'product',
    order_id: orderId,
  })
}
