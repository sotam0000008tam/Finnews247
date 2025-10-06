// pages/index.js
import fs from "fs";
import path from "path";
import PostCard from "../components/PostCard";
import { NextSeo } from "next-seo";
import TradingSignalsBoxMain from "../components/TradingSignalsBoxMain";
import TradingSignalsBoxMini from "../components/TradingSignalsBoxMini";
import TopExchanges from "../components/TopExchanges";
import BestWallets from "../components/BestWallets";
import TopStaking from "../components/TopStaking";
import TopMovers from "../components/TopMovers";

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
      logo: {
        "@type": "ImageObject",
        url: "https://www.finnews247.com/logo.png",
      },
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
        additionalMetaTags={[
          {
            name: "keywords",
            content:
              "crypto trading signals, bitcoin signals, ethereum signals, entry target stoploss, crypto analysis, finnews247",
          },
        ]}
      />

      {/* JSON-LD Structured Data */}
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
          {/* TopMovers: tự ẩn nếu không có dữ liệu market */}
          <TopMovers />
        </aside>

        {/* Main Content */}
        <main className="md:col-span-3 space-y-12">
          <TradingSignalsBoxMain />

          {/* Altcoin Analysis */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Altcoin Analysis</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {altcoinPosts.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </section>

          {/* Crypto Exchanges Insights */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Crypto Exchanges Insights</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {exchangePosts.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </section>

          {/* Crypto Apps & Wallets */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Crypto Apps & Wallets</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {appPosts.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </section>

          {/* Crypto Insurance & Tax */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Crypto Insurance & Tax</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {insuranceTaxPosts.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </section>

          {/* Crypto & Market News */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Crypto & Market News</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {newsPosts.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </section>

          {/* Guides & Reviews */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Guides & Reviews</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {guidePosts.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const readData = (filename) => {
    const p = path.join(process.cwd(), "data", filename);
    if (!fs.existsSync(p)) return [];
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  };

  const SECTION_COUNTS = {
    altcoins: 8,
    exchanges: 8,
    apps: 6,
    insuranceTax: 6,
    news: 6,
    guides: 6,
  };

  const altcoins = readData("altcoins.json");
  const seccoin = readData("seccoin.json");
  const fidelity = readData("fidelity.json");
  const cryptoexchanges = readData("cryptoexchanges.json");
  const apps = readData("bestapps.json");
  const insurance = readData("insurance.json");
  const tax = readData("tax.json");
  const news = readData("news.json");
  const guides = readData("guides.json");

  const sortDesc = (arr) =>
    arr.sort(
      (a, b) =>
        new Date(b.date || b.updatedAt || 0) - new Date(a.date || a.updatedAt || 0)
    );

  return {
    props: {
      altcoinPosts: sortDesc([...altcoins, ...seccoin]).slice(0, SECTION_COUNTS.altcoins),
      exchangePosts: sortDesc([...fidelity, ...cryptoexchanges]).slice(0, SECTION_COUNTS.exchanges),
      appPosts: sortDesc([...apps]).slice(0, SECTION_COUNTS.apps),
      insuranceTaxPosts: sortDesc([...insurance, ...tax]).slice(0, SECTION_COUNTS.insuranceTax),
      newsPosts: sortDesc([...news]).slice(0, SECTION_COUNTS.news),
      guidePosts: sortDesc([...guides]).slice(0, SECTION_COUNTS.guides),
    },
  };
}
