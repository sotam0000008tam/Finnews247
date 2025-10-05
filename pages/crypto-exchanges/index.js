// pages/crypto-exchanges/index.js
import fs from "fs";
import path from "path";
import Link from "next/link";
import { NextSeo } from "next-seo";

/**
 * Trang danh sách Crypto Exchanges (canonical).
 * Đọc dữ liệu từ data/cryptoexchanges.json và render dạng card.
 * Không phụ thuộc component bên ngoài để tránh lỗi import.
 */
export default function CryptoExchanges({ items }) {
  // Schema.org ItemList cho SEO
  const itemListElement = items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `https://www.finnews247.com/crypto-exchanges/${it.slug}`,
    name: it.title || it.name || it.slug,
  }));
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Crypto Exchanges",
    description:
      "Compare crypto exchanges by fees, security, liquidity and features.",
    url: "https://www.finnews247.com/crypto-exchanges",
    itemListElement,
  };

  return (
    <>
      <NextSeo
        title="Crypto Exchanges | FinNews247"
        description="Compare crypto exchanges: fees, security, liquidity and features. Find the best exchange for your trading style."
        canonical="https://www.finnews247.com/crypto-exchanges"
        openGraph={{
          title: "Crypto Exchanges | FinNews247",
          description:
            "Compare crypto exchanges: fees, security, liquidity and features.",
          url: "https://www.finnews247.com/crypto-exchanges",
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="container mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold">Crypto Exchanges</h1>
          <p className="text-gray-600 mt-2">
            A curated list of exchanges with key details on fees, security and
            features. Click any exchange to view the full review and guides.
          </p>
        </header>

        {items.length === 0 ? (
          <div className="p-4 border rounded-lg bg-white">
            No exchanges found. Please add items to <code>data/cryptoexchanges.json</code>.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {items.map((it) => (
              <article
                key={it.slug}
                className="p-4 border rounded-xl bg-white hover:shadow transition"
              >
                <div className="flex items-start gap-4">
                  {it.logo ? (
                    <img
                      src={it.logo.startsWith("http") ? it.logo : `/images/${it.logo}`}
                      alt={it.title || it.name || it.slug}
                      className="w-14 h-14 object-contain rounded border"
                      loading="lazy"
                    />
                  ) : null}

                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">
                      <Link
                        href={`/crypto-exchanges/${it.slug}`}
                        className="text-sky-700 hover:underline"
                      >
                        {it.title || it.name || it.slug}
                      </Link>
                    </h2>

                    {it.summary ? (
                      <p className="text-sm text-gray-600 mt-1">{it.summary}</p>
                    ) : null}

                    <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      {it.fees ? (
                        <>
                          <dt className="text-gray-500">Fees</dt>
                          <dd>{it.fees}</dd>
                        </>
                      ) : null}
                      {it.security ? (
                        <>
                          <dt className="text-gray-500">Security</dt>
                          <dd>{it.security}</dd>
                        </>
                      ) : null}
                      {it.liquidity ? (
                        <>
                          <dt className="text-gray-500">Liquidity</dt>
                          <dd>{it.liquidity}</dd>
                        </>
                      ) : null}
                      {it.rating ? (
                        <>
                          <dt className="text-gray-500">Rating</dt>
                          <dd>{it.rating}/5</dd>
                        </>
                      ) : null}
                    </dl>

                    <div className="mt-4 flex gap-3">
                      <Link
                        href={`/crypto-exchanges/${it.slug}`}
                        className="px-3 py-2 rounded bg-sky-600 text-white text-sm"
                      >
                        View review →
                      </Link>
                      {it.ctaUrl ? (
                        <a
                          href={it.ctaUrl}
                          target="_blank"
                          rel="nofollow noopener"
                          className="px-3 py-2 rounded bg-gray-100 text-sm"
                        >
                          Visit site
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export async function getStaticProps() {
  // Đọc JSON ở build-time để trang tĩnh & ổn định với Googlebot/AdSense
  const file = path.join(process.cwd(), "data", "cryptoexchanges.json");
  let items = [];
  try {
    if (fs.existsSync(file)) {
      items = JSON.parse(fs.readFileSync(file, "utf-8"));
    }
  } catch (e) {
    console.error("Failed to read cryptoexchanges.json:", e);
  }

  // Chuẩn hoá dữ liệu tối thiểu
  items = (Array.isArray(items) ? items : [])
    .filter((x) => x && x.slug)
    // Sắp xếp: ưu tiên rating giảm dần, sau đó theo tên
    .sort((a, b) => {
      const ra = Number(a.rating || 0), rb = Number(b.rating || 0);
      if (rb !== ra) return rb - ra;
      const na = (a.title || a.name || a.slug).toLowerCase();
      const nb = (b.title || b.name || b.slug).toLowerCase();
      return na.localeCompare(nb);
    });

  return { props: { items } };
}
