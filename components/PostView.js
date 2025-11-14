// components/PostView.js
import Link from "next/link";
import { NextSeo } from "next-seo";
import { stripHtml, truncate, firstImage, pickThumb, guessAuthor, buildUrl, catInfo, parseDate } from "../lib/cat";

// Manually injected ad units to guarantee additional inventory on article pages.

function SideMiniItem({ item }) {
  const href = buildUrl(item);
  const img = pickThumb(item);
  return (
    <Link href={href} className="group flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
      <img src={img} alt={item?.title || "post"} className="w-[45px] h-[45px] rounded-md object-cover border dark:border-gray-700 shrink-0" loading="lazy" />
      <div className="min-w-0">
        <div className="text-sm leading-snug line-clamp-2 group-hover:underline">{item?.title || "Untitled"}</div>
        {item?.date && <div className="text-xs text-gray-500 mt-0.5">{item.date}</div>}
      </div>
    </Link>
  );
}

export default function PostView({ catKey, post, related = [], latest = [] }) {
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-3">404 - Not Found</h1>
        <p>The article you are looking for does not exist.</p>
      </div>
    );
  }

  const cat = catInfo(catKey);
  const canonical = `https://www.finnews247.com${cat.base}/${post.slug}`;
  const title = `${post.title} | FinNews247`;
  const description = (post.excerpt && post.excerpt.trim()) || truncate(stripHtml(post.content), 160);
  const ogImage = post.ogImage || post.image || firstImage(post.content) || "https://www.finnews247.com/logo.png";
  const hero = post.image || ogImage || firstImage(post.content);
  const author = guessAuthor(post);

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        canonical={canonical}
        openGraph={{ title, description, url: canonical, images: [{ url: ogImage }] }}
        additionalMetaTags={[post.date ? { name: "article:published_time", content: post.date } : undefined].filter(Boolean)}
      />

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4">
          <Link href="/">Home</Link>
          <span className="mx-2">/</span>
          <Link href={cat.base}>{cat.title}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 dark:text-gray-300 line-clamp-1">{post.title}</span>
        </nav>

        <div className="grid md:grid-cols-12 gap-8">
          {/* Main rộng 9/12 */}
          <article className="md:col-span-9">
            <h1 className="text-2xl md:text-3xl font-bold">{post.title}</h1>
            {post.date && <p className="text-sm text-gray-500">{post.date}</p>}

            {/* Author line */}
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

            {/* HERO */}
            {hero && (
              <div className="article-hero my-3">
                <img src={hero} alt={post.title} loading="lazy" />
              </div>
            )}


            {/* Nội dung bài */}
            <div className="prose lg:prose-lg post-body" dangerouslySetInnerHTML={{ __html: post.content }} />


            {/* More from category */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">More from {cat.title}</h3>
                <Link href={cat.base} className="text-sm text-sky-600 hover:underline">View all</Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(related || []).slice(0, 6).map((it) => (
                  <Link key={it.slug} href={buildUrl({ ...it, _cat: catKey })} className="block rounded-lg border p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <img src={pickThumb(it)} alt={it.title} className="w-full h-40 object-cover rounded-md mb-2" />
                    <div className="font-medium line-clamp-2">{it.title}</div>
                  </Link>
                ))}
              </div>
            </div>
          </article>

          {/* Sidebar hẹp 3/12 */}
          <aside className="md:col-span-3 w-full sticky top-24 self-start space-y-6 sidebar-scope">
            <section className="rounded-xl border bg-white dark:bg-gray-900 overflow-hidden">
              <div className="px-4 py-3 border-b dark:border-gray-700">
                <h3 className="text-sm font-semibold">Latest on FinNews247</h3>
              </div>
              <ul className="divide-y dark:divide-gray-800">
                {latest.length ? (
                  latest.map((it) => (
                    <li key={(it.slug || it.title) + "-latest"}>
                      <SideMiniItem item={it} />
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-3 text-xs text-gray-500">No recent posts.</li>
                )}
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </>
  );
}

