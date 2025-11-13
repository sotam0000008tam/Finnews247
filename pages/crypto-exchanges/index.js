import CategoryIntro from "../components/CategoryIntro";
﻿import Link from "next/link";
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

const pickThumb = (p, f = "/images/dummy/altcoins64.jpg") =>
  p?.thumb || p?.ogImage || p?.image || firstImage(p?.content || p?.body || "") || f;

const hrefEx = (slug) =>
  `/crypto-exchanges/${String(slug || "").replace(/^\//, "")}`;

/* Map link sidebar Latest */
const hrefMixed = (p) => {
  if (p?.href) return p.href;
  const s = String(p?.slug || "").replace(/^\//, "");
  if (!s) return "#";
  const c = String(p?._cat || p?.category || "").toLowerCase();

  if (c.includes("sec-coin") || c.includes("seccoin")) return `/altcoins/${s}`;
  if (c.includes("altcoin")) return `/altcoins/${s}`;
  if (c.includes("fidelity") || c.includes("exchange"))
    return `/crypto-exchanges/${s}`;
  if (c.includes("app") || c.includes("wallet")) return `/best-crypto-apps/${s}`;
  if (c.includes("insurance") || c.includes("tax")) return `/insurance/${s}`;
  if (c.includes("guide") || c.includes("review")) return `/guides/${s}`;
  if (c.includes("market") || c.includes("news") || c.includes("crypto-market"))
    return `/crypto-market/${s}`;
  return `/guides/${s}`;
};

/* ===== Signals compact ===== */
const prettyType = (t = "") =>
  String(t).toLowerCase() === "long" ? "Long" : "Short";
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
                    className={`text-[10px] px-2 py-0.5 rounded-full ring-1 ${typeColor(
                      s.type
                    )}`}
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

/* ===== Card ===== */
function Card({ item }) {
  const href = hrefEx(item.slug);
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
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      )}
      <div className="p-3">
        <div className="font-semibold leading-snug line-clamp-2 group-hover:underline">
          {item?.title || "Untitled"}
        </div>
        {(item?.date || item?.updatedAt) && (
          <div className="text-xs text-gray-500 mt-1">
            {item.date || item.updatedAt}
          </div>
        )}
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

/* ===== Mini Latest ===== */
function SideMiniItem({ item }) {
  const href = hrefMixed(item);
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

export default function ExchangesIndex({
  items = [],
  latest = [],
  page = 1,
  totalPages = 1,
  signalsLatest = [],
}) {
  const title = "Crypto Exchanges";
  const canonical = "https://www.finnews247.com/crypto-exchanges";
  const description = "Crypto exchange reviews & analysis.";

  return (
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
        <section className="md:col-span-9">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {(items || []).map((it) => (
              <Card key={it.slug || it.title} item={it} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                const href =
                  p === 1 ? "/crypto-exchanges" : `/crypto-exchanges/page/${p}`;
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
                <li key={(it.slug || it.title) + "-latest"}>
                  <SideMiniItem item={it} />
                </li>
              ))}
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

/* ===== SSR ===== */
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

  // Exchanges = crypto-exchanges + fidelity
  const posts = uniqBySlug(readMany(["crypto-exchanges", "fidelity"])).sort(
    (a, b) => parseD(b.date || b.updatedAt) - parseD(a.date || a.updatedAt)
  );
  const PAGE_SIZE = 30;
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const items = posts.slice(0, PAGE_SIZE);

  // Sidebar Latest (đúng 6 nhóm)
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
      keys.length === 1
        ? readCat(keys[0])
        : uniqBySlug(readMany(keys));
    byCat[cat] = arr
      .map((p) => ({ ...p, _cat: cat }))
      .sort(
        (a, b) => parseD(b.date || b.updatedAt) - parseD(a.date || a.updatedAt)
      );
  }

  const coverage = Object.keys(groups)
    .map((cat) => byCat[cat]?.[0])
    .filter(Boolean);

  const poolAll = Object.values(byCat).flat();
  const seenSlug = new Set(coverage.map((x) => String(x.slug).toLowerCase()));
  const rest = poolAll.filter(
    (p) => p?.slug && !seenSlug.has(String(p.slug).toLowerCase())
  );

  const LATEST_LIMIT = 10;
  const latestRaw = coverage.concat(rest).slice(0, LATEST_LIMIT);
  const latest = uniqBySlug(latestRaw).sort(
    (a, b) => parseD(b.date || b.updatedAt) - parseD(a.date || a.updatedAt)
  );

  const signalsLatest = latestSignals(5);
  return { props: { items, latest, page: 1, totalPages, signalsLatest } };
}
