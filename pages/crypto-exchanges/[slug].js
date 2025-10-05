// pages/crypto-exchanges/[slug].js
import fs from "fs";
import path from "path";
import Link from "next/link";
import { NextSeo } from "next-seo";

function resolveImg(src) {
  if (!src) return null;
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) return src;
  return `/images/${src}`;
}

export default function ExchangeDetail({ item }) {
  if (!item) {
    return (
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-2">Not found</h1>
        <p className="text-gray-600 mb-6">This exchange is unavailable.</p>
        <Link href="/crypto-exchanges" className="text-sky-600 hover:underline">← Back to list</Link>
      </div>
    );
  }

  const title = item.title || item.name || item.slug;
  const desc =
    item.summary ||
    `Review of ${title}: fees, security, liquidity and features.`;
  const url = `https://www.finnews247.com/crypto-exchanges/${item.slug}`;
  const image = resolveImg(item.logo);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: desc,
    mainEntityOfPage: url,
    author: { "@type": "Organization", name: "FinNews247" },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.finnews247.com/" },
      { "@type": "ListItem", position: 2, name: "Crypto Exchanges", item: "https://www.finnews247.com/crypto-exchanges" },
      { "@type": "ListItem", position: 3, name: title, item: url },
    ],
  };

  return (
    <>
      <NextSeo
        title={`${title} | FinNews247`}
        description={desc}
        canonical={url}
        openGraph={{
          title: `${title} | FinNews247`,
          description: desc,
          url,
          images: image ? [{ url: image }] : undefined,
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="container mx-auto px-4 py-8">
        <nav className="mb-4 text-sm">
          <Link href="/crypto-exchanges" className="text-sky-600 hover:underline">Crypto Exchanges</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span>{title}</span>
        </nav>

        <header className="mb-6 flex items-start gap-4">
          {image && (
            <img
              src={image}
              alt={title}
              className="w-16 h-16 object-contain rounded border"
              loading="lazy"
            />
          )}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
            {item.summary && <p className="text-gray-600 mt-1">{item.summary}</p>}
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          <section className="md:col-span-2 space-y-4">
            {item.content ? (
              <article
                className="prose max-w-none bg-white p-4 rounded-xl border"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            ) : (
              <article className="bg-white p-4 rounded-xl border">
                <h2 className="text-lg font-semibold mb-2">Overview</h2>
                <p>
                  Detailed review is coming soon. Below are quick facts for {title}.
                </p>
              </article>
            )}
          </section>

          <aside className="space-y-3">
            <div className="bg-white p-4 rounded-xl border">
              <h3 className="font-semibold mb-2">Key Facts</h3>
              <dl className="text-sm grid grid-cols-2 gap-2">
                {item.fees && (<><dt className="text-gray-500">Fees</dt><dd>{item.fees}</dd></>)}
                {item.security && (<><dt className="text-gray-500">Security</dt><dd>{item.security}</dd></>)}
                {item.liquidity && (<><dt className="text-gray-500">Liquidity</dt><dd>{item.liquidity}</dd></>)}
                {typeof item.rating !== "undefined" && (<><dt className="text-gray-500">Rating</dt><dd>{item.rating}/5</dd></>)}
              </dl>
              {item.ctaUrl && (
                <a href={item.ctaUrl} target="_blank" rel="nofollow noopener"
                   className="mt-3 inline-block px-3 py-2 rounded bg-sky-600 text-white text-sm">
                  Visit site
                </a>
              )}
            </div>
          </aside>
        </div>

        <div className="mt-8">
          <Link href="/crypto-exchanges" className="text-sky-600 hover:underline">
            ← Back to all exchanges
          </Link>
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const file = path.join(process.cwd(), "data", "cryptoexchanges.json");
  let items = [];
  try {
    if (fs.existsSync(file)) {
      items = JSON.parse(fs.readFileSync(file, "utf-8"));
    }
  } catch {}
  const paths = (Array.isArray(items) ? items : [])
    .filter((x) => x && x.slug)
    .map((x) => ({ params: { slug: String(x.slug) } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const file = path.join(process.cwd(), "data", "cryptoexchanges.json");
  let items = [];
  try {
    if (fs.existsSync(file)) {
      items = JSON.parse(fs.readFileSync(file, "utf-8"));
    }
  } catch {}
  const item =
    (Array.isArray(items) ? items : []).find((x) => x && String(x.slug) === params.slug) || null;

  if (!item) return { notFound: true };
  return { props: { item } };
}
