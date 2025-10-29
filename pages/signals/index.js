// pages/signals/index.js
import Link from "next/link";
import { NextSeo } from "next-seo";

/* ===== helpers ===== */
const prettyType = (t) => (String(t).toLowerCase() === "long" ? "Long" : "Short");
const typeColor = (t) =>
  String(t).toLowerCase() === "long"
    ? "bg-green-100 text-green-700 ring-green-200"
    : "bg-red-100 text-red-700 ring-red-200";

function fixMojibake(s = "") {
  return String(s)
    .replace(/—/g, "—")
    .replace(/–/g, "–")
    .replace(/“/g, "“")
    .replace(/”/g, "”")
    .replace(/’/g, "’")
    .replace(/…/g, "…");
}

/* 1 dòng trong danh sách tín hiệu */
function SignalRow({ s }) {
  const href = `/signals/${s.id}`;
  return (
    <li className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
      <Link href={href} className="flex items-start gap-4">
        {s.thumb && (
          <img
            src={s.thumb}
            alt={s.title || s.pair || "signal"}
            className="w-[64px] h-[64px] object-cover rounded-lg border dark:border-gray-800"
            loading="lazy"
          />
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ring-1 ${typeColor(s.type)}`}>
              {prettyType(s.type)}
            </span>
            <span className="text-xs text-gray-500">{s.date}</span>
          </div>
          <div className="font-medium mt-1 line-clamp-2 hover:underline">
            {fixMojibake(s.title || `${s.pair || "Signal"} — ${prettyType(s.type)}`)}
          </div>
          {(s.entry || s.target || s.stoploss) && (
            <p className="text-xs text-gray-600 mt-1 flex flex-wrap gap-3">
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

/* ===== dùng đúng 3 component sidebar TRANG CHỦ ===== */
import TopExchanges from "../../components/TopExchanges";
import BestWallets from "../../components/BestWallets";
import TopStaking from "../../components/TopStaking";

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
        {/* MAIN */}
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
                  Chưa có tín hiệu trong <code>data/signals.json</code>.
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

          {/* === 3 MỤC ĐÚNG như SIDEBAR TRANG CHỦ (có logo) === */}
          <section className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TopExchanges variant="sidebar" />
              <BestWallets variant="sidebar" />
              <TopStaking variant="sidebar" />
            </div>
          </section>
        </section>

        {/* SIDEBAR: Latest */}
        <aside className="md:col-span-3">
          <div className="rounded-xl border bg-white dark:bg-gray-900 overflow-hidden">
            <div className="px-4 py-3 border-b dark:border-gray-800">
              <h2 className="text-base font-semibold">📰 Latest on FinNews247</h2>
            </div>
            <ul className="divide-y dark:divide-gray-800">
              {latest.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={p.href}
                    className="flex gap-3 p-3 items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                  >
                    {p.thumb && (
                      <img
                        src={p.thumb}
                        alt={p.title || "post"}
                        className="w-[45px] h-[45px] rounded-md object-cover border dark:border-gray-700"
                        loading="lazy"
                      />
                    )}
                    <div className="min-w-0">
                      <div className="text-sm leading-snug line-clamp-2">{fixMojibake(p.title)}</div>
                      {p.date && <div className="text-xs text-gray-500 mt-0.5">{p.date}</div>}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {/* đảm bảo ảnh sidebar không tràn chữ (KHÔNG ẩn logo ở 3 block dưới) */}
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

/* ===== server-only: đọc signals.json + gom latest ===== */
export async function getServerSideProps() {
  const fs = await import("fs/promises");
  const path = await import("path");

  // Đọc danh sách tín hiệu
  const filePath = path.join(process.cwd(), "data", "signals.json");
  let json = [];
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    json = JSON.parse(raw);
  } catch {}

  // Helper lấy thumbnail từ nội dung
  const firstImg = (html = "") => {
    const m = html?.match?.(/<img[^>]+src=["']([^"']+)["']/i);
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
  const cats = ["crypto-market", "altcoins", "crypto-exchanges", "best-crypto-apps", "insurance", "guides"];

  const firstImg2 = (html = "") => (html.match(/<img[^>]+src=["']([^"']+)["']/i) || [])[1] || null;
  const pickThumb = (p) => p.thumb || p.ogImage || p.image || firstImg2(p.content || "") || "/images/dummy/64x64.jpg";

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

  const pool = [];
  cats.forEach((c) => {
    (readCat(c) || []).forEach((p) => {
      pool.push({
        title: fixMojibake(p.title || ""),
        date: p.date || p.updatedAt || "",
        slug: p.slug,
        href: buildHref(p, c),
        thumb: pickThumb(p),
      });
    });
  });

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
