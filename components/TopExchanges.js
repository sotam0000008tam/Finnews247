import Image from "next/image";

export default function TopExchanges() {
  const exchanges = [
    { name: "Binance", link: "https://www.binance.com/referral/earn-together/refer-in-hotsummer/claim?hl=vi&ref=GRO_20338_OCDRL&utm_source=default", logo: "/logos/binance.png" },
    { name: "OKX", link: "https://okx.com/join/79224853", logo: "/logos/okx.png" },
    { name: "Bybit", link: "https://www.bybitglobal.com/invite?ref=DLY6OEW", logo: "/logos/bybit.png" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mt-6">
      <h2 className="text-xl font-bold mb-4">🏦 Top Exchanges</h2>
      <ul className="space-y-3">
        {exchanges.map((ex, i) => (
          <li key={i} className="flex items-center gap-2">
            <Image src={ex.logo} alt={ex.name} width={20} height={20} />
            <a
              href={ex.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-600 hover:underline"
            >
              {ex.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
