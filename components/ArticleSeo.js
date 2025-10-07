// components/ArticleSeo.js
import { NextSeo } from "next-seo";

/** Helpers nội bộ */
function stripHtml(html = "") {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function truncate(s = "", n = 160) {
  if (!s) return "";
  if (s.length <= n) return s;
  const cut = s.slice(0, n);
  const i = cut.lastIndexOf(" ");
  return (i > 80 ? cut.slice(0, i) : cut) + "…";
}
function extractFirstImage(html = "") {
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
}

/**
 * ArticleSeo: Nhúng NextSeo + JSON-LD Article + Breadcrumb cho 1 bài.
 * - post: { title, excerpt, content/body, image/ogImage, slug, date/updatedAt, author, category }
 * - path: đường dẫn tuyệt đối của bài, ví dụ "/altcoins/sec-coin-regulatory-roadmap"
 */
export default function ArticleSeo({ post, path }) {
  const base = "https://www.finnews247.com";
  const url = `${base}${path || ""}`;
  const title = post?.title ? `${post.title} | FinNews247` : "FinNews247";
  const rawDesc =
    post?.excerpt?.trim() ||
    stripHtml(post?.content || post?.body || "");
  const description = truncate(rawDesc, 160);
  const ogImage =
    post?.ogImage ||
    post?.image ||
    extractFirstImage(post?.content || post?.body || "");
  const datePublished = post?.date || post?.updatedAt || undefined;
  const authorName = post?.author?.name || post?.author || "FinNews247";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: url,
    headline: post?.title || "FinNews247",
    description,
    image: ogImage ? [ogImage] : undefined,
    datePublished,
    dateModified: datePublished,
    author: [{ "@type": "Person", name: authorName }],
    publisher: {
      "@type": "Organization",
      name: "FinNews247",
      logo: {
        "@type": "ImageObject",
        url: "https://www.finnews247.com/logo.png",
      },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: base,
      },
      post?.category
        ? {
            "@type": "ListItem",
            position: 2,
            name: post.category,
            item: `${base}/${String(post.category)
              .toLowerCase()
              .replace(/\s+/g, "-")}`,
          }
        : null,
      {
        "@type": "ListItem",
        position: post?.category ? 3 : 2,
        name: post?.title || "Article",
        item: url,
      },
    ].filter(Boolean),
  };

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        canonical={url}
        openGraph={{
          title,
          description,
          url,
          images: ogImage ? [{ url: ogImage }] : undefined,
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}
