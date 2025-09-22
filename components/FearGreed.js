import { useEffect, useState } from "react";

export default function FearGreed() {
  const [index, setIndex] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("https://api.alternative.me/fng/");
      const data = await res.json();
      setIndex(data.data[0]);
    }
    fetchData();
  }, []);

  if (!index) return <p className="p-4">Loading Fear & Greed...</p>;

  const date = new Date(index.timestamp * 1000).toLocaleDateString();

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mt-6">
      <h2 className="text-lg font-bold mb-2">😨 Fear & Greed Index</h2>
      <p className="text-2xl font-bold mb-1">
        {index.value} ({index.value_classification})
      </p>
      <p className="text-sm text-gray-500">Updated: {date}</p>
    </div>
  );
}
