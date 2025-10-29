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
    additionalSitemaps: [],
  },

  exclude: [
    '/admin',
    '/admin/*',
    '/api/*',
    '/privacy-policy',
    '/privacy-policy/*',
    '/news/*',
    '/exchanges*',
    '/crypto-tax*',
    '/crypto-insurance*',
  ],

  transform: async (config, url) => ({
    loc: url,
    changefreq: 'daily',
    priority: url === '/' ? 1.0 : 0.7,
    lastmod: new Date().toISOString(),
    alternateRefs: [],
  }),

  additionalPaths: async () => {
    const out = [];
    const seen = new Set();
    const push = (loc, lastmod, priority = 0.7) => {
      if (!loc) return;
      loc = loc.replace(/\/{2,}/g, '/');
      if (seen.has(loc)) return;
      seen.add(loc);
      out.push({
        loc,
        changefreq: 'daily',
        priority,
        lastmod: lastmod || new Date().toISOString(),
      });
    };

    [
      '/', '/about', '/contact', '/privacy', '/terms',
      '/crypto', '/market', '/signals', '/guides', '/tax', '/insurance',
      '/crypto-exchanges', '/best-crypto-apps', '/altcoins', '/wallets',
    ].forEach(u => push(u, new Date().toISOString(), u === '/' ? 1.0 : 0.7));

    readJson('news.json').forEach(it => {
      let slug = String(it?.slug || '').trim().replace(/^\/+/, '');
      if (slug.toLowerCase().startsWith('news/')) slug = slug.slice(5);
      if (slug.toLowerCase().startsWith('/news/')) slug = slug.slice(6);
      if (!slug || slug === '/' || slug === 'news') return;
      const loc = buildLoc('/', slug);
      push(loc, toISO(it?.date));
    });

    readJson('signals.json').forEach(it => {
      const s = String(it?.slug || it?.id || '').trim().replace(/^\/+/, '');
      const loc = buildLoc('/signals', s);
      push(loc, toISO(it?.date || it?.createdAt));
    });

    readJson('guides.json').forEach(it => {
      const slug = String(it?.slug || '').trim();
      const loc = buildLoc('/guides', slug);
      push(loc, toISO(it?.date));
    });

    readJson('tax.json').forEach(it => {
      const slug = String(it?.slug || '').trim();
      const loc = buildLoc('/tax', slug);
      push(loc, toISO(it?.date));
    });

    readJson('insurance.json').forEach(it => {
      const slug = String(it?.slug || '').trim();
      const loc = buildLoc('/insurance', slug);
      push(loc, toISO(it?.date));
    });

    [...readJson('cryptoexchanges.json'), ...readJson('fidelity.json')].forEach(it => {
      const slug = String(it?.slug || '').trim();
      const loc = buildLoc('/crypto-exchanges', slug);
      push(loc, toISO(it?.date));
    });

    readJson('bestapps.json').forEach(it => {
      const slug = String(it?.slug || '').trim();
      const loc = buildLoc('/best-crypto-apps', slug);
      push(loc, toISO(it?.date));
    });

    [...readJson('altcoins.json'), ...readJson('seccoin.json')].forEach(it => {
      const slug = String(it?.slug || '').trim();
      const loc = buildLoc('/altcoins', slug);
      push(loc, toISO(it?.date));
    });

    readJson('wallets.json').forEach(it => {
      const slug = String(it?.slug || '').trim();
      const loc = buildLoc('/wallets', slug);
      push(loc, toISO(it?.date));
    });

    return out;
  },
};
