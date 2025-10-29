// pages/guides/page/[page].js
import fs from "fs";
import path from "path";
import Link from "next/link";

const PAGE_SIZE = 12;

const firstImg = (html = "") => {
  const m = String(html).match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
};
const pickThumb = (p) =>
  p?.thumb || p?.ogImage || p?.image || firstImg(p?.content || "") || "/images/dummy/guides64.jpg";

const BASE = "/guides";

export default function GuidesPaged({ items = [], page = 1, totalPages = 1 }) {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Guides &amp; Reviews</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {items.map((p) => (
          <Link key={p.slug} href={`${BASE}/${p.slug}`} className="block rounded-lg border p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
              <img
                src={pickThumb(p)}
                alt={p.title}
                className="w-full h-40 object-cover rounded-md mb-2"
                loading="lazy"
              />
              <div className="font-medium line-clamp-2">{p.title}</div>
            </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {page > 1 && (
            <Link
              href={page === 2 ? BASE : `${BASE}/page/${page - 1}`}
              className="px-3 py-1 border rounded"
            >
              Prev
            </Link>
          )}
          <span className="text-sm">
            Page {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`${BASE}/page/${page + 1}`}
              className="px-3 py-1 border rounded"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const read = (f) => {
    try {
      return JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", f), "utf-8"));
    } catch {
      return [];
    }
  };
  const posts = read("guides.json").filter((p) => p?.slug);
  const page = Math.max(1, parseInt(params.page, 10) || 1);
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const items = posts.slice(start, start + PAGE_SIZE);
  if (!items.length && page !== 1) return { notFound: true };
  return { props: { items, page, totalPages } };
}
