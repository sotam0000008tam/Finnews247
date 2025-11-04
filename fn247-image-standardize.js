#!/usr/bin/env node
/**
 * fn247-image-standardize.js  (v2 - handles subfolders under /images/)
 * HARD migration (no backups).
 * - Resolves the real source file path under /public/images/** (preserves subfolders).
 * - Renames to /public/images/<slug>.<ext> (flattens to root).
 *
 * Usage:
 *   node fn247-image-standardize.js [--dry-run] [--sections=news,guides,...] [--force]
 */
const fs = require('fs');
const path = require('path');

const argv = process.argv.slice(2);
const DRY = argv.includes('--dry-run');
const FORCE = argv.includes('--force');

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

function writeJsonPretty(file, data) {
  const p = path.join(DATA_DIR, file);
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
}

function slugify(s) {
  return String(s || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const oldPattern = new RegExp(
  String.raw`^/images/(news|altcoin|exchange|exchang|wallet|bestapp|tax|guide|signal|staking|sec|crypto|market|stock|dummy)\\d*\\.jpe?g$`,
  'i'
);

const usedDest = new Set();
function uniqueDest(p) {
  if (!fs.existsSync(p) && !usedDest.has(p)) return p;
  const dir = path.dirname(p);
  const ext = path.extname(p);
  const base = path.basename(p, ext);
  let i = 2;
  for (;;) {
    const c = path.join(dir, `${base}-${i}${ext}`);
    if (!fs.existsSync(c) && !usedDest.has(c)) return c;
    i++;
  }
}

function processDataset(file) {
  const items = readJsonSafe(file);
  if (!Array.isArray(items)) {
    console.warn('SKIP (no array):', file);
    return { file, changed: 0, total: 0, missing: 0, moved: 0, skipped: 0 };
  }

  let changed = 0, missing = 0, moved = 0, skipped = 0;

  const updated = items.map((it, idx) => {
    const oldImg = it.image || it.ogImage || '';
    if (!oldImg || !oldImg.startsWith('/images/')) { skipped++; return it; }

    // Resolve the real source path including subfolders under /images
    const rel = oldImg.replace(/^\/images\//i, '');
    const absSrc = path.join(IMG_DIR, rel);

    const slug = slugify(it.slug || it.path || it.id || it.title || `item-${idx+1}`);
    const ext = path.extname(absSrc) || '.jpg';
    let newImg = `/images/${slug}${ext.toLowerCase()}`;
    let absDest = path.join(IMG_DIR, path.basename(newImg));

    const needsChange = oldPattern.test(oldImg) || (slug && oldImg !== newImg);
    if (!needsChange) { skipped++; return it; }

    if ((fs.existsSync(absDest) || usedDest.has(absDest)) && !FORCE) {
      const unique = uniqueDest(absDest);
      absDest = unique;
      newImg = `/images/${path.basename(unique)}`;
    }
    usedDest.add(absDest);

    if (!fs.existsSync(absSrc)) {
      console.warn('MISSING image file:', absSrc, 'for', oldImg, '->', newImg);
      missing++;
      it.image = newImg; // still standardize JSON so you can backfill later
      if (it.ogImage && it.ogImage.startsWith('/images/')) it.ogImage = newImg;
      changed++;
      return it;
    }

    console.log(`${DRY ? '[DRY]' : 'mv'} ${oldImg} -> ${newImg}`);
    if (!DRY) {
      try {
        if (FORCE && fs.existsSync(absDest)) fs.rmSync(absDest);
        // ensure destination dir exists
        fs.mkdirSync(path.dirname(absDest), { recursive: true });
        fs.renameSync(absSrc, absDest);
        moved++;
      } catch (e) {
        console.error('ERROR moving', absSrc, '->', absDest, e.message);
      }
    }

    it.image = newImg;
    if (it.ogImage && it.ogImage.startsWith('/images/')) it.ogImage = newImg;
    changed++;
    return it;
  });

  if (!DRY) writeJsonPretty(file, updated);
  return { file, changed, total: items.length, missing, moved, skipped };
}

function main() {
  if (!fs.existsSync(DATA_DIR) || !fs.existsSync(IMG_DIR)) {
    console.error('ERROR: Run from project root where /data and /public/images exist.');
    process.exit(1);
  }
  console.log('=== FinNews247 HARD Image Standardization (v2) ===');
  console.log('Sections:', sections.join(', '));
  console.log('Dry-run:', DRY, 'Force overwrite:', FORCE);
  let sum = { changed:0, total:0, missing:0, moved:0, skipped:0 };
  for (const file of sections) {
    const r = processDataset(file);
    sum.changed += r.changed;
    sum.total += r.total;
    sum.missing += r.missing;
    sum.moved += r.moved;
    sum.skipped += r.skipped;
    console.log(`  -> ${r.file}: changed ${r.changed}, moved ${r.moved}, missing ${r.missing}, skipped ${r.skipped}`);
  }
  console.log('=== Summary ===');
  console.log(`Total items: ${sum.total}`);
  console.log(`Updated JSON entries: ${sum.changed}`);
  console.log(`Files moved: ${sum.moved}`);
  console.log(`Missing files: ${sum.missing}`);
  console.log(`Skipped (no change): ${sum.skipped}`);
}

if (require.main === module) main();
