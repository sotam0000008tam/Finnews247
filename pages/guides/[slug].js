import fs from "fs";
import path from "path";
import ArticleSeo from "../../components/ArticleSeo";

/* helpers */
function firstImage(html=""){ const m=html.match(/<img[^>]+src=["']([^"']+)["']/i); return m?m[1]:null; }

export default function GuideDetail({ post }) {
  if (!post) {
    return <div className="p-6">
      <h1 className="text-3xl font-semibold mb-4">404 - Not Found</h1>
      <p>Guide not found.</p>
    </div>;
  }
  const hero = post.image || post.ogImage || firstImage(post.content || "");

  return (
    <article className="prose lg:prose-xl max-w-none container mx-auto px-4 py-6">
      <ArticleSeo post={post} path={`/guides/${post.slug}`} />
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

export async function getStaticPaths(){
  const posts = JSON.parse(fs.readFileSync(path.join(process.cwd(),"data","guides.json"),"utf-8"));
  return { paths: posts.map(p=>({ params:{ slug:p.slug }})), fallback:"blocking" };
}
export async function getStaticProps({ params }){
  const posts = JSON.parse(fs.readFileSync(path.join(process.cwd(),"data","guides.json"),"utf-8"));
  const post = posts.find(p=>p.slug===params.slug) || null;
  if (!post) return { notFound:true, revalidate:60 };
  return { props:{ post }, revalidate:600 };
}
