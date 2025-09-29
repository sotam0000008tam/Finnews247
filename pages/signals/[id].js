import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import Script from "next/script";
import Link from "next/link";
import { useState } from "react";
import signals from "../../data/signals.json";

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
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
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

export default function SignalDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const data = signals.find((s) => String(s.id) === String(id));

  if (!data) {
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
    content
  } = data;

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
    mainEntityOfPage: `https://finnews247.com/signals/${id}`
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <NextSeo title={pageTitle} description={pageDesc} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <nav className="mb-4 text-sm">
        <Link href="/signals" className="text-sky-600 hover:underline">Signals</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span>{pair}</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">{pair} — {type}</h1>
        <p className="text-gray-600 mt-1">{date}</p>
        <p className="mt-2">{excerpt}</p>
      </header>

      {/* Entry / Target / Stoploss */}
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

      {/* Chart + Zoomable Image */}
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
            If the TradingView symbol is unavailable for this asset, rely on the annotated image for target zones and invalidation.
          </p>
        </div>
      </div>

      {/* Nội dung */}
      {intro || marketContext || technicalAnalysis || riskStrategy || faq || disclaimer ? (
        <>
          {intro && (
            <section className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: intro }} />
          )}
          {marketContext && (
            <section className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: marketContext }} />
          )}
          {technicalAnalysis && (
            <section className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: technicalAnalysis }} />
          )}
          {riskStrategy && (
            <section className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: riskStrategy }} />
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
            <section className="mt-6 p-4 bg-yellow-100 text-yellow-900 text-sm rounded"
              dangerouslySetInnerHTML={{ __html: disclaimer }}
            />
          )}
        </>
      ) : content ? (
        <section className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        <div className="text-sm text-gray-500">
          No detailed content provided for this signal.
        </div>
      )}

      <div className="mt-10">
        <Link href="/signals" className="text-sky-600 hover:underline">← Back to all signals</Link>
      </div>
    </div>
  );
}
