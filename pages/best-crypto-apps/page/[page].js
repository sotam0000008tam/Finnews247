import Link from "next/link";
import { NextSeo } from "next-seo";
import PostCard from "../../../components/PostCard";

const stripHtml = (h = "") =>
  String(h)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const firstImage = (h = "") =>
  (String(h).match(/<img[^>]+src=["']([^"']+)["']/i) || [])[1] || null;

const pickThumb = (p, f = "/images/dummy/altcoins64.jpg") =>
  p?.thumb ||
  p?.ogImage ||
  p?.image ||
  firstImage(p?.content || p?.body || "") ||
  f;

const hrefApps = (slug) =>
  `/best-crypto-apps/${String(slug || "").replace(/^\//, "")}`;

const hrefMixed = (p) => {
  if (p?.href) return p.href;
  const s = String(p?.slug || "").replace(/^\//, "");
  if (!s) return "#";
  const c = String(p?._cat || p?.category || "").toLowerCase();

  if (c.includes("sec-coin") || c.includes("sec coin") || c.includes("seccoin"))
    return `/altcoins/${s}`;
  if (c.includes("altcoin")) return `/altcoins/${s}`;
  if (c.includes("fidelity")) return `/crypto-exchanges/${s}`;
  if (c.includes("exchange")) return `/crypto-exchanges/${s}`;
  if (c.includes("app") || c.includes("wallet")) return `/best-crypto-apps/${s}`;
  if (c.includes("insurance")) return `/insurance/${s}`;
  if (c.includes("guide") || c.includes("review")) return `/guides/${s}`;
  if (c.includes("market") || c.includes("news") || c.includes("crypto-market"))
    return `/crypto-market/${s}`;
  return `/guides/${s}`;
};

function Card({ item }) {
  const href = hrefApps(item.slug);
  const img = pickThumb(item);

  return (
    <Link
      href={href}
      className="group block rounded-xl overflow-hidden border bg-white dark:bg-gray-900 hover:shadow-md transition"
    >
      {img && (
        <img
          src={img}
          alt={item?.title || "post"}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      )}
      <div className="p-3">
        <div className="font-semibold leading-snug line-clamp-2 group-hover:underline">
          {item?.title || "Untitled"}
        </div>
        {(item?.date || item?.updatedAt) && (
          <div className="text-xs text-gray-500 mt-1">
            {item.date || item.updatedAt}
          </div>
        )}
        {/* Show a longer snippet so there is more vertical content for AutoAds. */}
        {item?.excerpt && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-4">
            {stripHtml(item.excerpt).slice(0, 250)}
            {stripHtml(item.excerpt).length > 250 ? "…" : ""}
          </p>
        )}
      </div>
    </Link>
  );
}

function SideMiniItem({ item }) {
  const href = hrefMixed(item);
  const img = pickThumb(item);

  return (
    <Link
      href={href}
      className="group flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
    >
      <img
        src={img}
        alt={item?.title || "post"}
        className="w-[45px] h-[45px] rounded-md object-cover border dark:border-gray-700 shrink-0"
        loading="lazy"
      />
      <div className="min-w-0">
        <div className="text-sm leading-snug line-clamp-2 group-hover:underline">
          {item?.title || "Untitled"}
        </div>
        {(item?.date || item?.updatedAt) && (
          <div className="text-xs text-gray-500 mt-0.5">
            {item?.date || item?.updatedAt}
          </div>
        )}
      </div>
    </Link>
  );
}

