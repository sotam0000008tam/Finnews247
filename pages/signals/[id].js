import { NextSeo } from "next-seo";
import Link from "next/link";
import Script from "next/script";
import { useState } from "react";
import fs from "fs";
import path from "path";
import allSignals from "../../data/signals.json";

/* ================= Helpers ================= */
function resolveImage(src) {
  if (!src) return null;
  if (src.startsWith("http") || src.startsWith("/")) return src;
  return `/images/${src}`;
}
function extractFirstImage(html = "") {
  const m = html?.match?.(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
}
function pickThumb(s) {
  return (
    resolveImage(s?.image) ||
    extractFirstImage(
      s?.content || s?.intro || s?.technicalAnalysis || s?.marketContext || ""
    ) ||
    "/images/dummy/altcoins64.jpg"
  );
}
function parseDate(d) {
  const t = Date.parse(d);
  return Number.isNaN(t) ? 0 : t;
}
function toTradingViewSymbol(pair) {
  if (!pair) return "BINANCE:BTCUSDT";
  let p = pair.toUpperCase().trim();
  p = p.replace(/^[A-Z]+:/, "");
  const compact = p.replace("/", "").replace(/\s+/g, "");
  return `BINANCE:${compact}`;
}

function TVChart({ symbol, height = 520 }) {
  const containerId = "tvchart-container";
  return (
    <>
      <div id={containerId} style={{ height }} />
      <Script
        src="https://s3.tradingview.com/tv.js"
        strategy="lazyOnload"
        onLoad={() => {
          const safe = symbol || "BINANCE:BTCUSDT";
          try {
            /* global TradingView */
            new TradingView.widget({
              container_id: containerId,
              symbol: safe,
              interval: "60",
              timezone: "Etc/UTC",
              theme: "light",
              style: "1",
              locale: "en",
              autosize: true,
              hide_side_toolbar: false,
              allow_symbol_change: true,
              studies: ["RSI@tv-basicstudies", "MACD@tv-basicstudies"],
            });
          } catch (e) {
            console.error("TV init error:", e);
          }
        }}
      />
    </>
  );
}

function ZoomableImage({ src, alt }) {
  const [open, setOpen] = useState(false);
  if (!src) return null;
  return (
    <>
      <img
        src={src}
        alt={alt}
        className="w-full h-auto rounded-md border cursor-zoom-in"
        onClick={() => setOpen(true)}
        loading="lazy"
      />
      {open && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setOpen(false)}
        >
          <img
            src={src}
            alt={alt}
            className="max-w-[95%] max-h-[90%] rounded shadow-lg cursor-zoom-out"
          />
        </div>
      )}
    </>
  );
}

/* JSON-safe mappers (tránh undefined trong props) */
const toSafeSignal = (s) => ({
  id: String(s.id),
  pair: s.pair || "",
  type: s.type || "",
  date: s.date || "",
  entry: s.entry || "",
  target: s.target || "",
  stoploss: s.stoploss || "",
  excerpt: s.excerpt || "",
  image: resolveImage(s.image) || null,
  // các field nội dung có thể null
  intro: s.intro ?? null,
  marketContext: s.marketContext ?? null,
  technicalAnalysis: s.technicalAnalysis ?? null,
  riskStrategy: s.riskStrategy ?? null,
  disclaimer: s.disclaimer ?? null,
  content: s.content ?? null,
});

const toSafeSignalLite = (s) => ({
  id: String(s.id),
  pair: s.pair || "",
  type: s.type || "",
  date: s.date || "",
  image: resolveImage(s.image) || null,
  // giữ content trống string để pickThumb không bị undefined
  content: s.content ?? "",
});

