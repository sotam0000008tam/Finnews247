// components/LatestRail.js
import Link from "next/link";
import { pickThumb, buildUrl } from "../lib/cat";

export default function LatestRail({ title = "Latest on FinNews247", items = [] }) {
  if (!items?.length) return null;
  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.slice(0, 6).map((it) => {
          const href = buildUrl(it);
          const img = pickThumb(it);
          return (
            <Link
              key={it.slug || it.title}
              href={href}
             className="block rounded-lg border p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
              <img src={img} alt={it.title || "post"} className="w-full h-40 object-cover rounded-md mb-2" />
              <div className="font-medium line-clamp-2">{it.title || "Untitled"}</div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

