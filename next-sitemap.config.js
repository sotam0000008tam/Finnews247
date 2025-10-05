/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");

const siteUrl = "https://www.finnews247.com";

/** Helpers */
function readJson(file) {
  try { return JSON.parse(fs.readFileSync(path.join(__dirname, "data", file), "utf-8")); }
  catch { return []; }
}
function add(urls, base, arr, key = "slug", mapVal = (v) => v) {
  for (const it of Array.isArray(arr) ? arr : []) {
    const val = it?.[key];
    if (!val) continue;
    const clean = String(mapVal(val)).replace(/^\/+|\/+$/g, "");
    urls.add(`${base}/${clean}`.replace(/\/+/, "/"));
  }
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 7000,

  // ❌ không đưa nhánh legacy/không canonical vào sitemap
  exclude: [
    "/admin/*", "/api/*", "/_next/*",
    "/privacy-policy", "/privacy-policy/*",
    "/exchanges", "/exchanges/*",
    "/crypto-tax", "/crypto-tax/*",
    "/crypto-insurance", "/crypto-insurance/*",
    "/fidelity-crypto/*" // nếu còn route phụ, vẫn loại để tránh trùng
  ],

  transform: async (config, loc) => ({
    loc,
    changefreq: "daily",
    priority: loc === "/" ? 1.0 : 0.7,
    lastmod: new Date().toISOString(),
  }),

  additionalPaths: async () => {
    const urls = new Set([
      // Hubs tĩnh chính
      "/", "/about", "/contact", "/privacy", "/terms",
      "/crypto", "/altcoins", "/economy", "/market", "/staking",
      "/wallets", "/crypto-exchanges",
      "/best-crypto-apps",
      "/tax", "/insurance",
      "/signals", "/guides",
      // (Nếu vẫn còn trang hub giới thiệu fidelity-crypto, có thể giữ hoặc bỏ.
      // Khuyến nghị: bỏ để tránh thin page. Ở đây mình bỏ KHÔNG add.)
    ]);

    // root news (nếu có) => /slug
    add(urls, "", readJson("news.json"), "slug", (v) => `/${v}`);

    // signals theo id
    add(urls, "/signals", readJson("signals.json"), "id");

    // ✅ Exchanges — gộp Fidelity về MỘT hub canonical
    add(urls, "/crypto-exchanges", readJson("cryptoexchanges.json"), "slug");
    add(urls, "/crypto-exchanges", readJson("fidelity.json"), "slug");

    // Các mục khác
    add(urls, "/guides", readJson("guides.json"), "slug");
    add(urls, "/wallets", readJson("wallets.json"), "slug");
    add(urls, "/altcoins", readJson("altcoins.json"), "slug");
    add(urls, "/best-crypto-apps", readJson("bestapps.json"), "slug");
    add(urls, "/tax", readJson("tax.json"), "slug");
    add(urls, "/insurance", readJson("insurance.json"), "slug");
    add(urls, "/sec-coin", readJson("seccoin.json"), "slug");

    return Array.from(urls).map((loc) => ({ loc }));
  },
};
