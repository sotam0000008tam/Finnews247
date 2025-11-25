// pages/insurance/[slug].js
import ArticleSeo from "../../components/ArticleSeo";
import ArticleHero from "../../components/ArticleHero";
import RiskDisclaimer from "../../components/RiskDisclaimer";
import TableOfContents from "../../components/TableOfContents";
import fs from "fs";
import path from "path";
import Link from "next/link";

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

const pickThumb = (p, fallback = "/images/dummy/altcoins64.jpg") =>
  p?.thumb ||
  p?.ogImage ||
  p?.image ||
  firstImage(p?.content || p?.body || "") ||
  fallback;

const buildHref = (p) => {
  if (!p) return "#";
  if (p.href) return p.href;
  const slug = String(p.slug || "").replace(/^\//, "");
  if (!slug) return "#";
  const cat = String(p._cat || p.category || "").toLowerCase();

  if (cat.includes("altcoin")) return `/altcoins/${slug}`;
  if (cat.includes("sec-coin") || cat.includes("sec coin") || cat.includes("seccoin"))
    return `/altcoins/${slug}`;
  if (cat.includes("exchange") || cat.includes("fidelity"))
    return `/crypto-exchanges/${slug}`;
  if (cat.includes("app") || cat.includes("wallet"))
    return `/best-crypto-apps/${slug}`;
  if (cat.includes("insurance") || cat.includes("tax"))
    return `/insurance/${slug}`;
  if (cat.includes("market") || cat.includes("news") || cat.includes("crypto-market"))
    return `/crypto-market/${slug}`;
  if (cat.includes("guide") || cat.includes("review"))
    return `/guides/${slug}`;
  return `/guides/${slug}`;
};

function guessAuthor(post) {
  const direct =
    post.author ||
    post.authorName ||
    post.author_name ||
    post.by ||
    post.byline ||
    post?.meta?.author ||
    post?.source?.author ||
    "";

  if (direct && String(direct).trim()) return String(direct).trim();

  // fallback an toàn
  return "FinNews247 Editorial Team";
}

function SideMiniItem({ item }) {
  const href = buildHref(item);
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
          <div className="text-xs text-gray-500 mt-0.5">
            {item?.date || item?.updatedAt}
          </div>
        )}
      </div>
    </Link>
  );
}

function RelatedCard({ item }) {
  const href = buildHref(item);
  const img = pickThumb(item);

  return (
    <Link
      href={href}
      className="group block rounded-xl overflow-hidden border bg-white dark:bg-gray-900 hover:shadow-md transition"
    >
      {img && (
        <img
          src={img}
          alt={item?.title || "post"}
          className="w-full h-40 object-cover"
          loading="lazy"
        />
      )}
      <div className="p-3">
        <div className="font-semibold leading-snug line-clamp-2 group-hover:underline">
          {item?.title || "Untitled"}
        </div>
        {(item?.date || item?.updatedAt) && (
          <div className="text-xs text-gray-500 mt-1">
            {item?.date || item?.updatedAt}
          </div>
        )}
        {item?.excerpt && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-4">
            {stripHtml(item.excerpt).slice(0, 250)}
            {stripHtml(item.excerpt).length > 250 ? "…" : ""}
          </p>
        )}
      </div>
    </Link>
  );
}

