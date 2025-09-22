import Image from "next/image";

export default function BestWallets() {
  const wallets = [
    { name: "MetaMask", link: "https://metamask.io/", logo: "/logos/metamask.png" },
    { name: "Trust Wallet", link: "https://trustwallet.com/", logo: "/logos/trustwallet.png" },
    { name: "Phantom", link: "https://phantom.app/", logo: "/logos/phantom.png" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mt-6">
      <h2 className="text-xl font-bold mb-4">💼 Best Crypto Wallets</h2>
      <ul className="space-y-3">
        {wallets.map((w, i) => (
          <li key={i} className="flex items-center gap-2">
            <Image src={w.logo} alt={w.name} width={20} height={20} />
            <a
              href={w.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-600 hover:underline"
            >
              {w.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
