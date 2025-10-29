import fs from "fs";
import path from "path";
import Link from "next/link";
import { NextSeo } from "next-seo";

const firstImg = (html = "") => (String(html).match(/<img[^>]+src=["']([^"']+)["']/i) || [])[1] || null;
const pickThumb = (p, fallback="/images/dummy/altcoins64.jpg") => p?.thumb || p?.ogImage || p?.image || firstImg(p?.content || p?.body || "") || fallback;

const FALLBACK_BASE = "/tax";
const buildUrl = (p) => {
  if (p?.href) return p.href;
  const slug = p?.slug; if (!slug) return "#";
  const c = String(p?._cat || p?.category || "").toLowerCase();
  if (c.includes("market") || c.includes("news")) return `/crypto-market/${slug}`;
  if (c.includes("altcoin") || c.includes("sec coin") || c.includes("seccoin")) return `/altcoins/${slug}`;
  if (c.includes("exchange") || c.includes("fidelity")) return `/crypto-exchanges/${slug}`;
  if (c.includes("wallet") || c.includes("app")) return `/best-crypto-apps/${slug}`;
  if (c.includes("insurance")) return `/insurance/${slug}`;
  if (c.includes("tax") || c.includes("compliance")) return `/tax/${slug}`;
  if (c.includes("guide") || c.includes("review")) return `/guides/${slug}`;
  return `${FALLBACK_BASE}/${slug}`;
};

function SideMiniItem({ item }) {
  const href = buildUrl(item);
  const img = pickThumb(item);
  return (
    <Link href={href} className="group flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
      <img src={img} alt={item?.title || "post"} className="w-[45px] h-[45px] rounded-md object-cover border dark:border-gray-700 shrink-0" loading="lazy"/>
      <div className="min-w-0">
        <div className="text-sm leading-snug line-clamp-2 group-hover:underline">{item?.title || "Untitled"}</div>
        {(item?.date || item?.updatedAt) && <div className="text-xs text-gray-500 mt-0.5">{item?.date || item?.updatedAt}</div>}
      </div>
    </Link>
  );
}

export default function TaxIndex({ posts = [], latest = [] }) {
  return (
    <>
      <NextSeo title="Tax & Compliance | FinNews247" canonical="https://www.finnews247.com/tax" />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Tax &amp; Compliance</h1>
        <div className="grid md:grid-cols-12 gap-8">
          <section className="md:col-span-9 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((it) => (
              <Link key={it.slug} href={buildUrl({ ...it, _cat: "tax" })} className="block rounded-lg border p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                <img src={pickThumb(it)} alt={it.title} className="w-full h-40 object-cover rounded-md mb-2" loading="lazy"/>
                <div className="font-medium line-clamp-2">{it.title}</div>
                {it.date && <div className="text-xs text-gray-500 mt-1">{it.date}</div>}
              </Link>
            ))}
          </section>

          <aside className="md:col-span-3 w-full sticky top-24 self-start space-y-6 sidebar-scope">
            <section className="rounded-xl border bg-white dark:bg-gray-900 overflow-hidden">
              <div className="px-4 py-3 border-b dark:border-gray-700"><h3 className="text-sm font-semibold">Latest on FinNews247</h3></div>
              <ul className="divide-y dark:divide-gray-800">
                {latest.length ? latest.map((it) => (<li key={(it.slug || it.title) + "-latest"}><SideMiniItem item={it}/></li>))
                  : (<li className="px-4 py-3 text-xs text-gray-500">No recent posts.</li>)}
              </ul>
            </section>
          </aside>
        </div>
      </div>

      <style jsx global>{`.sidebar-scope img{width:45px!important;height:45px!important;max-width:none!important;object-fit:cover!important;border-radius:8px!important;display:block!important;}`}</style>
    </>
  );
}

export async function getServerSideProps() {
  const read = (f) => { try { return JSON.parse(fs.readFileSync(path.join(process.cwd(),"data",f),"utf-8")); } catch { return []; } };
  const posts = (read("tax.json") || []).filter(Boolean);

  const market = read("news.json").map((p) => ({ ...p, _cat: "crypto-market" }));
  const alt = [].concat(read("altcoins.json"), read("seccoin.json")).map((p) => ({ ...p, _cat: "altcoins" }));
  const ex = [].concat(read("cryptoexchanges.json"), read("fidelity.json")).map((p) => ({ ...p, _cat: "crypto-exchanges" }));
  const apps = read("bestapps.json").map((p) => ({ ...p, _cat: "best-crypto-apps" }));
  const ins = read("insurance.json").map((p) => ({ ...p, _cat: "insurance" }));
  const guides = read("guides.json").map((p) => ({ ...p, _cat: "guides" }));

  const seen = new Set();
  const latest = [...market, ...alt, ...ex, ...apps, ...ins, ...guides]
    .filter((x) => x?.slug && !seen.has(x.slug) && seen.add(x.slug))
    .sort((a,b)=> (Date.parse(b.date||b.updatedAt)||0)-(Date.parse(a.date||a.updatedAt)||0))
    .slice(0,10);

  return { props: { posts, latest } };
}
