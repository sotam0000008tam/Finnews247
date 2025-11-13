// pages/best-crypto-apps/[slug].jsx
import fs from "fs";
import path from "path";
import Link from "next/link";
import ArticleSeo from "../../components/ArticleSeo";
import ArticleHero from "../../components/ArticleHero";

/* ===== Helpers ===== */
const stripHtml = (html = "") =>
  String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const firstImage = (html = "") =>
  (String(html).match(/<img[^>]+src=["']([^"']+)["']/i) || [])[1] || null;

const pickThumb = (p, f = "/images/dummy/altcoins64.jpg") =>
  p?.thumb || p?.ogImage || p?.image || firstImage(p?.content || p?.body || "") || f;

/* Map URL theo _cat/category — giống Altcoin */
const buildUrl = (p) => {
  if (p?.href) return p.href;
  const s = String(p?.slug || "").replace(/^\//, "");
  if (!s) return "#";
  const c = String(p?._cat || p?.category || "").toLowerCase();

  if (c.includes("sec-coin") || c.includes("sec coin") || c.includes("seccoin")) return `/altcoins/${s}`;
  if (c.includes("altcoin")) return `/altcoins/${s}`;
  if (c.includes("fidelity")) return `/crypto-exchanges/${s}`;
  if (c.includes("exchange")) return `/crypto-exchanges/${s}`;
  if (c.includes("app") || c.includes("wallet")) return `/best-crypto-apps/${s}`;
  if (c.includes("insurance")) return `/insurance/${s}`;
  if (c.includes("guide") || c.includes("review")) return `/guides/${s}`;
  if (c.includes("market") || c.includes("news") || c.includes("crypto-market")) return `/crypto-market/${s}`;
  return `/guides/${s}`;
};

/* Guess author */
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
  return m && m[1] ? m[1].trim().replace(/\s{2,}/g, " ") : "FinNews247 Team";
}

/* Trading Signals (compact) */
const prettyType = (t = "") => (String(t).toLowerCase() === "long" ? "Long" : "Short");
const typeColor = (t = "") =>
  String(t).toLowerCase() === "long"
    ? "bg-green-100 text-green-700 ring-green-200"
    : "bg-red-100 text-red-700 ring-red-200";

