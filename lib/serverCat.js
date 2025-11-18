// lib/serverCat.js (server-only)
import fs from "fs";
import path from "path";

/*
 * fileMap defines a fallback mapping from canonical keys to a single JSON file. This is used when
 * the key does not belong to a defined group. Most categories are grouped via groupFiles (see below).
 */
const fileMap = {
  "crypto-market": "news.json",
  "altcoins": "altcoins.json",
  // alias để không bị miss khi ai đó gọi "sec-coin"
  "sec-coin": "seccoin.json",
  "seccoin": "seccoin.json",
  "crypto-exchanges": "cryptoexchanges.json",
  "fidelity": "fidelity.json",
  "best-crypto-apps": "bestapps.json",
  "insurance": "insurance.json",
  "tax": "tax.json",
  "guides": "guides.json",
};

/*
 * groupFiles maps canonical category keys to an array of JSON files. It defines how multiple
 * legacy categories are unified into a single logical group. When reading a category via
 * readCat(), the key is first normalised via groupAliases (below) to a canonical group. If the
 * canonical group exists in groupFiles, all files listed for that group are read and combined.
 */
const groupFiles = {
  // Altcoin Analysis includes both altcoins.json and seccoin.json
  altcoins: ["altcoins.json", "seccoin.json"],
  // Crypto Exchanges includes cryptoexchanges.json plus fidelity.json (legacy)
  "crypto-exchanges": ["cryptoexchanges.json", "exchanges.json", "fidelity.json"],
  // Apps & Wallets: current site only has bestapps.json; wallets live as a static page
  // Best Crypto Apps & Wallets: includes bestapps.json and wallets.json
  "best-crypto-apps": ["bestapps.json", "wallets.json"],
  // Insurance & Tax: unify both insurance.json and tax.json into one group
  insurance: ["insurance.json", "tax.json"],
  // Crypto & Market: unify news.json (market/economy/stock synonyms handled via groupAliases)
  "crypto-market": ["news.json"],
  // Guides & Reviews: guides.json only
  guides: ["guides.json"],
  // Trading signals: separate group (not part of six categories but used for sidebar)
  signals: ["signals.json", "trading_signals.json", "signal.json"],
};

/*
 * groupAliases maps various legacy or synonymous category slugs to their canonical group key.
 * For example, "tax" and "crypto-tax" map to "insurance"; "economy", "stocks" and
 * "market" map to "crypto-market". When readCat() receives a key, it is normalised via
 * this mapping before determining which files to read.
 */
const groupAliases = {
  // altcoins synonyms
  "sec-coin": "altcoins",
  seccoin: "altcoins",
  // crypto exchanges synonyms
  exchanges: "crypto-exchanges",
  fidelity: "crypto-exchanges",
  "fidelity-crypto": "crypto-exchanges",
  // apps & wallets synonyms
  apps: "best-crypto-apps",
  wallets: "best-crypto-apps",
  bestapps: "best-crypto-apps",
  // insurance and tax synonyms
  tax: "insurance",
  "crypto-tax": "insurance",
  insurance: "insurance",
  // crypto market synonyms
  market: "crypto-market",
  news: "crypto-market",
  economy: "crypto-market",
  stocks: "crypto-market",
  crypto: "crypto-market",
  "crypto-market": "crypto-market",
  // guides and reviews
  reviews: "guides",
  guides: "guides",
};

const normalizeSlugish = (raw = "") =>
  String(raw)
    .trim()
    .replace(/^https?:\/\/[^/]+/i, "")   // bỏ domain nếu lỡ để full URL
    .replace(/\?.*$/, "")                // bỏ query
    .replace(/#.*/, "")                  // bỏ hash
    .replace(/^\/+|\/+$/g, "")           // bỏ leading/trailing slash
    .toLowerCase();

const parseD = (d) => {
  const t = Date.parse(d);
  return Number.isNaN(t) ? 0 : t;
};

function readFiles(files = []) {
  let out = [];
  for (const f of files) {
    try {
      const raw = fs.readFileSync(path.join(process.cwd(), "data", f), "utf-8");
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) out = out.concat(arr);
    } catch {
      /* ignore */
    }
  }
  return out;
}

function dedupAndSort(arr = []) {
  const seen = new Set();
  const uniq = [];
  for (const p of arr) {
    if (!p) continue;
    const sig = normalizeSlugish(p.slug || p.href || p.url || p.guid || p.title || "");
    if (!sig) continue;
    if (seen.has(sig)) continue;
    seen.add(sig);
    uniq.push({ ...p });
  }
  // sort newest first (date/updatedAt)
  uniq.sort(
    (a, b) => parseD(b.date || b.updatedAt) - parseD(a.date || a.updatedAt)
  );
  return uniq;
}

export function readCat(key) {
  if (!key) return [];
  // normalise the key via groupAliases (strip leading/trailing slashes, lower-case)
  const norm = normalizeSlugish(String(key));
  const canonical = groupAliases[norm] || norm;
  // if a group is defined, read all associated files
  if (groupFiles[canonical]) {
    const files = groupFiles[canonical];
    const raw = readFiles(files);
    return dedupAndSort(raw);
  }
  // fallback: read single file via fileMap
  const f = fileMap[canonical];
  if (f) {
    const raw = readFiles([f]);
    return dedupAndSort(raw);
  }
  // unknown key
  return [];
}

export function readMany(keys) {
  // đọc nhiều category và KHỬ TRÙNG toàn cục
  let acc = [];
  for (const k of keys) acc = acc.concat(readCat(k));
  return dedupAndSort(acc);
}

export function pickLatest(arr, n = 10) {
  // lấy n bài mới nhất nhưng vẫn đảm bảo không trùng
  const uniq = dedupAndSort(arr);
  return uniq.slice(0, n);
}
