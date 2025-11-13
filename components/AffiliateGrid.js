// components/AffiliateGrid.js
import AffiliateCard from "./AffiliateCard";

export default function AffiliateGrid({ title, items = [] }) {
  if (!items.length) return null;
  return (
    <section className="not-prose">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((it, idx) => (
          <AffiliateCard key={idx} item={it} />
        ))}
      </div>
    </section>
  );
}
