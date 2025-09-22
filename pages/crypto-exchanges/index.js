// pages/crypto-exchanges/index.js
import fs from "fs";
import path from "path";
import Link from "next/link";
import PostCard from "../../components/PostCard";
import { NextSeo } from "next-seo";

/**
 * Crypto Exchanges category page
 * Displays the pillar article in full at the top and lists cluster posts below with pagination.
 */
export default function CryptoExchanges({ pillar, clusters }) {
  return (
    <>
      {/* SEO for Crypto Exchanges */}
      <NextSeo
        title="Best Crypto Exchanges 2025 – Compare Fees, Security, Features | FinNews"
        description="Compare the best crypto exchanges of 2025 on fees, security and features. Includes in-depth reviews of Fidelity Crypto, Coinbase and more."
        openGraph={{
          title: "Best Crypto Exchanges 2025 – Compare Fees, Security, Features",
          description:
            "Comprehensive comparison of the top crypto exchanges in 2025, including fees, security and features.",
          url: "https://finnews247.com/crypto-exchanges",
        }}
      />

      <div>
        {/* Pillar content */}
        {pillar && (
          <article className="prose lg:prose-xl max-w-none mb-12">
            <h1>{pillar.title}</h1>
            <p className="text-sm text-gray-500">{pillar.date}</p>
            {pillar.image && (
              <img
                src={pillar.image}
                alt={pillar.title}
                className="my-4 rounded-lg shadow"
              />
            )}
            <div dangerouslySetInnerHTML={{ __html: pillar.content }} />
          </article>
        )}

        {/* Cluster posts listing */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Related Articles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {clusters.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
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

  // 🔥 Gộp dữ liệu từ 2 file
  let all = [...read("cryptoexchanges.json"), ...read("fidelity.json")];

  // 🔥 Sắp xếp mới nhất → cũ nhất
  all.sort((a, b) => new Date(b.date) - new Date(a.date));

  const [pillar, ...clusters] = all;
  return { props: { pillar, clusters } };
}
