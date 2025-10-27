import Link from "next/link";
import { NextSeo } from "next-seo";
import ArticleHero from "../../components/ArticleHero";

/* Helpers */
function stripHtml(html = "") {
  return html.replace(/<script[\s\S]*?<\/script>/gi,"")
             .replace(/<style[\s\S]*?<\/style>/gi,"")
             .replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
}
function truncate(s="",n=160){ if(s.length<=n) return s; const cut=s.slice(0,n); const i=cut.lastIndexOf(" "); return (i>80?cut.slice(0,i):cut)+"…"; }
function extractFirstImage(html = "") {
  const m = html?.match?.(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
}
function pickHero(p){ return p?.image || p?.ogImage || extractFirstImage(p?.content || p?.body || ""); }
function pickThumb(p){ return p?.thumb || p?.ogImage || p?.image || extractFirstImage(p?.content || p?.body || "") || "/images/dummy/altcoins64.jpg"; }
function parseDate(d){ const t=Date.parse(d); return isNaN(t)?0:t; }
function buildUrl(p){
  if (p?.href) return p.href;
  const slug=p?.slug; if(!slug) return "#";
  const c=String(p?.category||"").toLowerCase();
  if (c.includes("tax")||c.includes("compliance")) return `/tax/${slug}`;
  if (c.includes("insurance")) return `/insurance/${slug}`;
  if (c.includes("altcoin")||c.includes("sec coin")||c.includes("seccoin")) return `/altcoins/${slug}`;
  if (c.includes("exchange")||c.includes("fidelity")) return `/crypto-exchanges/${slug}`;
  if (c.includes("wallet")||c.includes("app")) return `/best-crypto-apps/${slug}`;
  if (c.includes("market")) return `/${slug}`;
  if (c.includes("guide")||c.includes("review")) return `/guides/${slug}`;
  return `/insurance/${slug}`;
}

function SideItem({ item }) {
  const url = buildUrl(item);
  const img = pickThumb(item);
  return (
    <Link href={url} className="group flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
      <img src={img} alt={item?.title || "post"} className="w-10 h-10 rounded-md object-cover shrink-0" loading="lazy" />
      <div className="min-w-0">
        <div className="text-sm leading-snug line-clamp-2 group-hover:underline">{item?.title || "Untitled"}</div>
        {item?.date && <div className="text-xs text-gray-500">{item.date}</div>}
      </div>
    </Link>
  );
}

export default function InsuranceDetail({ post, related = [], latest = [] }) {
  if (!post) return <p className="p-6">Post not found.</p>;

  const title = `${post.title} | FinNews247`;
  const desc = (post.excerpt && post.excerpt.trim()) || truncate(stripHtml(post.content || post.body || ""), 160);
  const canonical = `https://www.finnews247.com/crypto-insurance/${post.slug}`;
  const hero = pickHero(post);

  return (
    <div className="container mx-auto px-4 py-6">
      <NextSeo title={title} description={desc} canonical={canonical} openGraph={{ title, description: desc, url: canonical }} />

      <div className="grid md:grid-cols-12 gap-8">
        {/* Bài viết */}
        <article className="md:col-span-8 prose lg:prose-xl max-w-none">
          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-600 mb-6">{post.date}</p>
          <ArticleHero src={hero} alt={post.title} />
          <div className="post-body" dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>

        {/* Sidebar */}
        <aside className="md:col-span-4 w-full sticky top-24 self-start space-y-6">
          <section>
            <h3 className="text-sm font-semibold mb-2">Related in Insurance &amp; Tax</h3>
            {related.length ? (
              <ul className="space-y-1">{related.map((it) => (<li key={(it.slug||it.title)+"-rel"}><SideItem item={it} /></li>))}</ul>
            ) : (<div className="text-xs text-gray-500">No related posts.</div>)}
          </section>
          <section>
            <h3 className="text-sm font-semibold mb-2">Latest on FinNews247</h3>
            {latest.length ? (
              <ul className="space-y-1">{latest.map((it) => (<li key={(it.slug||it.title)+"-latest"}><SideItem item={it} /></li>))}</ul>
            ) : (<div className="text-xs text-gray-500">No recent posts.</div>)}
          </section>
        </aside>
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const fs = require("fs");
  const path = require("path");
  const safeRead = (f) => {
    try { return JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", f), "utf8")); }
    catch { return []; }
  };

  // nhóm Insurance + Tax
  const insurance = safeRead("insurance.json");
  const tax = safeRead("tax.json");
  const posts = [...insurance, ...tax].map((p) => {
    const href = `/insurance/${p.slug}`;
    return { ...p, category: p.category || "insurance", href, url: href, link: href };
  });

  const post = posts.find((p) => p.slug.trim().toLowerCase() === params.slug.trim().toLowerCase()) || null;
  if (!post) return { notFound: true };

  // Related
  const tags = (post.tags || post.keywords || []).map((t) => String(t).toLowerCase());
  const tagSet = new Set(tags);
  const related = posts
    .filter((p) => p.slug && p.slug !== post.slug)
    .map((p) => {
      const t = (p.tags || p.keywords || []).map((x) => String(x).toLowerCase());
      const s = tags.length ? t.filter((x) => tagSet.has(x)).length : 0;
      return { p, s, d: Date.parse(p.date || p.updatedAt) || 0 };
    })
    .sort((a, b) => (b.s !== a.s ? b.s - a.s : b.d - a.d))
    .map(({ p }) => p)
    .slice(0, 6);

  // Latest (gộp toàn site)
  const other = [
    ...safeRead("altcoins.json"),
    ...safeRead("seccoin.json"),
    ...safeRead("fidelity.json"),
    ...safeRead("cryptoexchanges.json"),
    ...safeRead("bestapps.json"),
    ...safeRead("news.json"),
    ...safeRead("guides.json"),
  ];
  const relatedSlugs = new Set(related.map((r) => r.slug));
  const latest = [...posts, ...other]
    .filter((p) => p?.slug && p.slug !== post.slug && !relatedSlugs.has(p.slug))
    .sort((a, b) => (Date.parse(b.date || b.updatedAt) || 0) - (Date.parse(a.date || a.updatedAt) || 0))
    .slice(0, 8);

  return { props: { post, related, latest } };
}
