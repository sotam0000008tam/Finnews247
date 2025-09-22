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
      <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-10 z-40 border-b relative">
        {/* Gradient border dưới header */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500"></div>

        <div className="container mx-auto px-4 flex items-center justify-between py-2 md:py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="FinNews Logo"
              width={120}
              height={35}
              priority
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex gap-6 text-sm md:text-base font-medium text-gray-700 dark:text-gray-300">
            {[
              { href: "/", label: "Home" },
              { href: "/crypto", label: "Crypto" },
              { href: "/stocks", label: "Stocks" },
              { href: "/economy", label: "Economy" },
              { href: "/market", label: "Market" },
              { href: "/signals", label: "Signals" },
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

          {/* Theme Toggle */}
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
              <li><Link href="/crypto">Crypto</Link></li>
              <li><Link href="/stocks">Stocks</Link></li>
              <li><Link href="/economy">Economy</Link></li>
              <li><Link href="/market">Market</Link></li>
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

        <div className="border-t border-gray-700 text-center py-4 text-xs text-gray-500">
          © {new Date().getFullYear()} FinNews. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
