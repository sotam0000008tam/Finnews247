// next-sitemap.config.cjs
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.finnews247.com',
  outDir: 'public',
  generateRobotsTxt: false,     // TẮT tự sinh robots.txt
  sitemapSize: 5000,
  exclude: [
    '/admin/*',
    '/api/*',
    '/server-sitemap.xml',
    '/_next/*',
    '/404',
    '/500'
  ],
  // Chỉ xuất loc + lastmod, KHÔNG có changefreq/priority
  transform: async (config, path) => ({
    loc: path,
    lastmod: new Date().toISOString(),
  }),
};
