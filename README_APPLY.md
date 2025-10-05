# FinNews247 – Remove legacy crypto-tax/crypto-insurance & dedupe sitemap

## What this package does
1) Forces 301 redirects from `/crypto-tax/*` -> `/tax/*` and `/crypto-insurance/*` -> `/insurance/*` (Next.js redirects).
2) Excludes legacy branches from sitemap and re-generates sitemap with *unique* canonical URLs only.
3) Optional page-level SSR redirects if you still have `pages/crypto-tax` or `pages/crypto-insurance` folders.
4) A small script to clean internal links.

## How to apply
1. Copy the files from this package into your project root, preserving the same paths:
   - `next.config.js`
   - `next-sitemap.config.js`
   - `pages/crypto-tax/index.js` and `pages/crypto-tax/[...slug].js` (optional if those folders still exist)
   - `pages/crypto-insurance/index.js` and `pages/crypto-insurance/[...slug].js` (optional)
   - `scripts/fix-internal-links.js`
2. (Optional) Run the internal link cleanup:
   ```bash
   node scripts/fix-internal-links.js
   ```
3. Rebuild & redeploy your site.
4. Re-generate sitemap if needed (depending on your build flow with next-sitemap).
5. Verify:
   - No `/crypto-tax*` or `/crypto-insurance*` entries in sitemap.
   - Hitting those URLs in the browser returns 301/308 to `/tax*` or `/insurance*`.
   - Submit the new sitemap in Google Search Console.
