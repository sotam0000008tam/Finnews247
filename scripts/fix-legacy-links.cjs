#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const SKIP_DIRS = new Set(["node_modules", ".next", "dist", "build", "public", ".git"]);
const exts = new Set([".js", ".jsx", ".tsx"]);

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.isDirectory()) {
      if (!SKIP_DIRS.has(ent.name)) walk(path.join(dir, ent.name));
      continue;
    }
    const p = path.join(dir, ent.name);
    if (exts.has(path.extname(p))) fixFile(p);
  }
}

function fixFile(p) {
  let s = fs.readFileSync(p, "utf8");
  const orig = s;

  // 1) TRƯỜNG HỢP ĐẦY ĐỦ: <Link ... legacyBehavior ...> <a ...> ... </a> </Link>
  //    -> <Link ... + aAttrs> ... </Link>
  s = s.replace(
    /<Link([^>]*?)\s+legacyBehavior([\s\S]*?)>\s*<a([^>]*?)>([\s\S]*?)<\/a>\s*<\/Link>/g,
    (m, linkAttrs, after, aAttrs, inner) => `<Link${linkAttrs}${after}${aAttrs}>${inner}</Link>`
  );

  // 2) TRƯỜNG HỢP MỞ THẺ: <Link ... legacyBehavior ...>\s*<a ...>
  //    -> gộp aAttrs vào Link mở
  s = s.replace(
    /<Link([^>]*?)\s+legacyBehavior([\s\S]*?)>\s*<a([^>]*?)>/g,
    (m, linkAttrs, after, aAttrs) => `<Link${linkAttrs}${after}${aAttrs}>`
  );

  // 3) Xoá legacyBehavior còn sót
  s = s.replace(/\s+legacyBehavior\b/g, "");

  // 4) Dọn </a> còn lại trước </Link>
  s = s.replace(/<\/a>\s*(<\/Link>)/g, "$1");

  // 5) Gỡ escape thừa trong JSX attributes: className="...\" -> className="..."
  s = s.replace(/className="([^"]*?)\\(?=["\s>])/g, 'className="$1');

  // 6) Gỡ escape kết thúc ở các attribute khác (nếu có)
  s = s.replace(/([ \t][a-zA-Z_:][-a-zA-Z0-9_:]*=)"([^"]*?)\\(?=["\s>])/g, (_m, attr, val) => {
    return `${attr}"${val}`;
  });

  if (s !== orig) {
    fs.writeFileSync(p, s, "utf8");
    console.log("✅ fixed:", p);
  }
}

walk(process.cwd());
