// pages/[slug].js
import fs from "fs";
import path from "path";
import { NextSeo } from "next-seo";

// helpers gọn nhẹ, không cần lib ngoài
function stripHtml(html) {
  return html ? html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim() : "";
}
function truncate(str, n = 160) {
  if (!str) return "";
  return str.length > n ? str.slice(0, n - 1).trim() + "…" : str;
}
function firstImage(html) {
  if (!html) return null;
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
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

  // ✅ SEO động theo dữ liệu bài
  const canonical = `https://www.finnews247.com/${post.slug}`;
  const title = `${post.title} | FinNews247`;
  const description =
    (post.excerpt && post.excerpt.trim()) || truncate(stripHtml(post.content), 160);
  const ogImage =
    post.ogImage || post.image || firstImage(post.content) || "https://www.finnews247.com/logo.png";

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        canonical={canonical}
        openGraph={{
          title,
          description,
          url: canonical,
          images: [{ url: ogImage }],
        }}
        additionalMetaTags={[
          post.date ? { name: "article:published_time", content: post.date } : undefined,
        ].filter(Boolean)}
      />

      <article className="prose lg:prose-xl max-w-none">
        <h1>{post.title}</h1>
        <p className="text-sm text-gray-500">{post.date}</p>

        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="my-4 rounded-lg shadow"
          />
        )}

        {/* giữ nguyên wrapper đặc thù SEC Coin */}
        <div
          className={`post-body ${post.category === "SEC Coin" ? "sec-coin-wrapper" : ""}`}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const raw = fs.readFileSync(path.join(process.cwd(), "data", "news.json"), "utf-8");
  const posts = JSON.parse(raw);
  const post = posts.find((p) => p.slug === params.slug) || null;
  return { props: { post } };
}
