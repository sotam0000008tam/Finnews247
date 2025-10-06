// pages/altcoins/[slug].js
import fs from "fs";
import path from "path";
import { NextSeo } from "next-seo";

/** Helpers nhỏ gọn (không đổi cấu trúc trang) */
function stripHtml(html = "") {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function truncate(s = "", n = 160) {
  if (s.length <= n) return s;
  // cắt đến khoảng trắng gần nhất cho đẹp
  const cut = s.slice(0, n);
  const i = cut.lastIndexOf(" ");
  return (i > 80 ? cut.slice(0, i) : cut) + "…";
}
function extractFirstImage(html = "") {
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
}

export default function AltcoinDetail({ post }) {
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">404 - Not Found</h1>
        <p>Article not found.</p>
      </div>
    );
  }

  // SEO động từ dữ liệu bài viết
  const title = post.title ? `${post.title} | FinNews247` : "FinNews247";
  const description =
    (post.excerpt && post.excerpt.trim()) ||
    truncate(stripHtml(post.content || post.body || ""), 160);
  const canonical = `https://www.finnews247.com/altcoins/${post.slug}`;
  const ogImage = post.ogImage || post.image || extractFirstImage(post.content || post.body || "");

  return (
    <div className="container mx-auto px-4 py-6">
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

      <article className="prose lg:prose-xl max-w-none">
        {post.title && <h1>{post.title}</h1>}
        {(post.date || post.updatedAt) && (
          <p className="text-sm text-gray-500">
            {post.date || post.updatedAt}
          </p>
        )}

        {post.image && (
          <img
            src={post.image}
            alt={post.title || "Altcoin article"}
            className="my-4 rounded-lg shadow"
            loading="lazy"
          />
        )}

        <div
          className={`post-body ${post.category === "SEC Coin" ? "sec-coin-wrapper" : ""}`}
          // Giữ nguyên render nội dung HTML hiện có
          dangerouslySetInnerHTML={{ __html: post.content || post.body || "" }}
        />
      </article>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  // Đọc đúng các nguồn dữ liệu altcoins (gồm cả seccoin nếu bạn gộp)
  const readJson = (name) => {
    try {
      const p = path.join(process.cwd(), "data", name);
      if (!fs.existsSync(p)) return [];
      return JSON.parse(fs.readFileSync(p, "utf-8"));
    } catch {
      return [];
    }
  };

  // Bạn có thể điều chỉnh danh sách này cho khớp project của mình
  const altcoins = readJson("altcoins.json");
  const seccoin = readJson("seccoin.json"); // nếu không dùng, vẫn an toàn (mảng rỗng)

  const all = [...altcoins, ...seccoin];
  const post = all.find((p) => p?.slug === params.slug) || null;

  return { props: { post } };
}
