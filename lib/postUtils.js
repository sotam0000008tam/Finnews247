export const stripHtml = (html = "") =>
  html.replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

export const truncate = (s = "", n = 160) => {
  if (!s) return "";
  if (s.length <= n) return s;
  const cut = s.slice(0, n);
  const i = cut.lastIndexOf(" ");
  return (i > 80 ? cut.slice(0, i) : cut) + "…";
};

export const firstImage = (html = "") => {
  const m = html?.match?.(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
};

export const pickThumb = (p) =>
  p?.thumb || p?.ogImage || p?.image || firstImage(p?.content || p?.body || "") || "/images/dummy/altcoins64.jpg";

export const parseDate = (d) => {
  const t = Date.parse(d);
  return Number.isNaN(t) ? 0 : t;
};

export function buildUrl(p) {
  const s = p?.slug;
  if (!s) return "#";
  const ns = String(p?._cat || p?.category || "").toLowerCase();
  if (ns.includes("crypto-market") || ns.includes("news") || ns.includes("market")) return `/crypto-market/${s}`;
  if (ns.includes("altcoin") || ns.includes("sec coin") || ns.includes("seccoin") || ns === "altcoins") return `/altcoins/${s}`;
  if (ns.includes("exchange") || ns.includes("fidelity") || ns === "crypto-exchanges") return `/crypto-exchanges/${s}`;
  if (ns.includes("wallet") || ns.includes("app") || ns === "best-crypto-apps") return `/best-crypto-apps/${s}`;
  if (ns.includes("insurance") || ns.includes("tax") || ns === "insurance") return `/insurance/${s}`;
  if (ns.includes("guide") || ns.includes("review") || ns === "guides") return `/guides/${s}`;
  return `/crypto-market/${s}`;
}

export function catInfo(post) {
  const c = String(post?._cat || post?.category || "").toLowerCase();
  if (c.includes("crypto-market") || c.includes("news") || c.includes("market")) return { href: "/crypto-market", label: "Crypto & Market" };
  if (c.includes("altcoin") || c.includes("sec coin") || c.includes("seccoin")) return { href: "/altcoins", label: "Altcoin Analysis" };
  if (c.includes("exchange") || c.includes("fidelity")) return { href: "/crypto-exchanges", label: "Exchanges" };
  if (c.includes("wallet") || c.includes("app")) return { href: "/best-crypto-apps", label: "Apps & Wallets" };
  if (c.includes("insurance") || c.includes("tax")) return { href: "/insurance", label: "Insurance & Tax" };
  if (c.includes("guide") || c.includes("review")) return { href: "/guides", label: "Guides & Reviews" };
  return { href: "/crypto-market", label: "Crypto & Market" };
}

export function guessAuthor(post) {
  const direct =
    post.author || post.authorName || post.author_name ||
    post.writer || post.writerName || post.by || post.byline ||
    post.credit || post?.meta?.author || post?.source?.author || "";
  if (direct && String(direct).trim()) return String(direct).trim();

  const raw = String(post.content || post.body || "");
  const m =
    raw.match(/(?:written\s+by|by)\s+([A-Z][\w .'-]{2,60})/i) ||
    raw.match(/作者[:：]\s*([^\n<]+)/i);
  return m && m[1] ? m[1].trim().replace(/\s{2,}/g, " ") : "FinNews247 Team";
}
