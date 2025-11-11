// lib/serverCat.js (server-only)
import fs from "fs";
import path from "path";

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
  const files = [];
  if (key === "altcoins") {
    // altcoins luôn gộp altcoins + seccoin
    files.push("altcoins.json", "seccoin.json");
  } else {
    const f = fileMap[key];
    if (f) files.push(f);
  }
  const raw = readFiles(files);
  return dedupAndSort(raw);
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
