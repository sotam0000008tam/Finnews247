// components/PostCard.js
import Link from "next/link";

export default function PostCard({ post = {} }) {
  let postUrl = `/${post.slug || ""}`;

  // Route mapping theo category (giữ nguyên như bạn)
  if (post.category === "Fidelity Crypto") {
    postUrl = `/fidelity-crypto/${post.slug}`;
  } else if (post.category === "SEC Coin" || post.category === "Sec Coin") {
    postUrl = `/sec-coin/${post.slug}`;
  } else if (post.category === "Best Crypto Apps") {
    postUrl = `/best-crypto-apps/${post.slug}`;
  } else if (post.category === "Guides") {
    postUrl = `/guides/${post.slug}`;
  } else if (
    post.category === "Crypto Tax & Compliance" ||
    post.category === "Crypto Insurance & Risk" ||
    post.category === "insurance" // ép từ index.js
  ) {
    // Gộp Tax + Insurance về chung route /insurance
    postUrl = `/insurance/${post.slug}`;
  } else if (post.category === "Crypto Exchanges") {
    postUrl = `/crypto-exchanges/${post.slug}`;
  } else if (post.category === "Altcoins") {
    postUrl = `/altcoins/${post.slug}`;
  } else if (
    post.category === "Signals" ||
    post.category === null ||
    post.category === undefined
  ) {
    postUrl = `/signals/${post.slug}`;
  } else if (post.category === "Wallets" || post.category === "Crypto Wallets") {
    postUrl = `/best-crypto-apps/${post.slug}`;
  }

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow ">
      {post.image && (
        <div className="w-full">
          <img
            src={post.image}
            alt={post.title || "post"}
            className="w-full h-auto rounded-t-lg"
            loading="lazy"
          />
        </div>
      )}

      <div className="p-4">
        <div className="text-xs text-gray-500 mb-2">{post.date}</div>

        <h3 className="text-lg font-semibold mb-2">
          <Link href={postUrl} className="hover:underline">{post.title}</Link>
        </h3>

        {post.excerpt && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            {post.excerpt}
          </p>
        )}

        <Link href={postUrl} className="text-sky-600 hover:underline text-sm">Read more →</Link>
      </div>
    </article>
  );
}
