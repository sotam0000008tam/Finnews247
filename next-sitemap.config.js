/** @type {import('next-sitemap').IConfig} */
const fs = require('fs');
const path = require('path');

// Đảm bảo timestamp sinh ra ở UTC (Google đọc theo UTC)
process.env.TZ = 'Etc/UTC';

const SITE = 'https://www.finnews247.com';
const INCLUDE_IMAGES_IN_MAIN_SITEMAP = true; // bật/tắt việc nhúng <image:image> trong sitemap.xml

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

// Chỉ lấy ảnh nằm trên chính domain để tránh lệch host
function pickAbsImage(it) {
  const src = it?.ogImage || it?.image || it?.thumb;
  if (!src) return null;
  if (/^https?:\/\//i.test(src)) {
    return src.startsWith(SITE) ? src : null;
  }
  // đường dẫn tương đối
  if (src.startsWith('/')) return SITE + src;
  return SITE + '/images/' + src;
}

module.exports = {
  siteUrl: SITE,

  // Chỉ 1 file sitemap.xml (không tạo index)
  generateIndexSitemap: false,
  sitemapBaseFileName: 'sitemap',

  // Dùng robots.txt thủ công trong /public
  generateRobotsTxt: false,

  changefreq: 'daily',
  priority: 0.7,

  // Không auto-scan route; chỉ dùng additionalPaths
  exclude: ['/*', '/**/*'],

  // Dùng mặc định cho những URL được auto-transform (dù ta không dùng auto-scan)
  transform: async (_config, url) => ({
    loc: url,
    changefreq: 'daily',
    priority: url === '/' ? 1.0 : 0.7,
    lastmod: new Date().toISOString(),
  }),

  additionalPaths: async () => {
    const out = [];
    const seen = new Set();

    // Fallback lastmod: nếu thiếu ngày → lùi 1 ngày (tránh đồng loạt = giờ build)
    const fallbackLastmod = () => new Date(Date.now() - 86400000).toISOString();

    const push = (loc, lastmod, priority, images) => {
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

      if (INCLUDE_IMAGES_IN_MAIN_SITEMAP && Array.isArray(images) && images.length) {
        entry.images = images; // next-sitemap sẽ render <image:image>
      }

      out.push(entry);
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
      const lm = toISO(it.date || it.updatedAt || it.publishedAt || it.createdAt);
      const img = pickAbsImage(it);
      push(loc, lm, undefined, img ? [{ loc: img }] : undefined);
    });

    // altcoins (+ seccoin)
    [...readJsonSafe('altcoins.json'), ...readJsonSafe('seccoin.json')].forEach(it => {
      const loc = buildPath('/altcoins', it.slug || it.path);
      const lm = toISO(it.date || it.updatedAt);
      const img = pickAbsImage(it);
      push(loc, lm, undefined, img ? [{ loc: img }] : undefined);
    });

    // crypto-exchanges (+ fidelity)
    [...readJsonSafe('cryptoexchanges.json'), ...readJsonSafe('fidelity.json')].forEach(it => {
      const loc = buildPath('/crypto-exchanges', it.slug || it.path);
      const lm = toISO(it.date || it.updatedAt);
      const img = pickAbsImage(it);
      push(loc, lm, undefined, img ? [{ loc: img }] : undefined);
    });

    // best-crypto-apps
    readJsonSafe('bestapps.json').forEach(it => {
      const loc = buildPath('/best-crypto-apps', it.slug || it.path);
      const lm = toISO(it.date || it.updatedAt);
      const img = pickAbsImage(it);
      push(loc, lm, undefined, img ? [{ loc: img }] : undefined);
    });

    // insurance
    readJsonSafe('insurance.json').forEach(it => {
      const loc = buildPath('/insurance', it.slug || it.path);
      const lm = toISO(it.date || it.updatedAt);
      const img = pickAbsImage(it);
      push(loc, lm, undefined, img ? [{ loc: img }] : undefined);
    });

    // crypto-market (news.json)
    readJsonSafe('news.json').forEach(it => {
      const loc = buildPath('/crypto-market', it.slug || it.path);
      const lm = toISO(it.date || it.updatedAt || it.publishedAt);
      const img = pickAbsImage(it);
      push(loc, lm, undefined, img ? [{ loc: img }] : undefined);
    });

    // guides
    readJsonSafe('guides.json').forEach(it => {
      const loc = buildPath('/guides', it.slug || it.path);
      const lm = toISO(it.date || it.updatedAt);
      const img = pickAbsImage(it);
      push(loc, lm, undefined, img ? [{ loc: img }] : undefined);
    });

    return out;
  },
};
