// components/CategoryRail.js
import Link from "next/link";

const CATS = [
  { href: "/signals", label: "Trading Signals" },
  { href: "/altcoins", label: "Altcoin Analysis" },
  { href: "/crypto-exchanges", label: "Exchanges" },
  { href: "/best-crypto-apps", label: "Apps & Wallets" },
  { href: "/insurance", label: "Insurance & Tax" },
  { href: "/crypto-market", label: "Crypto & Market" },
];

export default function CategoryRail() {
  return (
    <section className="mt-10">
      <h3 className="text-lg font-semibold mb-3">Explore Categories</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
        {CATS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
           className="block rounded-lg border px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800">
            {c.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

