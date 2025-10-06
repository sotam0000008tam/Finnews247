/** @type {import('next-sitemap').IConfig} */
const fs = require('fs');
const path = require('path');

function loadJson(file) {
  const p = path.join(process.cwd(), 'data', file);
  if (!fs.existsSync(p)) return [];
  try {
    return JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch {
    return [];
  }
}

function mapPosts(items, mkLoc, pickDate = (it) => it.date) {
  const out = [];
  const seen = new Set();
  for (const it of items || []) {
    const loc = mkLoc(it);
    if (!loc || seen.has(loc)) continue;
    seen.add(loc);
    const d = pickDate(it);
    out.push({ loc, lastmod: d ? new Date(d).toISOString() : undefined });
  }
  return out;
}

module.exports = {
  siteUrl: 'https://www.finnews247.com',
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,

  // loại các đường dẫn không nên index / trùng canonical
  exclude: [
    '/admin/*',
    '/privacy-policy', // giữ /privacy là canonical
  ],

  additionalPaths: async (config) => {
    const paths = [];

    // 1) NEWS ở ROOT: /{slug} (KHÔNG phải /news/{slug})
    const news = loadJson('news.json');
    paths.push(
      ...mapPosts(
        news,
        (it) => (it?.slug ? `/${it.slug}` : null),
        (it) => it?.date
      )
    );

    // 2) SIGNALS: /signals/{slug|id}
    const signals = loadJson('signals.json');
    paths.push(
      ...mapPosts(
        signals,
        (it) => {
          const s = it?.slug || it?.id;
          return s ? `/signals/${s}` : null;
        },
        (it) => it?.date || it?.createdAt
      )
    );

    // 3) GUIDES: /guides/{slug}
    const guides = loadJson('guides.json');
    paths.push(
      ...mapPosts(
        guides,
        (it) => (it?.slug ? `/guides/${it.slug}` : null),
        (it) => it?.date
      )
    );

    // 4) TAX: /tax/{slug}
    const tax = loadJson('tax.json');
    paths.push(
      ...mapPosts(
        tax,
        (it) => (it?.slug ? `/tax/${it.slug}` : null),
        (it) => it?.date
      )
    );

    // 5) INSURANCE: /insurance/{slug}
    const insurance = loadJson('insurance.json');
    paths.push(
      ...mapPosts(
        insurance,
        (it) => (it?.slug ? `/insurance/${it.slug}` : null),
        (it) => it?.date
      )
    );

    // 6) CRYPTO EXCHANGES: gộp cryptoexchanges.json + fidelity.json -> /crypto-exchanges/{slug}
    const cryptoEx = loadJson('cryptoexchanges.json');
    const fidelity = loadJson('fidelity.json');
    paths.push(
      ...mapPosts(
        [...cryptoEx, ...fidelity],
        (it) => (it?.slug ? `/crypto-exchanges/${it.slug}` : null),
        (it) => it?.date
      )
    );

    // 7) BEST APPS: /best-crypto-apps/{slug}
    const bestapps = loadJson('bestapps.json');
    paths.push(
      ...mapPosts(
        bestapps,
        (it) => (it?.slug ? `/best-crypto-apps/${it.slug}` : null),
        (it) => it?.date
      )
    );

    // 8) ALTCOINS (+ SECCOIN tùy site dùng chung hub): /altcoins/{slug}
    const altcoins = loadJson('altcoins.json');
    const seccoin = loadJson('seccoin.json');
    paths.push(
      ...mapPosts(
        [...altcoins, ...seccoin],
        (it) => (it?.slug ? `/altcoins/${it.slug}` : null),
        (it) => it?.date
      )
    );

    // 9) WALLETS (nếu có): /wallets/{slug}
    const wallets = loadJson('wallets.json');
    paths.push(
      ...mapPosts(
        wallets,
        (it) => (it?.slug ? `/wallets/${it.slug}` : null),
        (it) => it?.date
      )
    );

    // Trả về IPath[]
    return paths.map((p) =>
      config.transform(config, p.loc).then((base) => ({
        ...base,
        loc: p.loc,
        lastmod: p.lastmod || base.lastmod,
      }))
    );
  },

  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: 'daily',
      priority: path === '/' ? 1.0 : 0.7,
      lastmod: new Date().toISOString(),
      alternateRefs: [],
    };
  },
};
