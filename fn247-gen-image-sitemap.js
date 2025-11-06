// fn247-gen-image-sitemap.js
const fs = require('fs');
const path = require('path');

process.env.TZ = 'Etc/UTC';

const SITE =
  (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.finnews247.com').replace(/\/+$/, '');

function readJsonSafe(filename) {
  try {
    const p = path.join(process.cwd(), 'data', filename);
    if (!fs.existsSync(p)) return [];
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return [];
  }
}
function isAbs(u = '') {
  return /^https?:\/\//i.test(u) || u.startsWith('//');
}
function toAbs(u) {
  if (!u) return undefined;
  let s = String(u).trim();
  if (s.startsWith('//')) return `https:${s}`;
  if (isAbs(s)) return s;
  if (!s.startsWith('/')) s = `/${s}`;
  s = s.replace(/\/{2,}/g, '/');
  return `${SITE}${s}`;
}
function firstImgs(html = '') {
  const out = [];
  const re = /<img[^>]+src=["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(String(html)))) out.push(m[1]);
  return out;
}
function pickImages(it = {}) {
  const arr = [];
  if (it.ogImage) arr.push(it.ogImage);
  if (it.image) arr.push(it.image);
  arr.push(...firstImgs(it.content || it.body || ''));

  const seen = new Set();
  const valids = [];
  for (const u of arr) {
    const abs = toAbs(u);
    if (!abs) continue;
    if (!abs.startsWith(SITE + '/')) continue; // chỉ host của mình
    if (seen.has(abs)) continue;
    seen.add(abs);
    valids.push(abs);
  }
  return valids;
}
function cleanSlug(slug) {
  if (!slug) return '';
  let s = String(slug).trim().replace(/^\/+/, '');
  s = s.replace(/^news\//i, '').replace(/^crypto-market\//i, '');
  return s;
}
function pageUrl(base, slugOrId) {
  const s = cleanSlug(slugOrId);
  if (!s) return null;
  const p = `/${String(base).replace(/^\/+/, '')}/${s}`.replace(/\/{2,}/g, '/');
  return `${SITE}${p}`;
}
function escapeXml(s = '') {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function addEntries(out, base, items) {
  for (const it of items) {
    const url = pageUrl(base, it.slug || it.path || it.id);
    if (!url) continue;
    const imgs = pickImages(it);
    if (!imgs.length) continue; // Không có ảnh → bỏ qua entry

    const lines = [];
    lines.push('  <url>');
    lines.push(`    <loc>${escapeXml(url)}</loc>`);
    for (const img of imgs) {
      lines.push('    <image:image>');
      lines.push(`      <image:loc>${escapeXml(img)}</image:loc>`);
      lines.push('    </image:image>');
    }
    lines.push('  </url>');
    out.push(lines.join('\n'));
  }
}

(function main() {
  const chunks = [];
  const header = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset',
    '  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"',
    '>',
  ].join('\n');

  addEntries(chunks, '/crypto-market', readJsonSafe('news.json'));
  addEntries(chunks, '/altcoins', [...readJsonSafe('altcoins.json'), ...readJsonSafe('seccoin.json')]);
  addEntries(chunks, '/crypto-exchanges', [...readJsonSafe('cryptoexchanges.json'), ...readJsonSafe('fidelity.json')]);
  addEntries(chunks, '/best-crypto-apps', readJsonSafe('bestapps.json'));
  addEntries(chunks, '/insurance', readJsonSafe('insurance.json'));
  addEntries(chunks, '/guides', readJsonSafe('guides.json'));
  addEntries(chunks, '/signals', readJsonSafe('signals.json'));

  const xml = [header, ...chunks, '</urlset>'].join('\n');
  fs.writeFileSync(path.join(process.cwd(), 'public', 'image-sitemap.xml'), xml, 'utf8');
  console.log(`image-sitemap.xml entries: ${chunks.length}`);
})();
