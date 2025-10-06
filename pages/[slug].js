// pages/[slug].js
import fs from "fs";
import path from "path";
import { NextSeo } from "next-seo";

// Helpers nhỏ gọn
const stripHtml = (html = "") =>
  String(html).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const truncate = (s = "", n = 160) =>
  s.length <= n ? s : s.slice(0, n - 1).trimEnd() + "…";
const firstImageFromContent = (html = "") => {
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : undefined;
};

export default function Post({ post }) {
  if (!post) {
    return (
      <div>
        <h1 className="text-3xl font-semibold mb-6">404 - Not Found</h1>
        <p>The article you are looking for does not exist.</p>
      </div>
    );
  }

  // 🔹 SEO động theo dữ liệu bài
  const title = post.title ? `${post.title} | FinNews247` : "FinNews247";
  const description =
    (post.excerpt && post.excerpt.trim()) ||
    truncate(stripHtml(post.content || ""), 160) ||
    "Timely crypto insights and trading signals by FinNews247.";
  const canonical = `https://www.finnews247.com/${post.slug}`;
  const ogImage =
    post.ogImage || post.image || firstImageFromContent(post.content || "");

  return (
    <article className="prose lg:prose-xl max-w-none">
      <NextSeo
        title={title}
        description={description}
        canonical={canonical}
        openGraph={{
          title,
          description,
          url: canonical,
          images: ogImage ? [{ url: ogImage }] : undefined,
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

      <div
        className={`post-body ${
          post.category === "SEC Coin" ? "sec-coin-wrapper" : ""
        }`}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}

export async function getServerSideProps({ params }) {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "data", "news.json"),
    "utf-8"
  );
  const posts = JSON.parse(raw);
  const post = posts.find((p) => p.slug === params.slug) || null;

  return { props: { post } };
}
