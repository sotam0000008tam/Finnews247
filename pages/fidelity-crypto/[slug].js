// pages/fidelity-crypto/[slug].js
import fs from "fs";
import path from "path";
import Link from "next/link";
import { NextSeo } from "next-seo";

<<<<<<< HEAD
/* ===== Helpers chung ===== */
function stripHtml(html = "") {
  return html
=======
/* Helpers */
const stripHtml = (html = "") =>
  String(html)
>>>>>>> 310b096 (feat: sidebar/pages + link check config; chore: .gitignore; rm tracked sitemap)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
<<<<<<< HEAD
}
function truncate(s = "", n = 160) {
=======

const truncate = (s = "", n = 160) => {
  if (!s) return "";
>>>>>>> 310b096 (feat: sidebar/pages + link check config; chore: .gitignore; rm tracked sitemap)
  if (s.length <= n) return s;
  const cut = s.slice(0, n);
  const i = cut.lastIndexOf(" ");
  return (i > 80 ? cut.slice(0, i) : cut) + "…";
<<<<<<< HEAD
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
=======
};

const firstImg = (html = "") => {
  const m = String(html).match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
};
const pickThumb = (p) =>
  p?.thumb ||
  p?.ogImage ||
  p?.image ||
  firstImg(p?.content || p?.body || "") ||
  "/images/dummy/exchanges64.jpg";

/* Map URL theo category/_cat để tránh 404 ở Sidebar/Latest */
const buildUrl = (p) => {
  const slug = p?.slug;
  if (!slug) return "#";
  const c = String(p?._cat || p?.category || "").toLowerCase();
  if (c.includes("market") || c.includes("news")) return `/crypto-market/${slug}`;
  if (c.includes("altcoin") || c.includes("sec coin") || c.includes("seccoin")) return `/altcoins/${slug}`;
  if (c.includes("exchange") || c.includes("fidelity")) return `/crypto-exchanges/${slug}`;
  if (c.includes("wallet") || c.includes("app")) return `/best-crypto-apps/${slug}`;
  if (c.includes("insurance") || c.includes("tax")) return `/insurance/${slug}`;
  if (c.includes("guide") || c.includes("review")) return `/guides/${slug}`;
  return `/crypto-exchanges/${slug}`;
};

/** Tác giả */
function guessAuthor(post) {
  const direct =
    post.author ||
    post.authorName ||
    post.author_name ||
    post.writer ||
    post.by ||
    post.byline ||
    post.credit ||
    post?.meta?.author ||
    post?.source?.author ||
    "";
  if (String(direct).trim()) return String(direct).trim();

  const raw = String(post.content || post.body || "");
  const m =
    raw.match(/(?:written\s+by|by)\s+([A-Z][\w .'-]{2,60})/i) ||
    raw.match(/作者[:：]\s*([^\n<]+)/i);
  if (m && m[1]) return m[1].trim().replace(/\s{2,}/g, " ");
  return "FinNews247 Team";
}

function SideMiniItem({ item }) {
  const href = buildUrl(item);
  const img = pickThumb(item);
  return (
    <Link href={href} className="group flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
      <img
        src={img}
        alt={item?.title || "post"}
        className="w-[45px] h-[45px] rounded-md object-cover border dark:border-gray-700 shrink-0"
>>>>>>> 310b096 (feat: sidebar/pages + link check config; chore: .gitignore; rm tracked sitemap)
        loading="lazy"
      />
      <div className="min-w-0">
        <div className="text-sm leading-snug line-clamp-2 group-hover:underline">
          {item?.title || "Untitled"}
        </div>
<<<<<<< HEAD
        {item?.date && <div className="text-xs text-gray-500">{item.date}</div>}
=======
        {(item?.date || item?.updatedAt) && (
          <div className="text-xs text-gray-500 mt-0.5">
            {item?.date || item?.updatedAt}
          </div>
        )}
>>>>>>> 310b096 (feat: sidebar/pages + link check config; chore: .gitignore; rm tracked sitemap)
      </div>
    </Link>
  );
}

<<<<<<< HEAD
/* ===== Page ===== */
=======
>>>>>>> 310b096 (feat: sidebar/pages + link check config; chore: .gitignore; rm tracked sitemap)
export default function FidelityPost({ post, related = [], latest = [] }) {
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-6">
<<<<<<< HEAD
        <h1 className="text-3xl font-semibold mb-6">404 - Not Found</h1>
=======
        <h1 className="text-2xl font-bold mb-3">404 - Not Found</h1>
>>>>>>> 310b096 (feat: sidebar/pages + link check config; chore: .gitignore; rm tracked sitemap)
        <p>The article you are looking for does not exist.</p>
      </div>
    );
  }

<<<<<<< HEAD
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
=======
  // Canonical về /crypto-exchanges/{slug} để hợp nhất content
  const canonical = `https://www.finnews247.com/crypto-exchanges/${post.slug}`;
  const title = `${post.title} | FinNews247`;
  const description = (post.excerpt && post.excerpt.trim()) || truncate(stripHtml(post.content || post.body || ""), 160);
  const ogImage = post.ogImage || post.image || firstImg(post.content || post.body || "") || "https://www.finnews247.com/logo.png";
  const hero = post.image || ogImage || firstImg(post.content || post.body || "");
  const author = guessAuthor(post);

  return (
    <>
      <NextSeo title={title} description={description} canonical={canonical} openGraph={{ title, description, url: canonical, images: [{ url: ogImage }] }} />

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4">
          <Link href="/">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/crypto-exchanges">Exchanges</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 dark:text-gray-300 line-clamp-1">{post.title}</span>
        </nav>

        <div className="grid md:grid-cols-12 gap-8">
          <article className="md:col-span-9">
            <h1 className="text-2xl md:text-3xl font-bold">{post.title}</h1>
            {(post.date || post.updatedAt) && (
              <p className="text-sm text-gray-500">{post.date || post.updatedAt}</p>
            )}

            {/* Author badge trên phải trước ảnh (ngoài ảnh) */}
            <div className="mt-2 mb-1 flex justify-end">
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wide text-gray-500">Written by:</span>
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor" aria-hidden="true">
                    <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" />
                  </svg>
                  <span className="font-medium">{author}</span>
                </span>
              </div>
            </div>

            {hero && (
              <div className="article-hero my-3">
                <img src={hero} alt={post.title} loading="lazy" />
              </div>
            )}

            <div
              className="prose lg:prose-xl max-w-none post-body"
              dangerouslySetInnerHTML={{ __html: post.content || post.body || "" }}
            />

            {/* More */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">More from Exchanges</h3>
                <Link href="/crypto-exchanges" className="text-sm text-sky-600 hover:underline">View all</Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(related || []).slice(0, 6).map((it) => (
                  <Link key={it.slug} href={buildUrl(it)} className="block rounded-lg border p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <img
                      src={pickThumb(it)}
                      alt={it.title}
                      className="w-full h-40 object-cover rounded-md mb-2"
                      loading="lazy"
                    />
                    <div className="font-medium line-clamp-2">{it.title}</div>
                  </Link>
                ))}
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="md:col-span-3 w-full sticky top-24 self-start space-y-6 sidebar-scope">
            <section className="rounded-xl border bg-white dark:bg-gray-900 overflow-hidden">
              <div className="px-4 py-3 border-b dark:border-gray-700">
                <h3 className="text-sm font-semibold">Latest on FinNews247</h3>
              </div>
              <ul className="divide-y dark:divide-gray-800">
                {latest.length ? (
                  latest.map((it) => (
                    <li key={(it.slug || it.title) + "-latest"}>
                      <SideMiniItem item={it} />
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-3 text-xs text-gray-500">No recent posts.</li>
                )}
              </ul>
            </section>
          </aside>
        </div>
      </div>

      <style jsx global>{`
        .sidebar-scope img {
          width: 45px !important;
          height: 45px !important;
          max-width: none !important;
          object-fit: cover !important;
          border-radius: 8px !important;
          display: block !important;
        }
      `}</style>
    </>
>>>>>>> 310b096 (feat: sidebar/pages + link check config; chore: .gitignore; rm tracked sitemap)
  );
}

/* ===== SSR: đọc dữ liệu + chọn Related/Latest ===== */
export async function getServerSideProps({ params }) {
<<<<<<< HEAD
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
=======
  const read = (f) => {
    try { return JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", f), "utf-8")); }
    catch { return []; }
  };

  // Hợp nhất fidelity + cryptoexchanges để tìm bài và liên quan
  const pool = [].concat(read("fidelity.json"), read("cryptoexchanges.json")).filter(Boolean);
  const post = pool.find((p) => (p.slug || "").toLowerCase() === (params.slug || "").toLowerCase()) || null;
  if (!post) return { notFound: true };

  const related = pool.filter((p) => p.slug && p.slug !== post.slug).slice(0, 8);

  // latest: mix nhiều category + thêm _cat để buildUrl() map đúng route
  const market = read("news.json").map((p) => ({ ...p, _cat: "crypto-market" }));
  const alt = [].concat(read("altcoins.json"), read("seccoin.json")).map((p) => ({ ...p, _cat: "altcoins" }));
  const ex = pool.map((p) => ({ ...p, _cat: "crypto-exchanges" }));
  const apps = read("bestapps.json").map((p) => ({ ...p, _cat: "best-crypto-apps" }));
  const ins = read("insurance.json").map((p) => ({ ...p, _cat: "insurance" }));
  const guides = read("guides.json").map((p) => ({ ...p, _cat: "guides" }));

  const used = new Set(related.map((r) => r.slug).concat(post.slug));
  const poolLatest = [...market, ...alt, ...ex, ...apps, ...ins, ...guides].filter((x) => x?.slug && !used.has(x.slug));
  const seen = new Set();
  const latest = poolLatest
    .filter((p) => { if (seen.has(p.slug)) return false; seen.add(p.slug); return true; })
    .sort((a, b) => (Date.parse(b.date || b.updatedAt) || 0) - (Date.parse(a.date || a.updatedAt) || 0))
    .slice(0, 10);
>>>>>>> 310b096 (feat: sidebar/pages + link check config; chore: .gitignore; rm tracked sitemap)

  return { props: { post, related, latest } };
}
