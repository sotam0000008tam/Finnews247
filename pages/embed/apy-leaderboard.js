// pages/embed/apy-leaderboard.js
import { useEffect, useMemo, useState } from "react";
import Head from "next/head";

/** --- CSV parser siêu gọn (hỗ trợ dấu phẩy trong dấu ngoặc kép) --- */
function parseCSV(text = "") {
  const rows = [];
  let i = 0, field = "", row = [], inQuotes = false;
  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"'; // escaped quote
          i += 2;
          continue;
        } else {
          inQuotes = false;
          i++;
          continue;
        }
      } else {
        field += c;
        i++;
        continue;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
        i++;
        continue;
      }
      if (c === ",") {
        row.push(field);
        field = "";
        i++;
        continue;
      }
      if (c === "\n") {
        row.push(field);
        rows.push(row);
        field = "";
        row = [];
        i++;
        continue;
      }
      if (c === "\r") {
        // skip \r (windows newline)
        i++;
        continue;
      }
      field += c;
      i++;
    }
  }
  // push last field/row
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  // map header -> objects
  if (!rows.length) return [];
  const header = rows[0].map((h) => h.trim());
  return rows.slice(1).filter(r => r.length && r.some(x => String(x).trim() !== ""))
    .map((r) => {
      const obj = {};
      header.forEach((h, idx) => (obj[h] = (r[idx] ?? "").trim()));
      return obj;
    });
}

/** --- Utils nhỏ --- */
const COLS_DISPLAY = [
  "Platform/Pool",
  "Chain",
  "Asset",
  "APY (%)",
  "Compounding? (Y/N)",
  "Lockup (days)",
  "TVL (USD)",
];
const CSV_URL = "/data/apy-leaderboard.csv";

function toNumber(x) {
  const s = String(x || "").replace(/[, $]/g, "");
  const v = parseFloat(s);
  return Number.isFinite(v) ? v : null;
}

