import Link from "next/link";
import Image from "next/image";

export default function SidebarWidgets() {
  const exchanges = [
    { name: "Binance", volume: "$12.5B", slug: "binance", img: "/icons/binance.png" },
    { name: "Coinbase", volume: "$2.8B", slug: "coinbase", img: "/icons/coinbase.png" },
    { name: "Kraken", volume: "$1.6B", slug: "kraken", img: "/icons/kraken.png" },
  ];

  const wallets = [
    { name: "Ledger Nano X", desc: "Secure hardware wallet", slug: "ledger-nano-x", img: "/icons/ledger.png" },
    { name: "Trezor Model T", desc: "Advanced features wallet", slug: "trezor-model-t", img: "/icons/trezor.png" },
    { name: "MetaMask", desc: "Popular DeFi wallet", slug: "metamask", img: "/icons/metamask.png" },
  ];

  const staking = [
    { name: "Ethereum (ETH)", desc: "Stake ETH on trusted platforms", slug: "ethereum-staking", img: "/icons/eth.png" },
    { name: "Cardano (ADA)", desc: "Passive income with ADA staking", slug: "cardano-staking", img: "/icons/ada.png" },
    { name: "Polkadot (DOT)", desc: "Stake DOT to earn yield", slug: "polkadot-staking", img: "/icons/dot.png" },
  ];

  return (
    <>
      {/* Top Exchanges */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mt-6">
        <h2 className="text-lg font-bold mb-3">🏦 Top Exchanges</h2>
        <ul className="space-y-3">
          {exchanges.map((ex) => (
            <li key={ex.slug} className="flex items-center gap-3">
              <Image src={ex.img} alt={ex.name} width={24} height={24} />
              <div>
                <Link href={`/reviews/${ex.slug}`} className="font-medium hover:underline">
                  {ex.name}
                </Link>
                <p className="text-xs text-gray-500">{ex.volume}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Best Wallets */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mt-6">
        <h2 className="text-lg font-bold mb-3">🔑 Best Crypto Wallets</h2>
        <ul className="space-y-3">
          {wallets.map((w) => (
            <li key={w.slug} className="flex items-center gap-3">
              <Image src={w.img} alt={w.name} width={24} height={24} />
              <div>
                <Link href={`/reviews/${w.slug}`} className="font-medium hover:underline">
                  {w.name}
                </Link>
                <p className="text-xs text-gray-500">{w.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Staking Opportunities */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mt-6">
        <h2 className="text-lg font-bold mb-3">💸 Top Staking</h2>
        <ul className="space-y-3">
          {staking.map((s) => (
            <li key={s.slug} className="flex items-center gap-3">
              <Image src={s.img} alt={s.name} width={24} height={24} />
              <div>
                <Link href={`/reviews/${s.slug}`} className="font-medium hover:underline">
                  {s.name}
                </Link>
                <p className="text-xs text-gray-500">{s.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

