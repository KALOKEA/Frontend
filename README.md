# Kalokea — Frontend

Next.js 14 static-export storefront for [Kalokea](https://kalokea.com), a fashion e-commerce brand. Deployed on Cloudflare Pages.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (`output: 'export'`) — fully static, no SSR |
| Styling | Tailwind CSS |
| State | Zustand (cart, wishlist, auth) |
| Payments | Razorpay (client-side modal) |
| Images | Cloudinary |
| Analytics | Google Analytics 4 |
| Deploy | Cloudflare Pages — auto-deploy on push to `main` |

## Local setup

```bash
cp .env.local.example .env.local   # fill API URL + Razorpay public key
npm install
npm run dev    # http://localhost:3000
```

## Environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (e.g. `https://your-api.railway.app`) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay publishable key |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for SEO (e.g. `https://kalokea.com`) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics measurement ID (optional) |

## Build & deploy

```bash
npm run build   # Next.js static export → out/
```

Cloudflare Pages picks up the `out/` directory automatically.

Security headers are set in `public/_headers` (CSP, HSTS, X-Frame-Options, etc.).

## Key pages

| Route | Description |
|---|---|
| `/` | Homepage with hero, featured products, banners |
| `/shop` | Full catalogue with filters and search |
| `/search` | Search results page |
| `/product/[slug]` | Product detail with gallery, variants, reviews |
| `/cart` | Shopping cart with shipping progress bar |
| `/checkout` | Checkout — address, coupon, Razorpay payment |
| `/orders` | Order history (authenticated) |
| `/orders/[id]` | Order detail + tracking |
| `/wishlist` | Saved items |
| `/account` | Profile management |
| `/admin/*` | Admin panel (role-gated) |

## Architecture notes

- **Static export**: all pages are pre-rendered at build time. No server runtime. Dynamic data (products, cart, orders) fetched client-side from the NestJS API.
- **Auth**: access token stored in-memory (Zustand); refresh token in httpOnly cookie handled by the API.
- **Cart**: server-side (API-backed) for logged-in users; localStorage fallback for guests, merged on login.
- **SEO**: `sitemap.xml`, `robots.txt`, JSON-LD Product schema on product pages, Organization schema in layout.

## Security headers

`public/_headers` sets per-path headers for Cloudflare Pages:
- `Content-Security-Policy` — scoped to self + Cloudinary + Railway API + Razorpay
- `Strict-Transport-Security` — 1-year HSTS with includeSubDomains
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
