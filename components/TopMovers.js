import { useEffect, useState } from "react";

export default function TopMovers() {
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&price_change_percentage=24h"
      );
      const data = await res.json();
      const sorted = [...data].sort(
        (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
      );
      setGainers(sorted.slice(0, 5));
      setLosers(sorted.slice(-5).reverse());
    }
    fetchData();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mt-6">
      <h2 className="text-lg font-bold mb-2">🚀 Top Gainers (24h)</h2>
      <ul className="text-sm mb-4 space-y-1">
        {gainers.map((c) => (
          <li key={c.id}>
            {c.symbol.toUpperCase()} +{c.price_change_percentage_24h?.toFixed(2)}%
          </li>
        ))}
      </ul>
      <h2 className="text-lg font-bold mb-2">📉 Top Losers (24h)</h2>
      <ul className="text-sm space-y-1">
        {losers.map((c) => (
          <li key={c.id}>
            {c.symbol.toUpperCase()} {c.price_change_percentage_24h?.toFixed(2)}%
          </li>
        ))}
      </ul>
    </div>
  );
}
