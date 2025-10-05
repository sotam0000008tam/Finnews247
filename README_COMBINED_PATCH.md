# FinNews247 – Combined SEO/AdSense Patch
This bundle combines:
- Canonical migration `/exchanges*` -> `/crypto-exchanges*`
- Canonical migration `/crypto-tax*` -> `/tax*`
- Canonical migration `/crypto-insurance*` -> `/insurance*`
- Sitemap de-duplication and canonical-only URL generation
- Updated Signals pages (index + [id].js) with proper canonical and Open Graph
- A single script to rewrite internal links across the repository

## Apply steps
1. Copy these files into your project (preserving folder structure):
   - `next.config.js`
   - `next-sitemap.config.js`
   - `pages/crypto-tax/index.js`, `pages/crypto-tax/[...slug].js` (optional if folders exist)
   - `pages/crypto-insurance/index.js`, `pages/crypto-insurance/[...slug].js` (optional)
   - `pages/exchanges/index.js`, `pages/exchanges/[...slug].js` (optional)
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
   - Sitemap contains only canonical branches and no duplicates.
   - Signals detail pages have correct `<link rel="canonical">` and `og:url`.
