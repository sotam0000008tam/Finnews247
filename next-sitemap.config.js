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
 * - Nếu slug có "/" (vd "guides/abc"): thêm "/" + slug
 * - Nếu slug trần (vd "abc"): join base (vd "/guides/abc")
 */
function buildLoc(base, slug) {
  if (!slug) return null;
  if (slug.startsWith('/')) return slug.replace(/\/{2,}/g, '/');
  if (slug.includes('/')) return `/${slug}`.replace(/\/{2,}/g, '/');
  return `${base}/${slug}`.replace(/\/{2,}/g, '/');
}

function toISO(d) {
  if (!d) return undefined;
  const t = new Date(d);
  return isNaN(t.getTime()) ? undefined : t.toISOString();
}

module.exports = {
  siteUrl: SITE,
  trailingSlash: false,
  generateRobotsTxt: false,
  generateIndexSitemap: true,
  changefreq: 'daily',
  priority: 0.7,

  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/admin', '/admin/*', '/api/*'] },
    ],
    additionalSitemaps: [], // có thể thêm CDN sitemap khác nếu cần
  },

  // Loại hẳn các nhánh/URL không canonical
  exclude: [
    '/admin',
    '/admin/*',
    '/api/*',
    '/privacy-policy',      // giữ /privacy làm canonical
    '/privacy-policy/*',
    '/news/*',              // news đã canonical ở root /
    '/exchanges*',          // nhánh cũ, đã đổi thành /crypto-exchanges
    '/crypto-tax*',         // nhánh cũ, gộp vào /tax
    '/crypto-insurance*',   // nhánh cũ, gộp vào /insurance
  ],

  // Cho các URL Next tự phát hiện (nếu có)
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
      // chuẩn hoá bỏ slash thừa
      loc = loc.replace(/\/{2,}/g, '/');
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

    // 0) STATIC PAGES / HUBS (canonical)
    [
      '/', '/about', '/contact', '/privacy', '/terms',
      '/crypto', '/market', '/signals', '/guides', '/tax', '/insurance',
      '/crypto-exchanges', '/best-crypto-apps', '/altcoins', '/wallets',
    ].forEach(u => push(u, new Date().toISOString(), u === '/' ? 1.0 : 0.7));

    // 1) NEWS canonical ở ROOT: /{slug}
    readJson('news.json').forEach(it => {
      let slug = String(it?.slug || '').trim().replace(/^\/+/, '');
      // Nếu JSON còn để "news/xxx", đổi về root "xxx"
      if (slug.toLowerCase().startsWith('news/')) {
        slug = slug.slice(5);
      }
      // Trường hợp vô tình để absolute như "/news/xxx" → cũng strip
      if (slug.toLowerCase().startsWith('/news/')) {
        slug = slug.slice(6);
      }
      // Chặn rỗng/độc hại
      if (!slug || slug === '/' || slug === 'news') return;
      const loc = buildLoc('/', slug);
      push(loc, toISO(it?.date));
    });

    // 2) SIGNALS: /signals/{slug|id}
    readJson('signals.json').forEach(it => {
      const s = String(it?.slug || it?.id || '').trim().replace(/^\/+/, '');
      const loc = buildLoc('/signals', s);
      push(loc, toISO(it?.date || it?.createdAt));
    });

    // 3) GUIDES: /guides/{slug}
    readJson('guides.json').forEach(it => {
      const slug = String(it?.slug || '').trim();
      const loc = buildLoc('/guides', slug);
      push(loc, toISO(it?.date));
    });

    // 4) TAX: /tax/{slug}
    readJson('tax.json').forEach(it => {
      const slug = String(it?.slug || '').trim();
      const loc = buildLoc('/tax', slug);
      push(loc, toISO(it?.date));
    });

    // 5) INSURANCE: /insurance/{slug}
    readJson('insurance.json').forEach(it => {
      const slug = String(it?.slug || '').trim();
      const loc = buildLoc('/insurance', slug);
      push(loc, toISO(it?.date));
    });

    // 6) CRYPTO EXCHANGES (gộp fidelity)
    [...readJson('cryptoexchanges.json'), ...readJson('fidelity.json')].forEach(it => {
      const slug = String(it?.slug || '').trim();
      const loc = buildLoc('/crypto-exchanges', slug);
      push(loc, toISO(it?.date));
    });

    // 7) BEST APPS
    readJson('bestapps.json').forEach(it => {
      const slug = String(it?.slug || '').trim();
      const loc = buildLoc('/best-crypto-apps', slug);
      push(loc, toISO(it?.date));
    });

    // 8) ALTCOINS (+ SECCOIN)
    [...readJson('altcoins.json'), ...readJson('seccoin.json')].forEach(it => {
      const slug = String(it?.slug || '').trim();
      const loc = buildLoc('/altcoins', slug);
      push(loc, toISO(it?.date));
    });

    // 9) WALLETS (nếu có)
    readJson('wallets.json').forEach(it => {
      const slug = String(it?.slug || '').trim();
      const loc = buildLoc('/wallets', slug);
      push(loc, toISO(it?.date));
    });

    return out;
  },
};
