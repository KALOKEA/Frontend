/**
 * generate-sitemap.mjs
 *
 * Runs at build time (prebuild) to generate public/sitemap.xml with:
 *   • All static routes (hardcoded — changes rarely)
 *   • All live product pages fetched from Supabase (with lastmod from updated_at)
 *
 * Usage:  node scripts/generate-sitemap.mjs
 *
 * Env vars required:
 *   NEXT_PUBLIC_SUPABASE_URL   — https://xxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY  — service_role key (server-side only, not anon)
 *
 * If env vars are missing the script skips product URLs and writes only
 * the static sitemap (so the build still succeeds in CI without secrets).
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_URL   = 'https://kalokea.in';
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

// ── Fetch product slugs from Supabase ─────────────────────────────────────────
async function fetchProductSlugs() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.warn('[sitemap] NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set — skipping product URLs');
    return [];
  }

  const slugs = [];
  let page    = 0;
  const limit = 1000;

  while (true) {
    const url = `${supabaseUrl}/rest/v1/products`
      + `?select=slug,updated_at`
      + `&is_active=eq.true`
      + `&order=updated_at.desc`
      + `&offset=${page * limit}`
      + `&limit=${limit}`;

    const res = await fetch(url, {
      headers: {
        apikey:        serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error(`[sitemap] Supabase fetch failed: ${res.status} ${res.statusText}`);
      break;
    }

    const rows = await res.json();
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

  console.log(`[sitemap] Fetched ${slugs.length} product slug(s) from Supabase`);
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
