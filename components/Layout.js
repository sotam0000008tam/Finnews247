// components/Layout.js
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import CryptoTicker from "./CryptoTicker";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Layout({ children, title }) {
  const router = useRouter();

  // Các route bài viết (bao gồm cả root-level /[slug])
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
  ]);
  const isArticle = ARTICLE_PATHS.has(router.pathname);
  const isInsuranceArticle = router.pathname === "/insurance/[slug]";

  // Ẩn “Top Exchanges / Best Crypto Wallets / Top Staking …” chỉ trong bài Insurance
  useEffect(() => {
    if (!isInsuranceArticle || typeof window === "undefined") return;
    const scope =
      document.querySelector("main.is-insurance-article .post-scope") ||
      document.querySelector(".post-scope");
    if (!scope) return;

    const hrefPatterns = ["crypto-exchanges", "best-crypto-apps", "staking"];
    const textPatterns = ["Top Exchanges", "Best Crypto Wallets", "Top Staking"];

    const anchors = Array.from(scope.querySelectorAll("a"));
    anchors.forEach((a) => {
      const href = (a.getAttribute("href") || "").toLowerCase();
      const txt = (a.textContent || "").trim().toLowerCase();
      const hitHref = hrefPatterns.some((p) => href.includes(p));
      const hitText = textPatterns.some((t) => txt.includes(t.toLowerCase()));
      if (hitHref || hitText) {
        let node =
          a.closest(
            "li, p, div, section, aside, figure, .wp-block-group, .wp-block-buttons, .cta, .promo, .after-article, .related"
          ) || a.parentElement;
        if (node) {
          node.style.display = "none";
          const prev = node.previousElementSibling;
          if (
            prev &&
            /^(H2|H3|H4|P)$/i.test(prev.tagName) &&
            (prev.textContent || "").trim().length <= 60
          ) {
            prev.style.display = "none";
          }
        }
      }
    });

    // Ẩn list rỗng
    scope.querySelectorAll("ul,ol").forEach((list) => {
      const visibleItems = Array.from(list.children).some(
        (li) => li && li.offsetParent !== null
      );
      if (!visibleItems) list.style.display = "none";
    });
  }, [isInsuranceArticle]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Head */}
      <Head>
        <title>{title ? `${title} | FinNews` : "FinNews"}</title>
        <meta name="description" content="FinNews - Professional finance coverage" />
        <meta name="google-site-verification" content="Akkp3qaq0RfqlqI75Qw8nhIIiu21X7vMBIkV0yfahj0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Fixed ticker */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <CryptoTicker />
      </div>
      <div aria-hidden style={{ height: 30 }} />

      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-10 z-40 border-b-2 border-transparent relative">
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500" />
        <div className="container mx-auto px-4 flex items-center justify-between py-3">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="FinNews Logo" width={168} height={48} priority className="h-auto w-auto" />
            </Link>

            <nav className="hidden md:flex gap-6 text-lg font-medium text-gray-700 dark:text-gray-300">
              {[
                { href: "/", label: "Home" },
                { href: "/signals", label: "Trading Signals" },
                { href: "/altcoins", label: "Altcoin Analysis" },
                { href: "/crypto-exchanges", label: "Exchanges" },
                { href: "/best-crypto-apps", label: "Apps & Wallets" },
                { href: "/insurance", label: "Insurance & Tax" },
                { href: "/market", label: "Crypto & Market" },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="relative group hover:text-sky-600 transition-colors duration-200">
                  {item.label}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main */}
      <main
        className={[
          "flex-1 container mx-auto px-4 py-8",
          isArticle ? "is-article" : "",
          isInsuranceArticle ? "is-insurance-article" : "",
        ].join(" ")}
      >
        {isArticle ? <div className="post-scope">{children}</div> : children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-8">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start">
            <div className="min-w-0 md:justify-self-start text-left">
              <h4 className="text-lg font-semibold text-white mb-4">FinNews247</h4>
              <p className="text-sm leading-relaxed">
                FinNews247 provides reliable coverage of global financial markets, cryptocurrencies, and the economy.
                Our mission is to deliver timely, accurate, and unbiased information to help readers make informed investment decisions.
              </p>
            </div>
            <div className="min-w-0 md:justify-self-center text-center">
              <h4 className="text-lg font-semibold text-white mb-4">Categories</h4>
              <ul className="list-none m-0 p-0 space-y-2 text-sm md:text-center">
                <li><Link href="/signals">Trading Signals</Link></li>
                <li><Link href="/altcoins">Altcoin Analysis</Link></li>
                <li><Link href="/crypto-exchanges">Exchanges</Link></li>
                <li><Link href="/best-crypto-apps">Apps & Wallets</Link></li>
                <li><Link href="/insurance">Insurance & Tax</Link></li>
                <li><Link href="/market">Crypto & Market</Link></li>
                <li><Link href="/guides">Guides & Reviews</Link></li>
              </ul>
            </div>
            <div className="min-w-0 md:justify-self-end text-right">
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="list-none m-0 p-0 space-y-2 text-sm md:text-right">
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms & Conditions</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 text-center py-4 text-xs text-gray-500 space-y-1">
          <p>© {new Date().getFullYear()} FinNews247. All rights reserved.</p>
          <p>Design by: Miko Tech</p>
        </div>
      </footer>

      {/* GLOBAL CSS */}
      <style jsx global>{`
        /* +20% chữ toàn site */
        html { font-size: 120%; }
        body { line-height: 1.65; }

        /* ẢNH TRONG BÀI – chỉ áp dụng ở trang article (.post-scope) */
        .post-scope .prose { max-width: none; }  /* bỏ giới hạn 65ch của typography */

        /* IMG & PICTURE: đầy bề rộng cột chữ */
        .post-scope img,
        .post-scope picture img {
          display: block;
          width: 100% !important;
          height: auto !important;
          max-width: 100% !important;
        }

        /* Wrapper Next/Image (span position:relative) */
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

        /* Chống text dài làm bể layout */
        .post-scope, .post-scope * { min-width: 0; word-break: break-word; }

        /* Footer: loại bullet nếu theme kế thừa */
        footer ul { list-style: none; padding: 0; margin: 0; }
        footer li::marker { content: ""; }
      `}</style>
    </div>
  );
}
