const fs = require("fs");
const path = require("path");

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  // Define the canonical site URL using the www subdomain.  Using a single
  // consistent domain avoids duplicate content between www and non‑www versions
  // and ensures that generated sitemaps and robots.txt reference the same
  // canonical hostname.  See https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_URL#choosing_between_www_and_non-www
  siteUrl: "https://www.finnews247.com",
  generateRobotsTxt: true,
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 7000,
  exclude: ["/admin/*", "/api/*", "/_next/*"],

  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: "daily",
      priority: path === "/" ? 1.0 : 0.7,
      lastmod: new Date().toISOString(),
    };
  },

  additionalPaths: async () => {
    // Collect extra sitemap paths from our data files.  Some slugs may be
    // repeated across different sections of the code or multiple files.  We
    // ensure each URL appears only once by deduplicating before returning.
    const paths = [];

    // Helper to read JSON and push unique locations with a base path.
    const addSlugs = (filename, prefix, key = "slug") => {
      try {
        const data = JSON.parse(
          fs.readFileSync(path.join(__dirname, `data/${filename}`), "utf-8")
        );
        data.forEach((item) => {
          const val = item[key];
          if (val) {
            paths.push({ loc: `${prefix}${val}` });
          }
        });
      } catch (err) {
        console.error(`❌ Cannot load ${filename}:`, err);
      }
    };

    // News posts live at root level using slug
    addSlugs("news.json", "/");

    // Trading signals use id field rather than slug
    try {
      const signalsData = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data/signals.json"), "utf-8")
      );
      signalsData.forEach((item) => {
        if (item.id) paths.push({ loc: `/signals/${item.id}` });
      });
    } catch (err) {
      console.error("❌ Cannot load signals.json:", err);
    }

    // Fidelity Crypto posts
    addSlugs("fidelity.json", "/fidelity-crypto/");
    // Sec Coin posts
    addSlugs("seccoin.json", "/sec-coin/");
    // Best Crypto Apps and Wallets
    addSlugs("bestapps.json", "/best-crypto-apps/");
    // Guides (one loop only)
    addSlugs("guides.json", "/guides/");
    // General tax content
    addSlugs("tax.json", "/tax/");
    // Insurance content
    addSlugs("insurance.json", "/insurance/");
    // Crypto exchanges
    addSlugs("cryptoexchanges.json", "/crypto-exchanges/");
    // Altcoins posts
    addSlugs("altcoins.json", "/altcoins/");
    // Crypto tax (some tax articles have a separate section)
    addSlugs("tax.json", "/crypto-tax/");
    // Crypto insurance (some insurance articles have a separate section)
    addSlugs("insurance.json", "/crypto-insurance/");

    // After collecting all paths, remove duplicates.  This prevents the same URL
    // appearing multiple times in the generated sitemap (for example, when
    // multiple sections inadvertently add the same slug).
    const uniqueLocs = Array.from(new Set(paths.map((p) => p.loc)));
    return uniqueLocs.map((loc) => ({ loc }));
  },
};
