/** @type {import('next-sitemap').IConfig} */
const fs = require('fs');
const path = require('path');

const SITE = 'https://www.finnews247.com';

// Alias tên file JSON -> base path
const PATH_ALIASES = {
  // news/bài thị trường quy về /crypto-market
  news: '/crypto-market',
  market: '/crypto-market',
  posts: '/crypto-market',
  articles: '/crypto-market',
  'crypto-market': '/crypto-market',

  // các section khác giữ nguyên
  altcoins: '/altcoins',
  guides: '/guides',
  insurance: '/insurance',
  wallets: '/wallets',
  signals: '/signals',
  'crypto-exchanges': '/crypto-exchanges',
  exchanges: '/crypto-exchanges',
  'best-crypto-apps': '/best-crypto-apps',
  apps: '/best-crypto-apps',
};

function readJson(name) {
  try {
    const fp = path.join(process.cwd(), 'data', name);
    if (!fs.existsSync(fp)) return [];
    return JSON.parse(fs.readFileSync(fp, 'utf8'));
  } catch {
    return [];
  }
}

function toISO(d) {
  const dt = d ? new Date(d) : new Date();
  return isNaN(+dt) ? new Date().toISOString() : dt.toISOString();
}

function buildLoc(base, slug) {
  const s = String(slug || '').trim().replace(/^\/+|\/+$/g, '');
  const b = String(base || '').trim().replace(/^\/+|\/+$/g, '');
  return `/${[b, s].filter(Boolean).join('/')}`.replace(/\/{2,}/g, '/');
}

function baseFromFile(filename) {
  const key = filename.replace(/\.json$/,'');
  return PATH_ALIASES[key] || `/${key}`;
}

module.exports = {
  siteUrl: SITE,
  generateRobotsTxt: false,      // KHÔNG tự sinh robots.txt
  trailingSlash: false,
  sitemapSize: 45000,
  exclude: [
    '/admin',
    '/admin/*',
    '/api/*',
    '/server-sitemap.xml'
  ],

  // Các route tĩnh: để mặc định, nhưng thêm meta chuẩn
  transform: async (_config, url) => ({
    loc: url,
    changefreq: 'daily',
    priority: url === '/' ? 1 : 0.7,
    lastmod: new Date().toISOString(),
  }),

  // CHỈ liệt kê các bài động theo dữ liệu JSON trong /data
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
        lastmod: toISO(lastmod),
      });
    };

    // 1) Signals (giữ nguyên)
    readJson('signals.json').forEach((it) => {
      const slug = String(it?.slug || it?.id || '').trim();
      push(buildLoc('/signals', slug), it?.date || it?.lastmod);
    });

    // 2) Các section còn lại theo các file trong /data
    const dataDir = path.join(process.cwd(), 'data');
    if (fs.existsSync(dataDir)) {
      fs.readdirSync(dataDir)
        .filter((f) => f.endsWith('.json') && f !== 'signals.json')
        .forEach((file) => {
          const base = baseFromFile(file);
          const arr = readJson(file);

          arr.forEach((it) => {
            const slug = String(it?.slug || it?.id || '').trim();
            let locBase = base;

            // BẮT BUỘC: mọi “news/bài thị trường” phải vào /crypto-market
            const key = file.replace('.json', '');
            if (['news', 'market', 'posts', 'articles', 'crypto-market'].includes(key)) {
              locBase = '/crypto-market';
            }

            push(buildLoc(locBase, slug), it?.date || it?.updatedAt);
          });
        });
    }

    return out;
  },
};
