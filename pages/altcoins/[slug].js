import fs from "fs";
import path from "path";
import { NextSeo } from "next-seo";

/* helpers */
function stripHtml(html=""){ return html.replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim(); }
function truncate(s="",n=160){ if(s.length<=n) return s; const cut=s.slice(0,n); const i=cut.lastIndexOf(" "); return (i>80?cut.slice(0,i):cut)+"…"; }
function firstImage(html=""){ const m=html.match(/<img[^>]+src=["']([^"']+)["']/i); return m?m[1]:null; }

export default function AltcoinDetail({ post }) {
  if (!post) {
    return <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">404 - Not Found</h1>
      <p>Article not found.</p>
    </div>;
  }
  const title = post.title ? `${post.title} | FinNews247` : "FinNews247";
  const description = (post.excerpt && post.excerpt.trim()) || truncate(stripHtml(post.content || post.body || ""),160);
  const canonical = `https://www.finnews247.com/altcoins/${post.slug}`;
  const ogImage = post.ogImage || post.image || firstImage(post.content || post.body || "");
  const hero = post.image || ogImage || firstImage(post.content || post.body || "");

  return (
    <div className="container mx-auto px-4 py-6">
      <NextSeo
        title={title}
        description={description}
        canonical={canonical}
        openGraph={{ title, description, url: canonical, images: ogImage ? [{url:ogImage}] : undefined }}
      />
      <article className="prose lg:prose-xl max-w-none">
        {post.title && <h1>{post.title}</h1>}
        {(post.date || post.updatedAt) && (
          <p className="text-sm text-gray-500">{post.date || post.updatedAt}</p>
        )}

        {hero && (
          <div className="article-hero my-4">
            <img src={hero} alt={post.title || "Altcoin article"} loading="lazy" />
          </div>
        )}

        <div
          className={`post-body ${post.category === "SEC Coin" ? "sec-coin-wrapper" : ""}`}
          dangerouslySetInnerHTML={{ __html: post.content || post.body || "" }}
        />
      </article>
    </div>
  );
}

export async function getStaticPaths(){
  const a = JSON.parse(fs.readFileSync(path.join(process.cwd(),"data","altcoins.json"),"utf8")||"[]");
  const b = JSON.parse(fs.readFileSync(path.join(process.cwd(),"data","seccoin.json"),"utf8")||"[]");
  const paths = [...a,...b].filter(p=>p?.slug).map(p=>({ params:{ slug:p.slug }}));
  return { paths, fallback:"blocking" };
}
export async function getStaticProps({ params }){
  const a = JSON.parse(fs.readFileSync(path.join(process.cwd(),"data","altcoins.json"),"utf8")||"[]");
  const b = JSON.parse(fs.readFileSync(path.join(process.cwd(),"data","seccoin.json"),"utf8")||"[]");
  const post = [...a,...b].find(p=>p?.slug===params.slug) || null;
  if (!post) return { notFound:true, revalidate:300 };
  return { props:{ post }, revalidate:600 };
}
