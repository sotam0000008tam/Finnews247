// components/TopMovers.jsx
import Link from "next/link";

export default function TopMovers({ gainers = [], losers = [] }) {
  const hasGainers = Array.isArray(gainers) && gainers.length > 0;
  const hasLosers = Array.isArray(losers) && losers.length > 0;

  // Không có dữ liệu → ẩn hoàn toàn widget
  if (!hasGainers && !hasLosers) return null;

  const Row = ({ item }) => {
    const sym = item.symbol || item.ticker || item.pair || item.name || "-";
    const price = item.price || item.last || item.close;
    const pctVal = item.change24h ?? item.change ?? item.pct;
    const pctStr =
      typeof pctVal === "number" ? `${pctVal.toFixed(2)}%` : (pctVal || "");
    const isUp = typeof pctVal === "number" ? pctVal >= 0 : pctStr?.startsWith("+");

    return (
      <div className="flex items-center justify-between py-2">
        <span className="font-medium">{sym}</span>
        <span className="text-sm text-gray-500">
          {price !== undefined ? `$${price}` : ""}
        </span>
        <span className={`text-sm font-semibold ${isUp ? "text-green-600" : "text-red-600"}`}>
          {pctStr}
        </span>
      </div>
    );
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Top Movers (24h)</h2>
        <Link href="/market" className="text-sm text-sky-600 hover:underline">
          Market →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {hasGainers && (
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-3">
            <div className="font-semibold mb-2">Top Gainers</div>
            {gainers.slice(0, 5).map((it, i) => (
              <Row key={`g-${i}`} item={it} />
            ))}
          </div>
        )}
        {hasLosers && (
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-3">
            <div className="font-semibold mb-2">Top Losers</div>
            {losers.slice(0, 5).map((it, i) => (
              <Row key={`l-${i}`} item={it} />
            ))}
          </div>
        )}
      </div>

      {(!hasGainers || !hasLosers) && (
        <div className="mt-3 text-xs text-gray-500">
          Một phần dữ liệu market chưa khả dụng.
        </div>
      )}
    </section>
  );
}
