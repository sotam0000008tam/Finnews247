import fs from "fs";
import path from "path";
import ArticleSeo from "../../components/ArticleSeo";

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

  return (
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
}
