// pages/tax/[slug].js
import fs from "fs";
import path from "path";
import Link from "next/link";
import { NextSeo } from "next-seo";

<<<<<<< HEAD
/* helpers */
function firstImage(html=""){ const m=html.match(/<img[^>]+src=["']([^"']+)["']/i); return m?m[1]:null; }

export default function TaxDetail({ post }) {
  if (!post) {
    return <div className="p-6">
      <h1 className="text-3xl font-semibold mb-4">404 - Not Found</h1>
      <p>Tax article not found.</p>
    </div>;
  }
  const hero = post.image || post.ogImage || firstImage(post.content || "");
=======
const firstImg = (h = "") => (String(h).match(/<img[^>]+src=["']([^"']+)["']/i) || [])[1] || null;
const pickThumb = (p) =>
  p?.thumb ||
  p?.ogImage ||
  p?.image ||
  firstImg(p?.content || p?.body || "") ||
  "/images/dummy/altcoins64.jpg";
const parseDate = (d) => {
  const t = Date.parse(d);
  return isNaN(t) ? 0 : t;
};
const buildUrl = (p) => {
  const s = p?.slug;
  if (!s) return "#";
  const c = String(p?._cat || p?.category || "").toLowerCase();
  if (c.includes("market") || c.includes("news")) return `/crypto-market/${s}`;
  if (c.includes("altcoin") || c.includes("sec coin") || c.includes("seccoin")) return `/altcoins/${s}`;
  if (c.includes("exchange") || c.includes("fidelity")) return `/crypto-exchanges/${s}`;
  if (c.includes("wallet") || c.includes("app")) return `/best-crypto-apps/${s}`;
  if (c.includes("insurance")) return `/insurance/${s}`;
  if (c.includes("tax") || c.includes("compliance")) return `/tax/${s}`;
  if (c.includes("guide") || c.includes("review")) return `/guides/${s}`;
  return `/tax/${s}`;
};
>>>>>>> 310b096 (feat: sidebar/pages + link check config; chore: .gitignore; rm tracked sitemap)

/* ===== Dò tên tác giả ===== */
function guessAuthor(post) {
  const direct =
    post.author ||
    post.authorName ||
    post.author_name ||
    post.writer ||
    post.writerName ||
    post.by ||
    post.byline ||
    post.credit ||
    post?.meta?.author ||
    post?.source?.author ||
    "";
  if (direct && String(direct).trim()) return String(direct).trim();

  const raw = String(post.content || post.body || "");
  const m =
    raw.match(/(?:written\s+by|by)\s+([A-Z][\w .'-]{2,60})/i) ||
    raw.match(/作者[:：]\s*([^\n<]+)/i);
  if (m && m[1]) return m[1].trim().replace(/\s{2,}/g, " ");
  return "FinNews247 Team";
}

function SideItem({ item }) {
  const href = buildUrl(item);
  const img = pickThumb(item);
  return (
<<<<<<< HEAD
    <div className="container mx-auto px-4 py-6">
      <div className="grid md:grid-cols-12 gap-8">
        <article className="md:col-span-8 prose lg:prose-xl max-w-none">
          <ArticleSeo post={post} path={`/tax/${post.slug}`} />
          <h1>{post.title}</h1>
          {post.date && <p className="text-sm text-gray-500">{post.date}</p>}

          {hero && (
            <div className="article-hero my-4">
              <img src={hero} alt={post.title} loading="lazy" />
            </div>
          )}

          <div className="post-body" dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>

        {/* (Optional) sidebar ở đây nếu cần */}
        <aside className="md:col-span-4"></aside>
      </div>
    </div>
  );
}

export async function getStaticPaths(){
  const posts = JSON.parse(fs.readFileSync(path.join(process.cwd(),"data","tax.json"),"utf-8"));
  const paths = posts.filter(p=>p?.slug).map(p=>({ params:{ slug:p.slug } }));
  return { paths, fallback:"blocking" };
}
export async function getStaticProps({ params }){
  const posts = JSON.parse(fs.readFileSync(path.join(process.cwd(),"data","tax.json"),"utf-8"));
  const post = posts.find(p=>p.slug===params.slug) || null;
  if (!post) return { notFound:true, revalidate:60 };
  return { props:{ post }, revalidate:600 };
=======
    <Link
      href={href}
      className="group flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
    >
      <img
        src={img}
        alt={item.title}
        className="w-[45px] h-[45px] rounded-md object-cover border dark:border-gray-700 shrink-0"
        loading="lazy"
      />
      <div className="min-w-0">
        <div className="text-sm leading-snug line-clamp-2 group-hover:underline">{item.title}</div>
        {item.date && <div className="text-xs text-gray-500 mt-0.5">{item.date}</div>}
      </div>
    </Link>
  );
}

export default function TaxDetail({ post, related = [], latest = [] }) {
  if (!post) return <div className="p-6">404 - Not Found</div>;
  const canonical = `https://www.finnews247.com/tax/${post.slug}`;
  const hero = post.image || pickThumb(post);
  const author = guessAuthor(post);

  return (
    <div>
      <NextSeo
        title={`${post.title} | FinNews247`}
        description={post.excerpt}
        canonical={canonical}
        openGraph={{ title: `${post.title} | FinNews247`, description: post.excerpt, url: canonical }}
      />

      <div className="grid md:grid-cols-12 gap-8">
        <article className="md:col-span-9">
          <h1 className="text-2xl md:text-3xl font-bold">{post.title}</h1>
          {post.date && <p className="text-gray-600 mt-1">{post.date}</p>}

          {/* Dòng tác giả (góc phải, phía trên, ngoài ảnh) */}
          <div className="mt-2 mb-1 flex justify-end">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wide text-gray-500">Written by:</span>
              <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor" aria-hidden="true">
                  <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" />
                </svg>
                <span className="font-medium">{author}</span>
              </span>
            </div>
          </div>

          {hero && (
            <div className="relative overflow-hidden rounded-xl my-4" style={{ paddingTop: "56.25%" }}>
              <img src={hero} alt={post.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
            </div>
          )}

          <div
            className="prose lg:prose-xl max-w-none post-body"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        <aside className="md:col-span-3 space-y-6 sidebar-scope">
          <section>
            <h3 className="text-sm font-semibold mb-2">Related in Tax</h3>
            {related.length ? (
              <ul className="space-y-1">
                {related.map((it) => (
                  <li key={(it.slug || it.title) + "-rel"}>
                    <SideItem item={it} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-xs text-gray-500">No related posts.</div>
            )}
          </section>

          <section>
            <h3 className="text-sm font-semibold mb-2">Latest on FinNews247</h3>
            {latest.length ? (
              <ul className="space-y-1">
                {latest.map((it) => (
                  <li key={(it.slug || it.title) + "-latest"}>
                    <SideItem item={it} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-xs text-gray-500">No recent posts.</div>
            )}
          </section>
        </aside>
      </div>

      <style jsx global>{`
        .sidebar-scope img {
          width: 45px !important;
          height: 45px !important;
          max-width: none !important;
          object-fit: cover !important;
          display: block !important;
        }
        .post-body img,
        .prose .post-body img {
          width: 100% !important;
          max-width: 720px !important;
          height: auto !important;
          margin: 1.25rem auto !important;
          border-radius: 0.5rem !important;
          object-fit: cover !important;
        }
      `}</style>
    </div>
  );
}

const read = (f) => JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", f), "utf-8"));

export async function getStaticPaths() {
  const posts = read("tax.json");
  return { paths: posts.map((p) => ({ params: { slug: p.slug } })), fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const tax = read("tax.json").map((p) => ({ ...p, _cat: "tax" }));
  const insurance = read("insurance.json").map((p) => ({ ...p, _cat: "insurance" }));
  const post = tax.find((p) => p.slug === params.slug) || null;
  if (!post) return { notFound: true, revalidate: 60 };

  const currentTags = (post.tags || post.keywords || []).map((t) => String(t).toLowerCase());
  const tagSet = new Set(currentTags);
  let related = tax
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      const tags = (p.tags || p.keywords || []).map((t) => String(t).toLowerCase());
      const s = currentTags.length ? tags.filter((t) => tagSet.has(t)).length : 0;
      return { p, s, d: parseDate(p.date || p.updatedAt) };
    })
    .sort((x, y) => (y.s !== x.s ? y.s - x.s : y.d - x.d))
    .map(({ p }) => p)
    .slice(0, 6);

  const alt = read("altcoins.json").map((p) => ({ ...p, _cat: "altcoin" }));
  const sec = read("seccoin.json").map((p) => ({ ...p, _cat: "seccoin" }));
  const exA = read("cryptoexchanges.json").map((p) => ({ ...p, _cat: "exchange" }));
  const exB = read("fidelity.json").map((p) => ({ ...p, _cat: "fidelity" }));
  const apps = read("bestapps.json").map((p) => ({ ...p, _cat: "apps" }));
  const news = read("news.json").map((p) => ({ ...p, _cat: "market" }));
  const guides = read("guides.json").map((p) => ({ ...p, _cat: "guide" }));

  const used = new Set(related.map((r) => r.slug).concat(post.slug));
  const pool = [...tax, ...insurance, ...alt, ...sec, ...exA, ...exB, ...apps, ...news, ...guides].filter(
    (x) => x.slug && !used.has(x.slug)
  );
  const seen = new Set();
  const latest = pool
    .filter((p) => {
      if (seen.has(p.slug)) return false;
      seen.add(p.slug);
      return true;
    })
    .sort((x, y) => parseDate(y.date || y.updatedAt) - parseDate(x.date || x.updatedAt))
    .slice(0, 10);

  return { props: { post, related, latest }, revalidate: 600 };
>>>>>>> 310b096 (feat: sidebar/pages + link check config; chore: .gitignore; rm tracked sitemap)
}
