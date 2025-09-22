// pages/altcoins/index.js
import fs from "fs";
import path from "path";
import Link from "next/link";
import PostCard from "../../components/PostCard";
import { NextSeo } from "next-seo";

/**
 * Altcoins category page
 * Shows a pillar article at the top and lists cluster posts below.
 */
export default function Altcoins({ pillar, clusters }) {
  return (
    <>
      <NextSeo
        title="Altcoins 2025 – Guides, Analysis & Price Predictions | FinNews"
        description="Guides, analysis and price predictions for altcoins in 2025, including Sec Coin and other emerging projects."
        openGraph={{
          title: "Altcoins 2025 – Guides, Analysis & Price Predictions",
          description:
            "Comprehensive guides and analysis on major altcoins with price predictions for 2025.",
          url: "https://finnews247.com/altcoins",
        }}
      />
      <div>
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
  const rawAlt = fs.readFileSync(
    path.join(process.cwd(), "data", "altcoins.json"),
    "utf-8"
  );
  const rawSec = fs.readFileSync(
    path.join(process.cwd(), "data", "seccoin.json"),
    "utf-8"
  );

  const altcoins = JSON.parse(rawAlt);
  const seccoins = JSON.parse(rawSec);

  // 🔥 Gộp dữ liệu & sort mới → cũ
  const all = [...altcoins, ...seccoins].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const [pillar, ...clusters] = all;

  return { props: { pillar, clusters } };
}
