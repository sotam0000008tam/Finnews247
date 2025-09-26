// pages/[slug].js
import fs from "fs";
import path from "path";

export default function Post({ post }) {
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
      <h1>{post.title}</h1>
      <p className="text-sm text-gray-500">{post.date}</p>

      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="my-4 rounded-lg shadow"
        />
      )}

      {/* ✅ Thêm wrapper phân biệt SEC Coin */}
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
