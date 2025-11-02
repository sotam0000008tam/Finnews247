import Link from "next/link";

export default function SidebarSignals({ items=[] }) {
  if (!items?.length) return null;
  const fmt = (s)=> (s ? String(s).slice(0,10) : "");
  const badge = (t="") =>
    String(t).toLowerCase()==="long"
      ? "bg-green-100 text-green-700 ring-1 ring-green-200 px-2 py-0.5 rounded"
      : "bg-red-100 text-red-700 ring-1 ring-red-200 px-2 py-0.5 rounded";

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">🔥 Latest Trading Signals</h3>
        <Link href="/signals" className="text-xs text-sky-600 hover:underline">View all →</Link>
      </div>

      <div className="space-y-2 sidebar-scope">
        {items.map((s)=>(
          <Link key={s.id||s.slug} href={`/signals/${s.slug||s.id}`} className="fn-mini group no-underline">
            <img src={s.image || "/images/dummy/market64.jpg"} alt={s.symbol||s.title||"signal"} />
            <div className="min-w-0">
              <div className="title">{s.title || `${s.symbol||s.pair} ${String(s.type||"").toUpperCase()}`}</div>
              <div className="flex items-center gap-2">
                {s.type && <span className={badge(s.type)}>{String(s.type).toUpperCase()}</span>}
                <span className="date">{fmt(s.date||s.updatedAt)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
