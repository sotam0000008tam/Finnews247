import fs from "fs";
import path from "path";
import { NextSeo } from "next-seo";

/**
 * Trang chi tiết News: giữ nguyên logic gốc (SSR đọc data/news.json).
 * Thêm SEO động để mỗi bài có title/description riêng.
 */

// Helpers cục bộ (cắt gọn HTML, mô tả, ảnh)
function stripHtml(html = "") {
  return String(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function truncate(s = "", n = 160) {
  return s.length <= n ? s : s.slice(0, n - 1).trimEnd() + "…";
}
function extractFirstImage(content) {
  const match = content?.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : undefined;
}

export default function Post({ post }) {
  // 404 nếu không tìm thấy
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-semibold mb-6">404 - Not Found</h1>
        <p>The article you are looking for does not exist.</p>
      </div>
    );
  }

  // SEO động dựa trên dữ liệu bài viết
  const title = post.title ? `${post.title} | FinNews` : "FinNews";
  const description =
    (post.excerpt && post.excerpt.trim()) ||
    truncate(stripHtml(post.content || ""), 160) ||
    "Timely crypto insights and trading signals by FinNews.";
  const canonical = `https://www.finnews247.com/${post.slug}`;
  const ogImage =
    post.ogImage || post.image || extractFirstImage(post.content);

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
