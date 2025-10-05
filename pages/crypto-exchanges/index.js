// pages/crypto-exchanges/index.js
import fs from "fs";
import path from "path";
import Link from "next/link";
import PostCard from "../../components/PostCard";
import { NextSeo } from "next-seo";

/**
 * Chuẩn hoá đối tượng post để PostCard luôn có ảnh + ngày.
 * - Ảnh: ưu tiên image, thumbnail, cover, ogImage, logo, imageUrl
 * - Ngày: ưu tiên date, publishedAt, updatedAt, lastmod
 */
function normalizePost(p) {
  const imgRaw =
    p.image ||
    p.thumbnail ||
    p.cover ||
    p.ogImage ||
    p.logo ||
    p.imageUrl ||
    null;

  // Ảnh tương đối => lấy trong /public/images
  const image =
    !imgRaw
      ? null
      : (imgRaw.startsWith("http://") ||
         imgRaw.startsWith("https://") ||
         imgRaw.startsWith("/"))
        ? imgRaw
        : `/images/${imgRaw}`;

  const date =
    p.date || p.publishedAt || p.updatedAt || p.lastmod || null;

  // Trả về object đã chuẩn hoá + thêm field PostCard hay dùng
  return {
    ...p,
    slug: String(p.slug || "").replace(/^\/+|\/+$/g, ""),
    title: p.title || p.name || p.heading || p.slug,
    excerpt: p.excerpt || p.summary || p.description || "",
    image,                 // để PostCard lấy ảnh
    featuredImage: image,  // nếu PostCard dùng key khác
    date,                  // để sort/hiển thị ngày
  };
}

/**
 * Crypto Exchanges category page
 * Show ONLY a list of the latest posts (new → old).
 */
export default function CryptoExchanges({ posts }) {
  return (
    <>
      {/* SEO for Crypto Exchanges */}
      <NextSeo
        title="Best Crypto Exchanges 2025 – Compare Fees, Security, Features | FinNews"
        description="Compare the best crypto exchanges of 2025 on fees, security and features. Includes in-depth reviews of Fidelity Crypto, Coinbase and more."
        canonical="https://www.finnews247.com/crypto-exchanges"
        openGraph={{
          title: "Best Crypto Exchanges 2025 – Compare Fees, Security, Features",
          description:
            "Comprehensive comparison of the top crypto exchanges in 2025, including fees, security and features.",
          url: "https://www.finnews247.com/crypto-exchanges",
        }}
      />

      <div>
        <h1 className="text-3xl font-semibold mb-6">
          Crypto Platforms / Exchanges Reviews
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {posts.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>

        {/* (tuỳ chọn) Link phân trang/see all nếu muốn */}
        {/* <div className="mt-6 flex justify-center">
          <Link href="/crypto-exchanges" className="text-sky-600 hover:underline">
            View more →
          </Link>
        </div> */}
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const safeRead = (file) => {
    try {
      const raw = fs.readFileSync(path.join(process.cwd(), "data", file), "utf-8");
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  };

  // Merge data từ nhiều nguồn như code gốc
  let all = [
    ...safeRead("cryptoexchanges.json"),
    ...safeRead("fidelity.json"),
  ]
    // Chuẩn hoá để luôn có image/date cho PostCard
    .map(normalizePost)
    // Khử trùng lặp theo slug (ưu tiên bản có date/ảnh)
    .reduce((acc, cur) => {
      const key = cur.slug;
      if (!key) return acc;
      const prev = acc.get(key);
      if (!prev) {
        acc.set(key, cur);
      } else {
        const prevScore = (prev.image ? 1 : 0) + (prev.date ? 1 : 0);
        const curScore = (cur.image ? 1 : 0) + (cur.date ? 1 : 0);
        acc.set(key, curScore >= prevScore ? cur : prev);
      }
      return acc;
    }, new Map());

  // Sort newest → oldest (fallback 0 nếu không có ngày)
  const posts = Array.from(all.values()).sort((a, b) => {
    const ta = a.date ? Date.parse(a.date) || 0 : 0;
    const tb = b.date ? Date.parse(b.date) || 0 : 0;
    if (tb !== ta) return tb - ta;           // mới nhất trước
    // Tie-break: có ảnh ưu tiên, sau đó theo title
    const ib = b.image ? 1 : 0, ia = a.image ? 1 : 0;
    if (ib !== ia) return ib - ia;
    return String(a.title || "").localeCompare(String(b.title || ""));
  });

  return { props: { posts } };
}
