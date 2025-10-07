// pages/index.js
import PostCard from "../components/PostCard";
import { NextSeo } from "next-seo";
import TradingSignalsBoxMain from "../components/TradingSignalsBoxMain";
import TradingSignalsBoxMini from "../components/TradingSignalsBoxMini";
import TopExchanges from "../components/TopExchanges";
import BestWallets from "../components/BestWallets";
import TopStaking from "../components/TopStaking";
import TopMovers from "../components/TopMovers";
import { readJsonSafe, sortDescByDate, shallowPosts } from "../lib/data";

export default function Home({
  altcoinPosts,
  exchangePosts,
  appPosts,
  insuranceTaxPosts,
  newsPosts,
  guidePosts,
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "FinNews247 - Crypto Trading Signals & Market Coverage",
    url: "https://www.finnews247.com/",
    description:
      "FinNews247 provides professional finance coverage with a focus on crypto trading signals, entry, target, stoploss, plus updates on cryptocurrencies, stocks, economy, and global markets.",
    publisher: {
      "@type": "Organization",
      name: "FinNews247",
      url: "https://www.finnews247.com/",
      logo: { "@type": "ImageObject", url: "https://www.finnews247.com/logo.png" },
    },
  };

  return (
    <>
      <NextSeo
        title="FinNews247 - Crypto Trading Signals & Market Coverage"
        description="Stay updated with reliable crypto trading signals (entry, target, stoploss) and market insights across cryptocurrencies, stocks, economy, and global markets."
        canonical="https://www.finnews247.com/"
        openGraph={{
          title: "FinNews247 - Crypto Trading Signals & Market Coverage",
          description:
            "FinNews247 delivers professional finance coverage with crypto trading signals, stock updates, economy, and market news.",
          url: "https://www.finnews247.com/",
          images: [{ url: "https://www.finnews247.com/logo.png" }],
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="md:col-span-1 space-y-6">
          <TradingSignalsBoxMini />
          <TopExchanges />
          <BestWallets />
          <TopStaking />
          {/* TopMovers tự ẩn nếu chưa có dữ liệu market */}
          <TopMovers />
        </aside>

        {/* Main */}
        <main className="md:col-span-3 space-y-12">
          <TradingSignalsBoxMain />

          <section>
            <h2 className="text-2xl font-semibold mb-4">Altcoin Analysis</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {altcoinPosts.map((p) => <PostCard key={p.slug} post={p} />)}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Crypto Exchanges Insights</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {exchangePosts.map((p) => <PostCard key={p.slug} post={p} />)}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Crypto Apps & Wallets</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {appPosts.map((p) => <PostCard key={p.slug} post={p} />)}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Crypto Insurance & Tax</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {insuranceTaxPosts.map((p) => <PostCard key={p.slug} post={p} />)}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Crypto & Market News</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {newsPosts.map((p) => <PostCard key={p.slug} post={p} />)}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Guides & Reviews</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {guidePosts.map((p) => <PostCard key={p.slug} post={p} />)}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

/** SSG + ISR: build tĩnh và tái tạo định kỳ → giảm serverless request */
export async function getStaticProps() {
  const SECTION_COUNTS = {
    altcoins: 8,
    exchanges: 8,
    apps: 6,
    insuranceTax: 6,
    news: 6,
    guides: 6,
  };

  const altcoins = readJsonSafe("altcoins.json");
  const seccoin = readJsonSafe("seccoin.json");
  const fidelity = readJsonSafe("fidelity.json");
  const cryptoexchanges = readJsonSafe("cryptoexchanges.json");
  const apps = readJsonSafe("bestapps.json");
  const insurance = readJsonSafe("insurance.json");
  const tax = readJsonSafe("tax.json");
  const news = readJsonSafe("news.json");
  const guides = readJsonSafe("guides.json");

  const altcoinPosts = shallowPosts(
    sortDescByDate([...altcoins, ...seccoin]).slice(0, SECTION_COUNTS.altcoins)
  );
  const exchangePosts = shallowPosts(
    sortDescByDate([...fidelity, ...cryptoexchanges]).slice(0, SECTION_COUNTS.exchanges)
  );
  const appPosts = shallowPosts(sortDescByDate([...apps]).slice(0, SECTION_COUNTS.apps));
  const insuranceTaxPosts = shallowPosts(
    sortDescByDate([...insurance, ...tax]).slice(0, SECTION_COUNTS.insuranceTax)
  );
  const newsPosts = shallowPosts(sortDescByDate([...news]).slice(0, SECTION_COUNTS.news));
  const guidePosts = shallowPosts(sortDescByDate([...guides]).slice(0, SECTION_COUNTS.guides));

  return {
    props: { altcoinPosts, exchangePosts, appPosts, insuranceTaxPosts, newsPosts, guidePosts },
    /** ISR: tái tạo mỗi 15 phút (tùy bạn), không đổi URL/cấu trúc */
    revalidate: 900,
  };
}
