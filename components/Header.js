// components/Header.js
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

// Menu đúng tên & thứ tự như file gốc
const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/signals", label: "Trading Signals" },
  { href: "/altcoins", label: "Altcoin Analysis" },
  { href: "/crypto-exchanges", label: "Exchanges" },
  { href: "/best-crypto-apps", label: "Apps & Wallets" },
  { href: "/insurance", label: "Insurance & Tax" },
  { href: "/crypto-market", label: "Crypto & Market" },
  { href: "/guides", label: "Guides & Reviews" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    // Header sits underneath the ticker.  Removing the `sticky` and `top`
    // classes allows Google AdSense to show top anchor ads, which
    // improves overall ad density.  We keep the relative positioning
    // and z-index so the header still layers correctly.
    <header className="relative w-full bg-white dark:bg-gray-900 shadow-sm z-50">
      <div className="container 2xl:max-w-[1600px] mx-auto px-4 lg:px-6">
        {/* Header thấp: giảm py và gap */}
        <div className="grid grid-cols-[auto,1fr,auto] items-center gap-4 py-2 md:py-2.5">
          {/* LOGO: gấp ~2 lần (so với h-12 trước đây) */}
          <Link href="/" className="flex items-center shrink-0" aria-label="FinNews247">
            <Image
              src="/logo.png"
              alt="FinNews Logo"
              width={960}
              height={288}
              className="h-24 md:h-24 lg:h-28 w-auto"  // ~2x
              priority
            />
          </Link>

          {/* NAV DESKTOP: 1 dòng; nếu thiếu chỗ thì trượt ngang (không wrap, không cắt chữ) */}
          <nav
            className="
              hidden md:flex flex-1 min-w-0
              items-center justify-center
              flex-nowrap whitespace-nowrap
              gap-4 lg:gap-5
              text-[15px] lg:text-[16px] font-medium
              text-gray-800 dark:text-gray-200
              overflow-x-auto no-scrollbar
            "
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {it.label}
              </Link>
            ))}
          </nav>

          {/* Theme + nút mobile */}
          <div className="flex items-center justify-end gap-3 shrink-0">
            <ThemeToggle />
            <button
              className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-2xl"
              aria-label="Toggle menu"
              aria-expanded={menuOpen ? "true" : "false"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Viền mảnh dưới header */}
      <div className="pointer-events-none absolute -bottom-px left-0 right-0">
        <div className="h-[2px] w-full bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500" />
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t">
          <nav className="container 2xl:max-w-[1600px] mx-auto flex flex-col px-4 py-2 space-y-2 text-[18px]" aria-label="Mobile navigation">
            {NAV_ITEMS.map((it) => (
              <Link key={it.href} href={it.href} onClick={() => setMenuOpen(false)} className="py-1.5">
                {it.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Ẩn scrollbar ngang của nav khi tràn */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </header>
  );
}
