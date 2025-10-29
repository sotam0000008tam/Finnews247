/** @type {import('next-sitemap').IConfig} */
const fs = require('fs');
const path = require('path');

const SITE = 'https://www.finnews247.com';
const DATA_DIR = (p) => path.join(process.cwd(), 'data', p);

function readJson(name) {
  const p = DATA_DIR(name);
  if (!fs.existsSync(p)) return [];
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return []; }
}

function safeISO(d) {
  if (!d) return undefined;
  const t = new Date(d);
  return isNaN(t.getTime()) ? undefined : t.toISOString();
}

/**
 * Tạo URL bài viết:
 * - Nếu item.path / item.url / item.loc bắt đầu bằng "/", dùng nguyên vẹn (tôn trọng việc có/không có "baiviet").
 * - Nếu chỉ có slug (không có "/"), ghép base + "/" + slug.
 * - Không tự thêm "baiviet" ở bất kỳ bước nào.
 */
function buildArticleLoc(base, item) {
  const raw =
    item?.path || item?.url || item?.loc || item?.slug || item?.id || '';
  const s = String(raw).trim();

  if (!s) return null;

  if (s.startsWith('http://') || s.startsWith('https://')) {
    // Chỉ nhận URL nội bộ của site
    if (!s.startsWith(SITE)) return null;
    return s.replace(SITE, '');
  }

  if (s.startsWith('/')) return s; // đã là path đầy đủ (có thể gồm /baiviet hoặc không)

  // Chỉ là slug => ghép với base
  const normBase = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${normBase}/${s}`;
}

function makeEntries(base, filename, dateKey = 'date') {
  return readJson(filename)
    .map((it) => {
      const locPath = buildArticleLoc(base, it);
      if (!locPath) return null;
      return {
        loc: locPath,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: safeISO(it?.[dateKey]),
      };
    })
    .filter(Boolean);
}

module.exports = {
  siteUrl: SITE,

  // KHÔNG sinh robots.txt
  generateRobotsTxt: false,

  // Dồn vào 1 file duy nhất (sitemap-0.xml). Index /sitemap.xml sẽ trỏ đến đó.
  generateIndexSitemap: true,
  sitemapSize: 50000,

  trailingSlash: false,
  autoLastmod: false, // Không tự gắn lastmod cho trang chính
  changefreq: 'weekly',
  priority: 0.7,

  // Chỉ dùng danh sách mình chỉ định
  exclude: ['/**'],

  additionalPaths: async () => {
    const entries = [];

    // Trang chính (không gắn lastmod)
    const roots = [
      '/', '/about', '/contact', '/privacy', '/terms',
      '/signals', '/altcoins', '/crypto-exchanges',
      '/best-crypto-apps', '/insurance', '/crypto-market', '/guides',
    ];
    roots.forEach((loc) => {
      entries.push({
        loc,
        changefreq: loc === '/' ? 'daily' : 'weekly',
        priority: loc === '/' ? 1.0 : 0.7,
      });
    });

    // Bài viết cho từng chuyên mục – KHÔNG tự thêm /baiviet
    // Chỉ cần đổi tên file JSON cho khớp dữ liệu của bạn.
    entries.push(...makeEntries('/signals',           'signals.json'));
    entries.push(...makeEntries('/altcoins',          'altcoins.json'));
    entries.push(...makeEntries('/crypto-exchanges',  'cryptoexchanges.json'));
    entries.push(...makeEntries('/best-crypto-apps',  'bestapps.json'));
    entries.push(...makeEntries('/insurance',         'insurance.json'));
    entries.push(...makeEntries('/crypto-market',     'news.json'));   // hoặc file market của bạn
    entries.push(...makeEntries('/guides',            'guides.json'));

    // Khử trùng lặp theo loc
    const seen = new Set();
    return entries.filter((e) => {
      const key = e.loc.replace(/\/+$/, '');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  },
};
