// next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */

// Các trang gốc bắt buộc có
const ROOT_PAGES = [
  '/', '/about', '/contact', '/privacy', '/terms',
  '/signals', '/altcoins', '/crypto-exchanges', '/best-crypto-apps',
  '/insurance', '/crypto-market', '/guides',
];

// Chỉ cho phép các bài viết bên trong các thư mục này
const ARTICLE_PREFIXES = [
  '/signals/', '/altcoins/', '/crypto-exchanges/', '/best-crypto-apps/',
  '/insurance/', '/crypto-market/', '/guides/',
];

// Hàm whitelist
const isAllowed = (path) => {
  if (['/_next', '/api'].some(p => path.startsWith(p))) return false;
  if (path === '/') return true;
  if (ROOT_PAGES.includes(path)) return true;
  return ARTICLE_PREFIXES.some(prefix => path.startsWith(prefix));
};

module.exports = {
  siteUrl: 'https://www.finnews247.com',

  // ✅ KHÔNG sinh robots.txt
  generateRobotsTxt: false,

  // ✅ Luôn có index /sitemap.xml trỏ tới /sitemap-0.xml
  generateIndexSitemap: true,
  sitemapBaseFileName: 'sitemap',
  sitemapSize: 45000, // đủ lớn để thường chỉ tạo 1 file /sitemap-0.xml

  // Loại nhanh những đường dẫn chắc chắn không lấy
  exclude: [
    '/_next/*', '/api/*', '/404', '/500', '/server-sitemap.xml',
    '/drafts/*', '/tags/*', '/category/*'
  ],

  // Lọc giữ lại đúng whitelist
  transform: async (config, path) => {
    if (!isAllowed(path)) return null; // skip URL không hợp lệ
    const isHome = path === '/';
    return {
      loc: path,
      changefreq: isHome ? 'daily' : 'weekly',
      priority: isHome ? 1.0 : 0.7,
      lastmod: new Date().toISOString(),
    };
  },

  // Đảm bảo luôn có các trang gốc (dù là dynamic)
  additionalPaths: async () => {
    const now = new Date().toISOString();
    return ROOT_PAGES.map(p => ({
      loc: p,
      changefreq: p === '/' ? 'daily' : 'weekly',
      priority: p === '/' ? 1.0 : 0.7,
      lastmod: now,
    }));
  },
};
