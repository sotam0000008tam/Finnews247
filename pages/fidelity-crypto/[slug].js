// pages/fidelity-crypto/[slug].js
import fs from "fs";
import path from "path";
import Link from "next/link";
import { NextSeo } from "next-seo";

/* ===== Helpers chung ===== */
function stripHtml(html = "") {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function truncate(s = "", n = 160) {
  if (s.length <= n) return s;
  const cut = s.slice(0, n);
  const i = cut.lastIndexOf(" ");
  return (i > 80 ? cut.slice(0, i) : cut) + "…";
}
function extractFirstImage(html = "") {
  const m = html?.match?.(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
}
function pickThumb(p) {
  if (p?.thumb) return p.thumb;
  if (p?.ogImage) return p.ogImage;
  if (p?.image) return p.image;
  return extractFirstImage(p?.content || p?.body || "") || "/images/dummy/altcoins64.jpg";
}
function parseDate(d) {
  const t = Date.parse(d);
  return isNaN(t) ? 0 : t;
}
function buildUrl(p) {
  if (p?.href) return p.href;
  const slug = p?.slug;
  if (!slug) return "#";
  const c = String(p?.category || "").toLowerCase();

  // Fidelity-specific
  if (c.includes("fidelity")) return `/fidelity-crypto/${slug}`;
  // Exchanges chung
  if (c.includes("exchange")) return `/crypto-exchanges/${slug}`;
  // Các nhóm khác
  if (c.includes("altcoin") || c.includes("sec coin") || c.includes("seccoin"))
    return `/altcoins/${slug}`;
  if (c.includes("wallet") || c.includes("app")) return `/best-crypto-apps/${slug}`;
  if (c.includes("insurance")) return `/crypto-insurance/${slug}`;
  if (c.includes("tax") || c.includes("compliance")) return `/crypto-tax/${slug}`;
  if (c.includes("market")) return `/market/${slug}`;
  if (c.includes("guide") || c.includes("review")) return `/guides/${slug}`;
  // fallback theo ngữ cảnh Fidelity
  return `/fidelity-crypto/${slug}`;
}

/* ===== Item nhỏ trong sidebar ===== */
function SideItem({ item }) {
  const url = buildUrl(item);
  const img = pickThumb(item);
  return (
    <Link
      href={url}
      className="group flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
    >
      <img
        src={img}
        alt={item?.title || "post"}
        className="w-10 h-10 rounded-md object-cover shrink-0"
        loading="lazy"
      />
      <div className="min-w-0">
        <div className="text-sm leading-snug line-clamp-2 group-hover:underline">
          {item?.title || "Untitled"}
        </div>
        {item?.date && <div className="text-xs text-gray-500">{item.date}</div>}
      </div>
    </Link>
  );
}

/* ===== Page ===== */
export default function FidelityPost({ post, related = [], latest = [] }) {
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-semibold mb-6">404 - Not Found</h1>
        <p>The article you are looking for does not exist.</p>
      </div>
    );
  }

  const title = `${post.title} | FinNews247`;
  const description =
    (post.excerpt && post.excerpt.trim()) ||
    truncate(stripHtml(post.content || post.body || ""), 160);
  const canonical = `https://www.finnews247.com/fidelity-crypto/${post.slug}`;
  const ogImage =
    post.ogImage || post.image || extractFirstImage(post.content || post.body || "");

  return (
    <div className="container mx-auto px-4 py-6">
      <NextSeo
        title={title}
        description={description}
        canonical={canonical}
        openGraph={{
          title,
          description,
          url: canonical,
          images: ogImage ? [{ url: ogImage }] : undefined,
        }}
      />

      {/* 2 cột: bài viết + sidebar */}
      <div className="grid md:grid-cols-12 gap-8">
        {/* Bài viết */}
        <article className="md:col-span-8 prose lg:prose-xl max-w-none">
          <h1>{post.title}</h1>
          {post.date && <p className="text-sm text-gray-500">{post.date}</p>}
          {post.image && (
            <div className="article-hero my-4">
              <img src={post.image} alt={post.title} loading="lazy" />
            </div>
          )}
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>

        {/* Sidebar: Related in Exchanges + Latest */}
        <aside className="md:col-span-4 w-full sticky top-24 self-start space-y-6">
          <section>
            <h3 className="text-sm font-semibold mb-2">Related in Exchanges</h3>
            {related.length ? (
              <ul className="space-y-1">
                {related.map((it) => (
                  <li key={(it.slug || it.title) + "-rel"}>
                    <SideItem item={it} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-xs text-gray-500">No related posts.</div>
            )}
          </section>

          <section>
            <h3 className="text-sm font-semibold mb-2">Latest on FinNews247</h3>
            {latest.length ? (
              <ul className="space-y-1">
                {latest.map((it) => (
                  <li key={(it.slug || it.title) + "-latest"}>
                    <SideItem item={it} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-xs text-gray-500">No recent posts.</div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}

/* ===== SSR: đọc dữ liệu + chọn Related/Latest ===== */
export async function getServerSideProps({ params }) {
  const dataDir = path.join(process.cwd(), "data");
  const readJson = (file) =>
    JSON.parse(fs.readFileSync(path.join(dataDir, file), "utf-8"));

  // Nhóm chính cho Fidelity page
  const fidelity = readJson("fidelity.json").map((p) => ({
    ...p,
    category: (p.category || "fidelity").toLowerCase().includes("fidelity")
      ? p.category
      : "fidelity",
  }));

  // Nhóm Exchanges còn lại (để làm related pool mở rộng)
  const cryptoexchanges = readJson("cryptoexchanges.json").map((p) => ({
    ...p,
    category: (p.category || "exchanges"),
  }));

  // Nhóm khác để lấy "latest"
  const altcoins = readJson("altcoins.json");
  const seccoin = readJson("seccoin.json");
  const apps = readJson("bestapps.json");
  const insurance = readJson("insurance.json");
  const tax = readJson("tax.json");
  const news = readJson("news.json");
  const guides = readJson("guides.json");

  // Tập cho related: Fidelity + các bài Exchanges chung
  const relatedPoolBase = [...fidelity, ...cryptoexchanges];

  // Tập cho latest: toàn site
  const all = [
    ...relatedPoolBase,
    ...altcoins,
    ...seccoin,
    ...apps,
    ...insurance,
    ...tax,
    ...news,
    ...guides,
  ];

  const post =
    fidelity.find((p) => p.slug === params.slug) || null;

  if (!post) return { props: { post: null } };

  // --- Related trong Exchanges (Fidelity + Exchanges), ưu tiên trùng tag/keywords nếu có ---
  const currentTags = (post.tags || post.keywords || []).map((t) =>
    String(t).toLowerCase()
  );
  const tagSet = new Set(currentTags);

  let relatedPool = relatedPoolBase.filter((p) => p.slug && p.slug !== post.slug);

  if (currentTags.length) {
    relatedPool = relatedPool
      .map((p) => {
        const tags = (p.tags || p.keywords || []).map((t) =>
          String(t).toLowerCase()
        );
        const score = tags.filter((t) => tagSet.has(t)).length;
        return { p, s: score, d: parseDate(p.date || p.updatedAt) };
      })
      .sort((a, b) => (b.s !== a.s ? b.s - a.s : b.d - a.d))
      .map(({ p }) => p);
  } else {
    relatedPool = relatedPool.sort(
      (a, b) => parseDate(b.date || b.updatedAt) - parseDate(a.date || a.updatedAt)
    );
  }
  const related = relatedPool.slice(0, 6);

  // --- Latest toàn site (trừ bài hiện tại + các bài đã nằm trong related) ---
  const relatedSlugs = new Set(related.map((r) => r.slug));
  const latest = all
    .filter((p) => p?.slug && p.slug !== post.slug && !relatedSlugs.has(p.slug))
    .sort(
      (a, b) => parseDate(b.date || b.updatedAt) - parseDate(a.date || a.updatedAt)
    )
    .slice(0, 8);

  return { props: { post, related, latest } };
}
