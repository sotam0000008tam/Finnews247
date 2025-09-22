// pages/admin/signals.js
import { useState } from "react";

export default function AdminSignals() {
  const [signals, setSignals] = useState([
    {
      id: "",
      pair: "",
      exchange: "BINANCE",
      type: "Long",
      entry: "",
      target: "",
      stoploss: "",
      date: "",
      image: "",
      excerpt: "",
    },
  ]);

  // Handle input change
  const handleChange = (index, e) => {
    const newSignals = [...signals];
    newSignals[index][e.target.name] = e.target.value;
    setSignals(newSignals);
  };

  // Add new empty signal
  const addSignal = () => {
    setSignals([
      ...signals,
      {
        id: "",
        pair: "",
        exchange: "BINANCE",
        type: "Long",
        entry: "",
        target: "",
        stoploss: "",
        date: "",
        image: "",
        excerpt: "",
      },
    ]);
  };

  // Remove a signal
  const removeSignal = (index) => {
    setSignals(signals.filter((_, i) => i !== index));
  };

  const jsonOutput = JSON.stringify(signals, null, 2);

  // Download JSON
  const downloadJSON = () => {
    const blob = new Blob([jsonOutput], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `signals.json`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📝 Add Multiple Signals</h1>

      {signals.map((signal, index) => (
        <div key={index} className="border p-4 rounded mb-6 bg-gray-50">
          <h2 className="text-lg font-semibold mb-2">
            Signal #{index + 1}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ID */}
            <div>
              <label className="block text-sm font-medium mb-1">ID</label>
              <input
                type="text"
                name="id"
                value={signal.id}
                onChange={(e) => handleChange(index, e)}
                className="w-full border rounded p-2"
              />
            </div>

            {/* Pair */}
            <div>
              <label className="block text-sm font-medium mb-1">Pair</label>
              <input
                type="text"
                name="pair"
                placeholder="BTC/USDT"
                value={signal.pair}
                onChange={(e) => handleChange(index, e)}
                className="w-full border rounded p-2"
              />
            </div>

            {/* Exchange */}
            <div>
              <label className="block text-sm font-medium mb-1">Exchange</label>
              <select
                name="exchange"
                value={signal.exchange}
                onChange={(e) => handleChange(index, e)}
                className="w-full border rounded p-2"
              >
                <option value="BINANCE">BINANCE</option>
                <option value="BYBIT">BYBIT</option>
                <option value="KUCOIN">KUCOIN</option>
                <option value="OKX">OKX</option>
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                name="type"
                value={signal.type}
                onChange={(e) => handleChange(index, e)}
                className="w-full border rounded p-2"
              >
                <option value="Long">Long</option>
                <option value="Short">Short</option>
              </select>
            </div>

            {/* Entry */}
            <div>
              <label className="block text-sm font-medium mb-1">Entry</label>
              <input
                type="text"
                name="entry"
                value={signal.entry}
                onChange={(e) => handleChange(index, e)}
                className="w-full border rounded p-2"
              />
            </div>

            {/* Target */}
            <div>
              <label className="block text-sm font-medium mb-1">Target</label>
              <input
                type="text"
                name="target"
                value={signal.target}
                onChange={(e) => handleChange(index, e)}
                className="w-full border rounded p-2"
              />
            </div>

            {/* Stoploss */}
            <div>
              <label className="block text-sm font-medium mb-1">Stoploss</label>
              <input
                type="text"
                name="stoploss"
                value={signal.stoploss}
                onChange={(e) => handleChange(index, e)}
                className="w-full border rounded p-2"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="text"
                name="date"
                placeholder="2025-09-12 14:00"
                value={signal.date}
                onChange={(e) => handleChange(index, e)}
                className="w-full border rounded p-2"
              />
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium mb-1">Image</label>
              <input
                type="text"
                name="image"
                placeholder="signal6.png"
                value={signal.image}
                onChange={(e) => handleChange(index, e)}
                className="w-full border rounded p-2"
              />
            </div>

            {/* Excerpt */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Excerpt</label>
              <textarea
                name="excerpt"
                value={signal.excerpt}
                onChange={(e) => handleChange(index, e)}
                className="w-full border rounded p-2"
                rows="3"
              />
            </div>
          </div>

          {/* Remove button */}
          {signals.length > 1 && (
            <button
              onClick={() => removeSignal(index)}
              className="mt-3 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              ❌ Remove Signal
            </button>
          )}
        </div>
      ))}

      <div className="flex gap-4 mb-6">
        <button
          onClick={addSignal}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ➕ Add Another Signal
        </button>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">Generated JSON</h2>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
        {jsonOutput}
      </pre>

      <div className="mt-4 flex gap-4">
        <button
          onClick={downloadJSON}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ⬇️ Download JSON
        </button>
      </div>

      <p className="mt-2 text-gray-600">
        👉 Upload ảnh vào thư mục <code>/public/images/</code>, sau đó copy hoặc
        tải JSON này để cập nhật vào <code>data/signals.json</code>.
      </p>
    </div>
  );
}
