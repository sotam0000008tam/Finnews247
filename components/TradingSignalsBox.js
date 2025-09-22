// components/TradingSignalsBoxWide.js
import Link from "next/link";

export default function TradingSignalsBoxWide() {
  const signals = [
    {
      pair: "ETH/USDT",
      type: "Short",
      entry: 4520,
      target: 4300,
      stoploss: 4600,
      time: "2025-09-12 11:00",
    },
    {
      pair: "SOL/USDT",
      type: "Long",
      entry: 238,
      target: 260,
      stoploss: 230,
      time: "2025-09-12 12:00",
    },
    {
      pair: "XRP/USDT",
      type: "Long",
      entry: 3.05,
      target: 3.50,
      stoploss: 2.90,
      time: "2025-09-12 12:30",
    },
    {
      pair: "DOGE/USDT",
      type: "Short",
      entry: 0.262,
      target: 0.230,
      stoploss: 0.275,
      time: "2025-09-12 13:00",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">📊 Trading Signals</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-3 py-2 text-left">Pair</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Entry</th>
              <th className="px-3 py-2">Target</th>
              <th className="px-3 py-2">Stoploss</th>
              <th className="px-3 py-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {signals.map((s, i) => (
              <tr
                key={i}
                className="border-t hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-3 py-2 font-medium">{s.pair}</td>
                <td
                  className={`px-3 py-2 font-semibold ${
                    s.type === "Long" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {s.type}
                </td>
                <td className="px-3 py-2">{s.entry}</td>
                <td className="px-3 py-2">{s.target}</td>
                <td className="px-3 py-2">{s.stoploss}</td>
                <td className="px-3 py-2 text-xs text-gray-500">{s.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end">
        <Link
          href="/signals"
          className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 text-sm"
        >
          View All Signals →
        </Link>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        ⚠️ Trading signals are for educational purposes only — not financial
        advice.
      </div>
    </div>
  );
}
