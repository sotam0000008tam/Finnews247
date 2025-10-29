/** @type {import('next-sitemap').IConfig} */
const fs = require('fs');
const path = require('path');

const SITE = 'https://www.finnews247.com';
const DATA_DIR = path.join(process.cwd(), 'data');

// Đọc JSON an toàn: hỗ trợ mảng thuần, hoặc {items|posts}
function safeParse(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(raw);
    if (Array.isArray(json)) return json;
    if (Array.isArray(json.items)) return json.items;
    if (Array.isArray(json.posts)) return json.posts;
    return [];
  } catch {
    return [];
  }
}

// Load tất cả file .json trong /data có "keyword" trong tên file (vd: "news", "signals")
function loadAllByKeyword(keyword) {
  if (!fs.existsSync(DATA_DIR)) return [];
  const files = fs
    .readdirSync(DATA_DIR)
    .filter(f => f.endsWith('.json') && f.toLowerCase().includes(keyword.toLowerCase()));
  return files.flatMap(f => safeParse(path.join(DATA_DIR, f)));
}

const toISO = (d) => {
  if (!d) return undefined;
  const t = new Date(d);
  return isNaN(t.getTime()) ? undefined : t.toISOString();
};

const clean = (s) => s.replace(/\/{2,}/g, '/');

function joinUnder(base, slug) {
  if (!slug) return null;
  let s = String(slug).trim();
  // bỏ domain nếu có
  s = s.replace(/^https?:\/\/[^/]+/i, '');
  // bỏ slash đầu
  s = s.replace(/^\/+/, '');
  const baseNo = base.replace(/^\//, '').toLowerCase();
  if (s.toLowerCase().startsWith(baseNo + '/')) return clean('/' + s);
  return clean(`${base}/${s}`);
}

module.exports = {
  siteUrl: SITE,
  generateIndexSitemap: true,
  generateRobotsTxt: false,

  // *** QUAN TRỌNG ***
  // Loại BỎ TOÀN BỘ url mặc định mà next-sitemap tự tìm thấy
  transform: async () => null,
  // Thắt lưng buộc bụng thêm 1 lớp:
  exclude: ['/**'],

  // Chỉ tự tay thêm những URL được phép
  additionalPaths: async () => {
    const out = [];
    const seen = new Set();
    const push = (loc, lastmod, priority = 0.7, changefreq = 'weekly') => {
      if (!loc) return;
      loc = clean(loc);
      if (seen.has(loc)) return;
      seen.add(loc);
      out.push({ loc, lastmod, priority, changefreq });
    };

    const now = new Date().toISOString();

    // 1) Trang tĩnh chính (whitelist)
    [
      '/', '/about', '/contact', '/privacy', '/terms',
      '/signals', '/altcoins', '/crypto-exchanges',
      '/best-crypto-apps', '/insurance', '/crypto-market', '/guides',
    ].forEach((p) => push(p, now, p === '/' ? 1.0 : 0.7, p === '/' ? 'daily' : 'weekly'));

    // 2) Bài viết theo từng chuyên mục — chỉ lấy từ file phân trang/data của bạn
    const sections = [
      { key: 'signals', base: '/signals' },
      { key: 'altcoins', base: '/altcoins' },
      { key: 'exchange', base: '/crypto-exchanges' },     // khớp các file có 'exchange' trong tên
      { key: 'best', base: '/best-crypto-apps' },         // khớp các file có 'best' trong tên
      { key: 'insurance', base: '/insurance' },
      { key: 'guides', base: '/guides' },
    ];

    sections.forEach(({ key, base }) => {
      loadAllByKeyword(key).forEach((it) => {
        const slug = it.slug || it.path || it.id;
        push(joinUnder(base, slug), toISO(it.lastmod || it.date || it.updatedAt || it.createdAt));
      });
    });

    // 3) TẤT CẢ bài "news/market" => ÉP về /crypto-market/<slug>
    loadAllByKeyword('news').forEach((it) => {
      const slug = it.slug || it.path || it.id;
      push(joinUnder('/crypto-market', slug), toISO(it.lastmod || it.date || it.updatedAt || it.createdAt));
    });

    return out;
  },
};
