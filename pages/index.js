import PostCard from "../components/PostCard";
import { NextSeo } from "next-seo";
import TradingSignalsBoxMain from "../components/TradingSignalsBoxMain";
import TradingSignalsBoxMini from "../components/TradingSignalsBoxMini";
import TopExchanges from "../components/TopExchanges";
import BestWallets from "../components/BestWallets";
import TopStaking from "../components/TopStaking";
import TopMovers from "../components/TopMovers";
import FearGreed from "../components/FearGreed";

// ✅ Import JSON trực tiếp
import signals from "../data/signals.json";
import altcoins from "../data/altcoins.json";
import seccoin from "../data/seccoin.json";
import fidelity from "../data/fidelity.json";
import cryptoexchanges from "../data/cryptoexchanges.json";
import apps from "../data/bestapps.json";
import insurance from "../data/insurance.json";
import tax from "../data/tax.json";
import news from "../data/news.json";
import guides from "../data/guides.json";

/**
 * Home page component
 */
export default function Home({
  signalsPosts,
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
    url: "https://finnews247.com/",
    description:
      "FinNews247 provides professional finance coverage with a focus on crypto trading signals, entry, target, stoploss, plus updates on cryptocurrencies, stocks, economy, and global markets.",
    publisher: {
      "@type": "Organization",
      name: "FinNews247",
      url: "https://finnews247.com/",
      logo: {
        "@type": "ImageObject",
        url: "https://finnews247.com/logo.png",
      },
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Altcoin Analysis",
      itemListElement: altcoinPosts.map((p, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://finnews247.com/${
          p.category === "Sec Coin" || p.category === "SEC Coin"
            ? "sec-coin"
            : "altcoins"
        }/${p.slug}`,
        name: p.title,
      })),
    },
  };

  return (
    <>
      <NextSeo
        title="FinNews247 - Crypto Trading Signals & Market Coverage"
        description="Stay updated with reliable crypto trading signals (entry, target, stoploss) and market insights across cryptocurrencies, stocks, economy, and global markets."
        openGraph={{
          title: "FinNews247 - Crypto Trading Signals & Market Coverage",
          description:
            "FinNews247 delivers professional finance coverage with crypto trading signals, stock updates, economy, and market news.",
          url: "https://finnews247.com/",
          images: [{ url: "https://finnews247.com/logo.png" }],
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
          <TopMovers />
          <FearGreed />
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

          {/* Exchanges */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Crypto Exchanges Insights
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {exchangePosts.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </section>

          {/* Apps & Wallets */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Crypto Apps & Wallets</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {appPosts.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </section>

          {/* Insurance & Tax */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Crypto Insurance & Tax</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {insuranceTaxPosts.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </section>

          {/* Market News */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Crypto & Market News</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {newsPosts.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </section>

          {/* Guides */}
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

/**
 * Server Side Props
 */
export async function getServerSideProps() {
  const SECTION_COUNTS = {
    signals: 6,
    altcoins: 6,
    exchanges: 6,
    apps: 6,
    insuranceTax: 6,
    news: 6,
    guides: 6,
  };

  const sortDesc = (arr) =>
    arr.sort((a, b) => new Date(b.date) - new Date(a.date));

  const signalsPosts = sortDesc([...signals]).slice(0, SECTION_COUNTS.signals);
  const altcoinPosts = sortDesc([...altcoins, ...seccoin]).slice(
    0,
    SECTION_COUNTS.altcoins
  );
  const exchangePosts = sortDesc([...fidelity, ...cryptoexchanges]).slice(
    0,
    SECTION_COUNTS.exchanges
  );
  const appPosts = sortDesc([...apps]).slice(0, SECTION_COUNTS.apps);
  const insuranceTaxPosts = sortDesc([...insurance, ...tax]).slice(
    0,
    SECTION_COUNTS.insuranceTax
  );
  const newsPosts = sortDesc([...news]).slice(0, SECTION_COUNTS.news);
  const guidePosts = sortDesc([...guides]).slice(0, SECTION_COUNTS.guides);

  return {
    props: {
      signalsPosts,
      altcoinPosts,
      exchangePosts,
      appPosts,
      insuranceTaxPosts,
      newsPosts,
      guidePosts,
    },
  };
}
