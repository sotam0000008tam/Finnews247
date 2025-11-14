// components/ArticleHero.jsx
export default function ArticleHero({
  src,
  alt,
  width = 1200,   // chỉnh theo kích thước ảnh hero thực tế của bạn
  height = 630,   // 1200×630 là tỉ lệ OG phổ biến
  priority = true // hero ở đầu bài => nên ưu tiên tải
}) {
  if (!src) return null;

  // Ưu tiên tải ảnh hero để cải LCP, vẫn giữ bố cục cũ
  const loading = priority ? "eager" : "lazy";
  const fetchPrio = priority ? "high" : "auto";

  return (
    <figure className="article-hero my-4">
      <img
        src={src}
        alt={alt || ""}
        width={width}
        height={height}
        loading={loading}
        fetchpriority={fetchPrio}
        decoding="async"
        style={{ width: "100%", height: "auto", display: "block" }}
      />
    </figure>
  );
}
