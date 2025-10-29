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

/** Chuẩn hoá slug thành path tuyệt đối */
function buildLoc(base, slug) {
  if (!slug) return null;
  if (slug.startsWith('/')) return slug.replace(/\/{2,}/g, '/');
  if (slug.includes('/')) return `/${slug}`.replace(/\/{2,}/g, '/');
  return `${base}/${slug}`.replace(/\/{2,}/g, '/');
}

/** Bỏ /baiviet/ dưới các chuyên mục yêu cầu */
const CATS = [
  '/signals',
  '/altcoins',
  '/crypto-exchanges',
  '/best-crypto-apps',
  '/insurance',
  '/crypto-market',
  '/guides',
];

function normalizeCategoryPath(p) {
  if (!p) return p;
  let loc = p.replace(/\/{2,}/g, '/');
  for (const base of CATS) {
    // /cat/baiviet/slug  -> /cat/slug
    loc = loc.replace(new RegExp(`(${base})/baiviet/`, 'gi'), `$1/`);
    // /cat/baiviet (cuối chuỗi) -> /cat
    loc = loc.replace(new RegExp(`(${base})/baiviet$`, 'gi'), `$1`);
  }
  return loc;
}

function toISO(d) {
  if (!d) return undefined;
  const t = new Date(d);
  return isNaN(t.getTime()) ? undefined : t.toISOString();
}

module.exports = {
  siteUrl: SITE,
  trailingSlash: false,

  // KHÔNG sinh robots.txt
  generateRobotsTxt: false,

  // sitemap.xml (index) trỏ tới sitemap-0.xml
  generateIndexSitemap: true,

  changefreq: 'daily',
  priority: 0.7,

  // Giữ nguyên exclude an toàn
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
      loc = normalizeCategoryPath(loc);
      if (seen.has(loc)) return;
      seen.add(loc);
      out.push({
        loc,
        changefreq: 'daily',
        priority,
        lastmod: lastmod || new Date().toISOString(),
      });
    };

    // 1) Trang chính đúng như bạn yêu cầu
    [
      '/', '/about', '/contact', '/privacy', '/terms',
      '/signals', '/altcoins', '/crypto-exchanges',
      '/best-crypto-apps', '/insurance', '/crypto-market', '/guides',
    ].forEach(u => push(u, new Date().toISOString(), u === '/' ? 1.0 : 0.7));

    // 2) Bài viết theo từng chuyên mục
    // signals
    readJson('signals.json').forEach(it => {
      const s = String(it?.slug || it?.id || '').trim().replace(/^\/+/, '');
      const loc = buildLoc('/signals', s);
      push(loc, toISO(it?.date || it?.createdAt));
    });

    // altcoins (+ seccoin nếu bạn đang dùng để merge dữ liệu)
    [...readJson('altcoins.json'), ...readJson('seccoin.json')].forEach(it => {
      const slug = String(it?.slug || '').trim();
      const loc = buildLoc('/altcoins', slug);
      push(loc, toISO(it?.date));
    });

    // crypto-exchanges (+ fidelity nếu có)
    [...readJson('cryptoexchanges.json'), ...readJson('fidelity.json')].forEach(it => {
      const slug = String(it?.slug || '').trim();
      const loc = buildLoc('/crypto-exchanges', slug);
      push(loc, toISO(it?.date));
    });

    // best-crypto-apps
    readJson('bestapps.json').forEach(it => {
      const slug = String(it?.slug || '').trim();
      const loc = buildLoc('/best-crypto-apps', slug);
      push(loc, toISO(it?.date));
    });

    // insurance
    readJson('insurance.json').forEach(it => {
      const slug = String(it?.slug || '').trim();
      const loc = buildLoc('/insurance', slug);
      push(loc, toISO(it?.date));
    });

    // guides
    readJson('guides.json').forEach(it => {
      const slug = String(it?.slug || '').trim();
      const loc = buildLoc('/guides', slug);
      push(loc, toISO(it?.date));
    });

    // crypto-market (đang lưu trong news.json theo slug 'crypto-market/...'; bỏ tiền tố 'news/' nếu có)
    readJson('news.json').forEach(it => {
      let slug = String(it?.slug || '').trim().replace(/^\/+/, '');
      if (slug.toLowerCase().startsWith('news/')) slug = slug.slice(5);
      const loc = buildLoc('/', slug); // ví dụ: 'crypto-market/abc' -> '/crypto-market/abc'
      push(loc, toISO(it?.date));
    });

    // LƯU Ý: Cố ý KHÔNG đọc tax.json, wallets.json, ... để đúng phạm vi bạn yêu cầu
    return out;
  },
};
