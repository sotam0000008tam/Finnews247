/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.finnews247.com',
  outDir: 'public',
  generateRobotsTxt: true,
  sitemapSize: 45000,
  changefreq: 'daily',
  priority: 0.7,

  // Loại toàn bộ alias sai khỏi sitemap (chỉ để canonical)
  exclude: [
    '/cryptoexchanges', '/cryptoexchanges/*',
    '/fidelity', '/fidelity/*',
    '/seccoin', '/seccoin/*',
    '/bestapps', '/bestapps/*',
    '/exchanges', '/exchanges/*',
  ],

  // Không override transform để giữ nguyên lastmod theo dữ liệu của Next
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
    ],
  },
};
