#!/usr/bin/env node
/**
 * fn247-gen-image-sitemap.js
 * Generates /public/image-sitemap.xml with <image:image> entries for pages and their hero images.
 *
 * Usage:
 *   node fn247-gen-image-sitemap.js [--sections=news,guides,...]
 */
const fs = require('fs');
const path = require('path');

const argv = process.argv.slice(2);
function getArg(name) {
  const flag = `--${name}=`;
  const a = argv.find(x => x.startsWith(flag));
  return a ? a.slice(flag.length) : null;
}
const sectionsArg = getArg('sections');
const DEFAULT_SECTIONS = [
  'news.json',
  'guides.json',
  'wallets.json',
  'cryptoexchanges.json',
  'signals.json',
  'bestapps.json',
  'staking.json',
  'altcoins.json'
];
const sections = (sectionsArg ? sectionsArg.split(',') : DEFAULT_SECTIONS)
  .map(s => s.endsWith('.json') ? s : `${s}.json`);

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'data');
const PUBLIC_DIR = path.join(ROOT, 'public');
const OUT = path.join(PUBLIC_DIR, 'image-sitemap.xml');
const SITE = 'https://www.finnews247.com';

function readJsonSafe(file) {
  const p = path.join(DATA_DIR, file);
  if (!fs.existsSync(p)) return [];
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return []; }
}

function pagePathFor(section, it) {
  const folder = section.replace(/\.json$/, '');
  const slug = it.slug || it.path || it.id || '';
  return `/${folder}/${slug}`.replace(/\/{2,}/g, '/');
}

function toAbs(u) {
  if (!u) return null;
  return u.startsWith('http') ? u : `${SITE}${u}`;
}

function main() {
  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });

  let entries = [];
  for (const s of sections) {
    const items = readJsonSafe(s);
    for (const it of items) {
      const page = pagePathFor(s, it);
      const img = it.image || it.ogImage;
      if (!img) continue;
      const pageUrl = `${SITE}${page}`;
      const imgUrl = toAbs(img);
      entries.push({ pageUrl, imgUrl });
    }
  }

  const header = `<?xml version="1.0" encoding="UTF-8"?>\n` +
`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
`        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  const body = entries.map(u => {
    return `  <url>\n    <loc>${u.pageUrl}</loc>\n    <image:image>\n      <image:loc>${u.imgUrl}</image:loc>\n    </image:image>\n  </url>`;
  }).join('\n');

  const xml = `${header}${body}\n</urlset>\n`;
  fs.writeFileSync(OUT, xml, 'utf8');
  console.log('✅ Wrote', OUT, 'with', entries.length, 'entries');
}

if (require.main === module) main();
