/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");

const SITE_URL = "https://www.finnews247.com";
const NEWS_PREFIX = "/news"; // giữ news tại /news/<slug>

function readJsonSafe(file) {
  try {
    return JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "data", file), "utf8")
    );
  } catch {
    return [];
  }
}

function addUrls(urls, base, arr, key = "slug") {
  if (!Array.isArray(arr)) return;
  arr.forEach((it) => {
    const val = it?.[key];
    if (!val) return;
    const slug = String(val).trim().replace(/^\/+|\/+$/g, "");
    const loc = (base ? `${base}/${slug}` : `/${slug}`).replace(
      /\/{2,}/g,
      "/"
    );
    urls.add(loc);
  });
}

module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 7000,
  // Chỉ loại API/NextJS routes, không loại hub bạn cần
  exclude: ["/admin/*", "/api/*", "/_next/*"],
  transform: async (_config, loc) => ({
    loc,
    changefreq: "daily",
    priority: loc === "/" ? 1.0 : 0.7,
    lastmod: new Date().toISOString(),
  }),
  additionalPaths: async () => {
    const urls = new Set();
    // Hubs tĩnh phải luôn có mặt
    [
      "/",
      "/about",
      "/contact",
      "/privacy",
      "/terms",
      "/crypto",
      "/economy",
      "/market",
      "/staking",
      "/wallets",
      "/altcoins",
      "/sec-coin",
      "/signals",
      "/guides",
      "/best-crypto-apps",
      "/tax",
      "/insurance",
      "/crypto-exchanges",
    ].forEach((u) => urls.add(u));

    // News
    addUrls(urls, NEWS_PREFIX, readJsonSafe("news.json"), "slug");
    // Signals
    addUrls(urls, "/signals", readJsonSafe("signals.json"), "id");
    // Exchanges – gộp Fidelity vào hub canonical
    addUrls(urls, "/crypto-exchanges", readJsonSafe("cryptoexchanges.json"), "slug");
    addUrls(urls, "/crypto-exchanges", readJsonSafe("fidelity.json"), "slug");
    // Best crypto apps
    addUrls(urls, "/best-crypto-apps", readJsonSafe("bestapps.json"), "slug");
    // Guides
    addUrls(urls, "/guides", readJsonSafe("guides.json"), "slug");
    // Tax & Insurance
    addUrls(urls, "/tax", readJsonSafe("tax.json"), "slug");
    addUrls(urls, "/insurance", readJsonSafe("insurance.json"), "slug");
    // Altcoins, Wallets, Sec Coin
    addUrls(urls, "/altcoins", readJsonSafe("altcoins.json"), "slug");
    addUrls(urls, "/wallets", readJsonSafe("wallets.json"), "slug");
    addUrls(urls, "/sec-coin", readJsonSafe("seccoin.json"), "slug");

    return Array.from(urls).map((loc) => ({ loc }));
  },
};