export default function AppsPage({
  items = [],
  latest = [],
  page = 1,
  totalPages = 1,
}) {
  const title = "Apps & Wallets";
  const canonical =
    page > 1
      ? `https://www.finnews247.com/best-crypto-apps/page/${page}`
      : "https://www.finnews247.com/best-crypto-apps";
  const description = "Best crypto apps & wallets.";

  return (
    <div className="container mx-auto px-4 py-6 container-1600">
      <NextSeo
        title={title}
        description={description}
        canonical={canonical}
        openGraph={{ title, description, url: canonical }}
      />
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
      </div>
      <div className="grid md:grid-cols-12 gap-8">
        <section className="md:col-span-9">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {(items || []).map((it) => (
              <PostCard key={it.slug || it.title} post={it} />
            ))}
          </div>
          {totalPages > 1 && (
            /*
             * Allow pagination links to wrap on small screens.  Without
             * `flex-wrap` the row of page numbers could overflow the
             * viewport when there are many pages.
             */
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                const href =
                  p === 1
                    ? "/best-crypto-apps"
                    : `/best-crypto-apps/page/${p}`;
                const active = p === page;
                return (
                  <Link
                    key={p}
                    href={href}
                    className={
                      "px-3 py-1 rounded border " +
                      (active
                        ? "bg-gray-900 text-white border-gray-900"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800")
                    }
                  >
                    {p}
                  </Link>
                );
              })}
            </div>
          )}
        </section>
        <aside className="md:col-span-3 w-full sticky top-24 self-start space-y-6 sidebar-scope">
          {/* Trading signals removed for brand safety */}
          <section className="rounded-xl border bg-white dark:bg-gray-900 overflow-hidden">
            <div className="px-4 py-3 border-b dark:border-gray-700">
              <h3 className="text-sm font-semibold">Latest on FinNews247</h3>
            </div>
            <ul className="divide-y dark:divide-gray-800">
              {(latest ?? []).map((it) => (
                <li key={(it.slug || it.title) + "-latest"}>
                  <SideMiniItem item={it} />
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
      <style jsx global>{`
        .sidebar-scope img {
          width: 45px !important;
          height: 45px !important;
          max-width: none !important;
          object-fit: cover !important;
          border-radius: 8px !important;
          display: block !important;
        }
      `}</style>
    </div>
  );
}

/* GSSP */
export async function getServerSideProps({ params }) {
  const { readCat } = await import("../../../lib/serverCat");

  const norm = (s = "") =>
    String(s)
      .normalize("NFKD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .trim();

  const normalizeSlugish = (raw = "") =>
    String(raw)
      .trim()
      .replace(/^https?:\/\/[^/]+/i, "")
      .replace(/\?.*$/, "")
      .replace(/#.*/, "")
      .replace(/^\/+|\/+$/g, "")
      .toLowerCase();

  const signature = (p = {}) => {
    const k1 = normalizeSlugish(
      p.slug || p.href || p.url || p.guid || ""
    );
    const k2 = norm(stripHtml(p.title || ""))
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
    const k3 = String(p.date || p.updatedAt || "").slice(0, 10);
    const k4 = norm(stripHtml((p.excerpt || "").slice(0, 120)));
    return [k1, k2, k3, k4].filter(Boolean).join("|");
  };

  const uniqBySignature = (arr = []) => {
    const m = new Map();
    for (const p of arr || []) {
      const sig = signature(p);
      if (!sig) continue;
      if (!m.has(sig)) m.set(sig, p);
    }
    return Array.from(m.values());
  };

  const parsePage = (x) => {
    const n = Number(x?.page) || 1;
    return n < 1 ? 1 : n;
  };

  const postsRaw = readCat("best-crypto-apps") || [];
  const posts = uniqBySignature(postsRaw).sort(
    (a, b) =>
      (Date.parse(b.date || b.updatedAt) || 0) -
      (Date.parse(a.date || a.updatedAt) || 0)
  );

  const PAGE_SIZE = 30;
  const page = parsePage(params);
  const totalPages = Math.max(
    1,
    Math.ceil(posts.length / PAGE_SIZE)
  );
  const start = (page - 1) * PAGE_SIZE;
  const items = posts.slice(start, start + PAGE_SIZE);

  const cats = [
    "crypto-market",
    "altcoins",
    "crypto-exchanges",
    "best-crypto-apps",
    "insurance",
    "guides",
  ];

  const catLoad = (name) => {
    if (name === "crypto-exchanges") {
      const ex = readCat("crypto-exchanges") || [];
      const fi = readCat("fidelity") || [];
      return uniqBySignature([...ex, ...fi]);
    }
    if (name === "insurance") {
      const ins = readCat("insurance") || [];
      const tax = readCat("tax") || [];
      return uniqBySignature([...ins, ...tax]);
    }
    return uniqBySignature(readCat(name) || []);
  };

  const byCat = {};
  for (const c of cats) {
    const arr = (catLoad(c) || []).map((p) => ({ ...p, _cat: c }));
    arr.sort(
      (x, y) =>
        (Date.parse(y.date || y.updatedAt) || 0) -
        (Date.parse(x.date || x.updatedAt) || 0)
    );
    byCat[c] = arr;
  }

  const seen = new Set(items.map(signature));
  const coverage = [];
  for (const c of cats) {
    const pick = (byCat[c] || []).find((p) => {
      const sig = signature(p);
      return sig && !seen.has(sig);
    });
    if (pick) {
      seen.add(signature(pick));
      coverage.push(pick);
    }
  }

  const poolAll = cats.flatMap((c) => byCat[c] || []);
  const rest = poolAll.filter((p) => {
    const sig = signature(p);
    return sig && !seen.has(sig);
  });

  const latestRaw = coverage.concat(rest).slice(0, 10);
  const latest = uniqBySignature(latestRaw).sort(
    (x, y) =>
      (Date.parse(y.date || y.updatedAt) || 0) -
      (Date.parse(x.date || x.updatedAt) || 0)
  );

  return {
    props: { items, latest, page, totalPages },
  };
}
