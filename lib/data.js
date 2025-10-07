// lib/data.js
import fs from "fs";
import path from "path";

export function readJsonSafe(name) {
  try {
    const p = path.join(process.cwd(), "data", name);
    if (!fs.existsSync(p)) return [];
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch {
    return [];
  }
}

export function sortDescByDate(arr) {
  return [...arr].sort(
    (a, b) =>
      new Date(b.date || b.updatedAt || 0) - new Date(a.date || a.updatedAt || 0)
  );
}

export function shallowPosts(arr) {
  // Giảm dung lượng data cho trang / (tránh warning >128kB)
  return arr.map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date || p.updatedAt,
    image: p.image || p.ogImage || null,
    excerpt: p.excerpt || null,
    category: p.category || null,
  }));
}
