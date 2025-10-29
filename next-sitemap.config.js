/** @type {import('next-sitemap').IConfig} */
const fs = require('fs');
const path = require('path');

// ÉP domain thật – không bao giờ dùng localhost
const SITE = 'https://www.finnews247.com';

// Đọc JSON an toàn
function readJson(name) {
  try {
    const p = path.join(process.cwd(), 'data', name);
    if (!fs.existsSync(p)) return [];
    return JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch {
    return [];
  }
}

// Chuẩn hoá url path
function buildLoc(base, slug) {
  if (!slug) return null;
  slug = String(slug).trim();
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
  generateRobotsTxt: true,          // muốn tự gen robots.txt luôn
  generateIndexSitemap: true,       // tự tạo sitemap-index nếu dài
  trailingSlash: false,
  changefreq: 'daily',
  priority: 0.7,

  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/admin', '/admin/*', '/api/*'] },
    ],
  },

  // Loại các route cũ/không dùng
  exclude: [
    '/admin', '/admin/*',
    '/api/*',
    '/privacy-policy', '/privacy-policy/*',
    '/news/*',           // nếu không còn dùng
    '/exchanges*',       // route cũ
    '/crypto-tax*',      // route cũ
    '/crypto-insurance*' // route cũ
  ],

  // Mặc định mọi URL transform theo cấu hình chung
  transform: async (config, url) => ({
    loc: url,
    changefreq: 'daily',
    priority: url === '/' ? 1.0 : 0.7,
    lastmod: new Date().toISOString(),
    alternateRefs: [],
  }),

  /**
   * Bơm thêm đường dẫn tuỳ biến (trang chính + bài viết từ /data).
   * Bạn chỉ cần cập nhật JSON trong /data rồi rebuild là sitemap tự sinh đúng.
   */
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

    // 1) Trang cố định + các listing CHÍNH
    [
      '/', '/about', '/contact', '/privacy', '/terms',
      '/signals',
      '/altcoins',
      '/crypto-exchanges',
      '/best-crypto-apps',
      '/insurance',
      '/crypto-market',
      '/guides',
    ].forEach(u => push(u, new Date().toISOString(), u === '/' ? 1.0 : 0.7));

    // 2) Bài viết từ /data (giữ đúng cấu trúc site hiện tại)
    // - Signals
    readJson('signals.json').forEach(it => {
      const s = String(it?.slug || it?.id || '').replace(/^\/+/, '');
      const loc = buildLoc('/signals', s);
      push(loc, toISO(it?.date || it?.createdAt));
    });

    // - Guides
    readJson('guides.json').forEach(it => {
      const loc = buildLoc('/guides', it?.slug || '');
      push(loc, toISO(it?.date));
    });

    // - Insurance
    readJson('insurance.json').forEach(it => {
      const loc = buildLoc('/insurance', it?.slug || '');
      push(loc, toISO(it?.date));
    });

    // - Crypto Exchanges (gộp 2 nguồn thường thấy)
    [...readJson('cryptoexchanges.json'), ...readJson('fidelity.json')].forEach(it => {
      const loc = buildLoc('/crypto-exchanges', it?.slug || '');
      push(loc, toISO(it?.date));
    });

    // - Best crypto apps
    readJson('bestapps.json').forEach(it => {
      const loc = buildLoc('/best-crypto-apps', it?.slug || '');
      push(loc, toISO(it?.date));
    });

    // - Altcoins (có thể gồm cả seccoin.json nếu bạn tách bộ bài)
    [...readJson('altcoins.json'), ...readJson('seccoin.json')].forEach(it => {
      const loc = buildLoc('/altcoins', it?.slug || '');
      push(loc, toISO(it?.date));
    });

    // - Crypto market:
    //   Nhiều repo lưu chung vào news.json với slug đã chứa "crypto-market/..."
    //   nên mình đọc news.json và giữ nguyên slug.
    readJson('news.json').forEach(it => {
      let slug = String(it?.slug || '').trim().replace(/^\/+/, '');
      if (!slug || slug === '/') return;
      const loc = buildLoc('/', slug);  // slug đã gồm 'crypto-market/...'
      push(loc, toISO(it?.date));
    });

    return out;
  },
};
