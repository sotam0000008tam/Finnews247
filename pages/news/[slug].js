import { useRouter } from "next/router";
import news from "../../data/news.json";
import signals from "../../data/signals.json";
import { NextSeo } from "next-seo";
import BestWallets from "../../components/BestWallets";
import TopStaking from "../../components/TopStaking";
import TopExchanges from "../../components/TopExchanges";

export default function NewsDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const item = news.find((n) => n.slug === slug);

  if (!item) return <p className="p-6">News not found.</p>;

  const title = `${item.title} | FinNews247`;
  const desc = item.excerpt;

  return (
    <div className="container mx-auto px-4 py-6">
      <NextSeo
        title={title}
        description={desc}
        openGraph={{
          title,
          description: desc,
          url: `https://finnews247.com/news/${slug}`,
        }}
      />

      <h1 className="text-2xl font-bold mb-4">{item.title}</h1>
      <p className="text-gray-600 mb-6">{item.date}</p>
      <p className="mb-6">{item.content}</p>

      {/* ✅ Box Trading Signals bổ sung để SEO */}
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
