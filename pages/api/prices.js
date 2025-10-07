// pages/api/prices.js
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const TIMEOUT_MS = 4000;
  const abortCtrl = new AbortController();
  const timer = setTimeout(() => abortCtrl.abort(), TIMEOUT_MS);

  const cgUrl =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,solana,dogecoin&order=market_cap_desc&sparkline=false";
  const yhUrl =
    "https://query1.finance.yahoo.com/v7/finance/quote?symbols=AAPL,TSLA,MSFT,NVDA,AMZN";

  try {
    const [cgRes, yhRes] = await Promise.allSettled([
      fetch(cgUrl, { signal: abortCtrl.signal }),
      fetch(yhUrl, { signal: abortCtrl.signal }),
    ]);

    clearTimeout(timer);

    let cryptos = [];
    if (cgRes.status === "fulfilled" && cgRes.value.ok) {
      const cryptoData = await cgRes.value.json();
      cryptos = (cryptoData || []).map((c) => {
        const priceNum = Number(c.current_price ?? NaN);
        const changeNum = Number(c.price_change_percentage_24h ?? NaN);
        return {
          symbol: String(c.symbol || "").toUpperCase(),
          price: Number.isFinite(priceNum) ? priceNum.toLocaleString() : "",
          change: Number.isFinite(changeNum) ? changeNum.toFixed(2) : "",
          currency: "USD",
          // numeric fields (nếu UI cần)
          priceNum: Number.isFinite(priceNum) ? priceNum : null,
          changeNum: Number.isFinite(changeNum) ? changeNum : null,
          source: "coingecko",
        };
      });
    }

    let stocks = [];
    if (yhRes.status === "fulfilled" && yhRes.value.ok) {
      const stockJson = await yhRes.value.json();
      const list = stockJson?.quoteResponse?.result || [];
      stocks = list.map((s) => {
        const priceNum = Number(s.regularMarketPrice ?? NaN);
        const changeNum = Number(s.regularMarketChangePercent ?? NaN);
        return {
          symbol: s.symbol || "-",
          price: Number.isFinite(priceNum) ? priceNum.toLocaleString() : "",
          change: Number.isFinite(changeNum) ? changeNum.toFixed(2) : "",
          currency: s.currency || "USD",
          // numeric fields
          priceNum: Number.isFinite(priceNum) ? priceNum : null,
          changeNum: Number.isFinite(changeNum) ? changeNum : null,
          source: "yahoo",
        };
      });
    }

    const payload = [...cryptos, ...stocks];

    // ✅ Cache ở edge/CDN: 5 phút, cho phép phục vụ dữ liệu cũ 60s trong lúc revalidate
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=60"
    );
    // tránh vô tình set cookie từ upstream
    res.removeHeader?.("Set-Cookie");

    return res.status(200).json(payload);
  } catch (e) {
    // fallback: cache ngắn 60s để hạn chế spam API khi upstream down
    res.setHeader("Cache-Control", "public, s-maxage=60");
    return res.status(200).json([]);
  }
}
