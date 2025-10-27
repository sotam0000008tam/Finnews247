// pages/sec-coin/[slug].js
import fs from "fs";
import path from "path";
import { NextSeo } from "next-seo";

/* Helpers */
function extractFirstImage(html = "") {
  const m = html?.match?.(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
}
function pickThumb(p) {
  return p?.thumb || p?.ogImage || p?.image || extractFirstImage(p?.content || p?.body || "") || "/images/dummy/altcoins64.jpg";
}
function parseDate(d){ const t = Date.parse(d); return isNaN(t) ? 0 : t; }
function buildUrl(p){
  const slug = p?.slug; if (!slug) return "#";
  const c = String(p?.category || "").toLowerCase();
  if (c.includes("sec coin") || c.includes("seccoin") || c.includes("altcoin")) return `/altcoins/${slug}`;
  if (c.includes("market") || c.includes("news")) return `/${slug}`;
  if (c.includes("exchange") || c.includes("fidelity")) return `/crypto-exchanges/${slug}`;
  if (c.includes("wallet") || c.includes("app")) return `/best-crypto-apps/${slug}`;
  if (c.includes("insurance")) return `/insurance/${slug}`;
  if (c.includes("tax") || c.includes("compliance")) return `/tax/${slug}`;
  if (c.includes("guide") || c.includes("review")) return `/guides/${slug}`;
  return `/altcoins/${slug}`;
}
function SideItem({ item }) {
  const href = buildUrl(item); const img = pickThumb(item);
  return (
    <a href={href} className="fn-mini">
      <img src={img} alt={item?.title || "post"} loading="lazy" />
      <div className="min-w-0">
        <div className="title">{item?.title || "Untitled"}</div>
        {item?.date && <div className="date">{item.date}</div>}
      </div>
    </a>
  );
}

export default function SecCoinPost({ post, related = [], latest = [] }) {
  if (!post) {
    return (
      <div>
        <h1 className="text-3xl font-semibold mb-6">404 - Not Found</h1>
        <p>The article you are looking for does not exist.</p>
      </div>
    );
  }

  const hero = post.image || post.ogImage || extractFirstImage(post.content);

  return (
    <article className="container mx-auto px-4 py-6">
      <NextSeo
        title={`${post.title} | FinNews`}
        description={post.excerpt}
        openGraph={{
          title: `${post.title} | FinNews`,
          description: post.excerpt,
          url: `https://finnews247.com/sec-coin/${post.slug}`,
          images: hero ? [{ url: hero }] : undefined,
        }}
      />

      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-8 prose lg:prose-xl max-w-none">
          <h1>{post.title}</h1>
          <p className="text-sm text-gray-500">{post.date}</p>

          {hero && (
            <div className="article-hero my-4">
              <img src={hero} alt={post.title} loading="lazy" />
            </div>
          )}

          <div className="post-body" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        <aside className="md:col-span-4 w-full sticky top-24 self-start space-y-6">
          <section>
            <h3 className="text-sm font-semibold mb-2">Related Altcoins</h3>
            {related.length ? (
              <ul className="space-y-1">
                {related.map((it) => (
                  <li key={(it.slug || it.title) + "-rel"}><SideItem item={it} /></li>
                ))}
              </ul>
            ) : <div className="text-xs text-gray-500">No related posts.</div>}
          </section>

          <section>
            <h3 className="text-sm font-semibold mb-2">Latest on FinNews247</h3>
            {latest.length ? (
              <ul className="space-y-1">
                {latest.map((it) => (
                  <li key={(it.slug || it.title) + "-latest"}><SideItem item={it} /></li>
                ))}
              </ul>
            ) : <div className="text-xs text-gray-500">No recent posts.</div>}
          </section>
        </aside>
      </div>
    </article>
  );
}

export async function getServerSideProps({ params }) {
  const raw = fs.readFileSync(path.join(process.cwd(), "data", "seccoin.json"), "utf-8");
  const posts = JSON.parse(raw);
  const post = posts.find((p) => p.slug === params.slug) || null;
  if (!post) return { props: { post: null } };

  // related = cùng file seccoin.json
  const cur = (post.tags || post.keywords || []).map(t=>String(t).toLowerCase());
  const tagSet = new Set(cur);
  let relatedPool = posts.filter((p)=>p.slug && p.slug!==post.slug).map((p)=>{
    const tags = (p.tags || p.keywords || []).map(t=>String(t).toLowerCase());
    const s = cur.length ? tags.filter(t=>tagSet.has(t)).length : 0;
    const d = parseDate(p.date || p.updatedAt);
    return {p,s,d};
  }).sort((a,b)=> (b.s!==a.s? b.s-a.s : b.d-a.d)).map(({p})=>p);
  const related = relatedPool.slice(0,6);

  // latest
  const read = (f)=>JSON.parse(fs.readFileSync(path.join(process.cwd(),"data",f),"utf-8"));
  const altcoins = read("altcoins.json");
  const exchanges = [...read("fidelity.json"), ...read("cryptoexchanges.json")];
  const apps = read("bestapps.json");
  const insurance = read("insurance.json");
  const tax = read("tax.json");
  const news = read("news.json");
  const guides = read("guides.json");
  const pool = [...posts, ...altcoins, ...exchanges, ...apps, ...insurance, ...tax, ...news, ...guides];
  const exclude = new Set(related.map(r=>r.slug).concat(post.slug));
  const latest = pool.filter(p=>p?.slug && !exclude.has(p.slug))
    .sort((a,b)=>parseDate(b.date||b.updatedAt)-parseDate(a.date||a.updatedAt))
    .slice(0,8);

  return { props: { post, related, latest } };
}
