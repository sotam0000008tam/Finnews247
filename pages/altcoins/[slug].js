// pages/altcoins/[slug].js
import { NextSeo } from "next-seo";
import { readJsonSafe } from "../../lib/data";

/** Helpers */
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
  const title = post.title ? `${post.title} | FinNews247` : "FinNews247";
  const description =
    (post.excerpt && post.excerpt.trim()) || truncate(stripHtml(post.content || post.body || ""), 160);
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
          <p className="text-sm text-gray-500">{post.date || post.updatedAt}</p>
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
          dangerouslySetInnerHTML={{ __html: post.content || post.body || "" }}
        />
      </article>
    </div>
  );
}

/** SSG paths: tạo sẵn tất cả slug trong data (không đổi URL) */
export async function getStaticPaths() {
  const altcoins = readJsonSafe("altcoins.json");
  const seccoin = readJsonSafe("seccoin.json");
  const all = [...altcoins, ...seccoin];
  const paths = all
    .filter((p) => p?.slug)
    .map((p) => ({ params: { slug: p.slug } }));

  return { paths, fallback: "blocking" };
}

/** SSG + ISR: tái tạo 1 lần/12h (tuỳ chỉnh) */
export async function getStaticProps({ params }) {
  const altcoins = readJsonSafe("altcoins.json");
  const seccoin = readJsonSafe("seccoin.json");
  const all = [...altcoins, ...seccoin];
  const post = all.find((p) => p?.slug === params.slug) || null;

  if (!post) {
    return { notFound: true, revalidate: 300 };
  }
  return { props: { post }, revalidate: 43200 };
}
