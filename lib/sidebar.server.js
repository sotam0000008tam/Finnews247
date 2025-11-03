// lib/sidebar.server.js (CommonJS)
const fs = require("fs");
const path = require("path");

/* ---------- utils ---------- */
function readJsonSafe(file) {
  try {
    const p = path.join(process.cwd(), "data", file);
    if (!fs.existsSync(p)) return [];
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return [];
  }
}

const firstImg = (html = "") =>
  (String(html).match(/<img[^>]+src=["']([^"']+)["']/i) || [])[1] || null;

const pickThumb = (p) =>
  p.thumb ||
  p.ogImage ||
  p.image ||
  firstImg(p.content || p.body || "") ||
  "/images/dummy/64x64.jpg";

const toISO = (d) => {
  const t = new Date(d);
  return isNaN(t.getTime()) ? undefined : t.toISOString();
};

function sortByDateDesc(a, b) {
  const ta = Date.parse(a.date || "") || 0;
  const tb = Date.parse(b.date || "") || 0;
  return tb - ta;
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------- 6 cụm (đánh dấu canonical cho file nguồn) ---------- */
/* LƯU Ý:
 * - Chỉ các mục từ file canonical mới được dùng cho phần "random fill".
 * - Bài đại diện mỗi cụm (coverage) sẽ ưu tiên canonical; nếu không có thì mới fallback.
 */
const SECTION_SOURCES = [
  {
    key: "altcoins",
    label: "Altcoin Analysis",
    files: [
      { name: "altcoins.json", canonical: true },   // chính thức
      { name: "seccoin.json", canonical: false },   // gộp vào nhưng KHÔNG dùng cho random
    ],
    href: (p) => `/altcoins/${(p.slug || p.path || "").replace(/^\//, "")}`,
  },
  {
    key: "exchanges",
    label: "Exchanges",
    files: [
      { name: "cryptoexchanges.json", canonical: true }, // chính thức
      { name: "fidelity.json", canonical: false },       // gộp vào nhưng KHÔNG dùng cho random
    ],
    href: (p) => `/crypto-exchanges/${(p.slug || p.path || "").replace(/^\//, "")}`,
  },
  {
    key: "apps",
    label: "Apps & Wallets",
    files: [{ name: "bestapps.json", canonical: true }],
    href: (p) => `/best-crypto-apps/${(p.slug || p.path || "").replace(/^\//, "")}`,
  },
  {
    key: "insuranceTax",
    label: "Insurance & Tax",
    files: [
      { name: "insurance.json", canonical: true }, // cả 2 đều chính thức
      { name: "tax.json", canonical: true },
    ],
    href: (p, fileName) => {
      const slug = (p.slug || p.path || "").replace(/^\//, "");
      if (!slug) return null;
      return fileName === "tax.json" ? `/tax/${slug}` : `/insurance/${slug}`;
    },
  },
  {
    key: "market",
    label: "Crypto & Market",
    files: [{ name: "news.json", canonical: true }],
    href: (p) => `/crypto-market/${(p.slug || p.path || "").replace(/^\//, "")}`,
  },
  {
    key: "guides",
    label: "Guides & Reviews",
    files: [{ name: "guides.json", canonical: true }],
    href: (p) => `/guides/${(p.slug || p.path || "").replace(/^\//, "")}`,
  },
];

function normalizeItem(p, fileName, section, canonical) {
  const href = section.href(p, fileName);
  const title = p.title || "Untitled";
  const date = p.date || p.updatedAt || p.publishedAt || "";
  return {
    title,
    href,
    date,
    lastmod: toISO(date),
    thumb: pickThumb(p),
    section: section.label,
    sectionKey: section.key,
    canonical: !!canonical,
    _slug: (p.slug || p.path || "").trim(),
  };
}

/**
 * getSidebarLatest:
 * - Lấy đúng 1 bài MỚI NHẤT cho MỖI TRONG 6 CỤM (ưu tiên file canonical) → 6 link đầu
 * - Phần còn lại: RANDOM nhưng CHỈ lấy từ file canonical trên toàn site
 * - Không re-sort cuối để giữ thứ tự cụm cho 6 link đầu
 */
async function getSidebarLatest({ limit = 10, randomPoolSize = 100 } = {}) {
  const bySection = new Map();
  const all = [];

  // gom & chuẩn hoá
  for (const sec of SECTION_SOURCES) {
    const items = [];
    for (const f of sec.files) {
      const fileName = typeof f === "string" ? f : f.name;
      const canonical = typeof f === "string" ? true : !!f.canonical; // string => mặc định canonical
      const arr = readJsonSafe(fileName);
      for (const p of arr) {
        const it = normalizeItem(p, fileName, sec, canonical);
        if (it.href && it._slug) items.push(it);
      }
    }
    items.sort(sortByDateDesc);
    bySection.set(sec.key, items);
    all.push(...items);
  }

  // 1) mỗi cụm đúng 1 bài mới nhất, ƯU TIÊN canonical
  const seenHref = new Set();
  const coverage = [];
  for (const sec of SECTION_SOURCES) {
    const list = bySection.get(sec.key) || [];
    const pickCanonical = list.find((x) => x.canonical && x.href && !seenHref.has(x.href));
    const pickAny = pickCanonical || list.find((x) => x.href && !seenHref.has(x.href));
    if (pickAny) {
      coverage.push(pickAny);
      seenHref.add(pickAny.href);
    }
  }

  // 2) random phần còn lại CHỈ từ canonical
  const pool = all
    .filter((x) => x.canonical && x.href && !seenHref.has(x.href))
    .sort(sortByDateDesc)
    .slice(0, randomPoolSize);

  const randomized = shuffle(pool);

  const needed = Math.max(0, limit - coverage.length);
  const fill = [];
  for (const it of randomized) {
    if (fill.length >= needed) break;
    if (!seenHref.has(it.href)) {
      fill.push(it);
      seenHref.add(it.href);
    }
  }

  // 3) KHÔNG sort lại — giữ 6 link đầu theo thứ tự cụm, còn lại random canonical
  return coverage.concat(fill);
}

/* Trading signals nhỏ gọn: giữ nguyên */
function latestSignals(n = 5) {
  const candidates = ["signals.json", "trading_signals.json", "signal.json"];
  let raw = [];
  for (const f of candidates) {
    raw = readJsonSafe(f);
    if (raw && raw.length) break;
  }
  if (!Array.isArray(raw)) raw = [];

  const norm = raw
    .map((s) => {
      const id =
        s.id ||
        s._id ||
        s.slug ||
        s.code ||
        (s.title ? String(s.title).toLowerCase().replace(/\s+/g, "-") : "") ||
        Math.random().toString(36).slice(2);
      const title = s.title || s.pair || s.symbol || s.ticker || "Signal";
      const pair = s.pair || s.symbol || s.ticker || title;
      const side = String(s.type || s.side || s.action || "")
        .toLowerCase()
        .includes("long")
        ? "long"
        : "short";
      const date = s.date || s.updatedAt || s.publishedAt || s.createdAt || "";
      return { id, title, pair, type: side, date };
    })
    .sort(
      (a, b) => (Date.parse(b.date || "") || 0) - (Date.parse(a.date || "") || 0)
    );

  return norm.slice(0, n);
}

module.exports = { getSidebarLatest, latestSignals, SECTION_SOURCES };
