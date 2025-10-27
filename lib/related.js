import { readJsonSafe, sortDescByDate, shallowPosts } from "./data.js";

/**
 * @param {Object} opts
 * @param {string} opts.category   // ví dụ: "altcoins" | "exchanges" | "apps" | "insuranceTax" | "news" | "guides"
 * @param {string} opts.currentSlug
 * @param {string[]} [opts.currentTags]
 * @param {number} [opts.relatedLimit]
 * @param {number} [opts.latestLimit]
 */
export function getRelatedAndLatest({
  category,
  currentSlug,
  currentTags = [],
  relatedLimit = 6,
  latestLimit = 8,
}) {
  // Nạp dữ liệu theo đúng cách site đang dùng
  const altcoins = readJsonSafe("altcoins.json");
  const seccoin = readJsonSafe("seccoin.json");
  const exchanges = readJsonSafe("fidelity.json").concat(readJsonSafe("cryptoexchanges.json"));
  const apps = readJsonSafe("bestapps.json");
  const insuranceTax = readJsonSafe("insurance.json").concat(readJsonSafe("tax.json"));
  const news = readJsonSafe("news.json");
  const guides = readJsonSafe("guides.json");

  const byCat = {
    altcoins: altcoins.concat(seccoin),
    exchanges,
    apps,
    insuranceTax,
    news,
    guides,
  };

  const all = Object.values(byCat).flat();
  const allShallow = shallowPosts(sortDescByDate(all));

  // related: ưu tiên cùng category + trùng tag (nếu có)
  let pool = byCat[category] ? shallowPosts(sortDescByDate(byCat[category])) : allShallow;

  // bỏ chính bài hiện tại
  pool = pool.filter((p) => p.slug !== currentSlug);

  if (currentTags.length) {
    const tagSet = new Set(currentTags.map((t) => String(t).toLowerCase()));
    const score = (p) => {
      const tags = (p.tags || p.keywords || []).map((t) => String(t).toLowerCase());
      return tags.filter((t) => tagSet.has(t)).length;
    };
    pool = pool
      .map((p) => ({ p, s: score(p) }))
      .sort((a, b) => b.s - a.s)
      .map(({ p }) => p);
  }

  const related = pool.slice(0, relatedLimit);

  // latest toàn site (trừ bài hiện tại & những bài đã nằm trong related)
  const relatedSlugs = new Set(related.map((r) => r.slug));
  const latest = allShallow
    .filter((p) => p.slug !== currentSlug && !relatedSlugs.has(p.slug))
    .slice(0, latestLimit);

  return { related, latest };
}
