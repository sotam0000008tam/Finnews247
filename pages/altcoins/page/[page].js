// pages/altcoins/page/[page].js
import fs from "fs";
import path from "path";
import Link from "next/link";

const PAGE_SIZE = 12;

const pick = (html = "") => {
  const m = String(html).match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : "/images/dummy/altcoins64.jpg";
};
const build = (slug) => `/altcoins/${slug}`;

export default function AltcoinsPaged({ items = [], page = 1, totalPages = 1 }) {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Altcoin Analysis</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {items.map((p) => (
          <Link key={p.slug} href={build(p.slug)} legacyBehavior>
            <a className="group block rounded-xl overflow-hidden border hover:shadow-sm bg-white dark:bg-gray-900">
              <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                <img
                  src={p.image || p.ogImage || pick(p.content)}
                  alt={p.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold group-hover:underline line-clamp-2">
                  {p.title}
                </h2>
                {p.date && <p className="text-xs text-gray-500 mt-1">{p.date}</p>}
              </div>
            </a>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-6">
        <Link
          href={page > 1 ? (page === 2 ? "/altcoins" : `/altcoins/page/${page - 1}`) : "#"}
          legacyBehavior
        >
          <a
            className={
              "px-3 py-1 rounded border " + (page === 1 ? "pointer-events-none opacity-50" : "")
            }
          >
            Prev
          </a>
        </Link>

        <span className="text-sm">Page {page} / {totalPages}</span>

        <Link
          href={page < totalPages ? `/altcoins/page/${page + 1}` : "#"}
          legacyBehavior
        >
          <a
            className={
              "px-3 py-1 rounded border " +
              (page === totalPages ? "pointer-events-none opacity-50" : "")
            }
          >
            Next
          </a>
        </Link>
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const read = (f) => {
    try {
      return JSON.parse(
        fs.readFileSync(path.join(process.cwd(), "data", f), "utf-8")
      );
    } catch {
      return [];
    }
  };

  const posts = []
    .concat(read("altcoins.json"), read("seccoin.json"))
    .filter((p) => p?.slug);

  const page = Math.max(1, parseInt(params.page, 10) || 1);
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const items = posts.slice(start, start + PAGE_SIZE);

  if (!items.length && page !== 1) return { notFound: true };
  return { props: { items, page, totalPages } };
}
