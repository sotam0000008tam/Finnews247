const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const EXT = new Set(['.js', '.jsx', '.ts', '.tsx', '.md', '.mdx', '.json', '.html']);

function walk(dir, acc = []) {
  for (const n of fs.readdirSync(dir)) {
    if (n === 'node_modules' || n.startsWith('.next')) continue;
    const p = path.join(dir, n);
    const st = fs.statSync(p);
    st.isDirectory() ? walk(p, acc) : acc.push(p);
  }
  return acc;
}

const files = walk(ROOT).filter(f => EXT.has(path.extname(f)));

let changed = 0;
for (const file of files) {
  let s = fs.readFileSync(file, 'utf8'); const orig = s;

  // Protect canonical first
  s = s.replace(/\/crypto-exchanges\//g, '/__CRYPTO_EXCHANGES__/');
  s = s.replace(/(["'])\/crypto-exchanges\1/g, '$1/__CRYPTO_EXCHANGES__$1');
  s = s.replace(/\/tax\//g, '/__TAX__/');
  s = s.replace(/(["'])\/tax\1/g, '$1/__TAX__$1');
  s = s.replace(/\/insurance\//g, '/__INS__/');
  s = s.replace(/(["'])\/insurance\1/g, '$1/__INS__$1');

  // Replace legacy -> canonical
  s = s.replace(/\/exchanges\//g, '/crypto-exchanges/');
  s = s.replace(/(["'])\/exchanges\1/g, '$1/crypto-exchanges$1');
  s = s.replace(/\/crypto-tax\//g, '/tax/');
  s = s.replace(/(["'])\/crypto-tax\1/g, '$1/tax$1');
  s = s.replace(/\/crypto-insurance\//g, '/insurance/');
  s = s.replace(/(["'])\/crypto-insurance\1/g, '$1/insurance$1');

  // Restore placeholders
  s = s.replace(/\/__CRYPTO_EXCHANGES__\//g, '/crypto-exchanges/');
  s = s.replace(/(["'])\/__CRYPTO_EXCHANGES__\1/g, '$1/crypto-exchanges$1');
  s = s.replace(/\/__TAX__\//g, '/tax/');
  s = s.replace(/(["'])\/__TAX__\1/g, '$1/tax$1');
  s = s.replace(/\/__INS__\//g, '/insurance/');
  s = s.replace(/(["'])\/__INS__\1/g, '$1/insurance$1');

  if (s !== orig) { fs.writeFileSync(file, s); changed++; console.log('Updated:', file); }
}
console.log('Done. Files changed:', changed);
