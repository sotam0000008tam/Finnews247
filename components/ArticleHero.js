export default function ArticleHero({ src, alt }) {
  if (!src) return null;
  return (
    <div className="article-hero my-4">
      <img src={src} alt={alt || ""} loading="lazy" />
    </div>
  );
}