/* ======== SSG ======== */
export async function getStaticPaths() {
  const paths = (allSignals || []).map((s) => ({ params: { id: String(s.id) } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const id = String(params.id || "");
  const signalRaw =
    (allSignals || []).find((s) => String(s.id) === id) || null;
  if (!signalRaw) return { notFound: true };

  const signal = toSafeSignal(signalRaw);

  // Latest Signals (khối bên dưới nội dung)
  const latestSignals = (allSignals || [])
    .filter((s) => String(s.id) !== id)
    .sort((a, b) => parseDate(b.date) - parseDate(a.date))
    .slice(0, 8)
    .map(toSafeSignalLite);

  // Sidebar "Latest on FinNews247" — đảm bảo ≥1 bài/mỗi chuyên mục + sort mới→cũ
  const dataDir = path.join(process.cwd(), "data");
  const readJson = (file) => {
    try {
      const p = path.join(dataDir, file);
      return JSON.parse(fs.readFileSync(p, "utf-8"));
    } catch {
      return [];
    }
  };

  const cats = [
    "crypto-market",
    "altcoins",
    "crypto-exchanges",
    "best-crypto-apps",
    "insurance",
    "guides",
    "tax",
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

  const firstImg = (html = "") =>
    (String(html).match(/<img[^>]+src=["']([^"']+)["']/i) || [])[1] || null;
  const pickThumbPost = (p) =>
    p.thumb || p.ogImage || p.image || firstImg(p.content || p.body || "") || "/images/dummy/64x64.jpg";

  const buildHref = (p, c) => {
    const s = String(p?.slug || "").replace(/^\//, "");
    if (!s) return "#";
    const cat = String(c);
    if (cat === "crypto-market") return `/crypto-market/${s}`;
    if (cat === "altcoins") return `/altcoins/${s}`;
    if (cat === "crypto-exchanges") return `/crypto-exchanges/${s}`;
    if (cat === "best-crypto-apps") return `/best-crypto-apps/${s}`;
    if (cat === "insurance") return `/insurance/${s}`;
    if (cat === "guides") return `/guides/${s}`;
    if (cat === "tax") return `/tax/${s}`;
    if (cat === "fidelity") return `/fidelity-crypto/${s}`;
    if (cat === "sec-coin") return `/sec-coin/${s}`;
    return `/guides/${s}`;
  };

  const byCat = {};
  for (const c of cats) {
    const arr = (readJson(fileForCat(c)) || []).map((p) => ({
      title: p.title || "Untitled",
      date: p.date || p.updatedAt || "",
      slug: p.slug || "",
      href: buildHref(p, c),
      thumb: pickThumbPost(p),
      _cat: c,
    }));
    arr.sort(
      (a, b) => (Date.parse(b.date || "") || 0) - (Date.parse(a.date || "") || 0)
    );
    byCat[c] = arr;
  }

  const LATEST_LIMIT = 10;
  const seen = new Set();
  const coverage = [];
  for (const c of cats) {
    const top = byCat[c]?.find((x) => x.slug && !seen.has(x.slug));
    if (top) {
      seen.add(top.slug);
      coverage.push(top);
    }
  }
  const poolAll = cats.flatMap((c) => byCat[c] || []);
  const rest = poolAll
    .filter((p) => p.slug && !seen.has(p.slug))
    .sort(
      (a, b) => (Date.parse(b.date || "") || 0) - (Date.parse(a.date || "") || 0)
    );
  const latestSiteRaw = coverage.concat(rest).slice(0, LATEST_LIMIT);
  const latestSite = latestSiteRaw.sort(
    (a, b) => (Date.parse(b.date || "") || 0) - (Date.parse(a.date || "") || 0)
  );

  return {
    props: {
      signal,
      latestSignals, // dùng ở phần dưới nội dung
      latestSite, // dùng cho sidebar
    },
  };
}

/* ================ PAGE (default export BẮT BUỘC) ================ */
export default function SignalDetailPage({
  signal,
  latestSignals = [],
  latestSite = [],
}) {
  const {
    pair,
    type,
    entry,
    target,
    stoploss,
    date,
    image,
    excerpt,
    intro,
    marketContext,
    technicalAnalysis,
    riskStrategy,
    faq,
    disclaimer,
    content,
    id,
  } = signal;

  const imgUrl = image || null;
  const pageTitle = `${pair} ${type} Signal — Entry ${entry}, Target ${target}, Stoploss ${stoploss}`;
  const pageDesc =
    excerpt ||
    `Crypto trading signal for ${pair} — Entry ${entry}, Target ${target}, Stoploss ${stoploss}.`;

  return (
    <div className="container mx-auto px-4 py-8">
      <NextSeo
        title={pageTitle}
        description={pageDesc}
        canonical={`https://www.finnews247.com/signals/${id}`}
        openGraph={{
          title: pageTitle,
          description: pageDesc,
          url: `https://www.finnews247.com/signals/${id}`,
          images: [{ url: imgUrl || "https://www.finnews247.com/logo.png" }],
        }}
      />

      <div className="grid md:grid-cols-12 gap-8">
        {/* MAIN */}
        <div className="md:col-span-9">
          <nav className="mb-4 text-sm">
            <Link href="/signals" className="text-sky-600 hover:underline">
              Signals
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span>{pair}</span>
          </nav>

          <header className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">
              {pair} — {type}
            </h1>
            <p className="text-gray-600 mt-1">{date}</p>
            {excerpt && <p className="mt-2">{excerpt}</p>}
          </header>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 border rounded-xl bg-white dark:bg-gray-900">
              <div className="text-gray-500 text-sm">Entry</div>
              <div className="text-lg font-semibold text-yellow-600">{entry}</div>
            </div>
            <div className="p-4 border rounded-xl bg-white dark:bg-gray-900">
              <div className="text-gray-500 text-sm">Target</div>
              <div className="text-lg font-semibold text-green-600">{target}</div>
            </div>
            <div className="p-4 border rounded-xl bg-white dark:bg-gray-900">
              <div className="text-gray-500 text-sm">Stoploss</div>
              <div className="text-lg font-semibold text-red-600">{stoploss}</div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="md:col-span-2 border rounded-xl overflow-hidden bg-white dark:bg-gray-900">
              <TVChart symbol={toTradingViewSymbol(pair)} height={520} />
            </div>
            <div className="border rounded-xl p-3 bg-white dark:bg-gray-900">
              {imgUrl ? (
                <ZoomableImage src={imgUrl} alt={`${pair} ${type} setup`} />
              ) : (
                <div className="text-sm text-gray-500">
                  No image provided for this signal.
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                If the TradingView symbol is unavailable, use the annotated image
                as reference for target zones &amp; invalidation.
              </p>
            </div>
          </div>

          {(intro ||
            marketContext ||
            technicalAnalysis ||
            riskStrategy ||
            (Array.isArray(faq) && faq.length) ||
            disclaimer) ? (
            <>
              {intro && (
                <section
                  className="prose max-w-none mb-8"
                  dangerouslySetInnerHTML={{ __html: String(intro) }}
                />
              )}
              {marketContext && (
                <section
                  className="prose max-w-none mb-8"
                  dangerouslySetInnerHTML={{ __html: String(marketContext) }}
                />
              )}
              {technicalAnalysis && (
                <section
                  className="prose max-w-none mb-8"
                  dangerouslySetInnerHTML={{ __html: String(technicalAnalysis) }}
                />
              )}
              {riskStrategy && (
                <section
                  className="prose max-w-none mb-8"
                  dangerouslySetInnerHTML={{ __html: String(riskStrategy) }}
                />
              )}
              {Array.isArray(faq) && faq.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">FAQ</h2>
                  <div className="space-y-3">
                    {faq.map((it, idx) => (
                      <div
                        key={idx}
                        className="p-4 border rounded-lg bg-white dark:bg-gray-900"
                      >
                        <p className="font-medium">Q: {it.q}</p>
                        <p className="text-gray-700 mt-1">A: {it.a}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {disclaimer && (
                <section
                  className="mt-6 p-4 bg-yellow-100 text-yellow-900 text-sm rounded"
                  dangerouslySetInnerHTML={{ __html: String(disclaimer) }}
                />
              )}
            </>
          ) : content ? (
            <section
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: String(content) }}
            />
          ) : (
            <div className="text-sm text-gray-500">
              No detailed content provided for this signal.
            </div>
          )}

          {/* ====== NEW: Latest Signals (giống related) ====== */}
          <section className="mt-10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Latest Signals</h3>
              <Link href="/signals" className="text-sm text-sky-600 hover:underline">
                View all
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(latestSignals || []).map((it) => (
                <Link
                  key={it.id}
                  href={`/signals/${it.id}`}
                  className="block rounded-lg border p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <img
                    src={pickThumb(it)}
                    alt={`${it.pair} — ${it.type}`}
                    className="w-full h-40 object-cover rounded-md mb-2"
                    loading="lazy"
                  />
                  <div className="font-medium line-clamp-2">
                    {it.pair} — {it.type}
                  </div>
                  {it.date && (
                    <div className="text-xs text-gray-500 mt-0.5">{it.date}</div>
                  )}
                </Link>
              ))}
            </div>
          </section>

          <div className="mt-10">
            <Link href="/signals" className="text-sky-600 hover:underline">
              ← Back to all signals
            </Link>
          </div>
        </div>

        {/* SIDEBAR: Latest on FinNews247 (coverage + newest first) */}
        <aside className="md:col-span-3 w-full sticky top-24 self-start space-y-6 sidebar-scope">
          <section className="rounded-xl border bg-white dark:bg-gray-900 overflow-hidden">
            <div className="px-4 py-3 border-b dark:border-gray-700">
              <h3 className="text-sm font-semibold">Latest on FinNews247</h3>
            </div>
            <ul className="divide-y dark:divide-gray-800">
              {(latestSite || []).length ? (
                latestSite.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={p.href}
                      className="group flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      {p.thumb && (
                        <img
                          src={p.thumb}
                          alt={p.title || "post"}
                          className="w-[45px] h-[45px] rounded-md object-cover border dark:border-gray-700 shrink-0"
                          loading="lazy"
                        />
                      )}
                      <div className="min-w-0">
                        <div className="text-sm leading-snug line-clamp-2 group-hover:underline">
                          {p.title}
                        </div>
                        {p.date && (
                          <div className="text-xs text-gray-500 mt-0.5">{p.date}</div>
                        )}
                      </div>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="px-4 py-3 text-xs text-gray-500">No recent posts.</li>
              )}
            </ul>
          </section>
        </aside>
      </div>

      {/* chỉ áp dụng cho ảnh sidebar 45x45 */}
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
