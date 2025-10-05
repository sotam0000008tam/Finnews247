# FinNews247 – Combined SEO/AdSense Patch (v2)
This bundle includes:
- Canonical migrations:
  - `/exchanges*` -> `/crypto-exchanges*`
  - `/crypto-tax*` -> `/tax*`
  - `/crypto-insurance*` -> `/insurance*`
  - `/privacy-policy*` -> `/privacy`
- Sitemap de-duplication and canonical-only URL generation
- Optional SSR page-level redirects for legacy folders
- Updated Signals pages (index + [id].js) with proper canonical & Open Graph
- A single script to rewrite internal links across the repository

## Apply steps
1. Copy these files into your project (preserving folder structure):
   - `next.config.js`
   - `next-sitemap.config.js`
   - `pages/exchanges/index.js`, `pages/exchanges/[...slug].js` (optional if folder exists)
   - `pages/crypto-tax/index.js`, `pages/crypto-tax/[...slug].js` (optional)
   - `pages/crypto-insurance/index.js`, `pages/crypto-insurance/[...slug].js` (optional)
   - `pages/privacy-policy/index.js` (optional if you had that route)
   - `pages/crypto-exchanges/index.js` (optional placeholder if you don't already have one)
   - `pages/signals/index.js`, `pages/signals/[id].js`
   - `scripts/fix-links.js`
2. (Optional) Clean internal links:
   ```bash
   node scripts/fix-links.js
   ```
3. Rebuild & deploy.
4. Verify:
   - `/exchanges*`  -> 301/308 -> `/crypto-exchanges*`
   - `/crypto-tax*` -> 301/308 -> `/tax*`
   - `/crypto-insurance*` -> 301/308 -> `/insurance*`
   - `/privacy-policy*` -> 301/308 -> `/privacy`
   - Sitemap contains only canonical branches and no duplicates.
   - Signals detail pages have correct `<link rel="canonical">` and `og:url`.
