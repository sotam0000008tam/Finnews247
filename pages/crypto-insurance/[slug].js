import { NextSeo } from "next-seo";
import BestWallets from "../../components/BestWallets";
import TopStaking from "../../components/TopStaking";
import TopExchanges from "../../components/TopExchanges";

export default function InsuranceDetail({ post }) {
  if (!post) return <p className="p-6">Post not found.</p>;

  const title = `${post.title} | FinNews247`;
  const desc = post.excerpt;

  return (
    <div className="container mx-auto px-4 py-6">
      <NextSeo
        title={title}
        description={desc}
        canonical={`https://www.finnews247.com/crypto-insurance/${post.slug}`}
        openGraph={{
          title,
          description: desc,
          url: `https://www.finnews247.com/crypto-insurance/${post.slug}`,
        }}
      />

      {/* Tiêu đề */}
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 mb-6">{post.date}</p>

      {/* Nội dung chi tiết */}
      <div
        className="prose dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Sidebar mini widgets */}
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

  // Merge cả Insurance + Tax
  const posts = [...insurance, ...tax].map((p) => {
    const href = `/crypto-insurance/${p.slug}`;
    return {
      ...p,
      category: "crypto-insurance",
      path: "crypto-insurance",
      section: "crypto-insurance",
      href,
      url: href,
      link: href,
    };
  });

  // Debug: in ra slug để check
  console.log("URL params.slug =", params.slug);
  console.log("Available slugs =", posts.map((p) => p.slug));

  const post = posts.find(
    (p) => p.slug.trim().toLowerCase() === params.slug.trim().toLowerCase()
  );

  if (!post) return { notFound: true };

  return { props: { post } };
}
