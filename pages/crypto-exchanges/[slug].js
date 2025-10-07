import fs from "fs";
import path from "path";
import ArticleSeo from "../../components/ArticleSeo";

function readJson(file) {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), "data", file), "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export default function ExchangeDetail({ post }) {
  if (!post) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-semibold mb-4">404 - Not Found</h1>
        <p>Exchange review not found.</p>
      </div>
    );
  }

  return (
    <article className="prose lg:prose-xl max-w-none">
      <ArticleSeo post={post} path={`/crypto-exchanges/${post.slug}`} />
      <h1>{post.title}</h1>
      {post.date && <p className="text-sm text-gray-500">{post.date}</p>}
      {post.image && (
        <img src={post.image} alt={post.title} className="my-4 rounded-lg shadow" />
      )}
      <div
        className="post-body"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}

export async function getStaticPaths() {
  const a = readJson("cryptoexchanges.json");
  const b = readJson("fidelity.json");
  const all = [...a, ...b];
  const paths = all.map(p => ({ params: { slug: p.slug } }));
  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const a = readJson("cryptoexchanges.json");
  const b = readJson("fidelity.json");
  const all = [...a, ...b];
  const post = all.find(p => p.slug === params.slug) || null;
  if (!post) return { notFound: true, revalidate: 60 };
  return { props: { post }, revalidate: 600 };
}
