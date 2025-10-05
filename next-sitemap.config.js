/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

const siteUrl = 'https://www.finnews247.com';

// ---------- Helpers ----------
function safeReadJson(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch { return []; }
}
function addFromJson(urls, jsonFile, basePath) {
  const p = path.join(process.cwd(), 'data', jsonFile);
  if (!fs.existsSync(p)) return;
  const arr = safeReadJson(p);
  for (const item of arr) {
    const slug = item?.slug;
    if (!slug) continue;
    const clean = String(slug).replace(/^\/+|\/+$/g, '');
    const loc = `${basePath}/${clean}`.replace(/\/+/g, '/');
    urls.add(loc.startsWith('/') ? loc : `/${loc}`);
  }
}
/** Quét thư mục nội dung (nếu bạn lưu bài bằng file thay vì JSON) */
function addFromDir(urls, dirRel, basePath) {
  const dir = path.join(process.cwd(), dirRel);
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const ext = path.extname(name).toLowerCase();
    const stem = path.basename(name, ext);
    if (!['.md', '.mdx', '.json'].includes(ext)) continue;
    if (['index', '_app', '_document', '_middleware'].includes(stem)) continue;
    if (stem.startsWith('[')) continue;
    const clean = String(stem).replace(/^\/+|\/+$/g, '');
    const loc = `${basePath}/${clean}`.replace(/\/+/g, '/');
    urls.add(loc.startsWith('/') ? loc : `/${loc}`);
  }
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,

  // ❌ Không đưa khu vực quản trị vào sitemap
  exclude: [
    '/admin', '/admin/*',
    // Nếu bạn từng có nhánh cũ thì có thể giữ exclude bổ sung:
    // '/exchanges', '/exchanges/*',
    // '/crypto-tax', '/crypto-tax/*',
    // '/crypto-insurance', '/crypto-insurance/*',
    // '/privacy-policy', '/privacy-policy/*',
  ],

  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/admin/'] },
    ],
  },

  transform: async (config, url) => ({
    loc: url,
    changefreq: config.changefreq,
    priority: config.priority,
    lastmod: new Date().toISOString(),
  }),

  // ✅ Sinh một tập URL canonical duy nhất (khử trùng lặp bằng Set)
  //    KHÔNG sinh trang phân trang (?page=2...) để tránh rác sitemap.
  additionalPaths: async () => {
    const urls = new Set([
      '/', '/about', '/contact', '/privacy', '/terms',
      '/crypto', '/altcoins', '/economy', '/market', '/staking',
      '/wallets', '/crypto-exchanges',
      '/best-crypto-apps',
      '/tax', '/insurance',
      '/signals',
      '/guides',            // index Guides
      '/fidelity-crypto',
    ]);

    // ---- JSON-driven sections (đảm bảo các file JSON này tồn tại trong /data) ----
    addFromJson(urls, 'tax.json', '/tax');
    addFromJson(urls, 'insurance.json', '/insurance');
    addFromJson(urls, 'cryptoexchanges.json', '/crypto-exchanges');
    addFromJson(urls, 'wallets.json', '/wallets');
    addFromJson(urls, 'altcoins.json', '/altcoins');
    addFromJson(urls, 'bestapps.json', '/best-crypto-apps');
    addFromJson(urls, 'signals.json', '/signals');
    addFromJson(urls, 'guides.json', '/guides');          // ✅ Guides

    // ---- Fallback: nếu bạn lưu bài bằng file, tự quét thư mục nội dung ----
    addFromDir(urls, 'content/tax', '/tax');
    addFromDir(urls, 'content/insurance', '/insurance');
    addFromDir(urls, 'content/crypto-exchanges', '/crypto-exchanges');
    addFromDir(urls, 'content/wallets', '/wallets');
    addFromDir(urls, 'content/altcoins', '/altcoins');
    addFromDir(urls, 'content/best-crypto-apps', '/best-crypto-apps');
    addFromDir(urls, 'content/signals', '/signals');
    addFromDir(urls, 'content/guides', '/guides');        // ✅ Guides

    // (Tuỳ kiến trúc, có thể thêm quét 'pages/<section>' nếu bạn viết bài dưới pages/)
    // addFromDir(urls, 'pages/guides', '/guides');

    return Array.from(urls).map(loc => ({ loc }));
  },
};
