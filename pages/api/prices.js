export default async function handler(req, res){
  try{
    const cryptoRes = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,solana,dogecoin&order=market_cap_desc&sparkline=false");
    const cryptoData = await cryptoRes.json();
    const cryptos = cryptoData.map(c=>({ symbol: c.symbol.toUpperCase(), price: c.current_price?.toLocaleString(), change: c.price_change_percentage_24h?.toFixed(2), currency: 'USD' }));

    const stockRes = await fetch("https://query1.finance.yahoo.com/v7/finance/quote?symbols=AAPL,TSLA,MSFT,NVDA,AMZN");
    const stockJson = await stockRes.json();
    const stocks = (stockJson.quoteResponse?.result || []).map(s=>({ symbol: s.symbol, price: s.regularMarketPrice?.toLocaleString(), change: s.regularMarketChangePercent?.toFixed(2), currency: s.currency }));

    res.status(200).json([...cryptos, ...stocks]);
  }catch(e){
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
}
