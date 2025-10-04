import fs from "fs";
import path from "path";
import PostCard from "../../components/PostCard";
import { NextSeo } from "next-seo";

export default function InsuranceTaxAlias({ posts }) {
  return (
    <>
      <NextSeo
        title="Crypto Insurance & Tax Insights 2025 | FinNews247"
        description="Latest updates on crypto insurance and tax: policies, regulations, compliance, and risk management in 2025."
        canonical="https://www.finnews247.com/insurance"
        openGraph={{
          title: "Crypto Insurance & Tax Insights 2025",
          description:
            "Stay updated with the latest crypto insurance and tax news, policies, and regulations.",
          url: "https://www.finnews247.com/insurance",
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

export async function getStaticProps() {
  const read = (f) =>
    JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", f), "utf8"));

  const insurance = read("insurance.json");
  const tax = read("tax.json");

  // Gộp + ép category = insurance để route /insurance/[slug] nhận diện
  const posts = [...insurance, ...tax]
    .map((p) => ({
      ...p,
      category: "insurance",
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return { props: { posts } };
}
