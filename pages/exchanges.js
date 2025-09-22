// pages/exchanges.js
import { NextSeo } from "next-seo";

export default function Exchanges() {
  return (
    <div className="container mx-auto px-4 py-6">
      <NextSeo
        title="Top Crypto Exchanges | FinNews"
        description="Discover the best crypto exchanges for trading, staking, and derivatives."
        openGraph={{
          title: "Top Crypto Exchanges | FinNews",
          description:
            "Discover the best crypto exchanges for trading, staking, and derivatives.",
          url: "https://finnews247.com/exchanges",
        }}
        additionalMetaTags={[
          {
            name: "schema",
            content: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "Top Crypto Exchanges",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Binance",
                  url: "https://accounts.binance.com/en/register?ref=YOUR_ID",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Bybit",
                  url: "https://partner.bybit.com/b/YOUR_ID",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "OKX",
                  url: "https://www.okx.com/join/YOUR_ID",
                },
              ],
            }),
          },
        ]}
      />

      <h1 className="text-2xl font-bold mb-6">🏦 Top Crypto Exchanges</h1>
      <ul className="space-y-4">
        <li>
          <a
            href="https://accounts.binance.com/en/register?ref=YOUR_ID"
            target="_blank"
            className="text-sky-600 hover:underline font-semibold"
          >
            Binance
          </a>{" "}
          – Leading exchange with spot, futures, and staking.
        </li>
        <li>
          <a
            href="https://partner.bybit.com/b/YOUR_ID"
            target="_blank"
            className="text-sky-600 hover:underline font-semibold"
          >
            Bybit
          </a>{" "}
          – Popular derivatives platform for traders.
        </li>
        <li>
          <a
            href="https://www.okx.com/join/YOUR_ID"
            target="_blank"
            className="text-sky-600 hover:underline font-semibold"
          >
            OKX
          </a>{" "}
          – Exchange with strong staking and DeFi integration.
        </li>
      </ul>
    </div>
  );
}
