import { NextSeo } from "next-seo";
import Link from "next/link";
import Script from "next/script";
import signals from "../../data/signals.json";
import { useState } from "react";

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
  return isPerp ? `BYBIT:${compact}` : `BINANCE:${compact}`;
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

// Pre-render all signal pages
export async function getStaticPaths() {
  const paths = signals.map((s) => ({ params: { id: String(s.id) } }));
  return { paths, fallback: false };
}

// Get data for each signal
export async function getStaticProps({ params }) {
  const signal = signals.find((s) => String(s.id) === params.id) || null;
  if (!signal) {
    return { notFound: true };
  }
  return { props: { signal } };
}

export default function SignalDetailPage({ signal }) {
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

  const articleJson = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: pageTitle,
    description: pageDesc,
    author: { "@type": "Organization", name: "FinNews247" },
    datePublished: date,
    mainEntityOfPage: `https://www.finnews247.com/signals/${id}`,
  };
  const breadcrumbJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.finnews247.com/" },
      { "@type": "ListItem", position: 2, name: "Trading Signals", item: "https://www.finnews247.com/signals" },
      { "@type": "ListItem", position: 3, name: pair, item: `https://www.finnews247.com/signals/${id}` },
    ],
  };

  // Build array of optional sections
  const sections = [];
  if (intro) sections.push(<section key="intro" className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: intro }} />);
  if (marketContext) sections.push(<section key="market" className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: marketContext }} />);
  if (technicalAnalysis) sections.push(<section key="technical" className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: technicalAnalysis }} />);
  if (riskStrategy) sections.push(<section key="risk" className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: riskStrategy }} />);
  if (Array.isArray(faq) && faq.length > 0) {
    sections.push(
      <section key="faq" className="mb-8">
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
    );
  }
  if (disclaimer) sections.push(<section key="disclaimer" className="mt-6 p-4 bg-yellow-100 text-yellow-900 text-sm rounded" dangerouslySetInnerHTML={{ __html: disclaimer }} />);

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
          images: imgUrl ? [{ url: imgUrl }] : [{ url: "https://www.finnews247.com/logo.png" }],
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJson) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJson) }} />

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

      <div className="mb-8 p-4 rounded-xl bg-white border">
        <h2 className="text-lg font-semibold mb-2">Methodology (Summary)</h2>
        <p className="text-sm text-gray-700">
          Signals are derived from 1H–4H structure, liquidity cues, confluence with EMA, and momentum via RSI/MACD. Targets are tiered; stops sit at structural invalidation. Risk per trade is typically 0.25–1.0%.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="md:col-span-2 border rounded-xl overflow-hidden bg-white">
          <TVChart symbol={tvSymbol} height={520} />
        </div>
        <div className="border rounded-xl p-3 bg-white">
          {imgUrl ? (
            <ZoomableImage src={imgUrl} alt={`${pair} ${type} setup`} />
          ) : (
            <div className="text-sm text-gray-500">No image provided for this signal.</div>
          )}
          <p className="text-xs text-gray-500 mt-2">
            If the TradingView symbol is unavailable, use the annotated image as reference for target zones & invalidation.
          </p>
        </div>
      </div>

      {/* Render sections or fallback */}
      {sections.length > 0 ? (
        <>{sections}</>
      ) : content ? (
        <section className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        <div className="text-sm text-gray-500">No detailed content provided for this signal.</div>
      )}

      <div className="mt-10 flex items-center gap-4 text-sky-600">
        <Link href="/signals" className="hover:underline">
          ← Back to all signals
        </Link>
      </div>
    </div>
  );
}
