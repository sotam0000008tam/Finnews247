import Head from "next/head";
import CryptoTicker from "./CryptoTicker";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children, title }) {
  const router = useRouter();

  const ARTICLE_PATHS = new Set([
    "/[slug]","/altcoins/[slug]","/posts/[slug]","/market/[slug]",
    "/crypto/[slug]","/guides/[slug]","/news/[slug]","/insurance/[slug]",
    "/crypto-exchanges/[slug]","/best-crypto-apps/[slug]","/crypto-market/[slug]",
  ]);
  const isArticle = ARTICLE_PATHS.has(router.pathname);
  const isInsuranceArticle = false; // disabled to avoid hiding content blocks that help Auto Ads

  useEffect(() => {
    if (!isInsuranceArticle || typeof window === "undefined") return;
    const scope =
      document.querySelector("main.is-insurance-article .post-scope") ||
      document.querySelector(".post-scope");
    if (!scope) return;

    const hrefPatterns = ["crypto-exchanges","best-crypto-apps","staking"];
    const textPatterns = ["Top Exchanges","Best Crypto Wallets","Top Staking"];

    const anchors = Array.from(scope.querySelectorAll("a"));
    anchors.forEach((a) => {
      const href = (a.getAttribute("href") || "").toLowerCase();
      const txt = (a.textContent || "").trim().toLowerCase();
      const hitHref = hrefPatterns.some((p) => href.includes(p));
      const hitText = textPatterns.some((t) => txt.includes(t.toLowerCase()));
      if (hitHref || hitText) {
        let node =
          a.closest("li, p, div, section, aside, figure, .wp-block-group, .wp-block-buttons, .cta, .promo, .after-article, .related") || a.parentElement;
        if (node) {
          node.style.display = "none";
          const prev = node.previousElementSibling;
          if (prev && /^(H2|H3|H4|P)$/i.test(prev.tagName) && (prev.textContent || "").trim().length <= 60) {
            prev.style.display = "none";
          }
        }
      }
    });

    scope.querySelectorAll("ul,ol").forEach((list) => {
      const visibleItems = Array.from(list.children).some((li) => li && (li.offsetParent !== null));
      if (!visibleItems) list.style.display = "none";
    });
  }, [isInsuranceArticle]);

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

      {/* Header */}
      <Header />

      {/* Nội dung chính */}
      <main
        className={[
          "flex-1 container mx-auto px-4 lg:px-6 py-8",
          isArticle ? "is-article" : "",
          isInsuranceArticle ? "is-insurance-article" : "",
        ].join(" ")}
      >
        {isArticle ? <div className="post-scope">{children}</div> : children}
      </main>

      {/* Footer */}
      <Footer />

      <style jsx global>{`
        html { font-size: 120%; }
        body { line-height: 1.6; }
        /* KHÔNG khoá container 1200px nếu muốn 1600px */
        /* .container { max-width: 1200px; } */

        .post-scope .prose { max-width: none; }
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
