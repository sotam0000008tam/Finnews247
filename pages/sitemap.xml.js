// pages/sitemap.xml.js
export async function getServerSideProps({ res }) {
  // Ép dùng domain thật, không bao giờ trả localhost
  const SITE_URL = (() => {
    let s =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
      "https://www.finnews247.com";
    s = s.replace(/\/+$/, "");
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(s)) s = "https://www.finnews247.com";
    return s;
  })();

  const urls = [];
  const nowISO = new Date().toISOString();
  const abs = (path) =>
    /^https?:\/\//i.test(path) ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  const push = (path, lastmod, changefreq = "daily", priority = 0.7) => {
    urls.push({ loc: abs(path), lastmod, changefreq, priority });
  };

  // 1) Trang cố định + listing chính
  push("/", nowISO, "daily", 1);
  push("/about", undefined, "weekly", 0.7);
  push("/contact", undefined, "weekly", 0.7);
  push("/privacy", undefined, "yearly", 0.7);
  push("/terms", undefined, "yearly", 0.7);

  const LISTING = [
    "/signals",
    "/altcoins",
    "/crypto-exchanges",
    "/best-crypto-apps",
    "/insurance",
    "/crypto-market",
    "/guides",
  ];
  LISTING.forEach((p) => push(p, undefined, "daily", 0.7));

  // 2) Bài viết từ data (ổn định, không crawl HTML)
  try {
    const { readCat } = await import("../lib/serverCat");
    const cats = [
      "altcoins",
      "crypto-exchanges",
      "best-crypto-apps",
      "insurance",
      "crypto-market",
      "guides",
    ];
    const build = (cat, slug) => `/${cat}/${String(slug).replace(/^\//, "")}`;
    for (const cat of cats) {
      const arr = readCat(cat) || [];
      for (const p of arr) {
        if (p?.slug) push(build(cat, p.slug));
      }
    }
  } catch {
    // bỏ qua nếu chưa có lib/serverCat
  }

  // 3) Bài Signals từ /data/signals.json
  try {
    const fs = await import("fs/promises");
    const path = await import("path");
    const raw = await fs.readFile(path.join(process.cwd(), "data", "signals.json"), "utf-8");
    const items = JSON.parse(raw) || [];
    for (const it of items) {
      const id = String(it?.id || "").replace(/^\//, "");
      if (id) push(`/signals/${id}`);
    }
  } catch {
    // không có cũng không sao
  }

  // 4) Khử trùng lặp & xuất XML
  const seen = new Set();
  const list = urls.filter((u) => !seen.has(u.loc) && (seen.add(u.loc), true));

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    list
      .map(
        (u) =>
          `<url><loc>${u.loc}</loc>` +
          (u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ``) +
          `<changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`
      )
      .join("\n") +
    `\n</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
  res.write(xml);
  res.end();
  return { props: {} };
}

export default function SiteMap() {
  return null;
}
