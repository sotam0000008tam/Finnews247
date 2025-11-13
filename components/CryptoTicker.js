import { useEffect, useState } from "react";

export default function CryptoTicker() {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false"
        );
        const data = await res.json();
        setCoins(data);
      } catch (err) {
        console.error("Error fetching coin data", err);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black text-white  whitespace-nowrap border-b border-gray-800 relative">
      <div className="flex animate-marquee">
        {/* Lặp coin list 2 lần để nối tiếp nhau */}
        {[...coins, ...coins].map((coin, idx) => (
          <span
            key={idx}
            className="mx-6 inline-flex items-center space-x-2 text-sm"
          >
            <img
              src={coin.image}
              alt={coin.symbol}
              className="w-5 h-5 rounded-full"
            />
            <span className="uppercase font-bold text-lg">{coin.symbol}</span>
            <span>${coin.current_price?.toLocaleString()}</span>
            <span
              className={
                coin.price_change_percentage_24h >= 0
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              {coin.price_change_percentage_24h?.toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
