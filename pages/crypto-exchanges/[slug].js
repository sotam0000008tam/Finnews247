// pages/crypto-exchanges/[slug].js
import fs from "fs";
import path from "path";
import { NextSeo } from "next-seo";

export default function CryptoExchangesPost({ post }) {
  if (!post) {
    return (
      <div>
        <h1 className="text-3xl font-semibold mb-6">404 - Not Found</h1>
        <p>The article you are looking for does not exist.</p>
      </div>
    );
  }
  const url = `https://www.finnews247.com/crypto-exchanges/${post.slug}`;
  return (
    <article className="prose lg:prose-xl max-w-none">
      <NextSeo
        title={`${post.title} | FinNews`}
        description={post.excerpt}
        canonical={url}
        openGraph={{
          title: `${post.title} | FinNews`,
          description: post.excerpt,
          url,
        }}
      />
      <h1>{post.title}</h1>
      <p className="text-sm text-gray-500">{post.date}</p>
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="my-4 rounded-lg shadow"
        />
      )}
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}

export async function getServerSideProps({ params }) {
  const safeRead = (f) => {
    try {
      const raw = fs.readFileSync(path.join(process.cwd(), "data", f), "utf-8");
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  };

  let { slug } = params;
  const aliasMap = {
    "fidelity-crypto-review": "fidelity-crypto-review-fees-security-features",
    "fidelity-vs-coinbase":
      "fidelity-crypto-vs-coinbase-which-is-better-for-us-investors",
    "fidelity-crypto-guide":
      "how-to-buy-bitcoin-with-fidelity-crypto-step-by-step",
  };
  if (aliasMap[slug]) {
    slug = aliasMap[slug];
  }

  // 🔧 Đọc CẢ HAI nguồn để trang chi tiết mở được bài Fidelity
  const pool = [
    ...safeRead("cryptoexchanges.json"),
    ...safeRead("fidelity.json"),
  ];
  const post = pool.find((p) => p.slug === slug) || null;

  return { props: { post } };
}
