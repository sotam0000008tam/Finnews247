/** @type {import('next-sitemap').IConfig} */

// ==== WHITELIST pattern chỉ cho phép các đường dẫn bạn quy định ====
const ALLOW_RE = new RegExp(
  [
    '^/$', // home
    '^/(about|contact|privacy|terms)$',
    '^/(signals|altcoins|crypto-exchanges|best-crypto-apps|insurance|crypto-market|guides)$',
    '^/(signals|altcoins|crypto-exchanges|best-crypto-apps|insurance|crypto-market|guides)/[\\w-]+$',
  ].join('|')
);

// ==== Helpers parse lastmod cho /signals/... nếu slug có ngày ====
function isoFromParts(y, m, d, hh = 0, mm = 0) {
  const year = Number(y), month = Number(m), day = Number(d);
  const hour = Number(hh), min = Number(mm);
  return new Date(Date.UTC(year, month - 1, day, hour, min, 0)).toISOString();
}
function parseLastmodFromPath(path) {
  if (!path.startsWith('/signals/')) return null;

  // ...-YYYYMMDD-HHMM
  let m = path.match(/-(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})$/);
  if (m) return isoFromParts(m[1], m[2], m[3], m[4], m[5]);

  // ...-YYYYMMDD
  m = path.match(/-(\d{4})(\d{2})(\d{2})$/);
  if (m) return isoFromParts(m[1], m[2], m[3]);

  // ...-YYMMDD-HHMM  → 20YY
  m = path.match(/-(\d{2})(\d{2})(\d{2})-(\d{2})(\d{2})$/);
  if (m) return isoFromParts(2000 + Number(m[1]), m[2], m[3], m[4], m[5]);

  // ...-YYMMDD
  m = path.match(/-(\d{2})(\d{2})(\d{2})$/);
  if (m) return isoFromParts(2000 + Number(m[1]), m[2], m[3]);

  return null;
}

module.exports = {
  siteUrl: 'https://www.finnews247.com',
  generateRobotsTxt: true,
  // Không cần chia 1000 URL; vẫn để giá trị lớn để next-sitemap tạo 1 file duy nhất,
  // rồi bước #2 sẽ "ép" thành index → sitemap-0.xml theo đúng format bạn muốn.
  sitemapSize: 50000,
  exclude: ['/api/*'],

  transform: async (config, path) => {
    // Chỉ giữ URL đúng whitelist, còn lại loại bỏ khỏi sitemap
    if (!ALLOW_RE.test(path)) return null;

    const entry = {
      loc: path,
      changefreq: 'weekly',
      priority: 0.7,
    };

    if (path === '/') {
      entry.changefreq = 'daily';
      entry.priority = 1.0;
    }

    const lm = parseLastmodFromPath(path);
    if (lm) entry.lastmod = lm;

    return entry;
  },

  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
};
