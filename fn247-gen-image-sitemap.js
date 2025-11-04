// fn247-gen-image-sitemap.js
/* Generate public/image-sitemap.xml by following exactly the URLs produced by next-sitemap (sitemap.xml).
 * - Reuses next-sitemap.config.js -> additionalPaths() as the source of truth for page URLs
 * - Extracts images from JSON data + HTML content
 * - Ensures ABSOLUTE URLs on your own host (https://www.finnews247.com/images/...)
 */

const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const SITE = 'https://www.finnews247.com';
const PUB = path.join(process.cwd(), 'public');

function readJsonSafe(filename) {
  try {
    const p = path.join(process.cwd(), 'data', filename);
    if (!fs.existsSync(p)) return [];
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return [];
  }
}

function extractImgsFromHtml(html = '') {
  const out = [];
  if (!html || typeof html !== 'string') return out;
  const re = /<img[^>]+src=["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html))) {
    out.push(m[1]);
  }
  return out;
}

function toAbsoluteOnHost(src) {
  if (!src) return null;
  let s = String(src).trim();

  // already absolute
  if (/^https?:\/\//i.test(s)) {
    try {
      const u = new URL(s);
      // chỉ giữ ảnh thuộc domain chính
      if (u.hostname.replace(/^www\./, '') !== 'finnews247.com') return null;
      return u.href;
    } catch {
      return null;
    }
  }

  // relative → chuẩn hóa về /images/*
  s = s.replace(/^\.{1,2}\//, ''); // ./images/x → images/x
  if (!s.startsWith('/')) s = '/' + s;

  // chỉ index thư mục /images
  if (!/^\/images\//i.test(s)) return null;

  return SITE + s;
}

function uniq(arr) {
  return Array.from(new Set(arr));
}

function buildXml(urlEntries) {
  const head =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
    `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  const body = urlEntries
    .map(({ loc, images }) => {
      const imgs = (images || [])
        .map((im) => `    <image:image><image:loc>${im}</image:loc></image:image>`)
        .join('\n');
      return `  <url>\n    <loc>${loc}</loc>\n${imgs}\n  </url>`;
    })
    .join('\n');

  const tail = `\n</urlset>\n`;
  return head + body + tail;
}

// ---- load all data pools once
const DATA = {
  signals: readJsonSafe('signals.json'),
  altcoins: readJsonSafe('altcoins.json'),
  seccoin: readJsonSafe('seccoin.json'),
  cryptoexchanges: readJsonSafe('cryptoexchanges.json'),
  fidelity: readJsonSafe('fidelity.json'),
  bestapps: readJsonSafe('bestapps.json'),
  insurance: readJsonSafe('insurance.json'),
  news: readJsonSafe('news.json'),
  guides: readJsonSafe('guides.json'),
};

function findPostByPathname(pathname) {
  // pathname examples:
  // /crypto-market/slug
  // /altcoins/slug
  // /crypto-exchanges/slug
  // /best-crypto-apps/slug
  // /insurance/slug
  // /guides/slug
  // /signals/{id-or-slug}
  const parts = pathname.replace(/^\/+/, '').split('/');
  const cat = parts[0] || '';
  const slug = parts[1] || '';

  const bySlug = (arr) => arr.find((p) => String(p.slug || '').toLowerCase() === slug.toLowerCase());

  switch (cat) {
    case 'crypto-market':
      return bySlug(DATA.news);
    case 'altcoins':
      return bySlug(DATA.altcoins) || bySlug(DATA.seccoin);
    case 'crypto-exchanges':
      return bySlug(DATA.cryptoexchanges) || bySlug(DATA.fidelity);
    case 'best-crypto-apps':
      return bySlug(DATA.bestapps);
    case 'insurance':
      return bySlug(DATA.insurance);
    case 'guides':
      return bySlug(DATA.guides);
    case 'signals':
      // signals có thể là id hoặc slug
      return (
        DATA.signals.find((p) => String(p.slug || p.id).toLowerCase() === slug.toLowerCase()) ||
        DATA.signals.find((p) => String(p.id) === slug)
      );
    default:
      return null;
  }
}

function collectImagesForPost(post) {
  if (!post) return [];
  const candidates = [];

  // các field trực tiếp
  ['image', 'ogImage', 'thumb'].forEach((k) => {
    if (post[k]) candidates.push(post[k]);
  });

  // HTML content fields
  [
    'content',
    'body',
    'excerpt',
    'intro',
    'marketContext',
    'technicalAnalysis',
    'riskStrategy',
  ].forEach((k) => {
    if (post[k]) {
      candidates.push(...extractImgsFromHtml(String(post[k])));
    }
  });

  // chuẩn hóa → absolute + lọc domain đúng
  const abs = candidates
    .map(toAbsoluteOnHost)
    .filter(Boolean);

  // bỏ trùng
  return uniq(abs);
}

async function main() {
  // Lấy URL list trực tiếp từ next-sitemap.config.js để BÁM SÁT sitemap.xml
  const cfg = require('./next-sitemap.config.js');
  const pages = await cfg.additionalPaths();

  const entries = [];
  let totalImages = 0;

  for (const p of pages) {
    let loc = p.loc;
    if (!/^https?:\/\//i.test(loc)) {
      // additionalPaths của next-sitemap trả loc dạng "/path"
      loc = SITE.replace(/\/+$/, '') + loc;
    }
    const u = new URL(loc);
    const post = findPostByPathname(u.pathname);
    const images = collectImagesForPost(post);

    if (images.length) {
      totalImages += images.length;
      entries.push({ loc, images });
    } else {
      // vẫn thêm <url> để image-sitemap bám y chang URL, nhưng không có <image:image> thì cũng OK
      entries.push({ loc, images: [] });
    }
  }

  const xml = buildXml(entries);
  if (!fs.existsSync(PUB)) fs.mkdirSync(PUB, { recursive: true });
  const outFile = path.join(PUB, 'image-sitemap.xml');
  fs.writeFileSync(outFile, xml, 'utf8');

  console.log(`[image-sitemap] URLs: ${entries.length}, images: ${totalImages}`);
  console.log(`[image-sitemap] wrote: ${outFile}`);
}

main().catch((e) => {
  console.error('[image-sitemap] ERROR:', e);
  process.exit(1);
});
