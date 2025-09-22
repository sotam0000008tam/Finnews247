// pages/signals/[id].js
import { useRouter } from "next/router";
import signals from "../../data/signals.json";
import { NextSeo } from "next-seo";
import { useState } from "react";
import BestWallets from "../../components/BestWallets";
import TopStaking from "../../components/TopStaking";
import TopExchanges from "../../components/TopExchanges"; // ✅ giữ nguyên import gốc

export default function SignalDetail() {
  const router = useRouter();
  const { id } = router.query;
  const signal = signals.find((s) => String(s.id) === String(id));

  const [isOpen, setIsOpen] = useState(false);

  if (!signal) return <p className="p-6">Signal not found.</p>;

  const title = `${signal.pair} — ${signal.type} | Crypto Trading Signal`;
  const desc = `Trading signal for ${signal.pair}: ${signal.type}. Entry ${signal.entry}, Target ${signal.target}, Stoploss ${signal.stoploss} (${signal.date}).`;
  const tvSymbol = signal.pair.replace("/", "");

  // ✅ JSON-LD cho từng tín hiệu (NewsArticle)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: `${signal.pair} ${signal.type} Signal`,
    datePublished: signal.date,
    author: { "@type": "Organization", name: "FinNews247" },
    publisher: {
      "@type": "Organization",
      name: "FinNews247",
      logo: { "@type": "ImageObject", url: "https://finnews247.com/logo.png" },
    },
    image: [
      signal.image
        ? `https://finnews247.com/images/${signal.image}`
        : "https://finnews247.com/default-signal.jpg",
    ],
    description: `Signal details for ${signal.pair}: Entry ${signal.entry}, Target ${signal.target}, Stoploss ${signal.stoploss}.`,
    mainEntityOfPage: `https://finnews247.com/signals/${signal.id}`,
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* ✅ SEO Meta cho signal detail */}
      <NextSeo
        title={title}
        description={desc}
        openGraph={{
          title,
          description: desc,
          url: `https://finnews247.com/signals/${id}`,
          images: [
            {
              url: signal.image
                ? `https://finnews247.com/images/${signal.image}`
                : "https://finnews247.com/default-signal.jpg",
            },
          ],
        }}
        additionalMetaTags={[
          {
            name: "keywords",
            content: `${signal.pair} trading signal, crypto ${signal.type.toLowerCase()} signal, entry target stoploss, ${signal.pair} forecast, crypto signals`,
          },
        ]}
      />

      {/* ✅ JSON-LD Structured Data cho từng signal */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <h1 className="text-2xl font-bold mb-2">
        {signal.pair} —{" "}
        <span
          className={signal.type === "Long" ? "text-green-600" : "text-red-600"}
        >
          {signal.type}
        </span>
      </h1>
      <p className="text-gray-600 mb-4">{signal.date}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Info block */}
        <div className="space-y-2">
          {/* Entry / Target / Stoploss xuống 3 dòng riêng biệt */}
          <p>
            <b>Entry:</b> {signal.entry}
          </p>
          <p>
            <b>Target:</b> {signal.target}
          </p>
          <p>
            <b>Stoploss:</b> {signal.stoploss}
          </p>

          <p className="text-sm text-gray-600">{signal.excerpt}</p>
          <div className="mt-4 p-3 bg-yellow-100 text-yellow-900 text-sm rounded">
            ⚠️ <b>Disclaimer:</b> This content is for informational purposes
            only and not financial advice.
          </div>
        </div>

        {/* Charts block (giữ nguyên cấu trúc gốc) */}
        <div
          className={`grid gap-6 ${
            signal.image ? "md:grid-cols-2" : "md:grid-cols-1"
          }`}
        >
          {/* Custom chart image với zoom */}
          {signal.image && (
            <div>
              <h2 className="text-lg font-semibold mb-2">📊 Custom Chart</h2>
              <img
                src={`/images/${signal.image}`}
                alt={`${signal.pair} custom chart`}
                className="rounded-xl border w-full h-auto cursor-pointer hover:opacity-90"
                onClick={() => setIsOpen(true)}
              />
              {isOpen && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                  onClick={() => setIsOpen(false)}
                >
                  <img
                    src={`/images/${signal.image}`}
                    alt={`${signal.pair} zoomed chart`}
                    className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
                  />
                </div>
              )}
            </div>
          )}

          {/* TradingView Chart */}
          <div>
            <h2 className="text-lg font-semibold mb-2">📈 Live TradingView</h2>
            <iframe
              src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_${tvSymbol}&symbol=BINANCE:${tvSymbol}&interval=60&hidesidetoolbar=1&theme=light&style=1&timezone=Etc/UTC`}
              width="100%"
              height="500"
              frameBorder="0"
              allowTransparency={true}
              scrolling="no"
            ></iframe>
          </div>
        </div>
      </div>

      {/* ✅ Extra Boxes bên dưới */}
      <div className="mt-10 space-y-6">
        <TopExchanges />
        <BestWallets />
        <TopStaking />
      </div>
    </div>
  );
}
