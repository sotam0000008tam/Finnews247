import Link from "next/link";
import signals from "../data/signals.json";

export default function TradingSignalsBoxMain() {
  // 👉 Sắp xếp tín hiệu theo ngày mới nhất
  const sortedSignals = [...signals].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6">📊 Latest Trading Signals</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {sortedSignals.slice(0, 4).map((s) => (
          <div
            key={s.id}
            className="p-4 border rounded-lg hover:shadow-lg transition bg-gray-50 dark:bg-gray-900"
          >
            <h3 className="font-semibold text-lg">
              {s.pair} —{" "}
              <span
                className={
                  s.type === "Long" ? "text-green-600" : "text-red-600"
                }
              >
                {s.type}
              </span>
            </h3>
            <p className="text-xs text-gray-500 mb-2">{s.date}</p>

            {/* ✅ Gom Entry / Target / Stoploss thành 1 dòng */}
            <p className="text-sm">
              Entry: <b>{s.entry}</b> • Target: <b>{s.target}</b> • SL:{" "}
              <b>{s.stoploss}</b>
            </p>

            <Link
              href={`/signals/${s.id}`}
             className="mt-3 inline-block text-sm text-sky-600 hover:underline">
              View details →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

