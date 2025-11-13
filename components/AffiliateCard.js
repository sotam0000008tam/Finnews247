// components/AffiliateCard.js
import Image from "next/image";
import OutboundLink from "./OutboundLink";

export default function AffiliateCard({ item }) {
  const { title, href, logo, meta, tag } = item;
  return (
    <div className="group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-3">
        {logo ? (
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
            <Image src={logo} alt={`${title} logo`} width={40} height={40} />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800" />
        )}
        <div className="min-w-0">
          <h3 className="text-base font-semibold truncate">{title}</h3>
          {meta && <p className="text-xs text-gray-500 truncate">{meta}</p>}
        </div>
        {tag && (
          <span className="ml-auto text-[11px] px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 shrink-0">
            {tag}
          </span>
        )}
      </div>

      <div className="mt-4">
        <OutboundLink
          href={href}
          className="inline-flex items-center text-sm font-medium text-sky-600 hover:underline"
          aria-label={`Visit ${title}`}
        >
          Visit
          <svg viewBox="0 0 24 24" className="w-4 h-4 ml-1" fill="currentColor" aria-hidden>
            <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z" />
            <path d="M5 5h6V3H3v8h2V5z" opacity=".4" />
          </svg>
        </OutboundLink>
      </div>
    </div>
  );
}
