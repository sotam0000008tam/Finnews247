// components/TopStaking.js
export default function TopStaking() {
  const staking = [
    { name: "Ethereum 2.0", logo: "/logos/eth.png", url: "https://ethereum.org/en/staking/" },
    { name: "Solana Staking", logo: "/logos/sol.png", url: "https://solana.com/staking" },
    { name: "Polkadot", logo: "/logos/dot.png", url: "https://polkadot.network/" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mt-6">
      <h2 className="text-xl font-bold mb-4">💎 Top Staking Opportunities</h2>
      <ul className="space-y-3">
        {staking.map((s) => (
          <li key={s.name} className="flex items-center gap-3">
            <img src={s.logo} alt={s.name} className="w-6 h-6 rounded" />
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {s.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
