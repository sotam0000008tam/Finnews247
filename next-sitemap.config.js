/** @type {import('next-sitemap').IConfig} */
const fs = require('fs');
const path = require('path');

const SITE = 'https://www.finnews247.com';

function readJson(name) {
  try {
    const p = path.join(process.cwd(), 'data', name);
    if (!fs.existsSync(p)) return [];
    return JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch {
    return [];
  }
}

/** Chuẩn hoá đường dẫn:
 * - Nếu slug đã là absolute (bắt đầu bằng "/"): dùng nguyên
 * - Nếu slug đã bao gồm hub (vd "guides/abc"): thêm "/" + slug
 * - Nếu chỉ là slug trần (vd "abc"): join với base (vd "/guides/abc")
 */
function buildLoc(base, slug) {
  if (!slug) return null;
  if (slug.startsWith('/')) return slug;
  if (slug.includes('/')) return `/${slug}`;
  return `${base}/${slug}`.replace(/\/{2,}/g, '/');
}

function toISO(d) {
  if (!d) return undefined;
  const t = new Date(d);
  return isNaN(t.getTime()) ? undefined : t.toISOString();
}

module.exports = {
  siteUrl: SITE,
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  changefreq: 'daily',
  priority: 0.7,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/admin/'] },
    ],
  },
  exclude: [
    '/admin/*',
    '/privacy-policy', // giữ /privacy làm canonical
  ],

  // Dùng transform mặc định cho các URL tự khám phá từ Next (nếu có)
  transform: async (config, url) => ({
    loc: url,
    changefreq: 'daily',
    priority: url === '/' ? 1.0 : 0.7,
    lastmod: new Date().toISOString(),
    alternateRefs: [],
  }),

  // Bơm đầy đủ URL từ /data/*.json
  additionalPaths: async () => {
    const out = [];
    const seen = new Set();
    const push = (loc, lastmod, priority = 0.7) => {
      if (!loc) return;
      // lọc trùng
      if (seen.has(loc)) return;
      seen.add(loc);
      out.push({
        loc,
        changefreq: 'daily',
        priority,
        lastmod: lastmod || new Date().toISOString(),
      });
    };

    // 0) STATIC PAGES / HUBS
    [
      '/', '/about', '/contact', '/privacy', '/terms',
      '/crypto', '/market', '/signals', '/guides', '/tax', '/insurance',
      '/crypto-exchanges', '/best-crypto-apps', '/altcoins', '/wallets',
    ].forEach(u => push(u, new Date().toISOString(), u === '/' ? 1.0 : 0.7));

    // 1) NEWS ở ROOT: /{slug}
    readJson('news.json').forEach(it => {
      const loc = buildLoc('/', it?.slug);
      push(loc, toISO(it?.date));
    });

    // 2) SIGNALS: /signals/{slug|id}
    readJson('signals.json').forEach(it => {
      const s = it?.slug || it?.id;
      const loc = buildLoc('/signals', s);
      push(loc, toISO(it?.date || it?.createdAt));
    });

    // 3) GUIDES: /guides/{slug}
    readJson('guides.json').forEach(it => {
      const loc = buildLoc('/guides', it?.slug);
      push(loc, toISO(it?.date));
    });

    // 4) TAX: /tax/{slug}
    readJson('tax.json').forEach(it => {
      const loc = buildLoc('/tax', it?.slug);
      push(loc, toISO(it?.date));
    });

    // 5) INSURANCE: /insurance/{slug}
    readJson('insurance.json').forEach(it => {
      const loc = buildLoc('/insurance', it?.slug);
      push(loc, toISO(it?.date));
    });

    // 6) CRYPTO EXCHANGES (gộp)
    [...readJson('cryptoexchanges.json'), ...readJson('fidelity.json')].forEach(it => {
      const loc = buildLoc('/crypto-exchanges', it?.slug);
      push(loc, toISO(it?.date));
    });

    // 7) BEST APPS
    readJson('bestapps.json').forEach(it => {
      const loc = buildLoc('/best-crypto-apps', it?.slug);
      push(loc, toISO(it?.date));
    });

    // 8) ALTCOINS (+ SECCOIN)
    [...readJson('altcoins.json'), ...readJson('seccoin.json')].forEach(it => {
      const loc = buildLoc('/altcoins', it?.slug);
      push(loc, toISO(it?.date));
    });

    // 9) WALLETS (nếu có)
    readJson('wallets.json').forEach(it => {
      const loc = buildLoc('/wallets', it?.slug);
      push(loc, toISO(it?.date));
    });

    return out;
  },
};
