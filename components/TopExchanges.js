// components/TopExchanges.js
import Image from "next/image";

const EXCHANGES = [
  {
    name: "Binance",
    href: "https://www.binance.com/referral/earn-together/refer-in-hotsummer/claim?hl=vi&ref=GRO_20338_OCDRL&utm_source=default",
    logo: "/logos/binance.png",
  },
  { name: "OKX", href: "https://okx.com/join/79224853", logo: "/logos/okx.png" },
  { name: "Bybit", href: "https://www.bybitglobal.com/invite?ref=DLY6OEW", logo: "/logos/bybit.png" },
];

// Link ngoài an toàn
function ExtA({ href, children, className = "", sponsored = false }) {
  const rel = sponsored ? "nofollow sponsored noopener noreferrer" : "noopener noreferrer";
  return (
    <a href={href} target="_blank" rel={rel} className={className}>
      {children}
    </a>
  );
}

export default function TopExchanges({ variant = "grid", items = EXCHANGES }) {
  if (variant === "sidebar") {
    // DANH SÁCH DỌC – MỖI MỤC 1 HÀNG, CHIẾM FULL CHIỀU NGANG
    return (
      <section className="not-prose block w-full">
        <h3 className="text-sm font-semibold mb-2">Top Exchanges</h3>
        <ul className="space-y-2">
          {items.map((ex) => (
            <li key={ex.name} className="block w-full">
              <ExtA
                href={ex.href}
                sponsored
                className="block w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-2 py-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Image src={ex.logo} alt={ex.name} width={20} height={20} className="shrink-0" />
                  <span className="truncate text-sm">{ex.name}</span>
                </div>
              </ExtA>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  // Dạng card cho vùng rộng (Signals)
  return (
    <section className="not-prose">
      <h2 className="text-lg font-semibold mb-3">🏦 Top Exchanges</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((ex) => (
          <ExtA
            key={ex.name}
            href={ex.href}
            sponsored
            className="group block rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Image src={ex.logo} alt={ex.name} width={40} height={40} />
              </div>
              <div className="min-w-0">
                <div className="font-medium truncate group-hover:underline">{ex.name}</div>
                <div className="text-xs text-gray-500">Fees • liquidity • listings</div>
              </div>
            </div>
          </ExtA>
        ))}
      </div>
    </section>
  );
}
