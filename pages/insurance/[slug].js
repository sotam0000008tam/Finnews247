// pages/insurance/[slug].js
import fs from "fs";
import path from "path";
import Link from "next/link";
import { NextSeo } from "next-seo";

/* Helpers */
const stripHtml = (html = "") =>
  String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const truncate = (s = "", n = 160) => {
  if (s.length <= n) return s;
  const cut = s.slice(0, n);
  const i = cut.lastIndexOf(" ");
  return (i > 80 ? cut.slice(0, i) : cut) + "…";
};

const firstImg = (html = "") => {
  const m = String(html).match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
};
const pickThumb = (p) =>
  p?.thumb || p?.ogImage || p?.image || firstImg(p?.content || p?.body || "") || "/images/dummy/insurance64.jpg";

const buildUrl = (p) => `/insurance/${p.slug}`;

/* ===== Dò tên tác giả (ưu tiên data, fallback đoán trong content) ===== */
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
  if (direct && String(direct).trim()) return String(direct).trim();

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
        loading="lazy"
      />
      <div className="min-w-0">
        <div className="text-sm leading-snug line-clamp-2 group-hover:underline">
          {item?.title || "Untitled"}
        </div>
        {(item?.date || item?.updatedAt) && (
          <div className="text-xs text-gray-500 mt-0.5">
            {item?.date || item?.updatedAt}
          </div>
        )}
      </div>
    </Link>
  );
}

export default function DetailPage({ post, related = [], latest = [] }) {
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-3">404 - Not Found</h1>
        <p>The article you are looking for does not exist.</p>
      </div>
    );
  }

  const canonical = `https://www.finnews247.com/insurance/${post.slug}`;
  const title = `${post.title} | FinNews247`;
  const description =
    (post.excerpt && post.excerpt.trim()) ||
    truncate(stripHtml(post.content || post.body || ""), 160);
  const ogImage =
    post.ogImage ||
    post.image ||
    firstImg(post.content || post.body || "") ||
    "https://www.finnews247.com/logo.png";
  const hero = post.image || ogImage || firstImg(post.content || post.body || "");

  // tên tác giả: ưu tiên field trong data, nếu thiếu thì đoán từ nội dung
  const author =
    (post.author ||
      post.authorName ||
      post.author_name ||
      post.by ||
      post.byline ||
      post?.meta?.author ||
      post?.source?.author ||
      "").trim() || guessAuthor(post);

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        canonical={canonical}
        openGraph={{ title, description, url: canonical, images: [{ url: ogImage }] }}
      />

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4">
          <Link href="/">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/insurance">Insurance &amp; Tax</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 dark:text-gray-300 line-clamp-1">{post.title}</span>
        </nav>

        <div className="grid md:grid-cols-12 gap-8">
          {/* Main */}
          <article className="md:col-span-9">
            <h1 className="text-2xl md:text-3xl font-bold">{post.title}</h1>
            {(post.date || post.updatedAt) && (
              <p className="text-sm text-gray-500">{post.date || post.updatedAt}</p>
            )}

            {/* Author (góc phải, phía trên, ngoài ảnh) */}
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
                <h3 className="text-lg font-semibold">More from Insurance &amp; Tax</h3>
                <Link href="/insurance" className="text-sm text-sky-600 hover:underline">View all</Link>
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

      {/* Sidebar clamp */}
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
  );
}

export async function getServerSideProps({ params }) {
  const read = (f) => {
    try { return JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", f), "utf-8")); }
    catch { return []; }
  };

  const pool = read("insurance.json").filter(Boolean);
  const post =
    pool.find((p) => (p.slug || "").toLowerCase() === (params.slug || "").toLowerCase()) || null;
  if (!post) return { notFound: true };

  const related = pool.filter((p) => p.slug && p.slug !== post.slug).slice(0, 8);

  // latest mix
  const market = read("news.json").map((p) => ({ ...p, _cat: "crypto-market" }));
  const alt = read("altcoins.json").map((p) => ({ ...p, _cat: "altcoins" }));
  const ex = [].concat(read("cryptoexchanges.json"), read("fidelity.json")).map((p) => ({ ...p, _cat: "crypto-exchanges" }));
  const apps = read("bestapps.json").map((p) => ({ ...p, _cat: "best-crypto-apps" }));
  const guides = read("guides.json").map((p) => ({ ...p, _cat: "guides" }));

  const used = new Set(related.map((r) => r.slug).concat(post.slug));
  const poolLatest = [...market, ...alt, ...ex, ...apps, ...guides].filter((x) => x?.slug && !used.has(x.slug));
  const seen = new Set();
  const latest = poolLatest
    .filter((p) => { if (seen.has(p.slug)) return false; seen.add(p.slug); return true; })
    .sort((a, b) => (Date.parse(b.date || b.updatedAt) || 0) - (Date.parse(a.date || a.updatedAt) || 0))
    .slice(0, 10);

  return { props: { post, related, latest } };
}
