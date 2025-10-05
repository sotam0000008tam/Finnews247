// pages/crypto-exchanges/index.js
import fs from "fs";
import path from "path";
import Link from "next/link";
import PostCard from "../../components/PostCard";
import { NextSeo } from "next-seo";

/**
 * Crypto Exchanges category page
 * Show ONLY a list of the latest posts (new → old).
 */
export default function CryptoExchanges({ posts }) {
  return (
    <>
      {/* SEO for Crypto Exchanges */}
      <NextSeo
        title="Best Crypto Exchanges 2025 – Compare Fees, Security, Features | FinNews"
        description="Compare the best crypto exchanges of 2025 on fees, security and features. Includes in-depth reviews of Fidelity Crypto, Coinbase and more."
        canonical="https://www.finnews247.com/crypto-exchanges"
        openGraph={{
          title: "Best Crypto Exchanges 2025 – Compare Fees, Security, Features",
          description:
            "Comprehensive comparison of the top crypto exchanges in 2025, including fees, security and features.",
          url: "https://www.finnews247.com/crypto-exchanges",
        }}
      />

      <div>
        <h1 className="text-3xl font-semibold mb-6">Crypto Platforms / Exchanges Reviews</h1>
        <div className="grid md:grid-cols-2 gap-6">
          {posts.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const read = (file) => {
    const raw = fs.readFileSync(path.join(process.cwd(), "data", file), "utf-8");
    return JSON.parse(raw);
  };

  // Merge data from multiple sources
  let all = [...read("cryptoexchanges.json"), ...read("fidelity.json")];

  // Sort newest → oldest
  all.sort((a, b) => new Date(b.date) - new Date(a.date));

  return { props: { posts: all } };
}
