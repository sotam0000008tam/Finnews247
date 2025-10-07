// pages/best-crypto-apps/index.js
import fs from "fs";
import path from "path";
import Link from "next/link";
import PostCard from "../../components/PostCard";
import { NextSeo } from "next-seo";

/**
 * Best Crypto Apps category listing page
 * Đọc bài từ data/bestapps.json, sắp xếp mới → cũ, có phân trang.
 * Phong cách & cấu trúc giữ đúng với các trang danh mục gốc (Tax/Guides).
 */
export default function BestCryptoApps({ posts, totalPages, currentPage }) {
  return (
    <>
      <NextSeo
        title="Best Crypto Apps 2025 | FinNews247"
        description="Top crypto apps for trading, tracking, staking and security. Compare features, fees and usability to choose the right app for you."
        canonical="https://www.finnews247.com/best-crypto-apps"
        openGraph={{
          title: "Best Crypto Apps 2025 | FinNews247",
          description:
            "Top crypto apps for trading, tracking, staking and security. Compare features, fees and usability.",
          url: "https://www.finnews247.com/best-crypto-apps",
        }}
      />

      <div>
        <h1 className="text-3xl font-semibold mb-6">Best Crypto Apps & Wallets</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {posts.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center space-x-2">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <Link
                  key={pageNum}
                  href={pageNum === 1 ? "/best-crypto-apps" : `/best-crypto-apps?page=${pageNum}`}
                  className={`px-3 py-1 rounded ${
                    pageNum === currentPage
                      ? "bg-sky-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {pageNum}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export async function getServerSideProps({ query }) {
  const raw = fs.readFileSync(
    path.join(process.cwd(), "data", "bestapps.json"),
    "utf-8"
  );
  const all = JSON.parse(raw);

  // sort by date descending (mới → cũ) giống các trang danh mục khác
  all.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Phân trang giống pattern Guides/Tax
  const perPage = 30;
  const page = Math.max(1, parseInt(query.page || "1", 10));
  const totalPages = Math.max(1, Math.ceil(all.length / perPage));
  const start = (page - 1) * perPage;
  const pagePosts = all.slice(start, start + perPage);

  return { props: { posts: pagePosts, totalPages, currentPage: page } };
}
