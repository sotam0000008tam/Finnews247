/** @type {import('next-sitemap').IConfig} */
const SITE_URL = 'https://www.finnews247.com';

// Chuẩn hoá các prefix sai về đúng canonical
const normalize = (p) => {
  if (!p) return '/';
  if (!p.startsWith('/')) p = '/' + p;

  p = p
    .replace(/^\/cryptoexchanges(\/|$)/i, '/crypto-exchanges$1')
    .replace(/^\/fidelity(\/|$)/i, '/fidelity-crypto$1')
    .replace(/^\/seccoin(\/|$)/i, '/sec-coin$1')
    .replace(/^\/bestapps(\/|$)/i, '/best-crypto-apps$1');

  // bỏ trùng dấu '/', bỏ slash cuối (trừ '/')
  p = p.replace(/\/{2,}/g, '/');
  if (p !== '/' && p.endsWith('/')) p = p.slice(0, -1);
  return p;
};

module.exports = {
  siteUrl: SITE_URL,
  outDir: 'public',
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,

  // Loại hẳn các alias sai khỏi sitemap (nếu có từ rewrites/legacy)
  exclude: [
    '/cryptoexchanges', '/cryptoexchanges/*',
    '/fidelity', '/fidelity/*',
    '/seccoin', '/seccoin/*',
    '/bestapps', '/bestapps/*',
    '/exchanges', '/exchanges/*', // nếu /exchanges chỉ là alias cũ
    '/api/*', '/admin/*',
  ],

  // Luôn trả về đường dẫn đã normalize
  transform: async (config, path) => {
    const loc = normalize(path);
    return {
      loc,                               // chỉ path (không cần domain)
      changefreq: 'daily',
      priority: loc === '/' ? 1 : 0.7,
      lastmod: new Date().toISOString(),
    };
  },
};
