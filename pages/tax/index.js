// pages/tax/index.js
import fs from "fs";
import path from "path";
import Link from "next/link";
import PostCard from "../../components/PostCard";
import { NextSeo } from "next-seo";

/**
 * Crypto Tax & Compliance category listing page
 * Reads posts from data/tax.json and displays them with pagination.
 */
export default function TaxPage({ posts, totalPages, currentPage }) {
  return (
    <>
      <NextSeo
        title="Crypto Tax & Compliance | FinNews247"
        description="Stay compliant with our crypto tax guides, reporting tips and software reviews."
        canonical="https://www.finnews247.com/tax"
        openGraph={{
          title: "Crypto Tax & Compliance | FinNews247",
          description:
            "Learn how to report crypto transactions, minimize taxes legally and stay up to date on regulations.",
          url: "https://www.finnews247.com/tax",
        }}
      />

      <div>
        <h1 className="text-3xl font-semibold mb-6">Crypto Tax & Compliance</h1>
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
                  href={pageNum === 1 ? "/tax" : `/tax?page=${pageNum}`}
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
    path.join(process.cwd(), "data", "tax.json"),
    "utf-8"
  );
  const all = JSON.parse(raw);
  // sort by date descending
  all.sort((a, b) => new Date(b.date) - new Date(a.date));

  const perPage = 30;
  const page = Math.max(1, parseInt(query.page || "1", 10));
  const totalPages = Math.max(1, Math.ceil(all.length / perPage));
  const start = (page - 1) * perPage;
  const pagePosts = all.slice(start, start + perPage);

  return { props: { posts: pagePosts, totalPages, currentPage: page } };
}
