// pages/news/[slug].js
import { useRouter } from "next/router";
import news from "../../data/news.json";
import signals from "../../data/signals.json";
import { NextSeo } from "next-seo";
import BestWallets from "../../components/BestWallets";
import TopStaking from "../../components/TopStaking";
import TopExchanges from "../../components/TopExchanges";

/** Helpers: rút gọn nội dung làm description fallback & lấy ảnh OG */
function stripHtml(html = "") {
  return String(html).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
function truncate(s = "", n = 160) {
  const t = s.trim();
  return t.length <= n ? t : t.slice(0, n - 1).trimEnd() + "…";
}
function firstImageFromContent(html = "") {
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : undefined;
}

export default function NewsDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const item = news.find((n) => n.slug === slug);

  if (!item) return <p className="p-6">News not found.</p>;

  const url = `https://www.finnews247.com/news/${item.slug || slug}`;
  const title = item.title ? `${item.title} | FinNews247` : "FinNews247";
  const desc =
    (item.excerpt && item.excerpt.trim()) ||
    truncate(stripHtml(item.content || ""), 160);
  const ogImage =
    item.ogImage || item.image || firstImageFromContent(item.content || "");

  return (
    <div className="container mx-auto px-4 py-6">
      <NextSeo
        title={title}
        description={desc}
        canonical={url}
        openGraph={{
          title,
          description: desc,
          url,
          images: ogImage ? [{ url: ogImage }] : undefined,
        }}
      />

      <h1 className="text-2xl font-bold mb-4">{item.title}</h1>
      <p className="text-gray-600 mb-6">{item.date}</p>

      {/* Nếu item.content là HTML, có thể đổi sang dangerouslySetInnerHTML */}
      <p className="mb-6">{item.content}</p>

      {/* Latest Trading Signals */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-8">
        <h2 className="text-xl font-bold mb-3">📊 Latest Trading Signals</h2>
        <ul className="space-y-3">
          {signals.slice(0, 3).map((s) => (
            <li key={s.id}>
              <a
                href={`/signals/${s.id}`}
                className="text-sm text-sky-600 hover:underline"
              >
                {s.pair} — {s.type} (Entry {s.entry}, Target {s.target})
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Extra Boxes */}
      <div className="mt-10 space-y-6">
        <TopExchanges />
        <BestWallets />
        <TopStaking />
      </div>
    </div>
  );
}
