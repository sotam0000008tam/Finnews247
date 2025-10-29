// scripts/check-sidebar-links.mjs
// Node 18+ recommended (uses global fetch)
import fs from "fs";
import path from "path";
import * as cheerio from "cheerio";

const BASE = process.env.BASE_URL || "http://localhost:3000";

// Category index pages that render the sidebar you want to verify
const CATEGORY_INDEXES = [
  "/",
  "/crypto-market",
  "/altcoins",
  "/crypto-exchanges",
  "/best-crypto-apps",
  "/insurance",
  "/guides",
  "/tax"
];

const ok = (s) => s >= 200 && s < 400; // accept redirects as OK
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchHtml(url) {
  const res = await fetch(url, { redirect: "follow" });
  if (!ok(res.status)) throw new Error(`GET ${url} -> ${res.status}`);
  return await res.text();
}

function abs(href, base) {
  try {
    return new URL(href, base).toString();
  } catch {
    return null;
  }
}

async function checkUrl(u) {
  try {
    const res = await fetch(u, { redirect: "follow" });
    return { url: u, status: res.status, ok: ok(res.status) };
  } catch (e) {
    return { url: u, status: 0, ok: false, error: e.message };
  }
}

async function run() {
  const failures = [];
  for (const idx of CATEGORY_INDEXES) {
    const pageUrl = new URL(idx, BASE).toString();
    console.log(`\n=== Scan sidebar: ${pageUrl}`);
    let html = "";
    try {
      html = await fetchHtml(pageUrl);
    } catch (e) {
      console.error(`  ✖ Cannot load index: ${e.message}`);
      failures.push({ url: pageUrl, status: 0, note: "Index load failed" });
      continue;
    }

    const $ = cheerio.load(html);
    // collect links inside the sidebar block
    const anchors = $('.sidebar-scope a[href]')
      .map((_, el) => $(el).attr("href"))
      .get();

    const targets = [...new Set(
      anchors
        .map((h) => abs(h, pageUrl))
        .filter((u) => u && u.startsWith(BASE))
    )];

    console.log(`  → Found ${targets.length} sidebar links`);
    for (const u of targets) {
      const r = await checkUrl(u);
      if (!r.ok) {
        console.error(`  ✖ ${r.status} ${u}`);
        failures.push({ url: u, status: r.status, from: pageUrl });
      } else {
        console.log(`  ✓ ${r.status} ${u}`);
      }
      await sleep(50);
    }
  }

  const reportPath = path.join(process.cwd(), "sidebar-link-report.json");
  fs.writeFileSync(reportPath, JSON.stringify({ base: BASE, failures }, null, 2));
  console.log(`\nDone. Failures: ${failures.length}. Report → ${reportPath}`);
  process.exit(failures.length ? 1 : 0);
}

run().catch((e) => { console.error(e); process.exit(1); });