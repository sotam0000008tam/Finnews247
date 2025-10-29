// lib/cat.js
/* ===== Text helpers ===== */
export const stripHtml = (html = "") =>
  String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const truncate = (s = "", n = 160) => {
  const str = String(s || "");
  if (str.length <= n) return str;
  const cut = str.slice(0, n);
  const i = cut.lastIndexOf(" ");
  return (i > 80 ? cut.slice(0, i) : cut) + "…";
};

export const firstImage = (html = "") => {
  const m = String(html || "").match?.(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
};

export const pickThumb = (p = {}) =>
  p.thumb ||
  p.ogImage ||
  p.image ||
  firstImage(p.content || p.body || "") ||
  "/images/dummy/altcoins64.jpg";

export const parseDate = (d) => {
  const t = Date.parse(d);
  return Number.isNaN(t) ? 0 : t;
};

export function guessAuthor(post = {}) {
  const direct =
    post.author ||
    post.authorName ||
    post.author_name ||
    post.writer ||
    post.writerName ||
    post.by ||
    post.byline ||
    post.credit ||
    post?.meta?.author ||
    post?.source?.author ||
    "";
  if (direct && String(direct).trim()) return String(direct).trim();

  const raw = String(post.content || post.body || "");
  const m =
    raw.match(/(?:written\s+by|by)\s+([A-Z][\w .'-]{2,60})/i) ||
    raw.match(/作者[:：]\s*([^\n<]+)/i);
  if (m && m[1]) return m[1].trim().replace(/\s{2,}/g, " ");

  return "FinNews247 Team";
}

/* ===== URL & Category helpers ===== */
export function catInfo(key = "") {
  const k = String(key).toLowerCase();
  const map = {
    "crypto-market": { key: "crypto-market", base: "/crypto-market", title: "Crypto & Market" },
    "altcoins": { key: "altcoins", base: "/altcoins", title: "Altcoin Analysis" },
    "crypto-exchanges": { key: "crypto-exchanges", base: "/crypto-exchanges", title: "Exchanges" },
    "best-crypto-apps": { key: "best-crypto-apps", base: "/best-crypto-apps", title: "Apps & Wallets" },
    "insurance": { key: "insurance", base: "/insurance", title: "Insurance & Tax" },
    "guides": { key: "guides", base: "/guides", title: "Guides & Reviews" },
  };
  return map[k] || { key: k, base: `/${k}`, title: k };
}

export function buildUrl(p = {}) {
  if (p.href) return p.href;
  const slug = p.slug;
  if (!slug) return "#";
  const c = String(p._cat || p.category || "").toLowerCase();

  if (c.includes("market") || c.includes("news")) return `/crypto-market/${slug}`;
  if (c.includes("altcoin") || c.includes("seccoin") || c.includes("sec coin")) return `/altcoins/${slug}`;
  if (c.includes("exchange") || c.includes("fidelity")) return `/crypto-exchanges/${slug}`;
  if (c.includes("wallet") || c.includes("app")) return `/best-crypto-apps/${slug}`;
  if (c.includes("insurance") || c.includes("tax")) return `/insurance/${slug}`;
  if (c.includes("guide") || c.includes("review")) return `/guides/${slug}`;
  return `/${slug}`;
}

/* ===== Gather latest (server will pass readCat) ===== */
export function gatherLatest(readCatServer) {
  const pool = [
    ...readCatServer("crypto-market").map((x) => ({ ...x, _cat: "crypto-market" })),
    ...readCatServer("altcoins").map((x) => ({ ...x, _cat: "altcoins" })),
    ...readCatServer("crypto-exchanges").map((x) => ({ ...x, _cat: "crypto-exchanges" })),
    ...readCatServer("best-crypto-apps").map((x) => ({ ...x, _cat: "best-crypto-apps" })),
    ...readCatServer("insurance").map((x) => ({ ...x, _cat: "insurance" })),
    ...readCatServer("guides").map((x) => ({ ...x, _cat: "guides" })),
  ];
  const seen = new Set();
  return pool
    .filter((p) => {
      const key = p.slug || p.title;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => (parseDate(b.date || b.updatedAt) - parseDate(a.date || a.updatedAt)))
    .slice(0, 9);
}
