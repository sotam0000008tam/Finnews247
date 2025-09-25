// pages/altcoins/index.js
import fs from "fs";
import path from "path";
import Link from "next/link";
import PostCard from "../../components/PostCard";
import { NextSeo } from "next-seo";

/**
 * Altcoins category page
 * Show ONLY a list of the latest posts (new → old).
 */
export default function Altcoins({ posts }) {
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
        <h1 className="text-3xl font-semibold mb-6">Coin Analysis / Altcoins</h1>
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

  // Gộp dữ liệu & sort mới → cũ
  const posts = [...altcoins, ...seccoins].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return { props: { posts } };
}
