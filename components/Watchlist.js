import { useState, useEffect } from "react";

export default function Watchlist() {
  const [coins, setCoins] = useState([]);
  const [input, setInput] = useState("");
  const [prices, setPrices] = useState({});

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("watchlist") : null;
    if (saved) setCoins(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("watchlist", JSON.stringify(coins));
    }
  }, [coins]);

  useEffect(() => {
    if (coins.length === 0) return;
    async function fetchPrices() {
      try {
        const ids = coins.join(",");
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
        );
        const data = await res.json();
        setPrices(data);
      } catch (e) {
        console.error(e);
      }
    }
    fetchPrices();
  }, [coins]);

  const addCoin = () => {
    const val = input.trim().toLowerCase();
    if (val && !coins.includes(val)) setCoins([...coins, val]);
    setInput("");
  };
  const removeCoin = (id) => setCoins(coins.filter((c) => c !== id));

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mt-6">
      <h2 className="text-lg font-bold mb-2">👀 My Watchlist</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          placeholder="bitcoin, ethereum, solana..."
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded p-2 dark:bg-gray-700"
        />
        <button
          onClick={addCoin}
          className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          ➕ Add
        </button>
      </div>
      {coins.length === 0 ? (
        <p className="text-sm text-gray-500">No coins in watchlist yet.</p>
      ) : (
        <ul className="space-y-2">
          {coins.map((id) => (
            <li key={id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-2 rounded">
              <span className="font-semibold uppercase">{id}</span>
              {prices[id] ? (
                <span>
                  ${prices[id].usd.toLocaleString()}{" "}
                  <span className={prices[id].usd_24h_change > 0 ? "text-green-500" : "text-red-500"}>
                    {prices[id].usd_24h_change.toFixed(2)}%
                  </span>
                </span>
              ) : (
                <span className="text-gray-400">Loading...</span>
              )}
              <button onClick={() => removeCoin(id)} className="ml-2 text-red-500 hover:text-red-700">❌</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
