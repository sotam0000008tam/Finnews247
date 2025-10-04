import PostCard from "../../components/PostCard";
import { NextSeo } from "next-seo";
// Import JSON ở top-level để tránh rủi ro đường dẫn khi deploy
import insurance from "../../data/insurance.json";
import tax from "../../data/tax.json";

export default function InsuranceTaxIndex({ posts }) {
  return (
    <div className="container mx-auto px-4 py-6">
      <NextSeo
        title="Crypto Insurance & Tax | FinNews247"
        description="Stay updated with the latest insights on crypto insurance and tax compliance."
        canonical="https://www.finnews247.com/crypto-insurance"
        openGraph={{
          title: "Crypto Insurance & Tax | FinNews247",
          description:
            "Stay updated with the latest insights on crypto insurance and tax compliance.",
          url: "https://www.finnews247.com/crypto-insurance",
        }}
      />

      <h1 className="text-3xl font-bold mb-6">Crypto Insurance & Tax</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {posts.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  // Gộp Insurance + Tax, set category “chuẩn” để PostCard route đúng
  const merged = [...insurance, ...tax].map((p) => ({
    ...p,
    category: "Crypto Insurance & Tax",
  }));

  // Sort mới nhất trước
  merged.sort((a, b) => new Date(b.date) - new Date(a.date));

  return { props: { posts: merged } };
}
