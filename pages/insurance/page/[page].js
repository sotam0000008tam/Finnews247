import Link from "next/link";
import CategoryRail from "../../../components/CategoryRail";
import LatestRail from "../../../components/LatestRail";
import { pickThumb, gatherLatest } from "../../../lib/cat";

const PAGE_SIZE = 12;
const KEY = "insurance";
const TITLE = "Insurance & Tax";
const BASE = "/insurance";

export default function CatPage({ items = [], page = 1, totalPages = 1, latest = [] }) {
  return (
    <div className="container mx-auto px-4 py-6">
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/">Home</Link><span className="mx-2">/</span>
        <Link href={BASE}>{TITLE}</Link><span className="mx-2">/</span>
        <span className="text-gray-700 dark:text-gray-300">Page {page}</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold mb-4">{TITLE}</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((p) => (
          <Link key={p.slug} href={`${BASE}/${p.slug}`} className="block rounded-lg border p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
            <img src={pickThumb(p)} alt={p.title} className="w-full h-40 object-cover rounded-md mb-2" />
            <div className="font-medium line-clamp-2">{p.title}</div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          {page > 1 && <Link href={`${BASE}/page/${page - 1}`} className="px-3 py-1 border rounded">Prev</Link>}
          <span className="text-sm text-gray-500">Page {page} / {totalPages}</span>
          {page < totalPages && <Link href={`${BASE}/page/${page + 1}`} className="px-3 py-1 border rounded">Next</Link>}
        </div>
      )}

      <LatestRail title="Latest on FinNews247" items={latest} />
      <CategoryRail />
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const { readCat } = await import("../../../lib/serverCat");
  const page = Math.max(1, parseInt(params.page, 10) || 1);
  const posts = readCat(KEY);
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const items = posts.slice(start, start + PAGE_SIZE);
  const latest = gatherLatest(readCat);
  if (!items.length && page > 1) return { redirect: { destination: BASE, permanent: false } };
  return { props: { items, page, totalPages, latest } };
}

