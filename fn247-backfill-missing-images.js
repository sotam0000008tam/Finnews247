#!/usr/bin/env node
/**
 * fn247-backfill-missing-images.js
 * After standardization, copy a placeholder image for any standardized image path that doesn't exist.
 *
 * Usage:
 *   node fn247-backfill-missing-images.js --placeholder=/public/images/placeholder-hero.jpg [--sections=news,guides,...]
 */
const fs = require('fs');
const path = require('path');

function getArg(name) {
  const flag = `--${name}=`;
  const a = process.argv.slice(2).find(x => x.startsWith(flag));
  return a ? a.slice(flag.length) : null;
}

const placeholderArg = getArg('placeholder') || '/public/images/placeholder-hero.jpg';
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
const IMG_DIR = path.join(PUBLIC_DIR, 'images');

function readJsonSafe(file) {
  const p = path.join(DATA_DIR, file);
  if (!fs.existsSync(p)) return [];
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return []; }
}

function main() {
  const absPlaceholder = placeholderArg.startsWith('/')
    ? path.join(ROOT, placeholderArg.replace(/^\//, ''))
    : path.resolve(placeholderArg);

  if (!fs.existsSync(absPlaceholder)) {
    console.error('ERROR: placeholder not found at', absPlaceholder);
    process.exit(1);
  }

  let created = 0, checked = 0;
  for (const s of sections) {
    const items = readJsonSafe(s);
    for (const it of items) {
      const img = it.image || it.ogImage;
      if (!img || !img.startsWith('/images/')) continue;
      const dest = path.join(IMG_DIR, path.basename(img));
      checked++;
      if (!fs.existsSync(dest)) {
        // ensure images dir exists
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(absPlaceholder, dest);
        console.log('Backfilled:', dest);
        created++;
      }
    }
  }
  console.log('Done. Checked:', checked, 'Created:', created);
}

if (require.main === module) main();
