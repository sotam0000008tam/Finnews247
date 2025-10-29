import Link from "next/link";
import signals from "../data/signals.json";

export default function TradingSignalsBoxMini() {
  // 👉 Sắp xếp tín hiệu theo ngày mới nhất
  const sortedSignals = [...signals].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sticky top-24">
      <h2 className="text-xl font-bold mb-4">📊 Trading Signals</h2>
      <ul className="space-y-3">
        {sortedSignals.slice(0, 5).map((s) => (
          <li key={s.id} className="flex justify-between items-center text-sm">
            <span className="font-semibold">{s.pair}</span>
            <span
              className={`px-2 py-1 rounded ${
                s.type === "Long"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {s.type}
            </span>
            <span className="text-xs text-gray-500">{s.date}</span>
          </li>
        ))}
      </ul>
      <Link
        href="/signals"
       className="block mt-4 text-sm text-sky-600 hover:underline">
        View all signals →
      </Link>
    </div>
  );
}

