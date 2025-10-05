/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

const siteUrl = 'https://www.finnews247.com';

// Helpers
function safeReadJson(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch { return []; }
}

function addFromJson(urls, jsonFile, basePath) {
  const p = path.join(process.cwd(), 'data', jsonFile);
  const arr = safeReadJson(p);
  for (const item of arr) {
    const slug = item?.slug;
    if (!slug) continue;
    const clean = String(slug).replace(/^\/+|\/+$/g, '');
    const loc = `${basePath}/${clean}`.replace(/\/+/g, '/');
    urls.add(loc.startsWith('/') ? loc : `/${loc}`);
  }
}

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,

  // Loại khu vực admin khỏi sitemap (nếu có)
  exclude: [
    '/admin', '/admin/*',
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

  // Chỉ sinh URL canonical (không sinh các trang phân trang ?page=2...)
  additionalPaths: async () => {
    const urls = new Set([
      '/', '/about', '/contact', '/privacy', '/terms',
      '/crypto', '/altcoins', '/economy', '/market', '/staking',
      '/wallets', '/crypto-exchanges',
      '/best-crypto-apps',
      '/tax', '/insurance',
      '/signals',
      '/guides',          // ✅ trang index Guides
      '/fidelity-crypto',
    ]);

    // Đọc các mục Guides từ JSON để sinh /guides/<slug>
    addFromJson(urls, 'guides.json', '/guides');

    // Giữ nguyên các phần bạn đang dùng trước đó (nếu có):
    // addFromJson(urls, 'tax.json', '/tax');
    // addFromJson(urls, 'insurance.json', '/insurance');
    // addFromJson(urls, 'cryptoexchanges.json', '/crypto-exchanges');
    // addFromJson(urls, 'wallets.json', '/wallets');
    // addFromJson(urls, 'altcoins.json', '/altcoins');
    // addFromJson(urls, 'bestapps.json', '/best-crypto-apps');
    // addFromJson(urls, 'signals.json', '/signals');

    return Array.from(urls).map(loc => ({ loc }));
  },
};
