// pages/sitemap.xml.js
import fs from "fs";
import path from "path";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.finnews247.com";

// Thư mục chứa các file JSON bài viết
const DATA_DIR = path.join(process.cwd(), "data");

// Đọc JSON an toàn
function readJsonSafe(fileName) {
  try {
    const fullPath = path.join(DATA_DIR, fileName);
    const raw = fs.readFileSync(fullPath, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    // console.error("readJsonSafe error for", fileName, e);
    return [];
  }
}

// Lấy slug từ 1 item trong JSON
// (signals dùng id, các group khác dùng slug/path)
function getSlug(item) {
  const raw = item?.slug || item?.path || item?.id || "";
  return String(raw).replace(/^\/+/, "").trim();
}

// Lấy lastmod (ngày sửa) từ item, fallback = hôm nay
function getLastmod(item) {
  const cand =
    item?.updatedAt ||
    item?.updated_at ||
    item?.lastmod ||
    item?.lastModified ||
    item?.date ||
    item?.publishedAt ||
    item?.published_at;

  const d = cand ? new Date(cand) : new Date();
  if (Number.isNaN(d.getTime())) return new Date();
  return d;
}

// Escape XML
function escapeXml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Định nghĩa các nhóm chính của bạn
// LƯU Ý: chỉnh lại file JSON cho đúng với /data của bạn
const SECTION_CONFIG = [
  // Trading Signals
  { file: "signals.json", basePath: "/signals" },

  // Altcoin Analysis
  { file: "altcoins.json", basePath: "/altcoins" },

  // Exchanges (bao gồm cả Fidelity nếu bạn gộp JSON)
  { file: "cryptoexchanges.json", basePath: "/crypto-exchanges" },
  { file: "fidelity.json", basePath: "/crypto-exchanges" },

  // Apps & Wallets
  { file: "bestapps.json", basePath: "/best-crypto-apps" },
  { file: "wallets.json", basePath: "/best-crypto-apps" },

  // Insurance & Tax
  { file: "insurance.json", basePath: "/insurance" },
  { file: "tax.json", basePath: "/insurance" },

  // Crypto & Market
  { file: "news.json", basePath: "/crypto-market" },

  // Guides & Reviews
  { file: "guides.json", basePath: "/guides" },
  { file: "reviews.json", basePath: "/guides" }, // hiện tại reviews.json chưa có thì cũng không sao
];

// Các trang tĩnh cố định
const STATIC_PATHS = [
  "/", // homepage
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/signals",
  "/altcoins",
  "/crypto-exchanges",
  "/best-crypto-apps",
  "/insurance",
  "/crypto-market",
  "/guides",
];

function buildUrl(pathname) {
  if (!pathname.startsWith("/")) pathname = "/" + pathname;
  return SITE_URL.replace(/\/+$/, "") + pathname;
}

// Hàm tạo XML
function generateSiteMap() {
  const urls = [];

  const pushUrl = (loc, lastmodDate) => {
    if (!loc) return;
    const lastmod = (lastmodDate || new Date()).toISOString();
    urls.push({ loc: buildUrl(loc), lastmod });
  };

  // 1) Trang tĩnh
  STATIC_PATHS.forEach((p) => pushUrl(p, new Date()));

  // 2) Trang bài viết từ JSON
  for (const section of SECTION_CONFIG) {
    const items = readJsonSafe(section.file);
    for (const item of items) {
      const slug = getSlug(item);
      if (!slug) continue;
      const lastmod = getLastmod(item);
      const loc = `${section.basePath}/${slug}`;
      pushUrl(loc, lastmod);
    }
  }

  // 3) Tạo XML
  const urlsXml = urls
    .map(
      (u) => `
  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
  ${urlsXml}
</urlset>`;
}

// getServerSideProps: chạy MỖI LẦN request /sitemap.xml
export async function getServerSideProps({ res }) {
  const xml = generateSiteMap();

  res.setHeader("Content-Type", "application/xml");
  // Có thể cache nhẹ để giảm I/O nếu muốn:
  // res.setHeader("Cache-Control", "public, max-age=300");
  res.write(xml);
  res.end();

  return {
    props: {},
  };
}

// Component rỗng vì chúng ta chỉ trả XML
export default function SiteMap() {
  return null;
}
