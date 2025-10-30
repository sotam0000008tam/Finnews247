// next-sitemap.config.cjs
/** @type {import('next-sitemap').IConfig} */
const siteUrl = process.env.SITE_URL || 'https://www.finnews247.com';

// Dùng Set để tránh trùng URL giữa transform và additionalPaths
const EMITTED = new Set();

// Hàm loại trừ tối thiểu (tránh dùng glob quá rộng)
function isExcluded(loc) {
  return (
    loc === '/404' ||
    loc === '/500' ||
    loc.startsWith('/admin/') ||
    loc.startsWith('/api/') ||
    loc.startsWith('/_next/') ||
    loc === '/sitemap.xml' ||
    loc.startsWith('/sitemap-') ||
    loc === '/robots.txt' ||
    loc === '/server-sitemap.xml'
  );
}

module.exports = {
  siteUrl,
  generateRobotsTxt: false,          // robots.txt phục vụ từ public/robots.txt
  generateIndexSitemap: false,       // tạo 1 file sitemap.xml duy nhất
  sitemapBaseFileName: 'sitemap',
  trailingSlash: false,
  autoLastmod: true,
  // Chỉ loại trừ những route nội bộ bắt buộc — KHÔNG dùng /** hay /*/*
  exclude: [
    '/admin/*',
    '/api/*',
    '/_next/*',
    '/404',
    '/500',
    '/server-sitemap.xml',
    '/sitemap.xml',
    '/sitemap-*.xml',
    '/robots.txt',
  ],

  // Giữ transform mặc định, không lọc theo độ sâu path
  transform: async (config, path) => {
    EMITTED.add(path);
    if (isExcluded(path)) return null;
    return {
      loc: path,
      lastmod: new Date().toISOString(),
      changefreq: undefined,
      priority: undefined,
    };
  },

  // Bổ sung toàn bộ route đã prerender (kể cả dynamic) + giữ /signals/*
  additionalPaths: async (config) => {
    const fs = require('fs');
    const path = require('path');
    const add = [];

    // 1) Lấy danh sách route thực tế từ .next/prerender-manifest.json
    try {
      const prePath = path.join(process.cwd(), '.next', 'prerender-manifest.json');
      if (fs.existsSync(prePath)) {
        const pre = JSON.parse(fs.readFileSync(prePath, 'utf8'));
        const allRoutes = Object.keys(pre.routes || {});
        for (const loc of allRoutes) {
          if (!EMITTED.has(loc) && !isExcluded(loc)) {
            EMITTED.add(loc);
            add.push({
              loc,
              lastmod: new Date().toISOString(),
            });
          }
        }
      }
    } catch (e) {
      // bỏ qua nếu không đọc được manifest
    }

    // 2) Giữ lại /signals/* nếu bạn đang build động các tín hiệu
    //    (Tùy chọn) — nếu bạn có sẵn danh sách trong JSON, đặt ở public/signals-sitemap.json
    //    dạng: ["/signals/abc-20251001", {"loc":"/signals/xyz","lastmod":"2025-10-01T00:00:00Z"}]
    try {
      const jsonPath = path.join(process.cwd(), 'public', 'signals-sitemap.json');
      if (fs.existsSync(jsonPath)) {
        const list = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        for (const item of list) {
          const loc = typeof item === 'string' ? item : item.loc;
          const lastmod = typeof item === 'string' ? undefined : item.lastmod;
          if (loc && loc.startsWith('/signals/') && !EMITTED.has(loc) && !isExcluded(loc)) {
            EMITTED.add(loc);
            add.push({
              loc,
              lastmod,
            });
          }
        }
      }
    } catch (e) {
      // không có file này cũng không sao
    }

    return add;
  },
};
