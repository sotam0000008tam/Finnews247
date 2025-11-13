// components/TopStaking.js
import Image from "next/image";

const STAKING = [
  { name: "Ethereum 2.0", logo: "/logos/eth.png", href: "https://ethereum.org/en/staking/" },
  { name: "Solana Staking", logo: "/logos/sol.png", href: "https://solana.com/staking" },
  { name: "Polkadot", logo: "/logos/dot.png", href: "https://polkadot.network/" },
];

function ExtA({ href, children, className = "" }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}

export default function TopStaking({ variant = "grid", items = STAKING }) {
  if (variant === "sidebar") {
    return (
      <section className="not-prose block w-full">
        <h3 className="text-sm font-semibold mb-2">Top Staking Opportunities</h3>
        <ul className="space-y-2">
          {items.map((s) => (
            <li key={s.name} className="block w-full">
              <ExtA
                href={s.href}
                className="block w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-2 py-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Image src={s.logo} alt={s.name} width={20} height={20} className="shrink-0" />
                  <span className="truncate text-sm">{s.name}</span>
                </div>
              </ExtA>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section className="not-prose">
      <h2 className="text-lg font-semibold mb-3">💎 Top Staking Opportunities</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((s) => (
          <ExtA
            key={s.name}
            href={s.href}
            className="group block rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Image src={s.logo} alt={s.name} width={40} height={40} />
              </div>
              <div className="min-w-0">
                <div className="font-medium truncate group-hover:underline">{s.name}</div>
                <div className="text-xs text-gray-500">Yields • risks</div>
              </div>
            </div>
          </ExtA>
        ))}
      </div>
    </section>
  );
}
