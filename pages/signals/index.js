// pages/signals/index.js
import Link from "next/link";
import { NextSeo } from "next-seo";

// ===== helpers =====
const prettyType = (t) => (String(t).toLowerCase() === "long" ? "Long" : "Short");
const typeColor = (t) =>
  String(t).toLowerCase() === "long"
    ? "bg-green-100 text-green-700 ring-green-200"
    : "bg-red-100 text-red-700 ring-red-200";

// ✅ Fix các ký tự bị mojibake ngay tại file này (không cần import)
function fixMojibake(s = "") {
  return String(s)
    .replace(/—/g, "—")
    .replace(/–/g, "–")
    .replace(/‘/g, "‘").replace(/’/g, "’")
    .replace(/“/g, "“").replace(/”/g, "”")
    .replace(/•/g, "•").replace(/ /g, " ")
    .replace(/…/g, "…").replace(/→/g, "→").replace(/†/g, "†");
}

// Card nhỏ cho sidebar “Latest on FinNews247”
function LatestMini({ item }) {
  return (
    <Link
      href={item.href || "#"}
     className="group flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
      <img
        src={item.thumb || "/images/dummy/64x64.jpg"}
        alt={item.title || "post"}
        className="w-[45px] h-[45px] rounded-md object-cover border dark:border-gray-700 shrink-0"
        loading="lazy"
      />
      <div className="min-w-0">
        <div className="text-sm leading-snug line-clamp-2 group-hover:underline">
          {item.title || "Untitled"}
        </div>
        {item.date && <div className="text-xs text-gray-500 mt-0.5">{item.date}</div>}
      </div>
    </Link>
  );
}

