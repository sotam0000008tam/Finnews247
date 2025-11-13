import Link from "next/link";
import Image from "next/image";

function pickUrl(p) {
  return p?.href || p?.url || p?.link ||
    (p?.category && p?.slug ? `/${p.category}/${p.slug}` : (p?.slug ? `/${p.slug}` : "#"));
}

function pickThumb(p) {
  if (p?.thumb) return p.thumb;
  if (p?.image) return p.image.startsWith("http") ? p.image : `/images/${p.image}`;
  if (p?.cover) return p.cover;
  return "/images/dummy/altcoins64.jpg"; // fallback nhỏ
}

function ItemRow({ item }) {
  const url = pickUrl(item);
  const img = pickThumb(item);
  return (
    <Link
      href={url}
      className="group flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
    >
      <div className="relative w-10 h-10 shrink-0 rounded-md  bg-gray-100 dark:bg-gray-800">
        <Image src={img} alt={item?.title || "post"} fill sizes="40px" className="object-cover" />
      </div>
      <div className="min-w-0">
        <div className="text-sm leading-snug line-clamp-2 group-hover:underline">
          {item?.title || item?.name || "Untitled"}
        </div>
        {item?.date && (
          <div className="text-xs text-gray-500">{item.date}</div>
        )}
      </div>
    </Link>
  );
}

export default function ArticleSidebar({ related = [], latest = [], categoryLabel = "This Topic" }) {
  return (
    <aside className="w-full sticky top-24 space-y-6">
      {/* Related */}
      <section>
        <h3 className="text-sm font-semibold mb-2">
          Related in {categoryLabel}
        </h3>
        {related.length ? (
          <ul className="space-y-1">
            {related.map((it) => (
              <li key={(it.slug || it.href || it.url || it.title) + "-rel"}>
                <ItemRow item={it} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-xs text-gray-500">No related posts.</div>
        )}
      </section>

      {/* Latest all topics */}
      <section>
        <h3 className="text-sm font-semibold mb-2">Latest on FinNews247</h3>
        {latest.length ? (
          <ul className="space-y-1">
            {latest.map((it) => (
              <li key={(it.slug || it.href || it.url || it.title) + "-latest"}>
                <ItemRow item={it} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-xs text-gray-500">No recent posts.</div>
        )}
      </section>
    </aside>
  );
}
