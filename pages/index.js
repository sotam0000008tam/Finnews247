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

export default function Home({
  signalsPosts,
  altcoinPosts,
  exchangePosts,
  appPosts,
  insuranceTaxPosts,
  newsPosts,
  guidePosts,
}) {
  return (
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
        {/* Altcoins */}
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
          <h2 className="text-2xl font-semibold mb-4">Crypto Exchanges Insights</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {exchangePosts.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>

        {/* Apps */}
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

        {/* News */}
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
  );
}

export async function getServerSideProps() {
  const readData = (filename) => {
    const content = fs.readFileSync(path.join(process.cwd(), "data", filename), "utf-8");
    return JSON.parse(content);
  };

  const SECTION_COUNTS = {
    signals: 6,
    altcoins: 6,
    exchanges: 6,
    apps: 6,
    insuranceTax: 6,
    news: 6,
    guides: 6,
  };

  // Load JSON
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

  const sortDesc = (arr) => arr.sort((a, b) => new Date(b.date) - new Date(a.date));

  return {
    props: {
      signalsPosts: sortDesc([...signals]).slice(0, SECTION_COUNTS.signals),
      altcoinPosts: sortDesc([...altcoins, ...seccoin]).slice(0, SECTION_COUNTS.altcoins),
      exchangePosts: sortDesc([...fidelity, ...cryptoexchanges]).slice(0, SECTION_COUNTS.exchanges),
      appPosts: sortDesc([...apps]).slice(0, SECTION_COUNTS.apps),
      insuranceTaxPosts: sortDesc([...insurance, ...tax]).slice(0, SECTION_COUNTS.insuranceTax),
      newsPosts: sortDesc([...news]).slice(0, SECTION_COUNTS.news),
      guidePosts: sortDesc([...guides]).slice(0, SECTION_COUNTS.guides),
    },
  };
}
