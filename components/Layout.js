// components/Layout.js
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import CryptoTicker from "./CryptoTicker";

export default function Layout({ children, title }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Head */}
      <Head>
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

      {/* Fixed ticker */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <CryptoTicker />
      </div>
      <div aria-hidden style={{ height: 30 }} />

      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-10 z-40 border-b-2 border-transparent relative">
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500"></div>

        <div className="container mx-auto px-4 flex items-center justify-between py-3">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="FinNews Logo"
                width={140}
                height={40}
                priority
              />
            </Link>

            <nav className="hidden md:flex gap-6 text-lg font-medium text-gray-700 dark:text-gray-300">
              {/*
                The navigation has been streamlined to emphasize Crypto while keeping
                the menu concise. Altcoins and Exchanges are surfaced as top‑level
                items due to their strong niche and high CPC potential.  All other
                crypto sub‑topics (e.g. guides, apps, tax, insurance, fidelity,
                sec coin) remain accessible via internal links and the footer but
                are no longer listed directly in the header.
              */}
              {/*
                The primary navigation prioritizes key sections aligned with the
                site's niche: trading signals and crypto. Items are ordered
                intentionally to guide users from general to specific topics.
                "Crypto & Market" links to broader market coverage while
                "Insurance & Tax" consolidates compliance content. "Apps &
                Wallets" covers mobile wallets and crypto apps. Altcoin
                Analysis and Exchanges are surfaced separately due to high
                commercial intent. Trading Signals remains prominent.
              */}
              {[
                { href: "/", label: "Home" },
                { href: "/signals", label: "Trading Signals" },
                { href: "/altcoins", label: "Altcoin Analysis" },
                { href: "/crypto-exchanges", label: "Exchanges" },
                { href: "/best-crypto-apps", label: "Apps & Wallets" },
                { href: "/insurance", label: "Insurance & Tax" },
                { href: "/market", label: "Crypto & Market" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative group hover:text-sky-600 transition-colors duration-200"
                >
                  {item.label}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>
          </div>

          <ThemeToggle />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">FinNews</h4>
            <p className="text-sm leading-relaxed">
              FinNews provides reliable coverage of global financial markets,
              cryptocurrencies, and the economy. Our mission is to deliver
              timely, accurate, and unbiased information to help readers make
              informed investment decisions.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Categories</h4>
            <ul className="space-y-2 text-sm">
              {/* Align categories with header navigation while keeping them comprehensive */}
              <li><Link href="/signals">Trading Signals</Link></li>
              <li><Link href="/altcoins">Altcoin Analysis</Link></li>
              <li><Link href="/crypto-exchanges">Exchanges</Link></li>
              <li><Link href="/best-crypto-apps">Apps & Wallets</Link></li>
              <li><Link href="/insurance">Insurance & Tax</Link></li>
              <li><Link href="/market">Crypto & Market</Link></li>
              <li><Link href="/guides">Guides & Reviews</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Newsletter</h4>
            <p className="text-sm mb-3">
              Subscribe to receive weekly insights and analysis from FinNews.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="px-3 py-2 rounded bg-gray-800 border border-gray-700 text-sm w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-700 text-center py-4 text-xs text-gray-500 space-y-1">
          <p>© {new Date().getFullYear()} FinNews. All rights reserved.</p>
          <p>Design by: LongHung</p>
        </div>
      </footer>
    </div>
  );
}
