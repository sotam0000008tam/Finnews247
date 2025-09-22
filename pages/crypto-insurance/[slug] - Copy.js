import { NextSeo } from "next-seo";
import BestWallets from "../../components/BestWallets";
import TopStaking from "../../components/TopStaking";
import TopExchanges from "../../components/TopExchanges";

export default function InsuranceTaxDetail({ post }) {
  if (!post) return <p className="p-6">Post not found.</p>;

  const title = `${post.title} | FinNews247`;
  const desc = post.excerpt;

  return (
    <div className="container mx-auto px-4 py-6">
      <NextSeo
        title={title}
        description={desc}
        openGraph={{
          title,
          description: desc,
          url: `https://finnews247.com/crypto-insurance/${post.slug}`,
          images: post.image ? [{ url: post.image }] : [],
        }}
      />

      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 mb-6">{post.date}</p>

      {post.image && (
        <div className="mb-6">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-auto rounded-lg shadow"
          />
        </div>
      )}

      <div
        className="prose dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="mt-10 space-y-6">
        <TopExchanges />
        <BestWallets />
        <TopStaking />
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const fs = require("fs");
  const path = require("path");
  const read = (f) =>
    JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", f), "utf8"));

  const insurance = read("insurance.json");
  const tax = read("tax.json");

  const posts = [...insurance, ...tax].map((p) => ({
    ...p,
    href: `/crypto-insurance/${p.slug}`,
  }));

  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return { notFound: true };

  return { props: { post } };
}
