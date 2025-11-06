/** @type {import('next-sitemap').IConfig} */
const fs = require('fs');
const path = require('path');

// BẮT BUỘC: always UTC để Google hiểu đúng ngày/giờ
process.env.TZ = 'Etc/UTC';

const SITE = 'https://www.finnews247.com';
const BUILD_TS = Date.now();
const BUILD_ISO = new Date(BUILD_TS).toISOString();

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
function onlyDateString(v) {
  return typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
}
function hashSlug(s = '') {
  // djb2 simple hash → ổn định giữa các build
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) + s.charCodeAt(i);
  return Math.abs(h);
}
function isoSmart(dateLike, slugOrLoc) {
  if (!dateLike) return undefined;
  const d = new Date(dateLike);
  // Nếu parse được và có time → giữ nguyên
  if (!Number.isNaN(d.getTime()) && !onlyDateString(String(dateLike))) {
    return d.toISOString();
  }
  // Nếu chỉ có "YYYY-MM-DD"
  if (onlyDateString(String(dateLike))) {
    const base = new Date(dateLike + 'T00:00:00.000Z');
    // Nếu là NGÀY HÔM NAY → dùng giờ build (để sitemap thể hiện mới thực sự)
    const todayUTC = new Date(BUILD_TS).toISOString().slice(0, 10);
    if (String(dateLike) === todayUTC) return BUILD_ISO;
    // Cũ hơn hôm nay → gắn giờ/phút ổn định theo seed (tránh đổi mỗi build)
    const seed = hashSlug(slugOrLoc || String(dateLike));
    const hour = seed % 24;
    const min = Math.floor(seed / 97) % 60;
    base.setUTCHours(hour, min, 0, 0);
    return base.toISOString();
  }
  // Trường hợp parse fail → undefined
  return undefined;
}

function firstImageFromHtml(html = '') {
  const m = String(html).match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
}
function pickImage(p) {
  return p?.thumb || p?.ogImage || p?.image || firstImageFromHtml(p?.content || p?.body || '');
}
function absImg(src) {
  if (!src) return null;
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith('/')) return `${SITE}${src}`;
  return `${SITE}/images/${src}`;
}

module.exports = {
  siteUrl: SITE,

  // Một file duy nhất: /sitemap.xml
  generateIndexSitemap: false,
  sitemapBaseFileName: 'sitemap',

  // Dùng robots.txt thủ công
  generateRobotsTxt: false,

  changefreq: 'daily',
  priority: 0.7,

  // Không quét auto; chỉ xuất những gì mình cung cấp
  exclude: ['/*', '/**/*'],

  // (không dùng vì exclude tất cả, nhưng để an toàn)
  transform: async (_config, url) => ({
    loc: url,
    changefreq: 'daily',
    priority: url === '/' ? 1.0 : 0.7,
    lastmod: BUILD_ISO,
  }),

  additionalPaths: async () => {
    const out = [];
    const seen = new Set();

    const push = ({ loc, lastmod, priority, image }) => {
      if (!loc) return;
      const clean = loc.replace(/\/{2,}/g, '/');
      if (seen.has(clean)) return;
      seen.add(clean);

      const images = image ? [{ loc: absImg(image) }].filter(Boolean) : undefined;

      out.push({
        loc: clean,
        changefreq: 'daily',
        priority: priority ?? (clean === '/' ? 1.0 : 0.7),
        lastmod: lastmod ?? new Date(BUILD_TS - 86400000).toISOString(), // fallback "cách đây 1 ngày"
        ...(images && { images }),
      });
    };

    // 1) Trang chính
    [
      '/', '/about', '/contact', '/privacy', '/terms',
      '/signals', '/altcoins', '/crypto-exchanges',
      '/best-crypto-apps', '/insurance', '/crypto-market', '/guides',
    ].forEach((p) => push({ loc: p, lastmod: BUILD_ISO }));

    // 2) Bài viết từ data/*.json (gắn ảnh vào sitemap chính)
    const collect = (file, base, dateKeys = ['date', 'updatedAt', 'publishedAt', 'createdAt']) => {
      readJsonSafe(file).forEach((it) => {
        const slug = it.slug || it.path || it.id;
        const loc = buildPath(base, slug);
        const dateLike = dateKeys.map((k) => it[k]).find(Boolean);
        const lastmod = isoSmart(dateLike, slug || loc);
        const image = pickImage(it);
        push({ loc, lastmod, image });
      });
    };

    // signals
    collect('signals.json', '/signals', ['date', 'updatedAt', 'publishedAt', 'createdAt']);
    // altcoins (+ seccoin)
    [...readJsonSafe('altcoins.json'), ...readJsonSafe('seccoin.json')].forEach((it) => {
      const slug = it.slug || it.path;
      const loc = buildPath('/altcoins', slug);
      const lastmod = isoSmart(it.date || it.updatedAt, slug || loc);
      const image = pickImage(it);
      push({ loc, lastmod, image });
    });
    // crypto-exchanges (+ fidelity)
    [...readJsonSafe('cryptoexchanges.json'), ...readJsonSafe('fidelity.json')].forEach((it) => {
      const slug = it.slug || it.path;
      const loc = buildPath('/crypto-exchanges', slug);
      const lastmod = isoSmart(it.date || it.updatedAt, slug || loc);
      const image = pickImage(it);
      push({ loc, lastmod, image });
    });
    // best-crypto-apps
    readJsonSafe('bestapps.json').forEach((it) => {
      const slug = it.slug || it.path;
      const loc = buildPath('/best-crypto-apps', slug);
      const lastmod = isoSmart(it.date || it.updatedAt, slug || loc);
      const image = pickImage(it);
      push({ loc, lastmod, image });
    });
    // insurance
    readJsonSafe('insurance.json').forEach((it) => {
      const slug = it.slug || it.path;
      const loc = buildPath('/insurance', slug);
      const lastmod = isoSmart(it.date || it.updatedAt, slug || loc);
      const image = pickImage(it);
      push({ loc, lastmod, image });
    });
    // crypto-market (news.json)
    readJsonSafe('news.json').forEach((it) => {
      const slug = it.slug || it.path;
      const loc = buildPath('/crypto-market', slug);
      const lastmod = isoSmart(it.date || it.updatedAt, slug || loc);
      const image = pickImage(it);
      push({ loc, lastmod, image });
    });
    // guides
    readJsonSafe('guides.json').forEach((it) => {
      const slug = it.slug || it.path;
      const loc = buildPath('/guides', slug);
      const lastmod = isoSmart(it.date || it.updatedAt, slug || loc);
      const image = pickImage(it);
      push({ loc, lastmod, image });
    });

    return out;
  },
};
