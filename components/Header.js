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
    // Header dán dưới CryptoTicker cao 30px
    <header className="relative w-full bg-white dark:bg-gray-900 sticky top-[30px] left-0 right-0 z-50 shadow-sm">
      <div className="container 2xl:max-w-[1600px] mx-auto px-4 lg:px-6">
        {/* Header thấp hơn ~30% (py-3) và giữ logo không bị bóp (shrink-0) */}
        <div className="grid grid-cols-[auto,1fr,auto] items-center gap-6 py-3">
          {/* Logo to, không co lại */}
          <Link href="/" className="flex items-center shrink-0" aria-label="FinNews247">
              <Image
                src="/logo.png"
                alt="FinNews Logo"
                width={640}
                height={192}
                className="h-24 lg:h-28 xl:h-32 w-auto"
                priority
              />
            </Link>

          {/* Menu: chữ nhỏ lại + khoảng cách gần hơn; căn giữa; không ép logo */}
          <nav className="hidden md:flex justify-center items-center min-w-0 overflow-x-auto no-scrollbar whitespace-nowrap gap-5 text-[18px] lg:text-[19px] font-medium text-gray-800 dark:text-gray-200">
            {NAV_ITEMS.map((it) => (
              <Link key={it.href} href={it.href} className="hover:text-blue-600">{it.label}</Link>
            ))}
          </nav>

          {/* Theme + nút mobile */}
          <div className="flex items-center justify-end gap-3">
            <ThemeToggle />
            <button
              className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-2xl"
              aria-label="Toggle menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Viền mảnh dưới header giống bản cũ */}
      <div className="pointer-events-none absolute -bottom-px left-0 right-0">
        <div className="h-[2px] w-full bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500" />
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t">
          <nav className="container 2xl:max-w-[1600px] mx-auto flex flex-col px-4 py-2 space-y-2 text-[18px]">
            {NAV_ITEMS.map((it) => (
              <Link key={it.href} href={it.href} onClick={() => setMenuOpen(false)}>{it.label}</Link>
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
