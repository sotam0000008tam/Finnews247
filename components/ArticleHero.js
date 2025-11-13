// components/ArticleHero.jsx
export default function ArticleHero({
  src,
  alt,
  width = 1200,   // chỉnh theo kích thước ảnh hero thực tế của bạn
  // The default height is 675 to match 1200x675 (16:9) hero images used on FinNews.
  height = 675,
  priority = true // hero ở đầu bài => nên ưu tiên tải
}) {
  if (!src) return null;

  // Ưu tiên tải ảnh hero để cải LCP, vẫn giữ bố cục cũ
  const loading = priority ? "eager" : "lazy";
  const fetchPrio = priority ? "high" : "auto";

  return (
    // Center the hero image and constrain its width to match article content.
    // Without this, the hero uses the full article column width (md:col-span-9),
    // which can be much wider than the text body when we intentionally narrow
    // the prose column for better ad placement.  Constraining the figure to
    // roughly 46rem (~736px) and centering it keeps the hero aligned with
    // the content and prevents large blank margins on wide screens.
    <figure
      className="article-hero my-4"
      style={{ maxWidth: '46rem', marginLeft: 'auto', marginRight: 'auto' }}
    >
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
