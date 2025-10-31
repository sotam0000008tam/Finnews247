// pages/index.js
import Link from "next/link";
import PostCard from "../components/PostCard";
import { NextSeo } from "next-seo";
import TradingSignalsBoxMain from "../components/TradingSignalsBoxMain";
import TradingSignalsBoxMini from "../components/TradingSignalsBoxMini";
import TopExchanges from "../components/TopExchanges";
import BestWallets from "../components/BestWallets";
import TopStaking from "../components/TopStaking";
import { readJsonSafe, sortDescByDate, shallowPosts } from "../lib/data";

/* ================= Helpers for Latest ================= */
function parseDate(d) {
  const t = Date.parse(d);
  return isNaN(t) ? 0 : t;
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
// tạo url an toàn theo _cat hoặc category
function hrefOf(p) {
  const slug = p?.slug;
  if (!slug) return "#";
  const cat = String(p?._cat || p?.category || "").toLowerCase();

  if (cat.includes("fidelity")) return `/fidelity-crypto/${slug}`;
  if (cat.includes("exchange")) return `/crypto-exchanges/${slug}`;

  if (cat.includes("altcoin") || cat.includes("seccoin")) return `/altcoins/${slug}`;
  if (cat.includes("apps") || cat.includes("wallet")) return `/best-crypto-apps/${slug}`;

  if (cat.includes("insurance")) return `/insurance/${slug}`;
  if (cat.includes("tax") || cat.includes("compliance")) return `/tax/${slug}`;

  if (cat.includes("guide") || cat.includes("review")) return `/guides/${slug}`;
  if (cat.includes("market") || cat.includes("news")) return `/crypto-market/${slug}`;

  // fallback
  return `/guides/${slug}`;
}

function LatestMini({ items = [] }) {
  if (!items.length) return null;
  return (
    <section className="rounded-xl border bg-white dark:bg-gray-900 overflow-hidden">
      <div className="px-4 py-3 border-b dark:border-gray-700">
        <h3 className="text-sm font-semibold">Latest on FinNews247</h3>
      </div>
      <ul className="divide-y dark:divide-gray-800">
        {items.map((p) => {
          const href = hrefOf(p);
          const img = pickThumb(p);
          return (
            <li key={(p.slug || p.title) + "-latest"}>
              <Link href={href} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <img
                  src={img}
                  alt={p?.title || "post"}
                  className="w-[45px] h-[45px] rounded-md object-cover shrink-0 border dark:border-gray-700"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <div className="text-sm leading-snug line-clamp-2">
                    {p.title || "Untitled"}
                  </div>
                  {(p.date || p.updatedAt) && (
                    <div className="text-xs text-gray-500 mt-1">
                      {p.date || p.updatedAt}
                    </div>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
/* ===================================================== */

export default function Home({
  altcoinPosts,
  exchangePosts,
  appPosts,
  insuranceTaxPosts,
  newsPosts,
  guidePosts,
  latestAll,
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "FinNews247 - Crypto Trading Signals & Market Coverage",
    url: "https://www.finnews247.com/",
    description:
      "FinNews247 provides professional finance coverage with a focus on crypto trading signals, entry, target, stoploss, plus updates on cryptocurrencies, stocks, economy, and global markets.",
    publisher: {
      "@type": "Organization",
      name: "FinNews247",
      url: "https://www.finnews247.com/",
      logo: { "@type": "ImageObject", url: "https://www.finnews247.com/logo.png" },
    },
  };

  return (
    <>
      <NextSeo
        title="FinNews247 - Crypto Trading Signals & Market Coverage"
        description="Stay updated with reliable crypto trading signals (entry, target, stoploss) and market insights across cryptocurrencies, stocks, economy, and global markets."
        canonical="https://www.finnews247.com/"
        openGraph={{
          title: "FinNews247 - Crypto Trading Signals & Market Coverage",
          description:
            "FinNews247 delivers professional finance coverage with crypto trading signals, stock updates, economy, and market news.",
          url: "https://www.finnews247.com/",
          images: [{ url: "https://www.finnews247.com/logo.png" }],
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar (trái) */}
        <aside className="md:col-span-4 w-full space-y-6">
          <TradingSignalsBoxMini />
          <TopExchanges variant="sidebar" />
          <BestWallets variant="sidebar" />
          <TopStaking variant="sidebar" />
          {/* Latest toàn site (có thumbnail) */}
          <LatestMini items={latestAll} />
        </aside>

        {/* Main (phải) */}
        <main className="md:col-span-8 space-y-12">
          <TradingSignalsBoxMain />

          <section>
            <h2 className="text-2xl font-semibold mb-4">Altcoin Analysis</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {altcoinPosts.map((p) => <PostCard key={p.slug} post={p} />)}
            </div>
            <div className="mt-4">
              <Link href="/altcoins" className="text-sky-600 hover:underline text-sm">
                View all Altcoins →
              </Link>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Crypto Exchanges Insights</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {exchangePosts.map((p) => <PostCard key={p.slug} post={p} />)}
            </div>
            <div className="mt-4">
              <Link href="/crypto-exchanges" className="text-sky-600 hover:underline text-sm">
                View all Exchanges →
              </Link>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Crypto Apps & Wallets</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {appPosts.map((p) => <PostCard key={p.slug} post={p} />)}
            </div>
            <div className="mt-4">
              <Link href="/best-crypto-apps" className="text-sky-600 hover:underline text-sm">
                View all Apps & Wallets →
              </Link>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Crypto Insurance & Tax</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {insuranceTaxPosts.map((p) => <PostCard key={p.slug} post={p} />)}
            </div>
            <div className="mt-4">
              <Link href="/insurance" className="text-sky-600 hover:underline text-sm">
                View all Insurance & Tax →
              </Link>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Crypto & Market News</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {newsPosts.map((p) => (
                // Nếu thích direct path: đổi thành `/crypto-market/${p.slug}`
                <PostCard key={p.slug} post={{ ...p, href: `/${p.slug}` }} />
              ))}
            </div>
            
            <div className="mt-4">
              <Link href="/crypto-market" className="text-sky-600 hover:underline text-sm">
                View all Market News →
              </Link>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Guides & Reviews</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {guidePosts.map((p) => <PostCard key={p.slug} post={p} />)}
            </div>
            <div className="mt-4">
              <Link href="/guides" className="text-sky-600 hover:underline text-sm">
                View all Guides →
              </Link>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

/** SSG + ISR: build tĩnh và tái tạo định kỳ → giảm serverless request */
export async function getStaticProps() {
  const SECTION_COUNTS = {
    altcoins: 8,
    exchanges: 8,
    apps: 6,
    insuranceTax: 6,
    news: 6,
    guides: 6,
  };

  // đọc dữ liệu gốc
  const altcoins = readJsonSafe("altcoins.json");
  const seccoin = readJsonSafe("seccoin.json");
  const fidelity = readJsonSafe("fidelity.json");
  const cryptoexchanges = readJsonSafe("cryptoexchanges.json");
  const apps = readJsonSafe("bestapps.json");
  const insurance = readJsonSafe("insurance.json");
  const tax = readJsonSafe("tax.json");
  const news = readJsonSafe("news.json");
  const guides = readJsonSafe("guides.json");

  // nội dung chính
  const altcoinPosts = shallowPosts(
    sortDescByDate([...altcoins, ...seccoin]).slice(0, SECTION_COUNTS.altcoins)
  );
  const exchangePosts = shallowPosts(
    sortDescByDate([...fidelity, ...cryptoexchanges]).slice(0, SECTION_COUNTS.exchanges)
  );
  const appPosts = shallowPosts(sortDescByDate([...apps]).slice(0, SECTION_COUNTS.apps));
  const insuranceTaxPosts = shallowPosts(
    sortDescByDate([...insurance, ...tax]).slice(0, SECTION_COUNTS.insuranceTax)
  );
  const newsPosts = shallowPosts(sortDescByDate([...news]).slice(0, SECTION_COUNTS.news));
  const guidePosts = shallowPosts(sortDescByDate([...guides]).slice(0, SECTION_COUNTS.guides));

  // ===== Latest toàn site cho sidebar =====
  const tag = (arr, _cat) => arr.map((p) => ({ ...p, _cat }));
  const pool = [
    ...tag(altcoins, "altcoin"),
    ...tag(seccoin, "seccoin"),
    ...tag(fidelity, "fidelity"),
    ...tag(cryptoexchanges, "exchange"),
    ...tag(apps, "apps"),
    ...tag(insurance, "insurance"),
    ...tag(tax, "tax"),
    ...tag(news, "market"),
    ...tag(guides, "guide"),
  ];

  // loại trùng slug, sort theo date/updatedAt
  const seen = new Set();
  const dedup = pool.filter((p) => {
    if (!p?.slug) return false;
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });

  const latestAll = dedup
    .sort((a, b) => parseDate(b.date || b.updatedAt) - parseDate(a.date || a.updatedAt))
    .slice(0, 10);

  return {
    props: {
      altcoinPosts,
      exchangePosts,
      appPosts,
      insuranceTaxPosts,
      newsPosts,
      guidePosts,
      latestAll,
    },
    revalidate: 900,
  };
}