export default function ApyEmbed() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [chain, setChain] = useState("All");
  const [asset, setAsset] = useState("All");
  const [lock, setLock] = useState("All"); // All | Flexible | Locked
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    fetch(CSV_URL, { credentials: "omit" })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then((t) => alive && setRows(parseCSV(t)))
      .catch((e) => alive && setErr(String(e?.message || e)));
    return () => (alive = false);
  }, []);

  const lastUpdated = useMemo(() => {
    // cột: Last Checked (YYYY-MM-DD)
    const dates = rows
      .map((r) => r["Last Checked (YYYY-MM-DD)"])
      .filter(Boolean)
      .map((d) => new Date(d).getTime())
      .filter((n) => Number.isFinite(n))
      .sort((a, b) => b - a);
    if (!dates.length) return null;
    const dt = new Date(dates[0]);
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const d = String(dt.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, [rows]);

  const chains = useMemo(() => {
    const s = new Set();
    rows.forEach((r) => r["Chain"] && s.add(r["Chain"]));
    return ["All", ...Array.from(s).sort()];
  }, [rows]);

  const assets = useMemo(() => {
    const s = new Set();
    rows.forEach((r) => r["Asset"] && s.add(r["Asset"]));
    return ["All", ...Array.from(s).sort()];
  }, [rows]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return rows.filter((r) => {
      // search
      if (qq) {
        const blob = [
          r["Platform/Pool"],
          r["Chain"],
          r["Asset"],
          r["Risk Notes"],
          r["Source URL"],
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!blob.includes(qq)) return false;
      }
      // chain
      if (chain !== "All" && r["Chain"] !== chain) return false;
      // asset
      if (asset !== "All" && r["Asset"] !== asset) return false;
      // lockup
      const lockDays = toNumber(r["Lockup (days)"]) ?? 0;
      if (lock === "Flexible" && lockDays !== 0) return false;
      if (lock === "Locked" && lockDays === 0) return false;
      return true;
    });
  }, [rows, q, chain, asset, lock]);

  // Sắp xếp nhẹ: ưu tiên APY có số > rồi theo TVL
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const apyA = toNumber(a["APY (%)"]) ?? -Infinity;
      const apyB = toNumber(b["APY (%)"]) ?? -Infinity;
      if (apyB !== apyA) return apyB - apyA;
      const tvlA = toNumber(a["TVL (USD)"]) ?? -Infinity;
      const tvlB = toNumber(b["TVL (USD)"]) ?? -Infinity;
      return tvlB - tvlA;
    });
  }, [filtered]);

  return (
    <div style={{ fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif" }}>
      <Head>
        <title>APY Leaderboard (Embed) | FinNews247</title>
        {/* tránh index trang nhúng, nhưng vẫn follow link */}
        <meta name="robots" content="noindex,follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* OG để khi share nếu cần */}
        <meta property="og:title" content="APY Leaderboard (Embed) | FinNews247" />
        <meta property="og:description" content="Lightweight embedded APY table with quick filters. Data CSV available." />
        <meta property="og:url" content="https://www.finnews247.com/embed/apy-leaderboard" />
      </Head>

      <div style={{ padding: 10 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 8 }}>
          <strong style={{ fontSize: 14 }}>APY Leaderboard</strong>
          {lastUpdated && (
            <span style={{ fontSize: 12, color: "#666" }}>
              Last updated: {lastUpdated}
            </span>
          )}
          <a
            href="https://www.finnews247.com/guides/apy-leaderboard"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginLeft: "auto", fontSize: 12, color: "#0a66c2", textDecoration: "none" }}
            title="Open the full article"
          >
            Source page →
          </a>
        </div>

        {/* Bộ lọc nhẹ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 140px 140px", gap: 8, marginBottom: 10 }}>
          <input
            placeholder="Search platform/asset/risk…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ padding: "8px 10px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14 }}
          />
          <select value={chain} onChange={(e) => setChain(e.target.value)} style={selStyle}>
            {chains.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={asset} onChange={(e) => setAsset(e.target.value)} style={selStyle}>
            {assets.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <select value={lock} onChange={(e) => setLock(e.target.value)} style={selStyle}>
            <option>All</option>
            <option>Flexible</option>
            <option>Locked</option>
          </select>
        </div>

        {err ? (
          <div style={{ fontSize: 13, color: "#b00020", marginTop: 8 }}>
            Failed to load CSV: {err}. Check <code>/data/apy-leaderboard.csv</code>.
          </div>
        ) : null}

        {/* Bảng */}
        <div style={{ overflowX: "auto", border: "1px solid #eee", borderRadius: 10 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ position: "sticky", top: 0, background: "#fafafa", zIndex: 1 }}>
              <tr>
                {COLS_DISPLAY.map((h) => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((r, idx) => (
                <tr key={idx} style={{ borderTop: "1px solid #f2f2f2" }}>
                  {COLS_DISPLAY.map((h) => (
                    <td key={h} style={tdStyle}>
                      {h === "TVL (USD)"
                        ? (r[h] || "").toString()
                        : h === "APY (%)"
                        ? (r[h] || "").toString()
                        : (r[h] || "")}
                    </td>
                  ))}
                </tr>
              ))}
              {!sorted.length && (
                <tr>
                  <td colSpan={COLS_DISPLAY.length} style={{ ...tdStyle, color: "#666" }}>
                    No data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
          Data CSV: <a href="/data/apy-leaderboard.csv" target="_blank" rel="noopener noreferrer">/data/apy-leaderboard.csv</a>
        </p>
      </div>

      <style jsx global>{`
        :root { color-scheme: light; }
        @media (prefers-color-scheme: dark) {
          :root { color-scheme: dark; }
        }
      `}</style>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  fontSize: 12,
  fontWeight: 600,
  color: "#444",
  padding: "8px 10px",
  borderBottom: "1px solid #eaeaea",
  whiteSpace: "nowrap",
};
const tdStyle = {
  fontSize: 13,
  padding: "8px 10px",
  verticalAlign: "top",
};
const selStyle = {
  padding: "8px 10px",
  border: "1px solid #ddd",
  borderRadius: 8,
  fontSize: 14,
  background: "#fff",
};
