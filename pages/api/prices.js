// pages/api/market-prices.js
// Mục tiêu: giảm chi phí serverless bằng Cache-Control (CDN cache) + timeout + xử lý lỗi an toàn.
// Không thay đổi cấu trúc trả về (giữ keys price, change là string), chỉ bổ sung priceNum/changeNum.

export default async function handler(req, res) {
  // Chỉ cho GET để CDN cache tốt
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // ---- TIMEOUT cho các request ra ngoài (tránh treo function) ----
  const TIMEOUT_MS = 4000;
  const abortCtrl = new AbortController();
  const to = setTimeout(() => abortCtrl.abort(), TIMEOUT_MS);

  // ---- Gọi song song 2 nguồn ----
  const cgUrl =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,solana,dogecoin&order=market_cap_desc&sparkline=false";
  const yhUrl =
    "https://query1.finance.yahoo.com/v7/finance/quote?symbols=AAPL,TSLA,MSFT,NVDA,AMZN";

  try {
    const [cgRes, yhRes] = await Promise.allSettled([
      fetch(cgUrl, { signal: abortCtrl.signal }),
      fetch(yhUrl, { signal: abortCtrl.signal }),
    ]);

    clearTimeout(to);

    // ---- Chuẩn hoá dữ liệu Crypto (CoinGecko) ----
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
          // số thuần để UI muốn tự format
          priceNum: Number.isFinite(priceNum) ? priceNum : null,
          changeNum: Number.isFinite(changeNum) ? changeNum : null,
          source: "coingecko",
        };
      });
    }

    // ---- Chuẩn hoá dữ liệu Stocks (Yahoo Finance) ----
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
          priceNum: Number.isFinite(priceNum) ? priceNum : null,
          changeNum: Number.isFinite(changeNum) ? changeNum : null,
          source: "yahoo",
        };
      });
    }

    const payload = [...cryptos, ...stocks];

    // ---- CACHE CONTROL cho CDN: cache 5 phút, SWR 24h ----
    // Giúp nhiều người truy cập chỉ tính 1 invocation (hit từ CDN).
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=86400"
    );
    // Tránh bị chặn cache do cookies
    res.removeHeader?.("Set-Cookie");

    return res.status(200).json(payload);
  } catch (e) {
    // Timeout/Network error → trả rỗng, cache ngắn để retry sớm
    res.setHeader("Cache-Control", "public, s-maxage=60");
    return res.status(200).json([]);
  }
}
