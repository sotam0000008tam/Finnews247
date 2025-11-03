/** @type {import('next-sitemap').IConfig} */
const fs = require('fs');
const path = require('path');

const SITE = 'https://www.finnews247.com';

// --- helpers ---
function readJsonSafe(filename) {
  try {
    const p = path.join(process.cwd(), 'data', filename);
    if (!fs.existsSync(p)) return [];
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return [];
  }
}

function cleanSlug(slug) {
  if (!slug) return '';
  let s = String(slug).trim().replace(/^\/+/, '');
  s = s.replace(/^news\//i, '');
  s = s.replace(/^crypto-market\//i, '');
  return s;
}

function buildPath(base, slug) {
  const s = cleanSlug(slug);
  if (!s) return null;
  return `/${base.replace(/^\/+/, '')}/${s}`.replace(/\/{2,}/g, '/');
}

function toISO(d) {
  if (!d) return undefined;
  const t = new Date(d);
  return isNaN(t.getTime()) ? undefined : t.toISOString();
}

module.exports = {
  siteUrl: SITE,

  // QUAN TRỌNG: chỉ 1 file sitemap.xml, không tạo sitemap index/các file con
  generateIndexSitemap: false,
  sitemapBaseFileName: 'sitemap',

  // TẮT robots tự sinh (dùng public/robots.txt thủ công)
  generateRobotsTxt: false,

  changefreq: 'daily',
  priority: 0.7,

  // Không quét tự động; chỉ dùng additionalPaths
  exclude: ['/*', '/**/*'],

  // transform chỉ áp dụng cho auto-scan; vẫn để ổn định giá trị mặc định
  transform: async (_config, url) => ({
    loc: url,
    changefreq: 'daily',
    priority: url === '/' ? 1.0 : 0.7,
    lastmod: new Date().toISOString(),
  }),

  additionalPaths: async () => {
    const out = [];
    const seen = new Set();
    const push = (loc, lastmod, priority) => {
      if (!loc) return;
      const clean = loc.replace(/\/{2,}/g, '/');
      if (seen.has(clean)) return;
      seen.add(clean);
      out.push({
        loc: clean,
        changefreq: 'daily',
        priority: priority ?? (clean === '/' ? 1.0 : 0.7),
        lastmod: lastmod || new Date().toISOString(),
      });
    };

    // 1) Trang chính
    [
      '/', '/about', '/contact', '/privacy', '/terms',
      '/signals', '/altcoins', '/crypto-exchanges',
      '/best-crypto-apps', '/insurance', '/crypto-market', '/guides',
    ].forEach(p => push(p));

    // 2) Bài viết theo data/*.json
    // signals
    readJsonSafe('signals.json').forEach(it => {
      const loc = buildPath('/signals', it.slug || it.id);
      push(loc, toISO(it.date || it.createdAt));
    });

    // altcoins (+ seccoin)
    [...readJsonSafe('altcoins.json'), ...readJsonSafe('seccoin.json')].forEach(it => {
      const loc = buildPath('/altcoins', it.slug || it.path);
      push(loc, toISO(it.date));
    });

    // crypto-exchanges (+ fidelity)
    [...readJsonSafe('cryptoexchanges.json'), ...readJsonSafe('fidelity.json')].forEach(it => {
      const loc = buildPath('/crypto-exchanges', it.slug || it.path);
      push(loc, toISO(it.date));
    });

    // best-crypto-apps
    readJsonSafe('bestapps.json').forEach(it => {
      const loc = buildPath('/best-crypto-apps', it.slug || it.path);
      push(loc, toISO(it.date));
    });

    // insurance
    readJsonSafe('insurance.json').forEach(it => {
      const loc = buildPath('/insurance', it.slug || it.path);
      push(loc, toISO(it.date));
    });

    // crypto-market (news.json)
    readJsonSafe('news.json').forEach(it => {
      const loc = buildPath('/crypto-market', it.slug || it.path);
      push(loc, toISO(it.date));
    });

    // guides
    readJsonSafe('guides.json').forEach(it => {
      const loc = buildPath('/guides', it.slug || it.path);
      push(loc, toISO(it.date));
    });

    return out;
  },
};
