export default function AuthorBadge({ author, date, className = "", compact = true }) {
  const name = (author || "").trim() || "FinNews247 Team";
  return (
    <div className={`inline-flex items-center gap-2 ${compact ? "text-xs" : "text-sm"} ${className}`}>
      <span className="uppercase tracking-wide text-gray-500">Written by</span>
      <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor" aria-hidden="true">
          <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" />
        </svg>
        <span className="font-medium">{name}</span>
      </span>
      {date ? <span className="text-gray-400 ml-2">{date}</span> : null}
    </div>
  );
}
