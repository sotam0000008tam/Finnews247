// components/Layout.js
import Head from "next/head";
import { useRouter } from "next/router";
import CryptoTicker from "./CryptoTicker";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children, title }) {
  const router = useRouter();

  const ARTICLE_PATHS = new Set([
    "/[slug]",
    "/altcoins/[slug]",
    "/posts/[slug]",
    "/market/[slug]",
    "/crypto/[slug]",
    "/guides/[slug]",
    "/news/[slug]",
    "/insurance/[slug]",
    "/crypto-exchanges/[slug]",
    "/best-crypto-apps/[slug]",
    "/crypto-market/[slug]",
    "/reviews/[slug]",
    "/tax/[slug]",
    "/sec-coin/[slug]",
  ]);
  const isArticle = ARTICLE_PATHS.has(router.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Head>
        <meta charSet="utf-8" />
        <title>{title ? `${title} | FinNews` : "FinNews"}</title>
        <meta name="description" content="FinNews - Professional finance coverage" />
        <meta name="google-site-verification" content="Akkp3qaq0RfqlqI75Qw8nhIIiu21X7vMBIkV0yfahj0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Ticker cố định */}
      <div className="fixed top-0 left-0 right-0 z-50 w-full">
        <CryptoTicker />
      </div>
      {/* khoảng chèn đúng bằng chiều cao ticker */}
      <div aria-hidden style={{ height: 30 }} />

      <Header />

      {/* KHÔNG dùng overflow-hidden, KHÔNG giới hạn 1600px */}
      <main className={["flex-1 container mx-auto px-4 lg:px-6 py-8", isArticle ? "is-article" : ""].join(" ")}>
        {isArticle ? <div className="post-scope">{children}</div> : children}
      </main>

      <Footer />

      <style jsx global>{`
        html { font-size: 120%; }
        body { line-height: 1.6; }

        /* Hẹp như homepage để trang cao hơn → Auto Ads có nhiều điểm chèn */
        .post-scope .prose {
          max-width: 46rem; /* ~736px */
          margin-left: auto; margin-right: auto;
        }

        /* Ảnh trong bài viết responsive */
        .post-scope img, .post-scope picture img {
          display:block; width:100% !important; height:auto !important; max-width:100% !important;
        }
        .post-scope span[style*="position:relative"] { display:block !important; width:100% !important; max-width:100% !important; }
        .post-scope span[style*="position:relative"] > img { width:100% !important; height:auto !important; object-fit:contain; }

        .sidebar-scope img { width:45px !important; height:45px !important; object-fit:cover !important; display:block !important; }
      `}</style>
    </div>
  );
}
