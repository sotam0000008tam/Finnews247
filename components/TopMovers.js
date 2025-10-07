// components/TopMovers.js
import { useEffect, useState } from "react";

export default function TopMovers() {
  const [rows, setRows] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/market-prices");
        const json = await res.json();
        if (!mounted) return;
        // Chỉ lấy những item có changeNum là số
        const list = (json || []).filter(
          (x) => typeof x?.changeNum === "number" && Number.isFinite(x.changeNum)
        );
        setRows(list);
      } catch {
        if (mounted) setRows([]);
      } finally {
        if (mounted) setLoaded(true);
      }
    })();
    return () => (mounted = false);
  }, []);

  if (loaded && rows.length === 0) return null; // ẩn khi rỗng

  const gainers = [...rows]
    .sort((a, b) => b.changeNum - a.changeNum)
    .slice(0, 5);
  const losers = [...rows]
    .sort((a, b) => a.changeNum - b.changeNum)
    .slice(0, 5);

  return (
    <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">Top Movers (24h)</h3>
      {!loaded ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Top Gainers</h4>
            <ul className="space-y-1">
              {gainers.map((g, i) => (
                <li key={i} className="text-sm">
                  {g.symbol}: {g.changeNum.toFixed(2)}% (${g.price})
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Top Losers</h4>
            <ul className="space-y-1">
              {losers.map((l, i) => (
                <li key={i} className="text-sm">
                  {l.symbol}: {l.changeNum.toFixed(2)}% (${l.price})
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
