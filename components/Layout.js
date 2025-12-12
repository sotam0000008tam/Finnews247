// components/Layout.js
import Head from "next/head";
import { useRouter } from "next/router";
import Header from "./Header";
import Footer from "./Footer";
import CryptoTicker from "./CryptoTicker";

export default function Layout({ children, title }) {
  const router = useRouter();

  // Các trang bài viết (dùng pattern của Next.js qua router.pathname)
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
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-x-hidden">
      <Head>
        <meta charSet="utf-8" />
        <title>{title ? `${title} | FinNews` : "FinNews"}</title>
        <meta
          name="description"
          content="FinNews - Professional finance coverage"
        />
        <meta
          name="google-site-verification"
          content="Akkp3qaq0RfqlqI75Qw8nhIIiu21X7vMBIkV0yfahj0"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* The ticker is placed statically instead of being fixed.  This layout leaves
          room for any future top anchor ads that may be inserted by ad networks,
          and avoids the need for spacer elements to offset subsequent content. */}
      <div className="w-full">
        <CryptoTicker />
      </div>
      {/* Since the ticker is no longer fixed, we do not need an invisible spacer to
          offset subsequent content. */}

      {/* Header */}
      <Header />

      {/* Nội dung chính */}
      {/* Main content area. Use the wider container-1600 class for all pages to match
          the homepage layout. The is-article flag wraps posts in a post-scope so
          we can target styles without constraining their width. */}
      <main
        className={[
          "flex-1 container mx-auto px-4 lg:px-6 py-8 container-1600",
          isArticle ? "is-article" : "",
        ].join(" ")}
      >
        {isArticle ? <div className="post-scope">{children}</div> : children}
      </main>

      {/* Footer */}
      <Footer />

      <style jsx global>{`
        html {
          font-size: 120%;
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
        }
        body {
          line-height: 1.6;
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
        }

        /* Keep the layout tidy; a longer page allows ad networks to insert
           advertisements in more positions without breaking the reading
           experience. */
        /* Không ép container 1600px; để Tailwind container tự xử lý */

        /* NỘI DUNG BÀI VIẾT: bỏ giới hạn độ rộng để nội dung sử dụng
           toàn bộ chiều ngang cột bài viết.  Việc căn giữa đã được
           xử lý bởi Tailwind container classes. */
        .post-scope .prose {
          max-width: none;
          margin-left: auto;
          margin-right: auto;
        }

        /* Ảnh trong bài viết luôn responsive */
        .post-scope img,
        .post-scope picture img {
          display: block;
          width: 100% !important;
          height: auto !important;
          max-width: 100% !important;
        }
        .post-scope span[style*="position:relative"] {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
        }
        .post-scope span[style*="position:relative"] > img {
          width: 100% !important;
          height: auto !important;
          object-fit: contain;
        }

        .sidebar-scope img {
          width: 45px !important;
          height: 45px !important;
          object-fit: cover !important;
          display: block !important;
        }

        /* Các khối nội dung bài viết sử dụng class 'post-body' (nhiều trang viết).
           Không giới hạn độ rộng để chúng có thể lấp đầy phần cột bài viết. */
        .post-body {
          max-width: none !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
      `}</style>
    </div>
  );
}
