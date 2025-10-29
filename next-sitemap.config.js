/** @type {import('next-sitemap').IConfig} */
const fs = require('fs');
const path = require('path');

const SITE = 'https://www.finnews247.com';
const DATA_DIR = path.join(process.cwd(), 'data');

function readJson(name) {
  try {
    const p = path.join(DATA_DIR, name);
    if (!fs.existsSync(p)) return [];
    const raw = fs.readFileSync(p, 'utf-8');
    const j = JSON.parse(raw);
    if (Array.isArray(j)) return j;
    // fallback nếu data bọc trong {items|posts}
    return j.items || j.posts || [];
  } catch {
    return [];
  }
}

const toISO = (d) => {
  if (!d) return undefined;
  const t = new Date(d);
  return isNaN(t.getTime()) ? undefined : t.toISOString();
};

const clean = (s) => s.replace(/\/{2,}/g, '/');

// Ghép slug vào đúng chuyên mục (base)
/** joinUnder('/crypto-market', 'abc') => '/crypto-market/abc'
 *  Nếu slug đã có domain hoặc dấu / đầu: xử lý gọn
 *  Nếu slug đã bắt đầu bằng base: giữ nguyên
 */
function joinUnder(base, slug) {
  if (!slug) return null;
  let s = String(slug).trim();

  // bỏ domain nếu lỡ có
  s = s.replace(/^https?:\/\/[^/]+/i, '');

  // bỏ slash đầu
  s = s.replace(/^\/+/, '');

  const baseNoSlash = base.replace(/^\//, '').toLowerCase();

  if (s.toLowerCase().startsWith(baseNoSlash + '/')) {
    // đã đúng chuyên mục rồi
    return clean('/' + s);
  }
  return clean(`${base}/${s}`);
}

module.exports = {
  siteUrl: SITE,
  trailingSlash: false,

  // QUAN TRỌNG: chỉ sinh sitemap, KHÔNG đụng robots.txt
  generateRobotsTxt: false,

  // Có index sitemap (sitemap.xml -> sitemap-0.xml)
  generateIndexSitemap: true,

  // Mặc định
  changefreq: 'weekly',
  priority: 0.7,

  // Không cần exclude đặc biệt, tránh lỡ tay loại nhầm
  exclude: [],

  // Trang tĩnh mặc định
  transform: async (_, url) => ({
    loc: url,
    changefreq: url === '/' ? 'daily' : 'weekly',
    priority: url === '/' ? 1.0 : 0.7,
  }),

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

    // 1) Các trang chính (bạn yêu cầu)
    const mainPages = [
      '/', '/about', '/contact', '/privacy', '/terms',
      '/signals', '/altcoins', '/crypto-exchanges',
      '/best-crypto-apps', '/insurance', '/crypto-market', '/guides',
    ];
    const now = new Date().toISOString();
    mainPages.forEach((u) => push(u, now, u === '/' ? 1.0 : 0.7, u === '/' ? 'daily' : 'weekly'));

    // 2) Bài viết trong từng chuyên mục được phép
    // signals
    readJson('signals.json').forEach((it) => {
      const loc = joinUnder('/signals', it.slug || it.id);
      push(loc, toISO(it.date || it.updatedAt || it.createdAt));
    });

    // altcoins
    readJson('altcoins.json').forEach((it) => {
      const loc = joinUnder('/altcoins', it.slug);
      push(loc, toISO(it.date));
    });

    // crypto-exchanges
    // (nếu bạn có nhiều file, có thể concat lại tương tự)
    readJson('cryptoexchanges.json').forEach((it) => {
      const loc = joinUnder('/crypto-exchanges', it.slug);
      push(loc, toISO(it.date));
    });

    // best-crypto-apps
    readJson('bestapps.json').forEach((it) => {
      const loc = joinUnder('/best-crypto-apps', it.slug);
      push(loc, toISO(it.date));
    });

    // insurance
    readJson('insurance.json').forEach((it) => {
      const loc = joinUnder('/insurance', it.slug);
      push(loc, toISO(it.date));
    });

    // guides
    readJson('guides.json').forEach((it) => {
      const loc = joinUnder('/guides', it.slug);
      push(loc, toISO(it.date));
    });

    // 3) Toàn bộ bài market/news => ÉP về /crypto-market/<slug>
    // Ví dụ bạn nêu: '/blockchain-lender-figure-...' -> '/crypto-market/blockchain-lender-figure-...'
    readJson('news.json').forEach((it) => {
      const loc = joinUnder('/crypto-market', it.slug);
      push(loc, toISO(it.date));
    });

    return out;
  },
};
