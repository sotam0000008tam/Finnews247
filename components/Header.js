import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 flex items-center justify-between py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="FinNews Logo" width={140} height={40} />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Link href="/">Home</Link>
          <Link href="/crypto">Crypto</Link>
          <Link href="/stocks">Stocks</Link>
          <Link href="/economy">Economy</Link>
          <Link href="/market">Market</Link>
          <Link href="/signals">Signals</Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t">
          <nav className="flex flex-col p-3 space-y-2 text-sm">
            <Link href="/">Home</Link>
            <Link href="/crypto">Crypto</Link>
            <Link href="/stocks">Stocks</Link>
            <Link href="/economy">Economy</Link>
            <Link href="/market">Market</Link>
            <Link href="/signals">Signals</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
