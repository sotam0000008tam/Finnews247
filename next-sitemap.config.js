/** @type {import('next-sitemap').IConfig} */
const fs = require('fs');
const path = require('path');

process.env.TZ = 'Etc/UTC';

const SITE =
  (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.finnews247.com').replace(/\/+$/, '');

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

// chuẩn hóa slug: bỏ domain, bỏ tiền tố category cũ để ghép base mới
function cleanSlug(slug) {
  if (!slug) return '';
  let s = String(slug).trim();

  // bỏ domain nếu slug là full URL
  s = s.replace(/^https?:\/\/[^/]+/i, '');

  // bỏ slash đầu/cuối
  s = s.replace(/^\/+/, '').replace(/\/+$/, '');

  // bỏ tiền tố category lịch sử để không thành /insurance/tax/foo
  s = s
    .replace(/^news\//i, '')
    .replace(/^crypto-market\//i, '')
    .replace(/^altcoins\//i, '')
    .replace(/^seccoin\//i, '')
    .replace(/^crypto-exchanges\//i, '')
    .replace(/^fidelity\//i, '')
    .replace(/^best-crypto-apps\//i, '')
    .replace(/^insurance\//i, '')
    .replace(/^tax\//i, '')
    .replace(/^guides\//i, '')
    .replace(/^signals\//i, '');

  return s;
}

function buildPath(base, slug) {
  const s = cleanSlug(slug);
  if (!s) return null;
  return `/${String(base).replace(/^\/+/, '')}/${s}`.replace(/\/{2,}/g, '/');
}

// lastmod with jitter (nếu chỉ có yyyy-mm-dd)
function toISOWithJitter(d, slug = '') {
  if (!d) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
    let h = 0;
    for (const ch of String(slug)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    const minutes = h % 600; // 0..599 (~10h)
    const dt = new Date(`${d}T00:00:00.000Z`);
    dt.setUTCMinutes(minutes);
    return dt.toISOString();
  }
  const t = new Date(d);
  return Number.isNaN(t.getTime()) ? undefined : t.toISOString();
}

function lastmodOf(it = {}) {
  const d = it.date || it.updatedAt || it.publishedAt || it.createdAt || undefined;
  const iso = toISOWithJitter(d, it.slug || it.path || it.id || '');
  // fallback: build - 12h để tránh đồng loạt “giờ build”
  return iso || new Date(Date.now() - 12 * 3600 * 1000).toISOString();
}

function pushUrl(out, seen, loc, lastmod, priority) {
  if (!loc) return;
  const clean = loc.replace(/\/{2,}/g, '/');
  if (seen.has(clean)) return;
  seen.add(clean);

  out.push({
    loc: clean,
    changefreq: 'daily',
    priority: priority ?? (clean === '/' ? 1.0 : 0.7),
    lastmod: lastmod || new Date().toISOString(),
    // không đính kèm images cho sitemap chính
  });
}

// ---------- config ----------
module.exports = {
  siteUrl: SITE,
  generateIndexSitemap: false,          // 1 file sitemap.xml duy nhất
  sitemapBaseFileName: 'sitemap',
  generateRobotsTxt: false,             // dùng public/robots.txt thủ công
  changefreq: 'daily',
  priority: 0.7,

  // Không quét auto, chỉ dùng additionalPaths
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

    // Trang chính
    [
      '/', '/about', '/contact', '/privacy', '/terms',
      '/best-crypto-apps', '/insurance', '/crypto-market', '/guides',
    ].forEach(p => pushUrl(out, seen, p));

    // signals
    for (const it of readJsonSafe('signals.json')) {
      pushUrl(out, seen, loc, lastmodOf(it));
    }

    // altcoins + seccoin
    for (const it of [...readJsonSafe('altcoins.json'), ...readJsonSafe('seccoin.json')]) {
      const loc = buildPath('/altcoins', it.slug || it.path);
      pushUrl(out, seen, loc, lastmodOf(it));
    }

    // crypto-exchanges + exchanges + fidelity
    for (const it of [...readJsonSafe('cryptoexchanges.json'), ...readJsonSafe('exchanges.json'), ...readJsonSafe('fidelity.json')]) {
      const loc = buildPath('/crypto-exchanges', it.slug || it.path);
      pushUrl(out, seen, loc, lastmodOf(it));
    }

    // best-crypto-apps (bestapps + wallets)
    for (const it of [...readJsonSafe('bestapps.json'), ...readJsonSafe('wallets.json')]) {
      const loc = buildPath('/best-crypto-apps', it.slug || it.path);
      pushUrl(out, seen, loc, lastmodOf(it));
    }

    // ✅ Insurance & Tax (gộp)
    for (const it of [...readJsonSafe('insurance.json'), ...readJsonSafe('tax.json')]) {
      const loc = buildPath('/insurance', it.slug || it.path);
      pushUrl(out, seen, loc, lastmodOf(it));
    }

    // crypto-market (news)
    for (const it of readJsonSafe('news.json')) {
      const loc = buildPath('/crypto-market', it.slug || it.path);
      pushUrl(out, seen, loc, lastmodOf(it));
    }

    // guides
    for (const it of readJsonSafe('guides.json')) {
      const loc = buildPath('/guides', it.slug || it.path);
      pushUrl(out, seen, loc, lastmodOf(it));
    }

    return out;
  },
};
