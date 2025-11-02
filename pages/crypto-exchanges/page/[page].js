// pages/crypto-exchanges/page/[page].js
import Link from "next/link";
import { NextSeo } from "next-seo";

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
const pickThumb = (p, f = "/images/dummy/market64.jpg") =>
  p?.thumb || p?.ogImage || p?.image || firstImage(p?.content || p?.body || "") || f;

const hrefMixed = (p) => {
  if (p?.href) return p.href;
  const s = String(p?.slug || "").replace(/^\//, "");
  if (!s) return "#";
  const c = String(p?._cat || p?.category || "").toLowerCase();

  if (c.includes("sec-coin") || c.includes("sec coin") || c.includes("seccoin")) return `/sec-coin/${s}`;
  if (c.includes("altcoin")) return `/altcoins/${s}`;
  if (c.includes("fidelity")) return `/fidelity-crypto/${s}`;
  if (c.includes("exchange")) return `/crypto-exchanges/${s}`;
  if (c.includes("app") || c.includes("wallet")) return `/best-crypto-apps/${s}`;
  if (c.includes("insurance")) return `/insurance/${s}`;
  if (c.includes("tax") || c.includes("compliance")) return `/tax/${s}`;
  if (c.includes("guide") || c.includes("review")) return `/guides/${s}`;
  if (c.includes("market") || c.includes("news") || c.includes("crypto-market")) return `/crypto-market/${s}`;
  return `/guides/${s}`;
};

function SideMiniItem({ item }) {
  const href = hrefMixed(item);
  const img = pickThumb(item);
  return (
    <Link href={href} className="group flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
      <img src={img} alt={item?.title || "post"} className="w-[45px] h-[45px] rounded-md object-cover border dark:border-gray-700 shrink-0" loading="lazy" />
      <div className="min-w-0">
        <div className="text-sm leading-snug line-clamp-2 group-hover:underline">{item?.title || "Untitled"}</div>
        {(item?.date || item?.updatedAt) && <div className="text-xs text-gray-500 mt-0.5">{item?.date || item?.updatedAt}</div>}
      </div>
    </Link>
  );
}

const hrefBase = (slug) => `/crypto-exchanges/${String(slug || "").replace(/^\//, "")}`;

function Card({ item }) {
  const href = hrefBase(item.slug);
  const img = pickThumb(item);
  return (
    <Link href={href} className="group block rounded-xl overflow-hidden border bg-white dark:bg-gray-900 hover:shadow-md transition">
      {img && <img src={img} alt={item?.title || "post"} className="w-full h-48 object-cover" loading="lazy" />}
      <div className="p-3">
        <div className="font-semibold leading-snug line-clamp-2 group-hover:underline">{item?.title || "Untitled"}</div>
        {(item?.date || item?.updatedAt) && <div className="text-xs text-gray-500 mt-1">{item.date || item.updatedAt}</div>}
        {item?.excerpt && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
            {stripHtml(item.excerpt).slice(0, 120)}
            {stripHtml(item.excerpt).length > 120 ? "…" : ""}
          </p>
        )}
      </div>
    </Link>
  );
}

/* ===== Trading Signals (compact) ===== */
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
        <>
          <ul className="divide-y dark:divide-gray-800">
            {items.map((s) => (
              <li key={s.id}>
                <Link href={`/signals/${s.id}`} className="block px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium truncate">{s.pair || s.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ring-1 ${typeColor(s.type)}`}>{prettyType(s.type)}</span>
                    {s.date && <span className="ml-auto text-[11px] text-gray-500">{s.date}</span>}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="px-3 py-2">
            <Link href="/signals" className="text-sm text-sky-600 hover:underline">View all signals →</Link>
          </div>
        </>
      )}
    </section>
  );
}

export default function ExchangesPage({
  items = [],
  latest = [],
  signalsLatest = [],
  page = 1,
  totalPages = 1,
}) {
  const title = "Exchanges";
  const canonical = "https://www.finnews247.com/crypto-exchanges" + (page > 1 ? `/page/${page}` : "");
  const description = "Crypto exchanges insights and analysis.";

  return (
    <div className="container mx-auto px-4 py-6">
      <NextSeo title={title} description={description} canonical={canonical} openGraph={{ title, description, url: canonical }} />
      <div className="mb-4"><h1 className="text-2xl md:text-3xl font-bold">{title}</h1></div>

      <div className="grid md:grid-cols-12 gap-8">
        <section className="md:col-span-9">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {(items || []).map((it) => <Card key={it.slug || it.title} item={it} />)}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                const href = p === 1 ? "/crypto-exchanges" : `/crypto-exchanges/page/${p}`;
                const active = p === page;
                return (
                  <Link
                    key={p}
                    href={href}
                    className={"px-3 py-1 rounded border " + (active ? "bg-gray-900 text-white border-gray-900" : "hover:bg-gray-50 dark:hover:bg-gray-800")}
                  >
                    {p}
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* SIDEBAR: Trading Signals (compact) + Latest */}
        <aside className="md:col-span-3 w-full sticky top-24 self-start space-y-6 sidebar-scope">
          <TradingSignalsCompact items={signalsLatest ?? []} />

          <section className="rounded-xl border bg-white dark:bg-gray-900 overflow-hidden">
            <div className="px-4 py-3 border-b dark:border-gray-700"><h3 className="text-sm font-semibold">Latest on FinNews247</h3></div>
            <ul className="divide-y dark:divide-gray-800">
              {(latest ?? []).length ? (
                (latest ?? []).map((it) => (
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
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const { ensureCoverage, GROUPS, latestSignals } = await import("../../../lib/sidebar.server");
  const { readCat } = await import("../../../lib/serverCat");

  const posts = readCat("crypto-exchanges");
  // sort trước rồi mới phân trang
  posts.sort((a, b) => (Date.parse(b.date || b.updatedAt) || 0) - (Date.parse(a.date || a.updatedAt) || 0));

  const PAGE_SIZE = 30;
  const raw = parseInt(params.page, 10) || 1;
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, raw), totalPages);
  const start = (page - 1) * PAGE_SIZE;
  const items = posts.slice(start, start + PAGE_SIZE);

  // Latest: coverage + re-sort mới → cũ
  const latestRaw = ensureCoverage(GROUPS, 10) || [];
  const latest = [...latestRaw].sort(
    (a, b) => (Date.parse(b.date || b.updatedAt) || 0) - (Date.parse(a.date || a.updatedAt) || 0)
  );

  const signalsLatest = latestSignals(5);

  return { props: { items, latest, signalsLatest, page, totalPages } };
}
