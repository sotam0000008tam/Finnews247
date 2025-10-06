// lib/shallow-props.js
// Loại các trường nặng thường gặp trong bài viết:
const HEAVY_KEYS = new Set([
  "content",      // HTML dài
  "html",
  "body",
  "blocks",
  "faq",
  "longText"
]);

/**
 * Dùng JSON.stringify + replacer để loại bỏ key nặng ở mọi cấp lồng nhau.
 * Không đụng tới các trường nhẹ như title, slug, excerpt, image...
 */
export function shallowProps(props) {
  return JSON.parse(
    JSON.stringify(props, (key, value) => (HEAVY_KEYS.has(key) ? undefined : value))
  );
}
