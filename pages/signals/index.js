import Link from "next/link";
import { NextSeo } from "next-seo";
import signals from "../../data/signals.json";

// Widgets sẵn có
import BestWallets from "../../components/BestWallets";
import TopStaking from "../../components/TopStaking";
import TopExchanges from "../../components/TopExchanges";
import SignalFAQ from "../../components/SignalFAQ";
import FAQSchema from "../../components/FAQSchema";

// ✅ Lấy thumbnail nếu có
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
  // Structured data cho danh sách signals
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

  // Sắp xếp mới nhất
  const sortedSignals = [...signals].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <NextSeo
        title="Trading Signals | FinNews"
        description="Latest crypto trading signals with entry, target, and stoploss."
        canonical="https://www.finnews247.com/signals"
      />

      {/* FAQ Schema SEO */}
      <FAQSchema />

      {/* JSON-LD Structured Data */}
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
              {/* Bên trái: text */}
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

              {/* Bên phải: Thumbnail */}
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

      {/* Box bổ sung (giữ nguyên) */}
      <div className="mt-10 space-y-6">
        <TopExchanges />
        <BestWallets />
        <TopStaking />
      </div>

      {/* 🔎 NEW: Methodology (ngay trên FAQ, tăng chữ/SEO) */}
      <div className="mt-8 p-4 rounded-xl bg-white border">
        <h2 className="text-lg font-semibold mb-2">Methodology</h2>
        <p className="text-sm text-gray-700">
          Our trading signals are built from 1H–4H price action, liquidity maps
          (equal highs/lows, fair value gaps), market structure (HH/HL vs. LH/LL),
          and confluence with 20/50/200 EMA. Momentum (RSI/MACD) and volume
          profile help validate direction. Targets are tiered at prior swing
          levels, measured moves and Fibonacci projections. Stops are placed at
          structural invalidation (e.g., below last higher low for longs). Risk
          per trade is typically 0.25–1.0% with break-even after TP1 and a
          trailing stop under 1H swing lows/highs. Past performance does not
          guarantee future results.
        </p>
      </div>

      {/* FAQ cho SEO + UX */}
      <SignalFAQ />

      {/* Disclaimer (giữ nguyên copy) */}
      <div className="mt-6 p-3 bg-yellow-100 text-yellow-900 text-sm rounded">
        This content is for informational purposes only and not financial advice.
      </div>

      {/* ⬇️ Internal links xuống cuối trang */}
      <div className="mt-8 pt-6 border-t">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/exchanges"
            className="block p-4 rounded-xl border bg-white dark:bg-gray-800 hover:shadow-md transition"
          >
            <div className="text-sm text-gray-500">Explore</div>
            <div className="text-lg font-semibold">Top Crypto Exchanges</div>
            <p className="text-sm text-gray-600 mt-1">
              Compare trading fees, liquidity, and security.
            </p>
          </Link>
          <Link
            href="/wallets"
            className="block p-4 rounded-xl border bg-white dark:bg-gray-800 hover:shadow-md transition"
          >
            <div className="text-sm text-gray-500">Secure</div>
            <div className="text-lg font-semibold">Best Crypto Wallets</div>
            <p className="text-sm text-gray-600 mt-1">
              Custodial & non-custodial options for every user.
            </p>
          </Link>
          <Link
            href="/staking"
            className="block p-4 rounded-xl border bg-white dark:bg-gray-800 hover:shadow-md transition"
          >
            <div className="text-sm text-gray-500">Earn</div>
            <div className="text-lg font-semibold">Crypto Staking Yields</div>
            <p className="text-sm text-gray-600 mt-1">
              Track APY and validator risk before you stake.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