/* ===== Page component ===== */
export default function InsuranceTaxPost({
  post,
  related = [],
  latest = [],
}) {
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-6 container-1600">
        <h1 className="text-2xl font-bold mb-3">404 - Not Found</h1>
        <p>The article you are looking for does not exist.</p>
      </div>
    );
  }

  const hero = pickThumb(post, "/images/dummy/altcoins64.jpg");
  const pathForSeo = `/insurance/${String(post.slug || "").replace(/^\//, "")}`;
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

  const latestSorted = [...(latest || [])].sort(
    (a, b) =>
      (Date.parse(b.date || b.updatedAt || "") || 0) -
      (Date.parse(a.date || a.updatedAt || "") || 0)
  );

  return (
    <>
      <ArticleSeo post={post} path={pathForSeo} />

      <div className="container mx-auto px-4 py-6 container-1600">
        <nav className="text-sm text-gray-500 mb-4">
          <Link href="/">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/insurance">Insurance &amp; Tax</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 dark:text-gray-300 line-clamp-1">
            {post.title}
          </span>
        </nav>

        <div className="grid md:grid-cols-12 gap-8">
          {/* Main article */}
          <article className="md:col-span-9">
            <h1 className="text-2xl md:text-3xl font-bold">{post.title}</h1>

            {(post.date || post.updatedAt) && (
              <p className="text-sm text-gray-500 mt-1">
                {post.date || post.updatedAt}
              </p>
            )}

            <div className="mt-2 mb-3 flex justify-end">
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wide text-gray-500">
                  Written by:
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3.5 h-3.5"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" />
                  </svg>
                  <span className="font-medium">{author}</span>
                </span>
              </div>
            </div>

            {hero && <ArticleHero src={hero} alt={post.title} />}

            {/* Risk disclaimer + table of contents */}
            <RiskDisclaimer />
            <TableOfContents />

            <div
              className="prose lg:prose-lg post-body max-w-none"
              dangerouslySetInnerHTML={{
                __html: post.content || post.body || "",
              }}
            />

            {related && related.length > 0 && (
              <div className="mt-10 border-t pt-6">
                <h2 className="text-lg font-semibold mb-4">
                  Related insurance &amp; tax articles
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {related.map((it) => (
                    <RelatedCard
                      key={it.slug || it.title || Math.random().toString(36)}
                      item={it}
                    />
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar (không còn Trading Signals, chỉ Latest) */}
          <aside className="md:col-span-3 w-full sticky top-24 self-start space-y-6 sidebar-scope">
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
                  <li className="px-4 py-3 text-xs text-gray-500">
                    No recent posts.
                  </li>
                )}
              </ul>
            </section>
          </aside>
        </div>
      </div>

      {/* Đảm bảo ảnh trong sidebar không bị CSS global khác làm méo */}
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

  // Gộp insurance + tax làm nguồn chính
  const own = []
    .concat(read("insurance.json"), read("tax.json"))
    .filter(Boolean)
    .flat();

  const slug = String(params?.slug || "").toLowerCase();
  const post =
    own.find(
      (p) =>
        String(p.slug || "")
          .toLowerCase()
          .replace(/^\//, "") === slug
    ) || null;

  if (!post) {
    return { notFound: true };
  }

  // Related: ưu tiên cùng tag, cùng chủ đề
  const normalize = (v) => String(v || "").toLowerCase();
  const postTags = new Set(
    (post.tags || post.keywords || []).map((t) => normalize(t))
  );

  const relatedCandidates = own.filter(
    (p) =>
      String(p.slug || "")
        .toLowerCase()
        .replace(/^\//, "") !== slug
  );

  const scored = relatedCandidates.map((p) => {
    const tags = (p.tags || p.keywords || []).map((t) => normalize(t));
    const overlap = tags.filter((t) => postTags.has(t)).length;
    const timeScore =
      (Date.parse(p.date || p.updatedAt || "") || 0) / 86400000;
    const score = overlap * 10 + timeScore;
    return { p, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const related = scored.map((x) => x.p).slice(0, 4);

  // Latest sidebar: lấy từ nhiều nhóm nội dung chính
  const groups = {
    "crypto-market": ["news.json"],
    altcoins: ["altcoins.json", "seccoin.json"],
    "crypto-exchanges": ["cryptoexchanges.json", "fidelity.json"],
    "best-crypto-apps": ["bestapps.json"],
    insurance: ["insurance.json"],
    guides: ["guides.json"],
  };

  const byCat = {};
  for (const [cat, files] of Object.entries(groups)) {
    const arr = files
      .flatMap((f) => read(f) || [])
      .map((p) => ({ ...p, _cat: cat }));
    arr.sort(
      (a, b) =>
        (Date.parse(b.date || b.updatedAt) || 0) -
        (Date.parse(a.date || a.updatedAt) || 0)
    );
    byCat[cat] = arr;
  }

  const LATEST_LIMIT = 10;
  const seen = new Set([post.slug, ...related.map((r) => r.slug)]);
  const coverage = [];

  for (const cat of Object.keys(groups)) {
    const pick = byCat[cat]?.find((x) => x?.slug && !seen.has(x.slug));
    if (pick) {
      seen.add(pick.slug);
      coverage.push(pick);
    }
  }

  const poolAll = Object.values(byCat).flat();
  const rest = poolAll.filter((x) => x?.slug && !seen.has(x.slug));
  rest.sort(
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

  return {
    props: { post, related, latest },
  };
}