// Hàng list kiểu cũ (thumbnail trái, nội dung phải)
function SignalRow({ s }) {
  return (
    <li className="border-b dark:border-gray-800 last:border-b-0">
      <Link
        href={`/signals/${s.id}`}
       className="flex w-full gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition">
        {/* thumb trái */}
        {s.thumb ? (
          <img
            src={s.thumb}
            alt={s.pair || "signal"}
            className="w-[160px] h-[100px] md:w-[200px] md:h-[120px] rounded-lg object-cover border dark:border-gray-700 shrink-0"
            loading="lazy"
          />
        ) : (
          <div className="w-[160px] h-[100px] md:w-[200px] md:h-[120px] rounded-lg bg-gray-100 dark:bg-gray-800 border dark:border-gray-700 flex items-center justify-center text-xs text-gray-400">
            No image
          </div>
        )}

        {/* nội dung phải */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{s.date}</span>
          </div>

          <h2 className="mt-1 font-semibold truncate">
            {s.pair}
            <span
              className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${typeColor(
                s.type
              )}`}
            >
              {prettyType(s.type)}
            </span>
          </h2>

          {s.title && (
            <div className="text-sm mt-1 line-clamp-2 text-gray-900 dark:text-gray-100">
              {s.title}
            </div>
          )}

          {(s.excerpt || s.entry || s.target || s.stoploss) && (
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">
              {s.excerpt || ""}
            </p>
          )}

          {(s.entry || s.target || s.stoploss) && (
            <p className="text-xs text-gray-500 mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {s.entry && (
                <span>
                  <span className="text-gray-400">Entry:</span> {s.entry}
                </span>
              )}
              {s.target && (
                <span>
                  <span className="text-gray-400">Target:</span> {s.target}
                </span>
              )}
              {s.stoploss && (
                <span>
                  <span className="text-gray-400">Stoploss:</span> {s.stoploss}
                </span>
              )}
            </p>
          )}
        </div>
      </Link>
    </li>
  );
}

// ===== page =====
export default function SignalsPage({ signals = [], latest = [] }) {
  return (
    <div className="container 2xl:max-w-[1600px] mx-auto px-4 py-6">
      <NextSeo
        title="Trading Signals | FinNews247"
        description="Latest crypto trading signals with entry, target, and stoploss."
        canonical="https://www.finnews247.com/signals"
        openGraph={{
          title: "Trading Signals | FinNews247",
          description: "Latest crypto trading signals with entry, target, and stoploss.",
          url: "https://www.finnews247.com/signals",
          images: [{ url: "https://www.finnews247.com/logo.png" }],
        }}
      />

      <div className="grid md:grid-cols-12 gap-6">
        {/* MAIN: dạng cũ — list 1 cột */}
        <section className="md:col-span-9">
          <div className="rounded-xl border bg-white dark:bg-gray-900 overflow-hidden">
            <div className="px-4 py-3 border-b dark:border-gray-800">
              <h1 className="text-lg font-semibold">📊 All Trading Signals</h1>
              <p className="text-sm text-gray-600 mt-1">
                Explore the latest cryptocurrency trading signals with clear entry, target, and stoploss levels.
              </p>
            </div>

            {signals.length === 0 ? (
              <div className="p-4">
                <div className="font-medium">Tín hiệu & phân tích giao dịch cập nhật.</div>
                <div className="text-sm text-gray-600">
                  Chưa có tín hiệu trong <code>signals.json</code>.
                </div>
              </div>
            ) : (
              <ul className="divide-y dark:divide-gray-800">
                {signals.map((s) => (
                  <SignalRow key={s.id} s={s} />
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* SIDEBAR: Latest on FinNews247 */}
        <aside className="sidebar-scope md:col-span-3 w-full sticky top-24 self-start space-y-6">
          <section className="rounded-xl border bg-white dark:bg-gray-900 overflow-hidden">
            <div className="px-4 py-3 border-b dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Latest on FinNews247</h3>
              <Link href="/" className="text-xs text-blue-600 hover:underline">
                See all
              </Link>
            </div>
            <ul className="divide-y dark:divide-gray-800">
              {latest.length ? (
                latest.map((it) => (
                  <li key={(it.slug || it.title) + "-latest"}>
                    <LatestMini item={it} />
                  </li>
                ))
              ) : (
                <li className="px-4 py-3 text-xs text-gray-500">No recent posts.</li>
              )}
            </ul>
          </section>
        </aside>
      </div>

      {/* đảm bảo ảnh sidebar không tràn chữ */}
      <style jsx global>{`
        .sidebar-scope img,
        aside img {
          width: 45px !important;
          height: 45px !important;
          object-fit: cover !important;
          display: block !important;
        }
      `}</style>
    </div>
  );
}

// ===== server-only: đọc signals.json + gom latest
export async function getServerSideProps() {
  const fs = await import("fs/promises");
  const path = await import("path");

  const filePath = path.join(process.cwd(), "data", "signals.json");
  let raw = "[]";
  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch {}
  let json = [];
  try {
    json = JSON.parse(raw);
  } catch {}

  // Helper lấy thumbnail
  const firstImg = (html = "") => {
    const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    return m ? m[1] : null;
  };
  const thumbOf = (s) => {
    if (s.image) return s.image.startsWith("/") ? s.image : `/images/${s.image}`;
    return firstImg(s.content || "") || null;
  };

  const signals = [...json]
    .sort((a, b) => (Date.parse(b.date || "") || 0) - (Date.parse(a.date || "") || 0))
    .map((s) => ({
      id: s.id,
      pair: fixMojibake(s.pair || ""),
      type: s.type,
      date: s.date,
      title: fixMojibake(s.title || ""),
      excerpt: fixMojibake(s.excerpt || ""),
      entry: s.entry || "",
      target: s.target || "",
      stoploss: s.stoploss || "",
      thumb: thumbOf(s),
    }));

  // Latest on FinNews247
  const { readCat } = await import("../../lib/serverCat");
  const cats = [
    "crypto-market",
    "altcoins",
    "crypto-exchanges",
    "best-crypto-apps",
    "insurance",
    "guides",
  ];

  const buildHref = (p, cat) => {
    const c = String(cat);
    if (c === "crypto-market") return `/crypto-market/${p.slug}`;
    if (c === "altcoins") return `/altcoins/${p.slug}`;
    if (c === "crypto-exchanges") return `/crypto-exchanges/${p.slug}`;
    if (c === "best-crypto-apps") return `/best-crypto-apps/${p.slug}`;
    if (c === "insurance") return `/insurance/${p.slug}`;
    if (c === "guides") return `/guides/${p.slug}`;
    return `/${p.slug}`;
  };
  const pickThumb = (p) =>
    p.thumb || p.ogImage || p.image || firstImg(p.content || "") || "/images/dummy/64x64.jpg";

  const pool = cats.flatMap((c) =>
    (readCat(c) || []).map((p) => ({
      title: fixMojibake(p.title || ""),
      date: p.date || p.updatedAt || "",
      slug: p.slug,
      href: buildHref(p, c),
      thumb: pickThumb(p),
    }))
  );

  // unique theo slug + sort mới nhất
  const seen = new Set();
  const latest = pool
    .filter((p) => {
      if (!p.slug || seen.has(p.slug)) return false;
      seen.add(p.slug);
      return true;
    })
    .sort((a, b) => (Date.parse(b.date || "") || 0) - (Date.parse(a.date || "") || 0))
    .slice(0, 12);

  return { props: { signals, latest } };
}

