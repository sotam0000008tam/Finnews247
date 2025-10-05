/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

const siteUrl = 'https://www.finnews247.com';

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

  // Keep sitemap clean (no admin area, no legacy privacy-policy)
  exclude: [
    '/admin', '/admin/*',
    '/privacy-policy', '/privacy-policy/*',
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

  additionalPaths: async () => {
    const urls = new Set([
      '/', '/about', '/contact', '/privacy', '/terms',
      '/crypto', '/altcoins', '/economy', '/market', '/staking',
      '/wallets', '/crypto-exchanges',
      '/best-crypto-apps',
      '/tax', '/insurance',
      '/signals',
      '/guides',
      '/fidelity-crypto',
    ]);

    // JSON-driven categories (ensure these files exist under /data)
    addFromJson(urls, 'tax.json', '/tax');
    addFromJson(urls, 'insurance.json', '/insurance');
    addFromJson(urls, 'cryptoexchanges.json', '/crypto-exchanges');
    addFromJson(urls, 'wallets.json', '/wallets');
    addFromJson(urls, 'altcoins.json', '/altcoins');
    addFromJson(urls, 'bestapps.json', '/best-crypto-apps');
    addFromJson(urls, 'signals.json', '/signals');
    addFromJson(urls, 'guides.json', '/guides');

    // Fallback in case you store posts as files
    addFromDir(urls, 'content/tax', '/tax');
    addFromDir(urls, 'content/insurance', '/insurance');
    addFromDir(urls, 'content/crypto-exchanges', '/crypto-exchanges');
    addFromDir(urls, 'content/wallets', '/wallets');
    addFromDir(urls, 'content/altcoins', '/altcoins');
    addFromDir(urls, 'content/best-crypto-apps', '/best-crypto-apps');
    addFromDir(urls, 'content/signals', '/signals');
    addFromDir(urls, 'content/guides', '/guides');

    return Array.from(urls).map((loc) => ({ loc }));
  },
};