function TradingSignalsCompact({ items = [] }) {
  return (
    <section className="rounded-xl border bg-white dark:bg-gray-900 overflow-hidden">
      <div className="px-4 py-3 border-b dark:border-gray-800">
        <h3 className="text-sm font-semibold">📈 Trading Signals</h3>
      </div>

      {items.length === 0 ? (
        <div className="px-4 py-3 text-xs text-gray-500">No signals.</div>
      ) : (
        <ul className="divide-y dark:divide-gray-800">
          {items.map((s) => (
            <li key={s.id}>
              <Link
                href={`/signals/${s.id}`}
                className="block px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium truncate">
                    {s.pair || s.title}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ring-1 ${typeColor(s.type)}`}
                  >
                    {prettyType(s.type)}
                  </span>
                  {s.date && (
                    <span className="ml-auto text-[11px] text-gray-500">
                      {s.date}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="px-3 py-2">
        <Link href="/signals" className="text-sm text-sky-600 hover:underline">
          View all signals →
        </Link>
      </div>
    </section>
  );
}

/* Sidebar mini item (45x45) */
function SideMiniItem({ item }) {
  const href = buildUrl(item);
  const img = pickThumb(item);
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
    >
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
          <div className="text-xs text-gray-500 mt-0.5">{item?.date || item?.updatedAt}</div>
        )}
      </div>
    </Link>
  );
}

/* ===== PAGE ===== */
export default function BestAppsPostPage({ post, related = [], latest = [], signalsLatest = [] }) {
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-3">404 - Not Found</h1>
        <p>The article you are looking for does not exist.</p>
      </div>
    );
  }

  // 👉 Đường dẫn cho SEO để ArticleSeo tạo canonical/OG/JSON-LD chính xác (@type=Article)
  const pathForSeo = `/best-crypto-apps/${post.slug}`;

  const hero =
    post.image || post.ogImage || firstImage(post.content || post.body || "");

  const author =
    (
      post.author ||
      post.authorName ||
      post.author_name ||
      post.by ||
      post.byline ||
      post?.meta?.author ||
      post?.source?.author ||
      ""
    ).trim() || guessAuthor(post);

  // Sắp xếp latest mới → cũ
  const latestSorted = [...(latest || [])].sort(
    (a, b) =>
      (Date.parse(b.date || b.updatedAt || "") || 0) -
      (Date.parse(a.date || a.updatedAt || "") || 0)
  );

  return (
    <>
      {/* ✅ SEO theo bài: ảnh OG tuyệt đối, JSON-LD Article */}
      <ArticleSeo post={post} path={pathForSeo} />

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4">
          <Link href="/">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/best-crypto-apps">Best Crypto Apps</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 dark:text-gray-300 line-clamp-1">{post.title}</span>
        </nav>

        <div className="grid md:grid-cols-12 gap-8">
          {/* MAIN */}
          <article className="md:col-span-9">
            <h1 className="text-2xl md:text-3xl font-bold">{post.title}</h1>
            {(post.date || post.updatedAt) && (
              <p className="text-sm text-gray-500">{post.date || post.updatedAt}</p>
            )}

            {/* Author pill */}
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

            {/* ✅ HERO tối ưu LCP */}
            {hero && <ArticleHero src={hero} alt={post.title} />}

            {/* Content */}
            <div
              className="prose lg:prose-xl max-w-none post-body"
              dangerouslySetInnerHTML={{ __html: post.content || post.body || "" }}
            />

            {/* More from Best Crypto Apps */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">More from Best Crypto Apps</h3>
                <Link href="/best-crypto-apps" className="text-sm text-sky-600 hover:underline">
                  View all
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(related || []).slice(0, 6).map((it) => (
                  <Link
                    key={it.slug}
                    href={`/best-crypto-apps/${it.slug}`}
                    className="block rounded-lg border p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
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

          {/* SIDEBAR */}
          <aside className="md:col-span-3 w-full sticky top-24 self-start space-y-6 sidebar-scope">
            <TradingSignalsCompact items={signalsLatest} />

            <section className="rounded-xl border bg-white dark:bg-gray-900 overflow-hidden">
              <div className="px-4 py-3 border-b dark:border-gray-700">
                <h3 className="text-sm font-semibold">Latest on FinNews247</h3>
              </div>
              <ul className="divide-y dark:divide-gray-800">
                {latestSorted.length ? (
                  latestSorted.map((it) => (
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

      {/* Ép thumbnail sidebar 45x45 */}
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

/* ===== GSSP ===== */
export async function getServerSideProps({ params }) {
  const read = (file) => {
    try {
      const p = path.join(process.cwd(), "data", file);
      return JSON.parse(fs.readFileSync(p, "utf-8"));
    } catch {
      return [];
    }
  };

  const own = [].concat(read("bestapps.json")).filter(Boolean).flat();

  const post =
    own.find(
      (p) => (p.slug || "").toLowerCase() === (params.slug || "").toLowerCase()
    ) || null;
  if (!post) return { notFound: true };

  // Related theo tag/date
  const currentTags = (post.tags || post.keywords || []).map((t) => String(t).toLowerCase());
  const tagSet = new Set(currentTags);
  let relatedPool = own.filter((p) => p.slug && p.slug !== post.slug);
  if (currentTags.length) {
    relatedPool = relatedPool
      .map((p) => {
        const tags = (p.tags || p.keywords || []).map((t) => String(t).toLowerCase());
        const score = tags.filter((t) => tagSet.has(t)).length;
        const d = Date.parse(p.date || p.updatedAt) || 0;
        return { p, s: score, d };
      })
      .sort((a, b) => (b.s !== a.s ? b.s - a.s : b.d - a.d))
      .map(({ p }) => p);
  } else {
    relatedPool = relatedPool.sort(
      (a, b) =>
        (Date.parse(b.date || b.updatedAt) || 0) -
        (Date.parse(a.date || a.updatedAt) || 0)
    );
  }
  const related = relatedPool.slice(0, 8);

  /* Latest: phủ mỗi chuyên mục */
  const cats = [
    "crypto-market",
    "altcoins",
    "crypto-exchanges",
    "best-crypto-apps",
    "insurance",
    "guides",
    "fidelity",
    "sec-coin",
  ];

  const fileForCat = (c) =>
    (c === "crypto-exchanges"
      ? "cryptoexchanges"
      : c === "best-crypto-apps"
      ? "bestapps"
      : c === "sec-coin"
      ? "seccoin"
      : c === "crypto-market"
      ? "news"
      : c) + ".json";

  const byCat = {};
  for (const c of cats) {
    const arr = (read(fileForCat(c)) || []).map((p) => ({ ...p, _cat: c }));
    arr.sort(
      (a, b) =>
        (Date.parse(b.date || b.updatedAt) || 0) -
        (Date.parse(a.date || a.updatedAt) || 0)
    );
    byCat[c] = arr;
  }

  const LATEST_LIMIT = 10;
  const seen = new Set([post.slug, ...related.map((r) => r.slug)]);
  const coverage = [];

  for (const c of cats) {
    const top = byCat[c]?.find((x) => x?.slug && !seen.has(x.slug));
    if (top) {
      seen.add(top.slug);
      coverage.push(top);
    }
  }

  const poolAll = cats.flatMap((c) => byCat[c] || []);
  const rest = poolAll
    .filter((p) => p?.slug && !seen.has(p.slug))
    .sort(
      (a, b) =>
        (Date.parse(b.date || b.updatedAt) || 0) -
        (Date.parse(a.date || a.updatedAt) || 0)
    );

  const latestRaw = coverage.concat(rest).slice(0, LATEST_LIMIT);
  const latest = latestRaw.sort(
    (a, b) =>
      (Date.parse(b.date || b.updatedAt) || 0) -
      (Date.parse(a.date || a.updatedAt) || 0)
  );

  const { latestSignals } = await import("../../lib/sidebar.server");
  const signalsLatest = latestSignals(5);

  return { props: { post, related, latest, signalsLatest } };
}
