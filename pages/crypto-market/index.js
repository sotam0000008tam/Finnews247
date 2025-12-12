// pages/crypto-market/index.js
import Link from "next/link";
import { NextSeo } from "next-seo";
import PostCard from "../../components/PostCard";

/* ===== Helpers ===== */
const stripHtml = (h = "") =>
  String(h)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const firstImage = (h = "") =>
  (String(h).match(/<img[^>]+src=["']([^"']+)["']/i) || [])[1] || null;

const pickThumb = (item = {}) =>
  item.image || firstImage(item.content || "") || null;

/*
 * Map a post (or slug) to its appropriate URL.  We do not always link to
 * `/crypto-market/${slug}` because some posts aggregated into the latest pool may
 * belong to other categories (altcoins, exchanges, apps, guides, etc.).  The
 * logic here mirrors the `hrefMixed` helper used on the paginated crypto‑market
 * pages (`/crypto-market/page/[page].js`) and on the individual article pages.
 * If a post provides an explicit `href` property we honour it; otherwise we
 * derive the link based on its category.  Default fallback is a guides URL.
 */
const hrefMixed = (p) => {
  if (!p) return "#";
  // If p is a simple string (slug) assume it's a crypto‑market slug
  if (typeof p === "string") {
    const slug = String(p).replace(/^\//, "");
    return slug ? `/crypto-market/${slug}` : "/crypto-market";
  }
  if (p.href) return p.href;
  const slug = String(p.slug || "").replace(/^\//, "");
  if (!slug) return "#";
  const cat = String(p._cat || p.category || "").toLowerCase();
  if (cat.includes("sec-coin") || cat.includes("sec coin") || cat.includes("seccoin"))
    return `/altcoins/${slug}`;
  if (cat.includes("altcoin")) return `/altcoins/${slug}`;
  if (cat.includes("fidelity") || cat.includes("exchange"))
    return `/crypto-exchanges/${slug}`;
  if (cat.includes("app") || cat.includes("wallet"))
    return `/best-crypto-apps/${slug}`;
  if (cat.includes("insurance") || cat.includes("tax")) return `/insurance/${slug}`;
  if (cat.includes("guide") || cat.includes("review")) return `/guides/${slug}`;
  if (cat.includes("market") || cat.includes("news") || cat.includes("crypto-market"))
    return `/crypto-market/${slug}`;
  return `/guides/${slug}`;
};

/* Sidebar mini item (dùng chung với Guides) */
function SideMiniItem({ item }) {
  const href = hrefMixed(item);
  const img = pickThumb(item);
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
    >
      {img && (
        <img
          src={img}
          alt={item?.title || "post"}
          className="w-[45px] h-[45px] rounded-md object-cover border dark:border-gray-700 shrink-0"
          loading="lazy"
        />
      )}
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

/* Trading signals: hiện tại tắt hẳn */
function TradingSignalsCompact() {
  return null;
}

/* ===== Trang index Crypto & Market ===== */
export default function MarketIndex({
  items = [],
  latest = [],
  page = 1,
  totalPages = 1,
  signalsLatest = [],
}) {
  const title = "Crypto & Market";
  const description =
    "Latest news and professional analysis on cryptocurrencies, macro and institutional digital asset markets.";
  const canonical = "https://www.finnews247.com/crypto-market";

  return (
    // Wrap the entire page in a crypto‑market page scope.  This wrapper mirrors
    // the structure used on /crypto-market/page/[page] to ensure consistent
    // overflow handling on mobile.  Without this wrapper the index page could
    // still allow horizontal overflow on very small screens when a long word or
    // element exceeds the viewport.  By adding this wrapper and a scoped
    // overflow-x: hidden style (see style tag below), we guarantee that any
    // overflow is clipped rather than causing the page to extend.
    <div className="crypto-market-page">
      <div className="container mx-auto px-4 py-6 container-1600">
      <NextSeo
        title={title}
        description={description}
        canonical={canonical}
        openGraph={{ title, description, url: canonical }}
      />

      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        {/* MAIN */}
        <section className="md:col-span-9">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {(items || []).map((it) => (
              <PostCard key={it.slug || it.title} post={it} />
            ))}
          </div>

          {/* Phân trang 1,2,3… */}
          {totalPages > 1 && (
            /*
             * Pagination container
             *
             * On mobile screens with many pages (e.g. 12+), the row of page
             * numbers can exceed the viewport width and force a horizontal
             * scrollbar or cause overflow.  Allow the flex container to
             * wrap so that page links flow onto multiple lines.  This
             * preserves readability and prevents horizontal scrolling on
             * small devices.  The `flex-wrap` utility from Tailwind
             * achieves this.
             */
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                const href =
                  p === 1 ? "/crypto-market" : `/crypto-market/page/${p}`;
                const active = p === page;
                return (
                  <Link
                    key={p}
                    href={href}
                    className={
                      "px-3 py-1 rounded border " +
                      (active
                        ? "bg-gray-900 text-white border-gray-900"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800")
                    }
                  >
                    {p}
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* SIDEBAR */}
        <aside className="md:col-span-3 w-full sticky top-24 self-start space-y-6 sidebar-scope">
          <TradingSignalsCompact items={signalsLatest} />

          <section className="rounded-xl border bg-white dark:bg-gray-900 overflow-hidden">
            <div className="px-4 py-3 border-b dark:border-gray-700">
              <h3 className="text-sm font-semibold">Latest on FinNews247</h3>
            </div>
            <ul className="divide-y dark:divide-gray-800">
              {(latest ?? []).map((it) => (
                <li key={it.slug || it.title} className="first:border-t-0">
                  <SideMiniItem item={it} />
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

        {/* Chỉ giữ phần ảnh sidebar giống Guides */}
        <style jsx global>{`
          /*
           * Sidebar thumbnail sizing
           *
           * Keep the thumbnail dimensions consistent across pages.  These rules
           * mirror those used on the paginated crypto‑market pages to ensure
           * identical rendering between index and paginated routes.
           */
          .sidebar-scope img {
            width: 45px !important;
            height: 45px !important;
            max-width: none !important;
            object-fit: cover !important;
            border-radius: 8px !important;
            display: block !important;
          }

          /*
           * Crypto market page wrapper
           *
           * Set width and max‑width to 100% and hide any horizontal overflow.
           * This wrapper encapsulates the entire page content so that any
           * inadvertent overflow (from long words or large elements) does not
           * create a horizontal scroll bar on mobile.  The paginated
           * /crypto-market/page/[page] implementation already defines these
           * styles; duplicating them here aligns the index route behavior.
           */
          .crypto-market-page {
            width: 100%;
            max-width: 100%;
            overflow-x: hidden;
          }
        `}</style>
      </div>
    </div>
  );
}

/* ===== getServerSideProps giống Guides, chỉ đổi sang readCat("crypto-market") ===== */
export async function getServerSideProps() {
  const { readCat, readMany } = await import("../../lib/serverCat");
  const { latestSignals } = await import("../../lib/sidebar.server");

  const parseD = (d) => {
    const t = Date.parse(d);
    return Number.isNaN(t) ? 0 : t;
  };

  const uniqBySlug = (arr = []) => {
    const seen = new Set();
    const out = [];
    for (const p of arr || []) {
      const s = String(p?.slug || "").trim().toLowerCase();
      if (!s || seen.has(s)) continue;
      seen.add(s);
      out.push(p);
    }
    return out;
  };

  // Chỉ đọc nhóm crypto-market (news.json)
  const posts = uniqBySlug(readCat("crypto-market")).sort(
    (a, b) => parseD(b.date || b.updatedAt) - parseD(a.date || a.updatedAt)
  );
  const PAGE_SIZE = 30;
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const items = posts.slice(0, PAGE_SIZE);

  // Sidebar Latest: giống Guides
  const groups = {
    "crypto-market": ["crypto-market"],
    altcoins: ["altcoins"],
    "crypto-exchanges": ["crypto-exchanges", "fidelity"],
    "best-crypto-apps": ["best-crypto-apps"],
    insurance: ["insurance", "tax"],
    guides: ["guides"],
  };

  const byCat = {};
  for (const [cat, keys] of Object.entries(groups)) {
    const arr =
      keys.length === 1 ? readCat(keys[0]) : uniqBySlug(readMany(keys));
    byCat[cat] = (arr || [])
      .map((p) => ({ ...p, _cat: cat }))
      .sort(
        (a, b) => parseD(b.date || b.updatedAt) - parseD(a.date || a.updatedAt)
      );
  }

  const coverage = Object.keys(groups)
    .map((cat) => byCat[cat]?.[0])
    .filter(Boolean);

  const poolAll = Object.values(byCat).flat();
  const seenSlug = new Set(
    coverage.map((x) => String(x.slug || "").toLowerCase())
  );
  const rest = poolAll.filter(
    (p) => p?.slug && !seenSlug.has(String(p.slug || "").toLowerCase())
  );

  const LATEST_LIMIT = 10;
  const latestRaw = coverage.concat(rest).slice(0, LATEST_LIMIT);
  const latest = uniqBySlug(latestRaw).sort(
    (a, b) => parseD(b.date || b.updatedAt) - parseD(a.date || a.updatedAt)
  );

  const signalsLatest = latestSignals(5);

  return { props: { items, latest, page: 1, totalPages, signalsLatest } };
}
