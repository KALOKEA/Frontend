/**
 * generate-sitemap.mjs
 *
 * Runs at build time (prebuild) to generate public/sitemap.xml with:
 *   • All static routes (hardcoded — changes rarely)
 *   • All live product pages fetched from Supabase (with lastmod from updated_at)
 *
 * Usage:  node scripts/generate-sitemap.mjs
 *
 * Env vars used:
 *   NEXT_PUBLIC_API_URL — Railway backend URL (already set in Cloudflare Pages)
 *   Falls back to hardcoded Railway URL if not set.
 *   No Supabase keys needed — products are fetched via the public /products API.
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_URL   = 'https://kalokea.com';
const TODAY      = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

// ── Static routes ─────────────────────────────────────────────────────────────
const STATIC_URLS = [
  { loc: '/',                   changefreq: 'daily',   priority: '1.0', lastmod: TODAY },
  { loc: '/shop/',              changefreq: 'daily',   priority: '0.9', lastmod: TODAY },
  // Category pages
  { loc: '/shop/dresses/',      changefreq: 'daily',   priority: '0.8', lastmod: TODAY },
  { loc: '/shop/tops/',         changefreq: 'daily',   priority: '0.8', lastmod: TODAY },
  { loc: '/shop/bottoms/',      changefreq: 'daily',   priority: '0.8', lastmod: TODAY },
  { loc: '/shop/shoes/',        changefreq: 'daily',   priority: '0.8', lastmod: TODAY },
  { loc: '/shop/bags/',         changefreq: 'daily',   priority: '0.8', lastmod: TODAY },
  { loc: '/shop/accessories/',  changefreq: 'daily',   priority: '0.8', lastmod: TODAY },
  { loc: '/shop/sale/',         changefreq: 'daily',   priority: '0.8', lastmod: TODAY },
  { loc: '/shop/new-arrivals/', changefreq: 'daily',   priority: '0.8', lastmod: TODAY },
  { loc: '/shop/everything/',   changefreq: 'daily',   priority: '0.8', lastmod: TODAY },
  // Static pages
  { loc: '/about/',             changefreq: 'monthly', priority: '0.6', lastmod: TODAY },
  { loc: '/contact/',           changefreq: 'monthly', priority: '0.6', lastmod: TODAY },
  { loc: '/size-guide/',        changefreq: 'monthly', priority: '0.5', lastmod: TODAY },
  { loc: '/track-order/',       changefreq: 'monthly', priority: '0.4', lastmod: TODAY },
  // Policy pages
  { loc: '/privacy-policy/',    changefreq: 'yearly',  priority: '0.3', lastmod: TODAY },
  { loc: '/shipping-policy/',   changefreq: 'yearly',  priority: '0.3', lastmod: TODAY },
  { loc: '/refund-policy/',     changefreq: 'yearly',  priority: '0.3', lastmod: TODAY },
  { loc: '/terms/',             changefreq: 'yearly',  priority: '0.3', lastmod: TODAY },
];

// ── Fetch product slugs from Railway backend API ──────────────────────────────
// Uses NEXT_PUBLIC_API_URL (already set in Cloudflare) — no Supabase keys needed.
async function fetchProductSlugs() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-73aa.up.railway.app';

  const slugs = [];
  let page    = 1;
  const limit = 100;

  try {
    while (true) {
      // Note: no is_active filter — the public products endpoint already returns
      // only active products by default. Adding unknown query params causes 400
      // when the backend runs ValidationPipe with forbidNonWhitelisted:true.
      const url = `${apiUrl}/products?limit=${limit}&page=${page}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) });

      if (!res.ok) {
        console.error(`[sitemap] API fetch failed: ${res.status} ${res.statusText}`);
        break;
      }

      const json = await res.json();
      // Backend TransformInterceptor wraps as { data: { data: [], total, ... } }
      const rows = json?.data?.data ?? json?.data ?? [];
      if (!Array.isArray(rows) || rows.length === 0) break;

      for (const row of rows) {
        if (row.slug) {
          slugs.push({
            slug:       row.slug,
            updated_at: row.updated_at ? row.updated_at.split('T')[0] : TODAY,
          });
        }
      }

      if (rows.length < limit) break;
      page++;
    }
  } catch (err) {
    console.warn(`[sitemap] Could not fetch product slugs from API: ${err.message} — skipping product URLs`);
    return [];
  }

  console.log(`[sitemap] Fetched ${slugs.length} product slug(s) from Railway API`);
  return slugs;
}

// ── Render one <url> block ────────────────────────────────────────────────────
function urlBlock({ loc, changefreq, priority, lastmod }) {
  return [
    '  <url>',
    `    <loc>${SITE_URL}${loc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n');
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const productSlugs = await fetchProductSlugs();

  const staticBlocks  = STATIC_URLS.map(urlBlock);
  const productBlocks = productSlugs.map(({ slug, updated_at }) =>
    urlBlock({
      loc:        `/product/${slug}/`,
      changefreq: 'weekly',
      priority:   '0.7',
      lastmod:    updated_at,
    }),
  );

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<!-- Auto-generated by scripts/generate-sitemap.mjs on ${new Date().toISOString()} -->`,
    '<!-- DO NOT EDIT MANUALLY — re-run "npm run build" to regenerate. -->',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '',
    '  <!-- ── Static routes ───────────────────────────────────────────── -->',
    staticBlocks.join('\n\n'),
    '',
    '  <!-- ── Product pages ───────────────────────────────────────────── -->',
    productBlocks.join('\n\n'),
    '',
    '</urlset>',
  ].join('\n');

  const outPath = join(__dirname, '..', 'public', 'sitemap.xml');
  writeFileSync(outPath, xml, 'utf8');
  console.log(`[sitemap] Wrote ${staticBlocks.length + productBlocks.length} URLs to ${outPath}`);
}

main().catch((err) => {
  console.error('[sitemap] Generation failed:', err);
  // Non-fatal — don't exit(1) so the build continues
});
