const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const INCLUDE_EXT = new Set(['.js', '.jsx', '.ts', '.tsx', '.md', '.mdx', '.json', '.html']);

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.next')) continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

const files = walk(ROOT).filter(f => INCLUDE_EXT.has(path.extname(f)));
const REPLACES = [
  [/\/crypto-tax\//g, '/tax/'],
  [/\/crypto-insurance\//g, '/insurance/'],
  [/\/crypto-tax(\b|$)/g, '/tax'],
  [/\/crypto-insurance(\b|$)/g, '/insurance'],
];

let changed = 0;
for (const file of files) {
  let s = fs.readFileSync(file, 'utf8');
  let orig = s;
  for (const [from, to] of REPLACES) s = s.replace(from, to);
  if (s !== orig) {
    fs.writeFileSync(file, s);
    changed++;
    console.log('Updated:', file);
  }
}
console.log('Done. Files changed:', changed);
