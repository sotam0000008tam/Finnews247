/** @type {import('next-sitemap').IConfig} */
const fs = require('fs');
const path = require('path');

function loadJson(name) {
  try {
    const p = path.join(process.cwd(), 'data', name);
    if (!fs.existsSync(p)) return [];
    return JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch {
    return [];
  }
}

module.exports = {
  siteUrl: 'https://www.finnews247.com',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  changefreq: 'daily',
  priority: 0.7,
  // robots.txt: cho phép crawl, chặn admin
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/admin/'] },
    ],
  },
  // Loại các URL không phải canonical
  exclude: [
    '/admin/*',
    '/privacy-policy', // giữ /privacy là canonical
  ],

  // Mặc định transform cho mọi URL
  transform: async (config, url) => ({
    loc: url,
    changefreq: 'daily',
    priority: url === '/' ? 1.0 : 0.7,
    lastmod: new Date().toISOString(),
    alternateRefs: [],
  }),

  // Bổ sung đường dẫn động từ các JSON trong /data
  additionalPaths: async (config) => {
    const paths = [];

    // 1) Trang tĩnh/hub
    const staticPages = [
      '/', '/about', '/contact', '/privacy', '/terms',
      '/crypto', '/market', '/signals', '/guides', '/tax', '/insurance',
      '/crypto-exchanges', '/best-crypto-apps', '/altcoins', '/wallets',
    ];
    for (const u of staticPages) {
      paths.push(config.transform(config, u));
    }

    // Helper dedupe + lastmod
    const seen = new Set();
    const addList = (items, toLoc, pickDate) => {
      for (const it of items || []) {
        const loc = toLoc(it);
        if (!loc || seen.has(loc)) continue;
        seen.add(loc);
        const lmRaw = pickDate ? pickDate(it) : undefined;
        const lastmod = lmRaw ? new Date(lmRaw).toISOString() : undefined;
        paths.push(
          config.transform(config, loc).then((base) => ({
            ...base,
            loc,
            lastmod: lastmod || base.lastmod,
          }))
        );
      }
    };

    // 2) NEWS ở ROOT: /{slug}
    addList(loadJson('news.json'), (it) => (it?.slug ? `/${it.slug}` : null), (it) => it?.date);

    // 3) SIGNALS: /signals/{slug|id}
    addList(
      loadJson('signals.json'),
      (it) => {
        const s = it?.slug || it?.id;
        return s ? `/signals/${s}` : null;
      },
      (it) => it?.date || it?.createdAt
    );

    // 4) GUIDES: /guides/{slug}
    addList(loadJson('guides.json'), (it) => (it?.slug ? `/guides/${it.slug}` : null), (it) => it?.date);

    // 5) TAX: /tax/{slug}
    addList(loadJson('tax.json'), (it) => (it?.slug ? `/tax/${it.slug}` : null), (it) => it?.date);

    // 6) INSURANCE: /insurance/{slug}
    addList(
      loadJson('insurance.json'),
      (it) => (it?.slug ? `/insurance/${it.slug}` : null),
      (it) => it?.date
    );

    // 7) CRYPTO EXCHANGES (gộp): /crypto-exchanges/{slug}
    addList(
      [...loadJson('cryptoexchanges.json'), ...loadJson('fidelity.json')],
      (it) => (it?.slug ? `/crypto-exchanges/${it.slug}` : null),
      (it) => it?.date
    );

    // 8) BEST APPS: /best-crypto-apps/{slug}
    addList(
      loadJson('bestapps.json'),
      (it) => (it?.slug ? `/best-crypto-apps/${it.slug}` : null),
      (it) => it?.date
    );

    // 9) ALTCOINS (+ SECCOIN): /altcoins/{slug}
    addList(
      [...loadJson('altcoins.json'), ...loadJson('seccoin.json')],
      (it) => (it?.slug ? `/altcoins/${it.slug}` : null),
      (it) => it?.date
    );

    // 10) WALLETS (nếu có): /wallets/{slug}
    addList(loadJson('wallets.json'), (it) => (it?.slug ? `/wallets/${it.slug}` : null), (it) => it?.date);

    return paths;
  },
};
