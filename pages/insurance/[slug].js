import fs from "fs";
import path from "path";
import { NextSeo } from "next-seo";

/* helpers */
function stripHtml(html=""){ return html.replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim(); }
function truncate(s="",n=160){ if(s.length<=n) return s; const cut=s.slice(0,n); const i=cut.lastIndexOf(" "); return (i>80?cut.slice(0,i):cut)+"…"; }
function firstImage(html=""){ const m=html.match(/<img[^>]+src=["']([^"']+)["']/i); return m?m[1]:null; }

export default function InsuranceTaxDetail({ post }) {
  if (!post) {
    return <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-semibold mb-6">404 - Not Found</h1>
      <p>The article you are looking for does not exist.</p>
    </div>;
  }

  const url = `https://www.finnews247.com/insurance/${post.slug}`;
  const desc = (post.excerpt && post.excerpt.trim()) || truncate(stripHtml(post.content||""),160);
  const hero = post.image || post.ogImage || firstImage(post.content||"");

  return (
    <article className="prose lg:prose-xl max-w-none container mx-auto px-4 py-6">
      <NextSeo title={`${post.title} | FinNews247`} description={desc} canonical={url}
        openGraph={{ title:`${post.title} | FinNews247`, description:desc, url, images: hero?[{url:hero}]:undefined }} />
      <h1>{post.title}</h1>
      {post.date && <p className="text-sm text-gray-500">{post.date}</p>}

      {hero && (
        <div className="article-hero my-4">
          <img src={hero} alt={post.title} loading="lazy" />
        </div>
      )}

      <div className="post-body" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}

export async function getServerSideProps({ params }){
  const read = (f)=>JSON.parse(fs.readFileSync(path.join(process.cwd(),"data",f),"utf8"));
  const posts = [...read("insurance.json"), ...read("tax.json")];
  const post = posts.find(p=>p.slug===params.slug) || null;
  return { props:{ post } };
}
