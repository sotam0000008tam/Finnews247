// pages/signals/index.js
import Link from "next/link";
import { NextSeo } from "next-seo";
import signals from "../../data/signals.json";
import FAQSchema from "../../components/FAQSchema";

// 3 mục cuối trang (đã viết lại dạng card/grid, tự gắn rel="nofollow sponsored" cho link affiliate)
import BestWallets from "../../components/BestWallets";
import TopStaking from "../../components/TopStaking";
import TopExchanges from "../../components/TopExchanges";

import SignalFAQ from "../../components/SignalFAQ";

function getThumbnail(s) {
  const match = s.content?.match(/<img[^>]+src="([^">]+)"/i);
  if (match) return match[1];
  if (s.image) {
    if (s.image.startsWith("/")) return s.image;
    return `/images/${s.image}`;
  }
  return null;
}

export default function SignalsPage() {
  const itemListElement = signals.map((s, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `https://www.finnews247.com/signals/${s.id}`,
    name: `${s.pair} ${s.type} Signal`,
  }));

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Crypto Trading Signals",
    description:
      "List of latest cryptocurrency trading signals including entry, target, and stoploss.",
    url: "https://www.finnews247.com/signals",
    itemListElement,
  };

  const sortedSignals = [...signals].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <NextSeo
        title="Trading Signals | FinNews247"
        description="Latest crypto trading signals with entry, target, and stoploss."
        canonical="https://www.finnews247.com/signals"
        openGraph={{
          title: "Trading Signals | FinNews247",
          description:
            "Latest crypto trading signals with entry, target, and stoploss.",
          url: "https://www.finnews247.com/signals",
          images: [{ url: "https://www.finnews247.com/logo.png" }],
        }}
      />

      <FAQSchema />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <h1 className="text-2xl font-bold mb-3">📊 All Trading Signals</h1>
      <p className="text-gray-600 mb-6">
        Explore the latest cryptocurrency trading signals with clear entry,
        target, and stoploss levels. Updated frequently for traders who need
        quick and reliable insights.
      </p>

      {/* Danh sách tín hiệu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedSignals.map((s) => {
          const thumbnail = getThumbnail(s);
          return (
            <Link
              key={s.id}
              href={`/signals/${s.id}`}
              className="flex items-center justify-between p-4 border rounded-xl hover:shadow-lg transition bg-white dark:bg-gray-800"
            >
              <div className="flex-1 pr-4">
                <h2 className="font-semibold">
                  {s.pair} —{" "}
                  <span
                    className={
                      s.type === "Long" ? "text-green-600" : "text-red-600"
                    }
                  >
                    {s.type}
                  </span>
                </h2>
                <p className="text-sm text-gray-600">{s.date}</p>
                <p className="mt-2 text-sm">{s.excerpt}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Entry {s.entry} • Target {s.target} • Stoploss {s.stoploss}
                </p>
              </div>

              {thumbnail && (
                <div className="ml-4 flex-shrink-0">
                  <img
                    src={thumbnail}
                    alt={s.title || s.pair}
                    className="w-28 h-20 object-cover rounded-md border"
                  />
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* 3 mục chỉ đặt ở trang Signals: card/grid rõ ràng, link affiliate tự gắn rel="nofollow sponsored" */}
      <div className="mt-10 space-y-10 not-prose">
        <TopExchanges />
        <BestWallets />
        <TopStaking />
      </div>

      <div className="mt-8 p-4 rounded-xl bg-white border">
        <h2 className="text-lg font-semibold mb-2">Methodology</h2>
        <p className="text-sm text-gray-700">
          Our trading signals are built from 1H–4H price action, liquidity maps,
          market structure, and confluence with EMAs. Momentum (RSI/MACD)
          and volume profile help validate direction. Targets are tiered at prior swing levels;
          stops are placed at structural invalidation. This is not financial advice.
        </p>
      </div>

      <SignalFAQ />

      <div className="mt-6 p-3 bg-yellow-100 text-yellow-900 text-sm rounded">
        This content is for informational purposes only and not financial advice.
      </div>
    </div>
  );
}
