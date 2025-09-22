const fs = require("fs");
const path = require("path");

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://finnews247.com",
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

  additionalPaths: async (config) => {
    let paths = [];

    // ✅ Lấy news slug từ data/news.json
    try {
      const newsData = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data/news.json"))
      );
      newsData.forEach((item) => {
        if (item.slug) {
          // News posts live at root level: /slug
          paths.push({ loc: `/${item.slug}` });
        }
      });
    } catch (err) {
      console.error("❌ Không load được news.json:", err);
    }

    // ✅ Lấy signals id từ data/signals.json
    try {
      const signalsData = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data/signals.json"))
      );
      signalsData.forEach((item) => {
        if (item.id) {
          paths.push({ loc: `/signals/${item.id}` });
        }
      });
    } catch (err) {
      console.error("❌ Không load được signals.json:", err);
    }

    // ✅ Add Fidelity Crypto slugs from data/fidelity.json
    try {
      const fidelityData = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data/fidelity.json"))
      );
      fidelityData.forEach((item) => {
        if (item.slug) {
          paths.push({ loc: `/fidelity-crypto/${item.slug}` });
        }
      });
    } catch (err) {
      console.error("❌ Cannot load fidelity.json:", err);
    }

    // ✅ Add Sec Coin slugs from data/seccoin.json
    try {
      const secData = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data/seccoin.json"))
      );
      secData.forEach((item) => {
        if (item.slug) {
          paths.push({ loc: `/sec-coin/${item.slug}` });
        }
      });
    } catch (err) {
      console.error("❌ Cannot load seccoin.json:", err);
    }

    // ✅ Add Best Crypto Apps slugs from data/bestapps.json
    try {
      const appsData = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data/bestapps.json"))
      );
      appsData.forEach((item) => {
        if (item.slug) {
          paths.push({ loc: `/best-crypto-apps/${item.slug}` });
        }
      });
    } catch (err) {
      console.error("❌ Cannot load bestapps.json:", err);
    }

    // ✅ Add Guides slugs from data/guides.json
    try {
      const guidesData = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data/guides.json"))
      );
      guidesData.forEach((item) => {
        if (item.slug) {
          paths.push({ loc: `/guides/${item.slug}` });
        }
      });
    } catch (err) {
      console.error("❌ Cannot load guides.json:", err);
    }

    // ✅ Add Tax slugs from data/tax.json
    try {
      const taxData = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data/tax.json"))
      );
      taxData.forEach((item) => {
        if (item.slug) {
          paths.push({ loc: `/tax/${item.slug}` });
        }
      });
    } catch (err) {
      console.error("❌ Cannot load tax.json:", err);
    }

    // ✅ Add Insurance slugs from data/insurance.json
    try {
      const insData = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data/insurance.json"))
      );
      insData.forEach((item) => {
        if (item.slug) {
          paths.push({ loc: `/insurance/${item.slug}` });
        }
      });
    } catch (err) {
      console.error("❌ Cannot load insurance.json:", err);
    }

    // ✅ Add Crypto Exchanges slugs from data/cryptoexchanges.json
    try {
      const exData = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data/cryptoexchanges.json"))
      );
      exData.forEach((item) => {
        if (item.slug) {
          paths.push({ loc: `/crypto-exchanges/${item.slug}` });
        }
      });
    } catch (err) {
      console.error("❌ Cannot load cryptoexchanges.json:", err);
    }

    // ✅ Add Altcoins slugs from data/altcoins.json
    try {
      const altData = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data/altcoins.json"))
      );
      altData.forEach((item) => {
        if (item.slug) {
          paths.push({ loc: `/altcoins/${item.slug}` });
        }
      });
    } catch (err) {
      console.error("❌ Cannot load altcoins.json:", err);
    }

    // ✅ Add Guides slugs from data/guides.json
    try {
      const guidesData = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data/guides.json"))
      );
      guidesData.forEach((item) => {
        if (item.slug) {
          paths.push({ loc: `/guides/${item.slug}` });
        }
      });
    } catch (err) {
      console.error("❌ Cannot load guides.json:", err);
    }

    // ✅ Add Crypto Tax slugs from data/tax.json
    try {
      const taxData = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data/tax.json"))
      );
      taxData.forEach((item) => {
        if (item.slug) {
          paths.push({ loc: `/tax/${item.slug}` });
        }
      });
    } catch (err) {
      console.error("❌ Cannot load tax.json:", err);
    }

    // ✅ Add Crypto Insurance slugs from data/insurance.json
    try {
      const insuranceData = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data/insurance.json"))
      );
      insuranceData.forEach((item) => {
        if (item.slug) {
          paths.push({ loc: `/insurance/${item.slug}` });
        }
      });
    } catch (err) {
      console.error("❌ Cannot load insurance.json:", err);
    }

    // ✅ Add Crypto Exchanges slugs from data/cryptoexchanges.json
    try {
      const exchangesData = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data/cryptoexchanges.json"))
      );
      exchangesData.forEach((item) => {
        if (item.slug) {
          paths.push({ loc: `/crypto-exchanges/${item.slug}` });
        }
      });
    } catch (err) {
      console.error("❌ Cannot load cryptoexchanges.json:", err);
    }

    // ✅ Add Altcoins slugs from data/altcoins.json
    try {
      const altcoinsData = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data/altcoins.json"))
      );
      altcoinsData.forEach((item) => {
        if (item.slug) {
          paths.push({ loc: `/altcoins/${item.slug}` });
        }
      });
    } catch (err) {
      console.error("❌ Cannot load altcoins.json:", err);
    }

    // ✅ Add Guides slugs from data/guides.json
    try {
      const guidesData = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data/guides.json"))
      );
      guidesData.forEach((item) => {
        if (item.slug) {
          paths.push({ loc: `/guides/${item.slug}` });
        }
      });
    } catch (err) {
      console.error("❌ Cannot load guides.json:", err);
    }

    // ✅ Add Crypto Tax slugs from data/tax.json
    try {
      const taxData = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data/tax.json"))
      );
      taxData.forEach((item) => {
        if (item.slug) {
          paths.push({ loc: `/crypto-tax/${item.slug}` });
        }
      });
    } catch (err) {
      console.error("❌ Cannot load tax.json:", err);
    }

    // ✅ Add Crypto Insurance slugs from data/insurance.json
    try {
      const insuranceData = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data/insurance.json"))
      );
      insuranceData.forEach((item) => {
        if (item.slug) {
          paths.push({ loc: `/crypto-insurance/${item.slug}` });
        }
      });
    } catch (err) {
      console.error("❌ Cannot load insurance.json:", err);
    }

    // ✅ Add Crypto Exchanges slugs from data/cryptoexchanges.json
    try {
      const exchangesData = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data/cryptoexchanges.json"))
      );
      exchangesData.forEach((item) => {
        if (item.slug) {
          paths.push({ loc: `/crypto-exchanges/${item.slug}` });
        }
      });
    } catch (err) {
      console.error("❌ Cannot load cryptoexchanges.json:", err);
    }

    // ✅ Add Altcoins slugs from data/altcoins.json
    try {
      const altcoinsData = JSON.parse(
        fs.readFileSync(path.join(__dirname, "data/altcoins.json"))
      );
      altcoinsData.forEach((item) => {
        if (item.slug) {
          paths.push({ loc: `/altcoins/${item.slug}` });
        }
      });
    } catch (err) {
      console.error("❌ Cannot load altcoins.json:", err);
    }

    return paths;
  },
};
