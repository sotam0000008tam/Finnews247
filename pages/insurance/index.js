// pages/insurance/index.js
import fs from "fs";
import path from "path";
import Link from "next/link";
import PostCard from "../../components/PostCard";
import { NextSeo } from "next-seo";

/**
 * Crypto Insurance & Tax hub
 * Gộp bài từ data/insurance.json + data/tax.json để HIỂN THỊ trên hub,
 * nhưng KHÔNG đổi category của từng bài (tránh tạo URL trùng lặp).
 * Bám đúng pattern danh mục gốc: SSR + phân trang + PostCard.
 */
export default function InsuranceAndTax({ posts, totalPages, currentPage }) {
  return (
    <>
      <NextSeo
        title="Crypto Insurance & Tax | FinNews247"
        description="Crypto insurance providers, coverage and risks — plus practical crypto tax guides and reporting tips."
        canonical="https://www.finnews247.com/insurance"
        openGraph={{
          title: "Crypto Insurance & Tax | FinNews247",
          description:
            "Insurance providers, coverage and risks — plus practical tax guides and reporting tips.",
          url: "https://www.finnews247.com/insurance",
        }}
      />

      <div>
        <h1 className="text-3xl font-semibold mb-6">Crypto Insurance &amp; Tax</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {posts.map((p) => (
            <PostCard key={`${p.category}:${p.slug}`} post={p} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center space-x-2">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <Link
                  key={pageNum}
                  href={pageNum === 1 ? "/insurance" : `/insurance?page=${pageNum}`}
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
  const read = (file) => {
    try { return JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", file), "utf-8")); }
    catch { return []; }
  };

  const insurance = read("insurance.json");
  const tax = read("tax.json");

  // Không ép đổi category — giữ nguyên p.category để link đúng /insurance/... hoặc /tax/...
  const merged = [...insurance, ...tax]
    .filter((p) => p && p.slug)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const perPage = 30;
  const page = Math.max(1, parseInt(query.page || "1", 10));
  const totalPages = Math.max(1, Math.ceil(merged.length / perPage));
  const start = (page - 1) * perPage;
  const pagePosts = merged.slice(start, start + perPage);

  return { props: { posts: pagePosts, totalPages, currentPage: page } };
}
