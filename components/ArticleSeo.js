// components/ArticleSeo.js
import { NextSeo } from "next-seo";
import Head from "next/head";
import { useRouter } from "next/router";

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

/** URL tuyệt đối */
const SITE = "https://www.finnews247.com";
const toAbs = (u) => (!u ? undefined : u.startsWith("http") ? u : `${SITE}${u}`);

/**
 * ArticleSeo: NextSeo + JSON-LD Article/NewsArticle + Breadcrumb
 */
export default function ArticleSeo({ post = {}, path = "" }) {
  const router = useRouter();
  const normPath = String(path || router?.asPath || "");
  const url = `${SITE}${normPath}`;

  const title = post?.title ? `${post.title} | FinNews247` : "FinNews247";
  const rawDesc =
    (post?.excerpt && post.excerpt.trim()) ||
    stripHtml(post?.content || post?.body || "");
  const description = truncate(rawDesc, 160);

  // Ảnh ưu tiên: ogImage -> image -> ảnh đầu tiên trong content
  const ogImage =
    post?.ogImage ||
    post?.image ||
    extractFirstImage(post?.content || post?.body || "");
  const ogAbs = toAbs(ogImage);

  const datePublished = post?.date || post?.publishedAt || post?.updatedAt || undefined;
  const dateModified =
    post?.updatedAt || post?.modifiedAt || datePublished || undefined;

  const authorName = post?.author?.name || post?.author || "FinNews247";

  // NewsArticle nếu là chuyên mục tin
  const isNews = normPath.startsWith("/crypto-market");

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": isNews ? "NewsArticle" : "Article",
    mainEntityOfPage: url,
    headline: post?.title || "FinNews247",
    description: description || undefined,
    image: ogAbs ? [ogAbs] : undefined,
    datePublished,
    dateModified,
    author: [{ "@type": "Person", name: authorName }],
    publisher: {
      "@type": "Organization",
      name: "FinNews247",
      logo: {
        "@type": "ImageObject",
        url: `${SITE}/logo.png`,
      },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      post?.category
        ? {
            "@type": "ListItem",
            position: 2,
            name: post.category,
            item: `${SITE}/${String(post.category).toLowerCase().replace(/\s+/g, "-")}`,
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
          url,
          title,
          description,
          type: isNews ? "article" : "website",
          images: ogAbs ? [{ url: ogAbs }] : undefined,
        }}
        twitter={{ cardType: "summary_large_image" }}
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      </Head>
    </>
  );
}
