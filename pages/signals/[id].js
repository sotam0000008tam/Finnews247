import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import Script from "next/script";
import Link from "next/link";
import { useState } from "react";
// We'll load the signal data at build time via getStaticProps instead of
// statically importing the entire dataset here. Importing the JSON here
// means the list of available signals is frozen at build time and will not
// include newly added signals until the site is redeployed. By moving the
// data-loading logic into getStaticProps/getStaticPaths we allow Vercel to
// generate pages on demand (via fallback) for IDs that weren't present
// during the last build.
// The component receives a `signal` prop from getStaticProps.

function resolveImage(src) {
  if (!src) return null;
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
    return src;
  }
  return `/images/${src}`;
}

function toTradingViewSymbol(pair) {
  if (!pair) return "BINANCE:BTCUSDT";
  let p = pair.toUpperCase().trim();
  const isPerp = p.includes(".P");
  let compact = p.replace("/", "").replace(/\s+/g, "");
  if (isPerp) {
    return `BYBIT:${compact}`;
  }
  return `BINANCE:${compact}`;
}

function TVChart({ symbol, height = 520 }) {
  const containerId = "tvchart-container";
  return (
    <>
      <div id={containerId} className="w-full" style={{ height }} />
      <Script
        src="https://s3.tradingview.com/tv.js"
        strategy="lazyOnload"
        onLoad={() => {
          const safeSymbol = symbol || "BINANCE:BTCUSDT";
          try {
            /* global TradingView */
            new TradingView.widget({
              container_id: containerId,
              symbol: safeSymbol,
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
            console.error("TradingView init error:", e);
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

export default function SignalDetailPage({ signal }) {
  const router = useRouter();
  // During fallback rendering Next.js sets router.isFallback to true. We
  // display a simple loading state until the page has been statically
  // generated on-demand. Without this check a React error would occur
  // because the `signal` prop will be undefined during fallback.
  if (router.isFallback) {
    return (
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-xl font-semibold mb-2">Loading…</h1>
        <p className="text-gray-600">Please wait while we load the signal.</p>
      </div>
    );
  }

  // If no signal data was found return a 404-like message. This handles
  // cases where an invalid ID is requested; getStaticProps will return
  // `notFound: true` so this branch should rarely be executed, but it's here
  // as a safeguard for client-side navigation.
  if (!signal) {
    return (
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-2">Signal not found</h1>
        <p className="text-gray-600 mb-6">
          The requested trading signal does not exist or has been removed.
        </p>
        <Link href="/signals" className="text-sky-600 hover:underline">
          ← Back to Signals
        </Link>
      </div>
    );
  }

  // Destructure `id` along with other properties from the signal. Without destructuring
  // or otherwise defining `id`, the structured data generation below would reference
  // an undefined variable, causing a ReferenceError during prerendering. Including
  // `id` here ensures it is available in scope.
  const {
    id,
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
  } = signal;

  const imgUrl = resolveImage(image);
  const tvSymbol = toTradingViewSymbol(pair);

  const pageTitle = `${pair} ${type} Signal — Entry ${entry}, Target ${target}, Stoploss ${stoploss}`;
  const pageDesc =
    excerpt ||
    `Crypto trading signal for ${pair} — Entry ${entry}, Target ${target}, Stoploss ${stoploss}.`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: pageTitle,
    description: pageDesc,
    author: { "@type": "Organization", name: "FinNews247" },
    datePublished: date,
    mainEntityOfPage: `https://finnews247.com/signals/${id}`,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <NextSeo title={pageTitle} description={pageDesc} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

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
        <p className="mt-2">{excerpt}</p>
      </header>

      {/* Entry / Target / Stoploss (Vàng / Xanh / Đỏ) */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 border rounded-xl bg-white">
          <div className="text-gray-500 text-sm">Entry</div>
          <div className="text-lg font-semibold text-yellow-600">{entry}</div>
        </div>
        <div className="p-4 border rounded-xl bg-white">
          <div className="text-gray-500 text-sm">Target</div>
          <div className="text-lg font-semibold text-green-600">{target}</div>
        </div>
        <div className="p-4 border rounded-xl bg-white">
          <div className="text-gray-500 text-sm">Stoploss</div>
          <div className="text-lg font-semibold text-red-600">{stoploss}</div>
        </div>
      </div>

      {/* 🔎 NEW: Methodology (ngắn gọn, tăng chữ, đặt dưới 3 ô) */}
      <div className="mb-8 p-4 rounded-xl bg-white border">
        <h2 className="text-lg font-semibold mb-2">Methodology (Summary)</h2>
        <p className="text-sm text-gray-700">
          Signals are derived from 1H–4H structure (trend, higher highs/lows),
          liquidity cues (EQH/EQL, FVG), confluence with 20/50/200 EMA, and
          momentum via RSI/MACD. Targets are tiered (TP1/TP2/TP3) at prior
          swings, measured moves, and Fibonacci levels; stops sit at structural
          invalidation. Typical risk is 0.25–1.0% per trade. After TP1, we move
          to break-even and trail below 1H swing lows/highs to protect capital.
          These insights are informational and not financial advice.
        </p>
      </div>

      {/* Chart + Ảnh chú thích */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="md:col-span-2 border rounded-xl overflow-hidden bg-white">
          <TVChart symbol={tvSymbol} height={520} />
        </div>
        <div className="border rounded-xl p-3 bg-white">
          {imgUrl ? (
            <ZoomableImage src={imgUrl} alt={`${pair} ${type} setup`} />
          ) : (
            <div className="text-sm text-gray-500">
              No image provided for this signal.
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2">
            If the TradingView symbol is unavailable, use the annotated image as
            reference for target zones &amp; invalidation.
          </p>
        </div>
      </div>

      {/* Nội dung: ưu tiên intro/sections; fallback content nếu không có */}
      {intro || marketContext || technicalAnalysis || riskStrategy || faq || disclaimer ? (
        <>
          {intro && (
            <section
              className="prose max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: intro }}
            />
          )}
          {marketContext && (
            <section
              className="prose max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: marketContext }}
            />
          )}
          {technicalAnalysis && (
            <section
              className="prose max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: technicalAnalysis }}
            />
          )}
          {riskStrategy && (
            <section
              className="prose max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: riskStrategy }}
            />
          )}
          {Array.isArray(faq) && faq.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">FAQ</h2>
              <div className="space-y-3">
                {faq.map((item, idx) => (
                  <div key={idx} className="p-4 border rounded-lg bg-white">
                    <p className="font-medium">Q: {item.q}</p>
                    <p className="text-gray-700 mt-1">A: {item.a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          {disclaimer && (
            <section
              className="mt-6 p-4 bg-yellow-100 text-yellow-900 text-sm rounded"
              dangerouslySetInnerHTML={{ __html: disclaimer }}
            />
          )}
        </>
      ) : content ? (
        <section
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <div className="text-sm text-gray-500">
          No detailed content provided for this signal.
        </div>
      )}

      {/* Back link */}
      <div className="mt-10 flex items-center gap-4 text-sky-600">
        <Link href="/signals" className="hover:underline">
          ← Back to all signals
        </Link>
      </div>

      {/* ⬇️ Internal links xuống cuối trang */}
      <div className="mt-8 pt-6 border-t">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/exchanges"
            className="block p-4 rounded-xl border bg-white dark:bg-gray-800 hover:shadow-md transition"
          >
            <div className="text-sm text-gray-500">Exchange</div>
            <div className="text-lg font-semibold">Compare Top Exchanges</div>
            <p className="text-sm text-gray-600 mt-1">
              Fees • liquidity • listing quality.
            </p>
          </Link>
          <Link
            href="/wallets"
            className="block p-4 rounded-xl border bg-white dark:bg-gray-800 hover:shadow-md transition"
          >
            <div className="text-sm text-gray-500">Wallets</div>
            <div className="text-lg font-semibold">Best Crypto Wallets</div>
            <p className="text-sm text-gray-600 mt-1">
              Hardware &amp; software custody options.
            </p>
          </Link>
          <Link
            href="/staking"
            className="block p-4 rounded-xl border bg-white dark:bg-gray-800 hover:shadow-md transition"
          >
            <div className="text-sm text-gray-500">Staking</div>
            <div className="text-lg font-semibold">Staking Yields &amp; Risks</div>
            <p className="text-sm text-gray-600 mt-1">
              APY tracking &amp; validator slashing risk.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Use static generation with fallback to handle dynamic signal pages. This
// function tells Next.js which signal IDs to pre-render at build time. If a
// signal ID isn't in the returned list, Next.js will serve the page on
// demand using the fallback strategy specified below. This avoids 404
// errors for newly added signals and improves SEO by having static pages
// available for older signals.
import fs from 'fs';
import path from 'path';

export async function getStaticPaths() {
  const filePath = path.join(process.cwd(), 'data', 'signals.json');
  let signalsData = [];
  try {
    signalsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.warn('Error reading signals.json in getStaticPaths', err);
  }
  const paths = Array.isArray(signalsData)
    ? signalsData.map((s) => ({ params: { id: String(s.id) } }))
    : [];
  return {
    paths,
    // When fallback is set to 'blocking', Next.js will render pages for IDs
    // not returned in paths on-demand at request time. The initial request
    // will wait for the page to be generated, avoiding a flash of a
    // fallback page. Once generated, the page is cached and served for
    // subsequent requests.
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), 'data', 'signals.json');
  let signalsData = [];
  try {
    signalsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.warn('Error reading signals.json in getStaticProps', err);
  }
  const signal = Array.isArray(signalsData)
    ? signalsData.find((s) => String(s.id) === String(params.id))
    : null;
  if (!signal) {
    // By returning notFound: true, Next.js will render the built-in 404
    // page. This prevents infinite fallback loops and ensures invalid
    // signal IDs return a proper 404 status code.
    return { notFound: true };
  }
  return {
    props: {
      signal,
    },
    // Revalidate the page at most once per hour. This allows ISR to
    // regenerate pages when the signals.json file changes (for example,
    // when new signals are added). Adjust the value (in seconds) to suit
    // how frequently you expect signal updates. Setting it to 3600 means
    // a refresh every hour.
    revalidate: 3600,
  };
}
