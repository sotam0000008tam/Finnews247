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
import FearGreed from "../components/FearGreed";

/**
 * Home page component. This layout emphasises trading signals and crypto by
 * presenting a series of content sections in a defined order. Each section
 * pulls from its respective JSON file via getServerSideProps and the
 * number of posts displayed can be adjusted with SECTION_COUNTS in the
 * server function. The sidebar retains useful widgets such as mini
 * signals, top exchanges, wallets, staking, movers and the fear & greed
 * index.
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
  // Structured Data for SEO. We only include the latest trading signals
  // in the JSON‑LD mainEntity for clarity and focus.
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
        url: `https://finnews247.com/${p.category === 'Sec Coin' || p.category === 'SEC Coin' ? 'sec-coin' : 'altcoins'}/${p.slug}`,
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
        {/* Sidebar with widgets */}
        <aside className="md:col-span-1 space-y-6">
          <TradingSignalsBoxMini />
          <TopExchanges />
          <BestWallets />
          <TopStaking />
          <TopMovers />
          <FearGreed />
        </aside>

        {/* Main Content area */}
        <main className="md:col-span-3 space-y-12">
          {/* Detailed trading signal box at top */}
          <TradingSignalsBoxMain />

          {/* Latest Trading Signals section removed because signals are already highlighted
             via the TradingSignalsBoxMain and sidebar widgets. This keeps the home page
             concise and prevents duplicate content. */}

          {/* Section: Altcoin Analysis (Altcoins + SEC Coin) */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Altcoin Analysis</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {altcoinPosts.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </section>

          {/* Section: Crypto Exchanges Insights (Fidelity + Exchanges) */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Crypto Exchanges Insights</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {exchangePosts.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </section>

          {/* Section: Crypto Apps & Wallets */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Crypto Apps & Wallets</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {appPosts.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </section>

          {/* Section: Crypto Insurance & Tax */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Crypto Insurance & Tax</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {insuranceTaxPosts.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </section>

          {/* Section: Crypto & Market News */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Crypto & Market News</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {newsPosts.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </section>

          {/* Section: Guides & Reviews */}
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
 * Fetches data from multiple JSON sources and prepares the arrays for
 * each homepage section. Adjust SECTION_COUNTS to control how many
 * articles appear per section on the homepage. This makes it easy
 * to change the layout without editing the JSX above.
 */
export async function getServerSideProps() {
  const readData = (filename) => {
    const content = fs.readFileSync(path.join(process.cwd(), "data", filename), "utf-8");
    return JSON.parse(content);
  };

  // Configure how many posts to show in each section
  const SECTION_COUNTS = {
    signals: 6,
    altcoins: 6,
    exchanges: 6,
    apps: 6,
    insuranceTax: 6,
    news: 6,
    guides: 6,
  };

  // Load data files
  const signals = readData("signals.json");
  const altcoins = readData("altcoins.json");
  const seccoin = readData("seccoin.json");
  const fidelity = readData("fidelity.json");
  const cryptoexchanges = readData("cryptoexchanges.json");
  const apps = readData("bestapps.json");
  const insurance = readData("insurance.json");
  const tax = readData("tax.json");
  const news = readData("news.json");
  const guides = readData("guides.json");

  // Sorting helper: newest first
  const sortDesc = (arr) => arr.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Combine and slice posts for each section
  const signalsPosts = sortDesc([...signals]).slice(0, SECTION_COUNTS.signals);
  const altcoinPosts = sortDesc([...altcoins, ...seccoin]).slice(0, SECTION_COUNTS.altcoins);
  const exchangePosts = sortDesc([...fidelity, ...cryptoexchanges]).slice(0, SECTION_COUNTS.exchanges);
  const appPosts = sortDesc([...apps]).slice(0, SECTION_COUNTS.apps);
  const insuranceTaxPosts = sortDesc([...insurance, ...tax]).slice(0, SECTION_COUNTS.insuranceTax);
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