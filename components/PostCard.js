import Link from "next/link";

export default function PostCard({ post }) {
  // Determine base path based on category. Default is root (news/market).
  let postUrl = `/${post.slug}`;
  if (post.category === "Fidelity Crypto") {
    postUrl = `/fidelity-crypto/${post.slug}`;
  } else if (post.category === "SEC Coin" || post.category === "Sec Coin") {
    postUrl = `/sec-coin/${post.slug}`;
  } else if (post.category === "Best Crypto Apps") {
    postUrl = `/best-crypto-apps/${post.slug}`;
  } else if (post.category === "Guides") {
    postUrl = `/guides/${post.slug}`;
  } else if (post.category === "Crypto Tax & Compliance") {
    postUrl = `/tax/${post.slug}`;
  } else if (post.category === "Crypto Insurance & Risk") {
    postUrl = `/insurance/${post.slug}`;
  } else if (post.category === "Crypto Exchanges") {
    postUrl = `/crypto-exchanges/${post.slug}`;
  } else if (post.category === "Altcoins") {
    postUrl = `/altcoins/${post.slug}`;
  } else if (post.category === "Signals" || post.category === null || post.category === undefined) {
    // Signals or undefined category fallback
    postUrl = `/signals/${post.slug}`;
  } else if (post.category === "Wallets" || post.category === "Crypto Wallets") {
    // Normalise wallets category to best apps route
    postUrl = `/best-crypto-apps/${post.slug}`;
  }
  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* Thumbnail đại diện */}
      {post.image && (
        <div className="h-48 w-full overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="object-cover w-full h-full"
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
        {/* Đoạn trích ngắn */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          {post.excerpt}
        </p>
        {/* Link tới trang chi tiết */}
        <Link href={postUrl} className="text-sky-600 hover:underline text-sm">
          Read more →
        </Link>
      </div>
    </article>
  );
}
