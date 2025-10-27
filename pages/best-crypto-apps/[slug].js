import fs from "fs";
import path from "path";
import { NextSeo } from "next-seo";

/* helpers */
function firstImage(html=""){ const m=html.match(/<img[^>]+src=["']([^"']+)["']/i); return m?m[1]:null; }

export default function AppPost({ post }) {
  if (!post) {
    return <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-semibold mb-6">404 - Not Found</h1>
      <p>The article you are looking for does not exist.</p>
    </div>;
  }
  const hero = post.image || post.ogImage || firstImage(post.content || "");

  return (
    <article className="prose lg:prose-xl max-w-none container mx-auto px-4 py-6">
      <NextSeo
        title={`${post.title} | FinNews`}
        description={post.excerpt}
        canonical={`https://www.finnews247.com/best-crypto-apps/${post.slug}`}
        openGraph={{
          title: `${post.title} | FinNews`,
          description: post.excerpt,
          url: `https://www.finnews247.com/best-crypto-apps/${post.slug}`,
          images: hero ? [{ url: hero }] : undefined
        }}
      />
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
  const posts = JSON.parse(fs.readFileSync(path.join(process.cwd(),"data","bestapps.json"),"utf-8"));
  const post = posts.find(p=>p.slug===params.slug) || null;
  return { props:{ post } };
}
