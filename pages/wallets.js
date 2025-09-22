// pages/wallets.js
import { NextSeo } from "next-seo";

export default function Wallets() {
  return (
    <div className="container mx-auto px-4 py-6">
      <NextSeo
        title="Best Crypto Wallets | FinNews"
        description="Find the best crypto wallets for secure storage and easy access to your coins."
        openGraph={{
          title: "Best Crypto Wallets | FinNews",
          description:
            "Find the best crypto wallets for secure storage and easy access to your coins.",
          url: "https://finnews247.com/wallets",
        }}
        additionalMetaTags={[
          {
            name: "schema",
            content: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "Best Crypto Wallets",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  item: {
                    "@type": "Product",
                    name: "Metamask",
                    url: "https://metamask.io/",
                  },
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  item: {
                    "@type": "Product",
                    name: "Trust Wallet",
                    url: "https://trustwallet.com/",
                  },
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  item: {
                    "@type": "Product",
                    name: "Ledger",
                    url: "https://shop.ledger.com/pages/ledger-nano-x?r=YOUR_ID",
                  },
                },
              ],
            }),
          },
        ]}
      />

      <h1 className="text-2xl font-bold mb-6">🔑 Best Crypto Wallets</h1>
      <ul className="space-y-4">
        <li>
          <a
            href="https://metamask.io/"
            target="_blank"
            className="text-sky-600 hover:underline font-semibold"
          >
            Metamask
          </a>{" "}
          – Popular web3 wallet for Ethereum and EVM chains.
        </li>
        <li>
          <a
            href="https://trustwallet.com/"
            target="_blank"
            className="text-sky-600 hover:underline font-semibold"
          >
            Trust Wallet
          </a>{" "}
          – Mobile wallet supporting multi-chain assets.
        </li>
        <li>
          <a
            href="https://shop.ledger.com/pages/ledger-nano-x?r=YOUR_ID"
            target="_blank"
            className="text-sky-600 hover:underline font-semibold"
          >
            Ledger Nano X
          </a>{" "}
          – Secure hardware wallet for long-term storage.
        </li>
      </ul>
    </div>
  );
}
