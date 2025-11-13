// pages/reviews/[slug].js
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";

// Demo data (sau này bạn có thể chuyển ra JSON riêng)
const reviews = {
  "ledger-nano-x": {
    title: "Ledger Nano X - Best Hardware Wallet",
    excerpt: "Ledger Nano X is a secure and reliable hardware wallet trusted by millions of crypto investors.",
    image: "/images/ledger.jpg",
    pros: ["High security", "Bluetooth support", "Multi-asset storage"],
    cons: ["Higher price", "Limited stock availability"],
    content: `
      Ledger Nano X is considered one of the most reliable hardware wallets for storing cryptocurrencies securely.
      It provides strong protection against hacks and phishing, supports over 1800 assets, and works with Ledger Live app.
    `
  },
  "binance-exchange": {
    title: "Binance Exchange - Leading Crypto Platform",
    excerpt: "Binance is the world’s largest crypto exchange with advanced trading tools and staking features.",
    image: "/images/binance.jpg",
    pros: ["Low fees", "High liquidity", "Wide range of coins"],
    cons: ["Complex for beginners", "Past regulatory scrutiny"],
    content: `
      Binance offers one of the best trading experiences for both retail and professional traders.
      It provides spot, futures, staking, and launchpad opportunities.
    `
  },
  "eth-staking": {
    title: "Ethereum Staking - Earn Passive Rewards",
    excerpt: "Staking ETH allows you to earn passive income while supporting the Ethereum network.",
    image: "/images/eth-staking.jpg",
    pros: ["Attractive APY", "Supports network security", "Easy through exchanges"],
    cons: ["Funds locked", "Slashing risk"],
    content: `
      ETH staking is becoming increasingly popular with Ethereum 2.0.
      Users can stake directly or via major exchanges like Coinbase, Binance, or through pools.
    `
  }
};

export default function ReviewDetail() {
  const router = useRouter();
  const { slug } = router.query;

  const review = reviews[slug];

  if (!review) return <p className="p-6">Review not found.</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <NextSeo
        title={`${review.title} | FinNews Reviews`}
        description={review.excerpt}
        openGraph={{
          title: review.title,
          description: review.excerpt,
          images: [{ url: review.image }]
        }}
      />

      <h1 className="text-3xl font-bold mb-4">{review.title}</h1>
      <p className="text-gray-600 mb-4">{review.excerpt}</p>

      {review.image && (
        <img
          src={review.image}
          alt={review.title}
          className="rounded-xl shadow mb-6"
        />
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Pros */}
        <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2">✅ Pros</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {review.pros.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>

        {/* Cons */}
        <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">❌ Cons</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {review.cons.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>

        {/* Ads-ready slot */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex items-center justify-center">
          <span className="text-gray-500 text-sm">[Google AdSense slot here]</span>
        </div>
      </div>

      {/* Main content */}
      <div className="prose dark:prose-invert max-w-none mt-6">
        <p>{review.content}</p>
      </div>

      <div className="mt-6 p-3 bg-yellow-100 text-yellow-900 text-sm rounded">
        ⚠️ <b>Disclaimer:</b> This review is for informational purposes only and not financial advice.
      </div>
    </div>
  );
}
