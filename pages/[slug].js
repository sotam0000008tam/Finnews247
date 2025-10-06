// pages/[slug].js
import fs from "fs";
import path from "path";
import { NextSeo } from "next-seo";

/**
 * Giữ nguyên cấu trúc gốc (SSR đọc data/news.json).
 * Chỉ bổ sung SEO động để loại bỏ trùng title/description.
 */

// Helpers
function stripHtml(html = "") {
  return String(html).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
function truncate(s = "", n = 160) {
  const t = s.trim();
  return t.length <= n ? t : t.slice(0, n - 1).trimEnd() + "…";
}
function firstImageFromContent(html = "") {
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : undefined;
}

export default function Post({ post }) {
  if (!post) {
    return (
      <div>
        <h1 className="text-3xl font-semibold mb-6">404 - Not Found</h1>
        <p>The article you are looking for does not exist.</p>
      </div>
    );
  }

  // SEO động
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

      {/* ✅ Thêm wrapper phân biệt SEC Coin giữ nguyên */}
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
