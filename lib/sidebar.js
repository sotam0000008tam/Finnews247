// lib/sidebar.js
import fs from "fs";
import path from "path";

const read = (f) => {
  try { return JSON.parse(fs.readFileSync(path.join(process.cwd(),"data",f),"utf-8")); }
  catch { return []; }
};

const fileForCat = (c) =>
  (c==="crypto-exchanges" ? "cryptoexchanges"
   : c==="best-crypto-apps" ? "bestapps"
   : c==="fidelity" ? "fidelity"
   : c==="sec-coin" ? "seccoin"
   : c==="crypto-market" ? "news"
   : c) + ".json";

export const GROUPS = [
  { name: "Altcoin Analysis",  cats: ["altcoins"] },
  { name: "Exchanges",         cats: ["crypto-exchanges"] },
  { name: "Apps & Wallets",    cats: ["best-crypto-apps"] },
  { name: "Insurance & Tax",   cats: ["insurance","tax"] },
  { name: "Crypto & Market",   cats: ["crypto-market"] },
  { name: "Guides & Reviews",  cats: ["guides"] },
];

const sortDesc = (a,b) => (Date.parse(b.date||b.updatedAt)||0)-(Date.parse(a.date||a.updatedAt)||0);

export function buildPool(cats){
  let pool=[]; for(const c of cats){ try{
    pool = pool.concat(read(fileForCat(c)).map(p=>({...p,_cat:c})));
  }catch{} }
  return pool;
}

/** Đảm bảo mỗi nhóm có ≥1 bài, sau đó bù bài mới toàn site cho đủ total */
export function ensureCoverage(groups=GROUPS, total=10){
  const allCats = [...new Set(groups.flatMap(g=>g.cats))];
  const pool = buildPool(allCats);
  const seen = new Set();
  const ensured = [];

  for(const g of groups){
    const top = pool.filter(p=>g.cats.includes(p._cat)).sort(sortDesc)[0];
    if(top && !seen.has(top.slug)){ ensured.push({...top,_group:g.name}); seen.add(top.slug); }
  }

  const rest = pool.filter(p=>!seen.has(p.slug)).sort(sortDesc);
  return ensured.concat(rest).slice(0,total);
}

export function latestSignals(limit=8){
  const items = read("signals.json");
  return items.slice().sort(sortDesc).slice(0,limit);
}
