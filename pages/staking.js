// pages/staking.js
import { NextSeo } from "next-seo";

export default function Staking() {
  return (
    <div className="container mx-auto px-4 py-6">
      <NextSeo
        title="Top Staking Opportunities | FinNews"
        description="Explore the best staking opportunities to earn passive income from crypto."
        openGraph={{
          title: "Top Staking Opportunities | FinNews",
          description:
            "Explore the best staking opportunities to earn passive income from crypto.",
          url: "https://finnews247.com/staking",
        }}
        additionalMetaTags={[
          {
            name: "schema",
            content: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What is Ethereum 2.0 staking?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "You can earn rewards by staking ETH in Ethereum's Proof of Stake network.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I stake Cardano (ADA)?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, ADA holders can stake tokens and earn passive income via pools.",
                  },
                },
              ],
            }),
          },
        ]}
      />

      <h1 className="text-2xl font-bold mb-6">💰 Top Staking Opportunities</h1>
      <ul className="space-y-4">
        <li>
          <span className="font-semibold">Ethereum 2.0</span> – Stake ETH and
          earn ~5% APR.
        </li>
        <li>
          <span className="font-semibold">Cardano (ADA)</span> – Stake ADA in
          pools for ~4% APR.
        </li>
        <li>
          <span className="font-semibold">Polkadot (DOT)</span> – High-yield
          staking with nominators system.
        </li>
      </ul>
    </div>
  );
}
