#!/usr/bin/env node
/**
 * fn247-verify-images.js
 * Verifies that for each item in data/*.json, the image file exists in /public/images.
 * Also prints warnings if image path isn't standardized to /images/<slug>.<ext>
 *
 * Usage:
 *   node fn247-verify-images.js [--sections=news,guides,...]
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
const IMG_DIR = path.join(ROOT, 'public', 'images');

function readJsonSafe(file) {
  const p = path.join(DATA_DIR, file);
  if (!fs.existsSync(p)) return null;
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch (e) { console.error('ERROR reading JSON', p, e.message); return null; }
}

function looksStandard(u) {
  return /^\/images\/[a-z0-9-]+\.[a-z]+$/i.test(u || '');
}

function main() {
  if (!fs.existsSync(DATA_DIR) || !fs.existsSync(IMG_DIR)) {
    console.error('ERROR: Run from project root where /data and /public/images exist.');
    process.exit(1);
  }
  let missing = 0, notStd = 0, total = 0;
  for (const file of sections) {
    const items = readJsonSafe(file);
    if (!Array.isArray(items)) continue;
    for (const it of items) {
      total++;
      const img = it.image || it.ogImage || '';
      if (!img || !img.startsWith('/images/')) continue;
      if (!looksStandard(img)) { console.warn('Non-standard path:', img, 'in', file); notStd++; }
      const src = path.join(IMG_DIR, path.basename(img));
      if (!fs.existsSync(src)) { console.warn('MISSING file:', src); missing++; }
    }
  }
  console.log('Checked items:', total);
  console.log('Missing files:', missing);
  console.log('Non-standard paths:', notStd);
}

if (require.main === module) main();
