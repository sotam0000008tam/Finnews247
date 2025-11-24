// work/components/TableOfContents.js
// A dynamic Table of Contents component that scans headings in the
// surrounding article (elements with the class `post-body`) and
// constructs an anchor-based outline. When included on a page, it
// automatically assigns id attributes to H2–H4 elements and lists
// them here. This improves UX by allowing readers to jump to
// sections quickly, a best practice recommended by Mediavine for
// longer articles.

import { useEffect, useState } from "react";

export default function TableOfContents() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll(
        '.post-body h2, .post-body h3, .post-body h4'
      )
    );
    const results = [];
    headings.forEach((el) => {
      const level = parseInt(el.tagName.substring(1), 10);
      const text = el.textContent.trim();
      if (!text) return;
      const slug = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-/g, '')
        .replace(/-$/g, '');
      if (!el.id) el.id = slug;
      results.push({ level, text, slug });
    });
    setItems(results);
  }, []);

  if (!items.length) return null;

  return (
    <nav className="my-6 p-4 border-l-4 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded">
      <h2 className="text-base font-semibold mb-2">Table of Contents</h2>
      <ul className="text-sm space-y-1">
        {items.map(({ level, text, slug }, idx) => (
          <li key={idx} className={level === 2 ? '' : level === 3 ? 'ml-4' : 'ml-8'}>
            <a href={`#${slug}`} className="text-sky-600 hover:underline">
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}