/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

/** @type {import('next-sitemap').IConfig} */
const siteUrl = 'https://www.finnews247.com';

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

  // Exclude legacy/duplicate branches from sitemap
  exclude: [
    '/crypto-tax', '/crypto-tax/*',
    '/crypto-insurance', '/crypto-insurance/*',
    '/exchanges', '/exchanges/*',
    '/privacy-policy', '/privacy-policy/*',
  ],

  transform: async (config, url) => ({
    loc: url,
    changefreq: config.changefreq,
    priority: config.priority,
    lastmod: new Date().toISOString(),
  }),

  // Build unique, canonical-only URL set
  additionalPaths: async () => {
    const urls = new Set([
      '/', '/about', '/contact', '/privacy', '/terms',
      '/altcoins', '/crypto-exchanges', '/wallets', '/staking',
      '/market', '/economy', '/signals',
      '/best-crypto-apps',
      '/tax', '/insurance',
      '/fidelity-crypto',
    ]);

    // JSON-driven sections (adjust file names if they differ)
    addFromJson(urls, 'tax.json', '/tax');
    addFromJson(urls, 'insurance.json', '/insurance');
    addFromJson(urls, 'cryptoexchanges.json', '/crypto-exchanges');
    addFromJson(urls, 'wallets.json', '/wallets');
    addFromJson(urls, 'altcoins.json', '/altcoins');
    addFromJson(urls, 'bestapps.json', '/best-crypto-apps');
    addFromJson(urls, 'signals.json', '/signals');

    return Array.from(urls).map(loc => ({ loc }));
  },
};
