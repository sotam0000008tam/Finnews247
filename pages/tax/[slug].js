// pages/tax/[slug].js
import fs from "fs";
import path from "path";
import { NextSeo } from "next-seo";

/**
 * Dynamic page for individual Crypto Tax & Compliance posts.
 * Reads post data from data/tax.json based on slug. If no post is found, displays a 404 message.
 */
export default function TaxPost({ post }) {
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
          url: `https://finnews247.com/tax/${post.slug}`,
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
      {/* eslint-disable-next-line react/no-danger */}
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}

export async function getServerSideProps({ params }) {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "data", "tax.json"),
    "utf-8"
  );
  const posts = JSON.parse(raw);
  let { slug } = params;
  // handle legacy or alias slug for staking rewards post
  if (slug === "reporting-crypto-staking-rewards") {
    slug = "reporting-crypto-staking-rewards-and-yield-farming-income";
  }
  const post = posts.find((p) => p.slug === slug) || null;
  return { props: { post } };
}