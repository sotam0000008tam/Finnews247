// components/TradingSignalsBoxWide.js
import Link from "next/link";
import signals from "../data/signals.json";

export default function TradingSignalsBoxWide() {
  const latestSignals = signals.slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-sky-600">
        📊 Featured Trading Signals
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-300 dark:border-gray-700 text-left">
              <th className="py-2">Pair</th>
              <th className="py-2">Type</th>
              <th className="py-2">Entry</th>
              <th className="py-2">Target</th>
              <th className="py-2">Stop</th>
              <th className="py-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {latestSignals.map((s, i) => (
              <tr
                key={i}
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <td className="py-2 font-semibold">{s.pair}</td>
                <td
                  className={`py-2 font-bold ${
                    s.type === "Long" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {s.type}
                </td>
                <td className="py-2">{s.entry}</td>
                <td className="py-2">{s.target}</td>
                <td className="py-2">{s.stoploss}</td>
                <td className="py-2 text-xs text-gray-500">{s.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CTA nổi bật */}
      <div className="mt-6 text-center">
        <Link
          href="/signals"
         className="inline-block px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg shadow transition">
          View All Signals →
        </Link>
      </div>

      {/* Disclaimer */}
      <p className="text-[12px] text-gray-500 mt-4 text-center">
        ⚠️ Trading signals are for educational purposes only — not financial
        advice.
      </p>
    </div>
  );
}

