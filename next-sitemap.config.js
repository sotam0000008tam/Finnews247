/** @type {import('next-sitemap').IConfig} */
const fs = require('fs');
const path = require('path');

// Luôn sinh timestamp theo UTC
process.env.TZ = 'Etc/UTC';

const SITE = 'https://www.finnews247.com';
const INCLUDE_IMAGES_IN_MAIN_SITEMAP = true;

// ---------- helpers ----------
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
  s = s.replace(/^news\//i, '').replace(/^crypto-market\//i, '');
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
// hash nhẹ để tạo phút-offset ổn định theo slug
function hash32(s='') {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}
// Nếu chỉ có "YYYY-MM-DD" thì rải giờ ổn định theo slug
function smartLastmod(item, slugKey) {
  const cand = item.date || item.updatedAt || item.publishedAt || item.createdAt;
  if (!cand) return undefined;
  const d = new Date(cand);
  if (isNaN(d.getTime())) return undefined;

  const onlyDate = /^\d{4}-\d{2}-\d{2}$/.test(String(cand));
  if (!onlyDate) return d.toISOString();

  const base = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0);
  const minutes = hash32(String(slugKey)) % 1440; // 0..1439
  return new Date(base + minutes * 60000).toISOString();
}

// chỉ nhận ảnh tuyệt đối cùng host
function toAbsOnHost(src) {
  if (!src) return null;
  if (/^https?:\/\//i.test(src)) return src.startsWith(SITE) ? src : null;
  if (src.startsWith('/')) return SITE + src;
  return SITE + '/images/' + src;
}
function pickAbsImage(it) {
  // bỏ qua logo chung để tránh spam ảnh
  const cand = it?.ogImage || it?.image || it?.thumb;
  const abs = toAbsOnHost(cand);
  if (!abs) return null;
  if (/\/logo\.png$/i.test(abs)) return null;
  return abs;
}

module.exports = {
  siteUrl: SITE,
  generateIndexSitemap: false,
  sitemapBaseFileName: 'sitemap',
  generateRobotsTxt: false,
  changefreq: 'daily',
  priority: 0.7,
  exclude: ['/*', '/**/*'],
  transform: async (_config, url) => ({
    loc: url,
    changefreq: 'daily',
    priority: url === '/' ? 1.0 : 0.7,
    lastmod: new Date().toISOString(),
  }),
  additionalPaths: async () => {
    const out = [];
    const seen = new Set();
    const fallbackLastmod = () => new Date(Date.now() - 86400000).toISOString();

    const push = (loc, lastmod, priority, imgUrl) => {
      if (!loc) return;
      const clean = loc.replace(/\/{2,}/g, '/');
      if (seen.has(clean)) return;
      seen.add(clean);

      const entry = {
        loc: clean,
        changefreq: 'daily',
        priority: priority ?? (clean === '/' ? 1.0 : 0.7),
        lastmod: lastmod ?? fallbackLastmod(),
      };

      if (INCLUDE_IMAGES_IN_MAIN_SITEMAP && typeof imgUrl === 'string' && /^https?:\/\//.test(imgUrl)) {
        entry.images = [{ loc: imgUrl }]; // chỉ thêm khi có URL hợp lệ -> không bao giờ ra 'undefined'
      }

      out.push(entry);
    };

    // Trang chính
    [
      '/', '/about', '/contact', '/privacy', '/terms',
      '/signals', '/altcoins', '/crypto-exchanges',
      '/best-crypto-apps', '/insurance', '/crypto-market', '/guides',
    ].forEach(p => push(p));

    // signals
    readJsonSafe('signals.json').forEach(it => {
      const slug = it.slug || it.id;
      const loc = buildPath('/signals', slug);
      const lm  = smartLastmod(it, slug) || toISO(it.date || it.updatedAt || it.publishedAt || it.createdAt);
      const img = pickAbsImage(it);
      push(loc, lm, undefined, img);
    });

    // altcoins (+ seccoin)
    [...readJsonSafe('altcoins.json'), ...readJsonSafe('seccoin.json')].forEach(it => {
      const slug = it.slug || it.path;
      const loc = buildPath('/altcoins', slug);
      const lm  = smartLastmod(it, slug) || toISO(it.date || it.updatedAt);
      const img = pickAbsImage(it);
      push(loc, lm, undefined, img);
    });

    // crypto-exchanges (+ fidelity)
    [...readJsonSafe('cryptoexchanges.json'), ...readJsonSafe('fidelity.json')].forEach(it => {
      const slug = it.slug || it.path;
      const loc = buildPath('/crypto-exchanges', slug);
      const lm  = smartLastmod(it, slug) || toISO(it.date || it.updatedAt);
      const img = pickAbsImage(it);
      push(loc, lm, undefined, img);
    });

    // best-crypto-apps
    readJsonSafe('bestapps.json').forEach(it => {
      const slug = it.slug || it.path;
      const loc = buildPath('/best-crypto-apps', slug);
      const lm  = smartLastmod(it, slug) || toISO(it.date || it.updatedAt);
      const img = pickAbsImage(it);
      push(loc, lm, undefined, img);
    });

    // insurance
    readJsonSafe('insurance.json').forEach(it => {
      const slug = it.slug || it.path;
      const loc = buildPath('/insurance', slug);
      const lm  = smartLastmod(it, slug) || toISO(it.date || it.updatedAt);
      const img = pickAbsImage(it);
      push(loc, lm, undefined, img);
    });

    // crypto-market (news.json)
    readJsonSafe('news.json').forEach(it => {
      const slug = it.slug || it.path;
      const loc = buildPath('/crypto-market', slug);
      const lm  = smartLastmod(it, slug) || toISO(it.date || it.updatedAt || it.publishedAt);
      const img = pickAbsImage(it);
      push(loc, lm, undefined, img);
    });

    // guides
    readJsonSafe('guides.json').forEach(it => {
      const slug = it.slug || it.path;
      const loc = buildPath('/guides', slug);
      const lm  = smartLastmod(it, slug) || toISO(it.date || it.updatedAt);
      const img = pickAbsImage(it);
      push(loc, lm, undefined, img);
    });

    return out;
  },
};
