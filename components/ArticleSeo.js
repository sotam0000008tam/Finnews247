// components/ArticleSeo.js
import { NextSeo } from "next-seo";
import Head from "next/head";
import { useRouter } from "next/router";

/* ================= Helpers ================= */
const SITE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  "https://www.finnews247.com";

const isAbs = (u = "") => /^https?:\/\//i.test(u) || u.startsWith("//");

function toAbs(u) {
  if (!u) return undefined;
  let s = String(u).trim();

  // protocol-relative //cdn...
  if (s.startsWith("//")) return `https:${s}`;

  if (isAbs(s)) return s;

  // ensure leading slash
  if (!s.startsWith("/")) s = `/${s}`;
  // collapse duplicate slashes
  s = s.replace(/\/{2,}/g, "/");
  return `${SITE}${s}`;
}

function stripHtml(html = "") {
  return String(html)
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
  const m = String(html).match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
}

function normalizePath(p = "") {
  let s = String(p).trim();
  // remove domain if accidentally passed
  s = s.replace(/^https?:\/\/[^/]+/i, "");
  // strip query/fragment
  s = s.split("#")[0].split("?")[0];
  if (!s.startsWith("/")) s = `/${s}`;
  // collapse //
  s = s.replace(/\/{2,}/g, "/");
  return s;
}

function toISO(d) {
  if (!d) return undefined;
  // support plain date "YYYY-MM-DD" as UTC midnight
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return `${d}T00:00:00.000Z`;
  const t = new Date(d);
  return Number.isNaN(t.getTime()) ? undefined : t.toISOString();
}

/* ============== Component ============== */
/**
 * ArticleSeo: NextSeo + JSON-LD Article/NewsArticle + Breadcrumb
 * Props:
 *  - post: { title, excerpt, content/body, ogImage, image, date, updatedAt, publishedAt, modifiedAt, author, category }
 *  - path: canonical path (e.g. "/crypto-market/slug") — nếu không truyền sẽ dùng router.asPath
 */
export default function ArticleSeo({ post = {}, path = "" }) {
  const router = useRouter();

  const normPath = normalizePath(path || router?.asPath || "/");
  const url = `${SITE}${normPath}`;

  const title =
    post?.title ? `${post.title} | FinNews247` : "FinNews247";

  const rawDesc =
    (post?.excerpt && String(post.excerpt).trim()) ||
    stripHtml(post?.content || post?.body || "");
  const description = truncate(rawDesc, 160);

  // Ảnh ưu tiên: ogImage -> image -> ảnh đầu tiên trong content -> fallback logo
  const ogImageRaw =
    post?.ogImage ||
    post?.image ||
    extractFirstImage(post?.content || post?.body || "") ||
    "/logo.png";
  const ogAbs = toAbs(ogImageRaw);

  const datePublished =
    toISO(post?.date || post?.publishedAt || post?.updatedAt);
  const dateModified =
    toISO(post?.updatedAt || post?.modifiedAt) || datePublished;

  const authorName =
    (typeof post?.author === "string"
      ? post.author
      : post?.author?.name) || "FinNews247";

  // NewsArticle nếu trong chuyên mục crypto-market
  const isNews =
    normPath.startsWith("/crypto-market/") ||
    normPath === "/crypto-market";

  // JSON-LD Article / NewsArticle
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

  // Breadcrumb (đơn giản, an toàn)
  const categoryName =
    (post?.category && String(post.category)) || undefined;
  const categoryPath =
    categoryName &&
    `${SITE}/${categoryName.toLowerCase().replace(/\s+/g, "-")}`;

  const breadcrumbItems = [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE },
  ];
  if (categoryName && categoryPath) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 2,
      name: categoryName,
      item: categoryPath,
    });
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 3,
      name: post?.title || "Article",
      item: url,
    });
  } else {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 2,
      name: post?.title || "Article",
      item: url,
    });
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  };

  // OpenGraph type + article meta (khi là news/article)
  const openGraph = {
    url,
    title,
    description,
    type: isNews ? "article" : "website",
    images: ogAbs ? [{ url: ogAbs }] : undefined,
  };

  if (isNews) {
    openGraph.article = {
      publishedTime: datePublished,
      modifiedTime: dateModified,
      authors: [authorName],
      section: categoryName || undefined,
    };
  }

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        canonical={url}
        openGraph={openGraph}
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
