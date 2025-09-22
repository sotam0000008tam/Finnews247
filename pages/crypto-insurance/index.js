import fs from "fs";
import path from "path";
import PostCard from "../../components/PostCard";
import { NextSeo } from "next-seo";

export default function InsuranceTax({ posts }) {
  return (
    <>
      <NextSeo
        title="Crypto Insurance & Tax Insights 2025 | FinNews247"
        description="Latest updates on crypto insurance and tax: policies, regulations, compliance, and risk management in 2025."
        openGraph={{
          title: "Crypto Insurance & Tax Insights 2025",
          description:
            "Stay updated with the latest crypto insurance and tax news, policies, and regulations.",
          url: "https://finnews247.com/crypto-insurance",
        }}
      />
      <div>
        <h1 className="text-3xl font-bold mb-6">Crypto Insurance & Tax</h1>
        <div className="grid md:grid-cols-2 gap-6">
          {posts.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const read = (f) =>
    JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", f), "utf8"));

  const insurance = read("insurance.json");
  const tax = read("tax.json");

  // Gộp + sort mới nhất
  const posts = [...insurance, ...tax]
    .map((p) => ({
      ...p,
      // Ép category để PostCard build URL đúng route này
      category: "crypto-insurance",
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return { props: { posts } };
}
