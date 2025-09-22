// pages/altcoins/[slug].js
import fs from "fs";
import path from "path";
import { NextSeo } from "next-seo";

export default function AltcoinPost({ post }) {
  if (!post) {
    return (
      <div>
        <h1 className="text-3xl font-semibold mb-6">404 - Not Found</h1>
        <p>The article you are looking for does not exist.</p>
      </div>
    );
  }
  return (
    <article className="prose lg:prose-xl max-w-none">
      <NextSeo
        title={`${post.title} | FinNews`}
        description={post.excerpt}
        openGraph={{
          title: `${post.title} | FinNews`,
          description: post.excerpt,
          url: `https://finnews247.com/altcoins/${post.slug}`,
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
  const raw = fs.readFileSync(
    path.join(process.cwd(), "data", "altcoins.json"),
    "utf-8"
  );
  const posts = JSON.parse(raw);
  let { slug } = params;
  // Provide alias mapping for simplified slugs used in internal links
  const aliasMap = {
    "sec-coin-analysis":
      "sec-coin-analysis-what-investors-need-to-know-in-2025",
    "sec-coin-price-prediction-2025-and-beyond":
      "sec-coin-price-prediction-for-2025-and-beyond",
    "sec-coin-vs-xrp": "sec-coin-vs-xrp-key-differences-for-investors",
  };
  if (aliasMap[slug]) {
    slug = aliasMap[slug];
  }
  const post = posts.find((p) => p.slug === slug) || null;
  return { props: { post } };
}