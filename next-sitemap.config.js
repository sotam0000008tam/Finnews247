/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

/** @type {import('next-sitemap').IConfig} */
const siteUrl = 'https://www.finnews247.com';

// Safe JSON reader (returns [] if file is missing/invalid)
function safeReadJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return [];
  }
}

// Add slugs from a JSON file under a base path; normalize double slashes
function addFromJson(urls, jsonFile, basePath) {
  const p = path.join(process.cwd(), 'data', jsonFile);
  const arr = safeReadJson(p);
  for (const item of arr) {
    const slug = item?.slug;
    if (!slug) continue;
    const clean = String(slug).replace(/^\/+|\/+$/g, ''); // trim leading/trailing '/'
    const loc = `${basePath}/${clean}`.replace(/\/+/g, '/'); // collapse '//' to '/'
    urls.add(loc.startsWith('/') ? loc : `/${loc}`);
  }
}

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,

  // ❌ Exclude legacy branches from sitemap entirely
  exclude: [
    '/crypto-tax',
    '/crypto-tax/*',
    '/crypto-insurance',
    '/crypto-insurance/*',
  ],

  // Ensure each entry has lastmod etc.
  transform: async (config, url) => ({
    loc: url,
    changefreq: config.changefreq,
    priority: config.priority,
    lastmod: new Date().toISOString(),
  }),

  // ✅ Build a unique set of canonical URLs only
  additionalPaths: async () => {
    const urls = new Set();

    // Top-level canonical sections (adjust as your site needs)
    [
      '/', '/about', '/contact', '/privacy', '/terms',
      '/altcoins', '/exchanges', '/wallets', '/staking',
      '/market', '/economy', '/signals',
      '/best-crypto-apps',
      // canonical branches for these topics:
      '/tax', '/insurance',
      '/fidelity-crypto',
    ].forEach(u => urls.add(u));

    // Article/post slugs via JSON data files
    addFromJson(urls, 'tax.json', '/tax');
    addFromJson(urls, 'insurance.json', '/insurance');
    addFromJson(urls, 'cryptoexchanges.json', '/exchanges');
    addFromJson(urls, 'wallets.json', '/wallets');
    addFromJson(urls, 'altcoins.json', '/altcoins');
    addFromJson(urls, 'bestapps.json', '/best-crypto-apps');
    addFromJson(urls, 'signals.json', '/signals');

    // Return as next-sitemap path objects
    return Array.from(urls).map(loc => ({ loc }));
  },
};
