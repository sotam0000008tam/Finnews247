import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 mt-8">
      {/* Giảm chiều cao ~20% (py-10) và bỏ mọi đường viền thừa */}
      <div className="container 2xl:max-w-[1600px] mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12 items-start">
          <div className="min-w-0 md:justify-self-start text-left">
            <h4 className="text-lg font-semibold text-white mb-4">FinNews247</h4>
            <p className="text-sm leading-relaxed">
              FinNews247 provides reliable coverage of global financial markets, cryptocurrencies, and the economy.
              Our mission is to deliver timely, accurate, and unbiased information.
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
              <li><Link href="/crypto-market">Crypto & Market</Link></li>
              <li><Link href="/guides">Guides & Reviews</Link></li>
            </ul>
          </div>

          <div className="min-w-0 md:justify-self-end text-right">
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="list-none m-0 p-0 space-y-2 text-sm md:text-right">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms &amp; Conditions</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center py-3 text-xs text-gray-500">
        © {new Date().getFullYear()} FinNews247. All rights reserved. • Design by LongHung
      </div>
    </footer>
  );
}
