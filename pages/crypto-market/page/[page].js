// pages/crypto-market/page/[page].js
import fs from "fs";
import path from "path";
import Link from "next/link";

const PAGE_SIZE = 12;

const firstImg = (html = "") => {
  const m = String(html).match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
};
const pickThumb = (p) =>
  p?.thumb || p?.ogImage || p?.image || firstImg(p?.content || "") || "/images/dummy/market64.jpg";

const buildHref = (slug) => `/crypto-market/${String(slug || "").replace(/^\//, "")}`;

function Card({ item }) {
  const href = buildHref(item.slug);
  const img = pickThumb(item);
  return (
    <article className="rounded-xl border bg-white dark:bg-gray-900 overflow-hidden hover:shadow transition">
      <Link href={href} className="block relative" style={{ paddingTop: "56.25%" }}>
          {img && (
            <img
              src={img}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          )}
        </Link>
      <div className="p-4">
        <Link href={href}>
          <h3 className="text-base font-semibold leading-snug hover:underline line-clamp-2">
            {item.title}
          </h3>
        </Link>
        {item.date && <div className="text-xs text-gray-500 mt-1">{item.date}</div>}
      </div>
    </article>
  );
}

export default function MarketPaged({ items = [], page = 1, totalPages = 1 }) {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Crypto &amp; Market</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {items.map((p) => (
          <Card key={p.slug} item={p} />
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-6">
        <Link
          href={page > 1 ? (page === 2 ? "/crypto-market" : `/crypto-market/page/${page - 1}`) : "#"}
          className={`px-3 py-2 rounded-lg border text-sm ${
            page === 1 ? "pointer-events-none opacity-50" : ""
          }`}
        >
          Newer
        </Link>
        <span className="text-sm">Page {page} / {totalPages}</span>
        <Link
          href={page < totalPages ? `/crypto-market/page/${page + 1}` : "#"}
          className={`px-3 py-2 rounded-lg border text-sm ${
            page === totalPages ? "pointer-events-none opacity-50" : ""
          }`}
        >
          Older
        </Link>
      </div>
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
  const posts = read("news.json").filter((p) => p?.slug);
  const page = Math.max(1, parseInt(params.page, 10) || 1);
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const items = posts.slice(start, start + PAGE_SIZE);
  if (!items.length && page !== 1) return { notFound: true };
  return { props: { items, page, totalPages } };
}
