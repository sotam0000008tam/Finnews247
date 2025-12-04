// components/PostCard.js
import Link from "next/link";

export default function PostCard({ post = {} }) {
  const slug = post.slug || "";
  let postUrl = `/${slug}`;

  const cat = (post.category || "").toLowerCase();

  // 1) Exchanges: gộp Fidelity Crypto + Crypto Exchanges → /crypto-exchanges
  if (cat === "fidelity crypto" || cat === "crypto exchanges") {
    postUrl = `/crypto-exchanges/${slug}`;

  // 2) Altcoins: gộp SEC Coin + Altcoins → /altcoins
  } else if (
    cat === "sec coin" ||
    cat === "sec-coin" ||
    cat === "seccoin" ||
    cat === "altcoins"
  ) {
    postUrl = `/altcoins/${slug}`;

  // 3) Apps & Wallets → /best-crypto-apps
  } else if (
    cat === "best crypto apps" ||
    cat === "wallets" ||
    cat === "crypto wallets"
  ) {
    postUrl = `/best-crypto-apps/${slug}`;

  // 4) Guides & Reviews → /guides
  } else if (cat === "guides" || cat === "reviews") {
    postUrl = `/guides/${slug}`;

  // 5) Insurance & Tax → /insurance (1 nhóm)
  } else if (
    cat === "crypto tax & compliance" ||
    cat === "crypto insurance & risk" ||
    cat === "insurance" ||
    cat === "tax"
  ) {
    postUrl = `/insurance/${slug}`;

  // 6) Crypto & Market (news / market / economy / stocks / crypto) → /crypto-market
  } else if (
    cat === "crypto market" ||
    cat === "market" ||
    cat === "news" ||
    cat === "economy" ||
    cat === "stocks" ||
    cat === "crypto"
  ) {
    postUrl = `/crypto-market/${slug}`;

  // 7) Signals hoặc không có category
  } else if (cat === "signals" || !post.category) {
    // giữ nguyên /slug mặc định
  }

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {post.image && (
        <div className="w-full">
          {/* cố định chiều cao để card đều nhau, tránh ảnh dọc làm vỡ layout */}
          <img
            src={post.image}
            alt={post.title || "post"}
            className="w-full h-48 object-cover rounded-t-lg"
            loading="lazy"
          />
        </div>
      )}

      <div className="p-4">
        <div className="text-xs text-gray-500 mb-2">{post.date}</div>

        <h3 className="text-lg font-semibold mb-2">
          <Link href={postUrl} className="hover:underline">
            {post.title}
          </Link>
        </h3>

        {post.excerpt && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            {post.excerpt}
          </p>
        )}

        <Link href={postUrl} className="text-sky-600 hover:underline text-sm">
          Read more →
        </Link>
      </div>
    </article>
  );
}
