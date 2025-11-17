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

/* ===== 3 block sidebar TRANG CHỦ ===== */
import TopExchanges from "../../components/TopExchanges";
import BestWallets from "../../components/BestWallets";
import TopStaking from "../../components/TopStaking";
import PostCard from "../../components/PostCard";

export default function SignalsPage({ signals = [], latest = [] }) {
  return (
    <div className="container 2xl:max-w-[1600px] mx-auto px-4 py-6 container-1600">
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
                <div className="font-medium">
                  Tín hiệu & phân tích giao dịch cập nhật.
                </div>
                <div className="text-sm text-gray-600">
                  Chưa có tín hiệu trong <code>data/signals.json</code>.
                </div>
              </div>
            ) : (
              /*
               * Hiển thị tín hiệu dưới dạng các thẻ bài lớn giống trang index.
               * Mỗi thẻ bao gồm ảnh, tiêu đề, đoạn trích và liên kết tới trang tín hiệu.
               * Sử dụng PostCard để tăng chiều cao nội dung, giúp Google Auto Ads nhận diện nhiều vị trí hơn.
               */
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {signals.map((s) => {
                  const title = fixMojibake(
                    s.title || `${s.pair || "Signal"} — ${prettyType(s.type)}`
                  );
                  const postObj = {
                    slug: s.id,
                    category: "Signals",
                    date: s.date,
                    title,
                    excerpt: s.excerpt,
                    image: s.thumb,
                  };
                  return <PostCard key={s.id} post={postObj} />;
                })}
              </div>
            )}
          </div>

          {/* === 3 MỤC như SIDEBAR TRANG CHỦ === */}
          <section className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TopExchanges variant="sidebar" />
              <BestWallets variant="sidebar" />
              <TopStaking variant="sidebar" />
            </div>
          </section>
        </section>

        {/* SIDEBAR: Latest (phủ 6 chuyên mục, mới→cũ) */}
        <aside className="md:col-span-3">
          <div className="rounded-xl border bg-white dark:bg-gray-900 overflow-hidden">
            <div className="px-4 py-3 border-b dark:border-gray-800">
              <h2 className="text-base font-semibold">📰 Latest on FinNews247</h2>
            </div>
            <ul className="divide-y dark:divide-gray-800">
              {(latest ?? []).map((p) => (
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

/* ===== server-only: đọc signals.json + Latest 6 trang chính ===== */
export async function getServerSideProps() {
  const { readCat } = await import("../../lib/serverCat");
  const fs = await import("fs/promises");
  const path = await import("path");

  // Đọc danh sách tín hiệu, sort ĐƠN GIẢN theo date (đúng như file gốc index bạn đưa)
  const filePath = path.join(process.cwd(), "data", "signals.json");
  let json = [];
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    json = JSON.parse(raw);
  } catch {}

  const firstImg = (html = "") => {
    const m = html?.match?.(/<img[^>]+src=["']([^"']+)["']/i);
    return m ? m[1] : null;
  };
  const thumbOf = (s) => {
    if (s?.image) return s.image.startsWith("/") ? s.image : `/images/${s.image}`;
    return firstImg(s?.content || "") || null;
  };

  const signals = [...(json || [])]
    .sort((a, b) => (Date.parse(b?.date || "") || 0) - (Date.parse(a?.date || "") || 0))
    .map((s) => ({
      id: s.id,
      pair: s.pair || "",
      type: s.type || "",
      date: s.date || "",
      title: s.title || "",
      excerpt: s.excerpt || "",
      entry: s.entry || "",
      target: s.target || "",
      stoploss: s.stoploss || "",
      thumb: thumbOf(s),
    }));

  // ===== Latest on FinNews247: CHỈ 6 TRANG CHÍNH
  const SIX_CATS = [
    "crypto-market",
    "altcoins",
    "crypto-exchanges",
    "best-crypto-apps",
    "insurance",
    "guides",
  ];

  const firstImg2 = (html = "") =>
    (String(html).match(/<img[^>]+src=["']([^"']+)["']/i) || [])[1] || null;

  const pickThumb = (p) =>
    p?.thumb ||
    p?.ogImage ||
    p?.image ||
    firstImg2(p?.content || p?.body || "") ||
    "/images/dummy/64x64.jpg";

  const buildHref = (p, cat) => {
    switch (cat) {
      case "crypto-market":
        return `/crypto-market/${p.slug}`;
      case "altcoins":
        return `/altcoins/${p.slug}`;
      case "crypto-exchanges":
        return `/crypto-exchanges/${p.slug}`;
      case "best-crypto-apps":
        return `/best-crypto-apps/${p.slug}`;
      case "insurance":
        return `/insurance/${p.slug}`;
      case "guides":
        return `/guides/${p.slug}`;
      default:
        return `/${p.slug}`;
    }
  };

  const byCat = {};
  for (const c of SIX_CATS) {
    const arr = (readCat(c) || [])
      .sort(
        (a, b) =>
          (Date.parse(b?.date || b?.updatedAt || "") || 0) -
          (Date.parse(a?.date || a?.updatedAt || "") || 0)
      )
      .map((p) => ({
        title: p.title || "",
        date: p.date || p.updatedAt || "",
        slug: p.slug,
        href: buildHref(p, c),
        thumb: pickThumb(p),
      }));
    byCat[c] = arr;
  }

  const LATEST_LIMIT = 12;
  const seen = new Set();
  const coverage = [];
  // 1) mỗi chuyên mục lấy bài mới nhất (nếu có)
  for (const c of SIX_CATS) {
    const top = byCat[c]?.find((x) => x?.slug && !seen.has(x.slug));
    if (top) {
      seen.add(top.slug);
      coverage.push(top);
    }
  }
  // 2) bù phần còn lại từ pool 6 trang
  const poolAll = SIX_CATS.flatMap((c) => byCat[c] || []);
  const rest = poolAll
    .filter((p) => p?.slug && !seen.has(p.slug))
    .sort((a, b) => (Date.parse(b?.date || "") || 0) - (Date.parse(a?.date || "") || 0));

  const latestRaw = coverage.concat(rest).slice(0, LATEST_LIMIT);
  const latest = latestRaw.sort(
    (a, b) => (Date.parse(b?.date || "") || 0) - (Date.parse(a?.date || "") || 0)
  );

  return { props: { signals, latest } };
}
