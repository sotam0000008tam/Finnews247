// components/BestWallets.js
import Image from "next/image";

const WALLETS = [
  { name: "MetaMask", href: "https://metamask.io/", logo: "/logos/metamask.png" },
  { name: "Trust Wallet", href: "https://trustwallet.com/", logo: "/logos/trustwallet.png" },
  { name: "Phantom", href: "https://phantom.app/", logo: "/logos/phantom.png" },
];

function ExtA({ href, children, className = "" }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}

export default function BestWallets({ variant = "grid", items = WALLETS }) {
  if (variant === "sidebar") {
    return (
      <section className="not-prose block w-full">
        <h3 className="text-sm font-semibold mb-2">Best Crypto Wallets</h3>
        <ul className="space-y-2">
          {items.map((w) => (
            <li key={w.name} className="block w-full">
              <ExtA
                href={w.href}
                className="block w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-2 py-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Image src={w.logo} alt={w.name} width={20} height={20} className="shrink-0" />
                  <span className="truncate text-sm">{w.name}</span>
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
      <h2 className="text-lg font-semibold mb-3">💼 Best Crypto Wallets</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((w) => (
          <ExtA
            key={w.name}
            href={w.href}
            className="group block rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Image src={w.logo} alt={w.name} width={40} height={40} />
              </div>
              <div className="min-w-0">
                <div className="font-medium truncate group-hover:underline">{w.name}</div>
                <div className="text-xs text-gray-500">Self-custody • security</div>
              </div>
            </div>
          </ExtA>
        ))}
      </div>
    </section>
  );
}
