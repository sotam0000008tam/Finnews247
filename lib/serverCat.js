// lib/serverCat.js (server-only)
import fs from "fs";
import path from "path";

const fileMap = {
  "crypto-market": "news.json",
  "altcoins": "altcoins.json",
  "seccoin": "seccoin.json",
  "crypto-exchanges": "cryptoexchanges.json",
  "fidelity": "fidelity.json",
  "best-crypto-apps": "bestapps.json",
  "insurance": "insurance.json",
  "tax": "tax.json",
  "guides": "guides.json"
};

export function readCat(key) {
  const files = [];
  if (key === "altcoins") {
    files.push("altcoins.json", "seccoin.json");
  } else {
    const f = fileMap[key];
    if (f) files.push(f);
  }
  let out = [];
  for (const f of files) {
    try {
      const raw = fs.readFileSync(path.join(process.cwd(), "data", f), "utf-8");
      const arr = JSON.parse(raw);
      out = out.concat(arr);
    } catch {}
  }
  return out.filter(x => x && (x.slug || x.title)).map(x => ({...x}));
}

export function readMany(keys) {
  let acc = [];
  for (const k of keys) acc = acc.concat(readCat(k));
  return acc;
}

export function pickLatest(arr, n=10) {
  const parseD = (d) => { const t = Date.parse(d); return Number.isNaN(t)?0:t; };
  const seen = new Set();
  return arr.filter(p => {
      if (!p?.slug) return false;
      if (seen.has(p.slug)) return false;
      seen.add(p.slug); return true;
    })
    .sort((a,b) => (parseD(b.date || b.updatedAt) - parseD(a.date || a.updatedAt)))
    .slice(0, n);
}
