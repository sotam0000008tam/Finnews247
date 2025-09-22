// components/SignalFAQ.js
import { useState } from "react";

export default function SignalFAQ() {
  const faqs = [
    {
      q: "How to start crypto trading safely?",
      a: "To start trading crypto safely, choose a regulated exchange, enable 2FA, never invest more than you can afford to lose, and start with small positions.",
    },
    {
      q: "What is the safest crypto wallet?",
      a: "The safest wallets are hardware wallets like Ledger Nano X or Trezor Model T. For daily use, MetaMask is popular but should not be used for large holdings.",
    },
    {
      q: "Which exchanges have the lowest fees?",
      a: "Binance and Kraken are known for competitive fees. Coinbase is beginner-friendly but has higher transaction costs.",
    },
    {
      q: "What is crypto staking and how does it work?",
      a: "Staking involves locking your crypto in a network to support its security and operations, in return for earning rewards (similar to interest).",
    },
    {
      q: "Are crypto signals reliable?",
      a: "Crypto signals can provide insights, but they are not always accurate. Use them as guidance and combine with your own research before trading.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mt-10">
      <h2 className="text-2xl font-bold mb-6">❓ Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((item, idx) => (
          <div key={idx} className="border-b border-gray-300 dark:border-gray-700 pb-3">
            <button
              className="flex justify-between items-center w-full text-left font-semibold"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            >
              <span>{item.q}</span>
              <span>{openIndex === idx ? "−" : "+"}</span>
            </button>
            {openIndex === idx && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{item.a}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
