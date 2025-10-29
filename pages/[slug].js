<<<<<<< HEAD
import fs from "fs";
import path from "path";
import { NextSeo } from "next-seo";

/* helpers */
function stripHtml(html){ return html ? html.replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim() : ""; }
function truncate(s,n=160){ if(!s) return ""; return s.length>n ? s.slice(0,n-1).trim()+"…" : s; }
function firstImage(html){ if(!html) return null; const m=html.match(/<img[^>]+src=["']([^"']+)["']/i); return m?m[1]:null; }

export default function Post({ post }) {
  if (!post) {
    return <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-3">404 - Not Found</h1>
      <p>The article you are looking for does not exist.</p>
    </div>;
  }

  const canonical = `https://www.finnews247.com/${post.slug}`;
  const title = `${post.title} | FinNews247`;
  const description = (post.excerpt && post.excerpt.trim()) || truncate(stripHtml(post.content),160);
  const ogImage = post.ogImage || post.image || firstImage(post.content) || "https://www.finnews247.com/logo.png";
  const hero = post.image || ogImage || firstImage(post.content);

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        canonical={canonical}
        openGraph={{ title, description, url: canonical, images:[{url:ogImage}] }}
        additionalMetaTags={[ post.date ? { name:"article:published_time", content:post.date } : undefined ].filter(Boolean)}
      />
      <div className="container mx-auto px-4 py-6">
        <article className="prose lg:prose-xl max-w-none">
          <h1>{post.title}</h1>
          {post.date && <p className="text-sm text-gray-500">{post.date}</p>}

          {hero && (
            <div className="article-hero my-4">
              <img src={hero} alt={post.title} loading="lazy" />
            </div>
          )}

          <div
            className={`post-body ${post.category === "SEC Coin" ? "sec-coin-wrapper" : ""}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const raw = fs.readFileSync(path.join(process.cwd(),"data","news.json"),"utf-8");
  const posts = JSON.parse(raw);
  const post = posts.find(p=>p.slug===params.slug) || null;
  return { props:{ post } };
=======
// pages/[slug].js (chỉ còn GSSP redirect)
export async function getServerSideProps({ params }) {
  const { readCat } = await import("../lib/serverCat");
  const all = readCat("crypto-market");
  const found = all.some((p) => p.slug === params.slug);
  if (found) {
    return {
      redirect: {
        destination: `/crypto-market/${params.slug}`,
        permanent: true,
      },
    };
  }
  return { notFound: true };
>>>>>>> 310b096 (feat: sidebar/pages + link check config; chore: .gitignore; rm tracked sitemap)
}
export default function _() { return null; }
