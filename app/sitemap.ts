// app/sitemap.ts
import type { MetadataRoute } from "next";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = 3600;

type Changefreq = "daily" | "weekly" | "monthly" | "yearly";

/** Lấy SITE_URL từ ENV, tuyệt đối không trả localhost */
function resolveBase(): string {
  // Ưu tiên các biến ENV phổ biến trên Vercel / Node
  let site =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

  site = (site || "").trim().replace(/\/+$/, "");

  // Nếu chưa có ENV thì dùng domain thật làm fallback (KHÔNG dùng localhost)
  if (!site) site = "https://www.finnews247.com";

  // Nếu lỡ config sai và trả localhost → ép về domain thật
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(site)) {
    site = "https://www.finnews247.com";
  }
  return site;
}

// Các listing chính
const LISTING_MAIN = [
  "/signals",
  "/altcoins",
  "/crypto-exchanges",
  "/best-crypto-apps",
  "/insurance",
  "/crypto-market",
  "/guides",
] as const;

function toAbs(u: string, BASE: string) {
  if (/^https?:\/\//i.test(u)) return u;
  return `${BASE}${u.startsWith("/") ? "" : "/"}${u}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE = resolveBase();
  const out: MetadataRoute.Sitemap = [];
  const nowISO = new Date().toISOString();

  const push = (
    url: string,
    lastModified?: string,
    changeFrequency: Changefreq = "daily",
    priority = 0.7
  ) => {
    out.push({ url, lastModified, changeFrequency, priority });
  };

  // 1) Trang cố định + listing chính
  push(toAbs("/", BASE), nowISO, "daily", 1);
  push(toAbs("/about", BASE), undefined, "weekly", 0.7);
  push(toAbs("/contact", BASE), undefined, "weekly", 0.7);
  push(toAbs("/privacy", BASE), undefined, "yearly", 0.7);
  push(toAbs("/terms", BASE), undefined, "yearly", 0.7);
  (LISTING_MAIN as readonly string[]).forEach((l) =>
    push(toAbs(l, BASE), undefined, "daily", 0.7)
  );

  // 2) Đổ bài viết trực tiếp từ data (ổn định)
  try {
    const { readCat } = await import("../lib/serverCat");
    type Post = { slug?: string; id?: string };

    const CAT_KEYS = [
      "altcoins",
      "crypto-exchanges",
      "best-crypto-apps",
      "insurance",
      "crypto-market",
      "guides",
    ] as const;

    const buildHref = (cat: string, p: Post): string | null => {
      const s = String(p?.slug || "").replace(/^\//, "");
      if (!s) return null;
      if (cat === "crypto-market") return `/crypto-market/${s}`;
      if (cat === "altcoins") return `/altcoins/${s}`;
      if (cat === "crypto-exchanges") return `/crypto-exchanges/${s}`;
      if (cat === "best-crypto-apps") return `/best-crypto-apps/${s}`;
      if (cat === "insurance") return `/insurance/${s}`;
      if (cat === "guides") return `/guides/${s}`;
      return null;
    };

    (CAT_KEYS as readonly string[]).forEach((cat) => {
      const arr = (readCat(cat as any) || []) as Post[];
      for (let i = 0; i < arr.length; i++) {
        const href = buildHref(cat, arr[i]);
        if (href) push(toAbs(href, BASE));
      }
    });

    // Signals từ /data/signals.json
    try {
      const fs = await import("fs/promises");
      const path = await import("path");
      const f = await fs.readFile(
        path.join(process.cwd(), "data", "signals.json"),
        "utf-8"
      );
      const signals = JSON.parse(f) as Post[];
      for (let i = 0; i < signals.length; i++) {
        const id = String(signals[i]?.id || "").replace(/^\//, "");
        if (id) push(toAbs(`/signals/${id}`, BASE));
      }
    } catch {}
  } catch {}

  // 3) Khử trùng lặp
  const seen = new Set<string>();
  return out.filter((it) => {
    if (!it.url || seen.has(it.url)) return false;
    seen.add(it.url);
    return true;
  });
}
