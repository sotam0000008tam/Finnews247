import { NextSeo } from "next-seo";
import Link from "next/link";
import Script from "next/script";
import { useState } from "react";
import signals from "../../data/signals.json";

<<<<<<< HEAD
/* ========= Helpers ========= */
function resolveImage(src) {
  if (!src) return null;
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
    return src;
  }
  return `/images/${src}`;
=======
/* Helpers */
function resolveImage(src){ if(!src) return null; if(src.startsWith("http")||src.startsWith("/")) return src; return `/images/${src}`; }
function extractFirstImage(html=""){ const m=html?.match?.(/<img[^>]+src=["']([^"']+)["']/i); return m?m[1]:null; }
function pickThumb(s){ return resolveImage(s?.image)||extractFirstImage(s?.content||s?.intro||s?.technicalAnalysis||"")||"/images/dummy/altcoins64.jpg"; }
function parseDate(d){ const t=Date.parse(d); return Number.isNaN(t)?0:t; }
function toTradingViewSymbol(pair){ if(!pair) return "BINANCE:BTCUSDT"; let p=pair.toUpperCase().trim(); p=p.replace(/^[A-Z]+:/,""); const compact=p.replace("/","").replace(/\s+/g,""); return `BINANCE:${compact}`; }

function TVChart({symbol,height=520}){
  const containerId="tvchart-container";
  return(<>
    <div id={containerId} style={{height}}/>
    <Script src="https://s3.tradingview.com/tv.js" strategy="lazyOnload"
      onLoad={()=>{
        const safe=symbol||"BINANCE:BTCUSDT";
        try{
          /* global TradingView */
          new TradingView.widget({
            container_id:containerId,symbol:safe,interval:"60",timezone:"Etc/UTC",theme:"light",style:"1",locale:"en",autosize:true,
            hide_side_toolbar:false,allow_symbol_change:true,studies:["RSI@tv-basicstudies","MACD@tv-basicstudies"],
          });
        }catch(e){ console.error("TV init error:",e); }
      }}
    />
  </>);
>>>>>>> 310b096 (feat: sidebar/pages + link check config; chore: .gitignore; rm tracked sitemap)
}
function extractFirstImage(html = "") {
  const m = html?.match?.(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
}
function pickThumb(s) {
  return (
    resolveImage(s?.image) ||
    extractFirstImage(s?.content || s?.intro || s?.technicalAnalysis || "") ||
    "/images/dummy/altcoins64.jpg"
  );
}
function parseDate(d) {
  const t = Date.parse(d);
  return Number.isNaN(t) ? 0 : t;
}
function baseSymbolFromPair(pair = "") {
  // Ví dụ: "BTC/USDT.P" -> "BTC", "ARIAUSDT.P" -> "ARIA"
  let p = String(pair).toUpperCase().trim();
  p = p.replace(/^[A-Z]+:/, "");      // bỏ prefix sàn nếu có (BINANCE:, BYBIT:, ...)
  p = p.replace(/\s+/g, "");
  // Nếu có slash: "BTC/USDT" -> lấy trước slash
  if (p.includes("/")) return p.split("/")[0];
  // Nếu là dạng liền: "BTCUSDT.P" -> bỏ .P rồi tách theo heuristics: lấy chuỗi chữ cái đầu
  p = p.replace(/\.P$/i, "");
  const m = p.match(/^[A-Z]+/);
  return m ? m[0] : p;
}
function formatSignalUrl(id) {
  return `/signals/${id}`;
}

<<<<<<< HEAD
/* ========= TradingView ========= */
function toTradingViewSymbol(pair) {
  if (!pair) return "BINANCE:BTCUSDT";
  let p = pair.toUpperCase().trim();
  p = p.replace(/^[A-Z]+:/, "");
  const compact = p.replace("/", "").replace(/\s+/g, "");
  return `BINANCE:${compact}`;
}
function TVChart({ symbol, height = 520 }) {
  const containerId = "tvchart-container";
  return (
    <>
      <div id={containerId} style={{ height }} />
      <Script
        src="https://s3.tradingview.com/tv.js"
        strategy="lazyOnload"
        onLoad={() => {
          const safeSymbol = symbol || "BINANCE:BTCUSDT";
          try {
            /* global TradingView */
            new TradingView.widget({
              container_id: containerId,
              symbol: safeSymbol,
              interval: "60",
              timezone: "Etc/UTC",
              theme: "light",
              style: "1",
              locale: "en",
              autosize: true,
              hide_side_toolbar: false,
              allow_symbol_change: true,
              studies: ["RSI@tv-basicstudies", "MACD@tv-basicstudies"],
            });
          } catch (e) {
            console.error("TradingView init error:", e);
          }
        }}
      />
    </>
  );
}

/* ========= Zoom ảnh ========= */
function ZoomableImage({ src, alt }) {
  const [open, setOpen] = useState(false);
  if (!src) return null;
  return (
    <>
      <img
        src={src}
        alt={alt}
        className="w-full h-auto rounded-md border cursor-zoom-in"
        onClick={() => setOpen(true)}
        loading="lazy"
      />
      {open && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setOpen(false)}
        >
          <img
            src={src}
            alt={alt}
            className="max-w-[95%] max-h-[90%] rounded shadow-lg cursor-zoom-out"
          />
        </div>
      )}
    </>
  );
}

/* ========= Item nhỏ sidebar ========= */
function SideSignalItem({ item }) {
  const href = formatSignalUrl(item.id);
  const img = pickThumb(item);
  const title = `${item.pair} — ${item.type}`;
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
    >
      <img
        src={img}
        alt={title}
        className="w-[45px] h-[45px] rounded-md object-cover border dark:border-gray-700 shrink-0"
        loading="lazy"
      />
      <div className="min-w-0">
        <div className="text-sm leading-snug line-clamp-2 group-hover:underline">
          {title}
        </div>
        {item?.date && <div className="text-xs text-gray-500 mt-0.5">{item.date}</div>}
      </div>
    </Link>
  );
}

/* ========= SSG ========= */
export async function getStaticPaths() {
  const paths = signals.map((s) => ({ params: { id: String(s.id) } }));
  return { paths, fallback: false };
}
export async function getStaticProps({ params }) {
  const signal = signals.find((s) => String(s.id) === params.id) || null;

  // Tính related + latest ngay ở build-time
  let related = [];
  let latest = [];
  if (signal) {
    const base = baseSymbolFromPair(signal.pair);
    const others = signals
      .filter((s) => String(s.id) !== String(signal.id))
      .sort((a, b) => parseDate(b.date) - parseDate(a.date));

    // Ưu tiên cùng base symbol
    related = others.filter((s) => baseSymbolFromPair(s.pair) === base).slice(0, 8);

    // Nếu không đủ thì bổ sung bằng các tín hiệu mới nhất còn lại
    const used = new Set(related.map((r) => String(r.id)));
    latest = others.filter((s) => !used.has(String(s.id))).slice(0, 10);
  }

  if (!signal) return { notFound: true };
  return { props: { signal, related, latest } };
}

/* ========= Page ========= */
export default function SignalDetailPage({ signal, related = [], latest = [] }) {
  if (!signal) {
    return (
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-2">Signal not found</h1>
        <p className="text-gray-600 mb-6">
          The requested trading signal does not exist or has been removed.
        </p>
        <Link href="/signals" className="text-sky-600 hover:underline">
          ← Back to Signals
        </Link>
=======
function ZoomableImage({src,alt}){
  const [open,setOpen]=useState(false); if(!src) return null;
  return(<>
    <img src={src} alt={alt} className="w-full h-auto rounded-md border cursor-zoom-in" onClick={()=>setOpen(true)} loading="lazy"/>
    {open&&(
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={()=>setOpen(false)}>
        <img src={src} alt={alt} className="max-w-[95%] max-h-[90%] rounded shadow-lg cursor-zoom-out"/>
>>>>>>> 310b096 (feat: sidebar/pages + link check config; chore: .gitignore; rm tracked sitemap)
      </div>
    )}
  </>);
}

/* SSG */
export async function getStaticPaths(){
  const paths=signals.map(s=>({params:{id:String(s.id)}}));
  return { paths, fallback:false };
}
export async function getStaticProps({params}){
  const signal=signals.find(s=>String(s.id)===params.id)||null;

  // only latest (no related)
  let latest=[];
  if(signal){
    const others=signals.filter(s=>String(s.id)!==String(signal.id))
      .sort((a,b)=>parseDate(b.date)-parseDate(a.date));
    latest=others.slice(0,10);
  }

  if(!signal) return { notFound:true };
  return { props:{ signal, latest } };
}

<<<<<<< HEAD
  const imgUrl = resolveImage(image);
  const tvSymbol = toTradingViewSymbol(pair);
  const pageTitle = `${pair} ${type} Signal — Entry ${entry}, Target ${target}, Stoploss ${stoploss}`;
  const pageDesc =
    excerpt || `Crypto trading signal for ${pair} — Entry ${entry}, Target ${target}, Stoploss ${stoploss}.`;
=======
/* Page */
export default function SignalDetailPage({ signal, latest=[] }){
  if(!signal){
    return(<div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">Signal not found</h1>
      <Link href="/signals" className="text-sky-600 hover:underline">† Back to Signals</Link>
    </div>);
  }
>>>>>>> 310b096 (feat: sidebar/pages + link check config; chore: .gitignore; rm tracked sitemap)

  const { pair,type,entry,target,stoploss,date,image,excerpt,intro,marketContext,technicalAnalysis,riskStrategy,faq,disclaimer,content,id }=signal;
  const imgUrl=resolveImage(image);
  const pageTitle=`${pair} ${type} Signal — Entry ${entry}, Target ${target}, Stoploss ${stoploss}`;
  const pageDesc=excerpt||`Crypto trading signal for ${pair} — Entry ${entry}, Target ${target}, Stoploss ${stoploss}.`;

<<<<<<< HEAD
  const RenderDetails = () => (
    <>
      {intro && (
        <section className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: String(intro) }} />
      )}
      {marketContext && (
        <section className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: String(marketContext) }} />
      )}
      {technicalAnalysis && (
        <section className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: String(technicalAnalysis) }} />
      )}
      {riskStrategy && (
        <section className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: String(riskStrategy) }} />
      )}
      {Array.isArray(faq) && faq.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">FAQ</h2>
          <div className="space-y-3">
            {faq.map((item, idx) => (
              <div key={idx} className="p-4 border rounded-lg bg-white dark:bg-gray-900">
                <p className="font-medium">Q: {item.q}</p>
                <p className="text-gray-700 mt-1">A: {item.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      {disclaimer && (
        <section
          className="mt-6 p-4 bg-yellow-100 text-yellow-900 text-sm rounded"
          dangerouslySetInnerHTML={{ __html: String(disclaimer) }}
        />
      )}
    </>
  );

  return (
=======
  return(
>>>>>>> 310b096 (feat: sidebar/pages + link check config; chore: .gitignore; rm tracked sitemap)
    <div className="container mx-auto px-4 py-8">
      <NextSeo title={pageTitle} description={pageDesc} canonical={`https://www.finnews247.com/signals/${id}`}
        openGraph={{ title:pageTitle, description:pageDesc, url:`https://www.finnews247.com/signals/${id}`, images: imgUrl?[{url:imgUrl}]:[{url:"https://www.finnews247.com/logo.png"}] }}
      />

<<<<<<< HEAD
      {/* 2 cột: Main + Sidebar */}
      <div className="grid md:grid-cols-12 gap-8">
        {/* Main */}
        <div className="md:col-span-8">
          <nav className="mb-4 text-sm">
            <Link href="/signals" className="text-sky-600 hover:underline">Signals</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span>{pair}</span>
=======
      <div className="grid md:grid-cols-12 gap-8">
        {/* Main */}
        <div className="md:col-span-9">
          <nav className="mb-4 text-sm">
            <Link href="/signals" className="text-sky-600 hover:underline">Signals</Link>
            <span className="mx-2 text-gray-400">/</span><span>{pair}</span>
>>>>>>> 310b096 (feat: sidebar/pages + link check config; chore: .gitignore; rm tracked sitemap)
          </nav>

          <header className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">{pair} — {type}</h1>
            <p className="text-gray-600 mt-1">{date}</p>
            <p className="mt-2">{excerpt}</p>
          </header>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
<<<<<<< HEAD
            <div className="p-4 border rounded-xl bg-white dark:bg-gray-900">
              <div className="text-gray-500 text-sm">Entry</div>
              <div className="text-lg font-semibold text-yellow-600">{entry}</div>
            </div>
            <div className="p-4 border rounded-xl bg-white dark:bg-gray-900">
              <div className="text-gray-500 text-sm">Target</div>
              <div className="text-lg font-semibold text-green-600">{target}</div>
            </div>
            <div className="p-4 border rounded-xl bg-white dark:bg-gray-900">
              <div className="text-gray-500 text-sm">Stoploss</div>
              <div className="text-lg font-semibold text-red-600">{stoploss}</div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="md:col-span-2 border rounded-xl overflow-hidden bg-white dark:bg-gray-900">
              <TVChart symbol={toTradingViewSymbol(pair)} height={520} />
            </div>
            <div className="border rounded-xl p-3 bg-white dark:bg-gray-900">
              {imgUrl ? (
                <ZoomableImage src={imgUrl} alt={`${pair} ${type} setup`} />
              ) : (
                <div className="text-sm text-gray-500">No image provided for this signal.</div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                If the TradingView symbol is unavailable, use the annotated image as reference for target zones &amp; invalidation.
              </p>
            </div>
          </div>

          {(intro || marketContext || technicalAnalysis || riskStrategy || (Array.isArray(faq) && faq.length) || disclaimer) ? (
            <RenderDetails />
          ) : content ? (
            <section className="prose max-w-none" dangerouslySetInnerHTML={{ __html: String(content) }} />
          ) : (
            <div className="text-sm text-gray-500">No detailed content provided for this signal.</div>
          )}

          <div className="mt-10 flex items-center gap-4 text-sky-600">
            <Link href="/signals" className="hover:underline">← Back to all signals</Link>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="md:col-span-4 w-full sticky top-24 self-start space-y-6">
          <section className="rounded-xl border bg-white dark:bg-gray-900 overflow-hidden">
            <div className="px-4 py-3 border-b dark:border-gray-700">
              <h3 className="text-sm font-semibold">Related Signals</h3>
            </div>
            <ul className="divide-y dark:divide-gray-800">
              {related.length ? (
                related.map((it) => (
                  <li key={it.id}>
                    <SideSignalItem item={it} />
                  </li>
                ))
              ) : (
                <li className="px-4 py-3 text-xs text-gray-500">No related signals.</li>
              )}
            </ul>
          </section>

          <section className="rounded-xl border bg-white dark:bg-gray-900 overflow-hidden">
            <div className="px-4 py-3 border-b dark:border-gray-700">
              <h3 className="text-sm font-semibold">Latest Signals</h3>
            </div>
            <ul className="divide-y dark:divide-gray-800">
              {latest.length ? (
                latest.map((it) => (
                  <li key={`latest-${it.id}`}>
                    <SideSignalItem item={it} />
                  </li>
                ))
              ) : (
                <li className="px-4 py-3 text-xs text-gray-500">No recent signals.</li>
              )}
=======
            <div className="p-4 border rounded-xl bg-white dark:bg-gray-900"><div className="text-gray-500 text-sm">Entry</div><div className="text-lg font-semibold text-yellow-600">{entry}</div></div>
            <div className="p-4 border rounded-xl bg-white dark:bg-gray-900"><div className="text-gray-500 text-sm">Target</div><div className="text-lg font-semibold text-green-600">{target}</div></div>
            <div className="p-4 border rounded-xl bg-white dark:bg-gray-900"><div className="text-gray-500 text-sm">Stoploss</div><div className="text-lg font-semibold text-red-600">{stoploss}</div></div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="md:col-span-2 border rounded-xl overflow-hidden bg-white dark:bg-gray-900">
              <TVChart symbol={toTradingViewSymbol(pair)} height={520}/>
            </div>
            <div className="border rounded-xl p-3 bg-white dark:bg-gray-900">
              {imgUrl? <ZoomableImage src={imgUrl} alt={`${pair} ${type} setup`}/> : <div className="text-sm text-gray-500">No image provided for this signal.</div>}
              <p className="text-xs text-gray-500 mt-2">If the TradingView symbol is unavailable, use the annotated image as reference for target zones &amp; invalidation.</p>
            </div>
          </div>

          {(intro||marketContext||technicalAnalysis||riskStrategy||(Array.isArray(faq)&&faq.length)||disclaimer)? (
            <>
              {intro&&<section className="prose max-w-none mb-8" dangerouslySetInnerHTML={{__html:String(intro)}}/>}
              {marketContext&&<section className="prose max-w-none mb-8" dangerouslySetInnerHTML={{__html:String(marketContext)}}/>}
              {technicalAnalysis&&<section className="prose max-w-none mb-8" dangerouslySetInnerHTML={{__html:String(technicalAnalysis)}}/>}
              {riskStrategy&&<section className="prose max-w-none mb-8" dangerouslySetInnerHTML={{__html:String(riskStrategy)}}/>}
              {Array.isArray(faq)&&faq.length>0&&(
                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">FAQ</h2>
                  <div className="space-y-3">
                    {faq.map((it,idx)=>(
                      <div key={idx} className="p-4 border rounded-lg bg-white dark:bg-gray-900">
                        <p className="font-medium">Q: {it.q}</p>
                        <p className="text-gray-700 mt-1">A: {it.a}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {disclaimer&&<section className="mt-6 p-4 bg-yellow-100 text-yellow-900 text-sm rounded" dangerouslySetInnerHTML={{__html:String(disclaimer)}}/>}
            </>
          ): content? <section className="prose max-w-none" dangerouslySetInnerHTML={{__html:String(content)}}/> : <div className="text-sm text-gray-500">No detailed content provided for this signal.</div>}

          <div className="mt-10 flex items-center gap-4 text-sky-600">
            <Link href="/signals" className="hover:underline">† Back to all signals</Link>
          </div>
        </div>

        {/* Sidebar: ONLY Latest Signals */}
        <aside className="md:col-span-3 w-full sticky top-24 self-start space-y-6">
          <section className="rounded-xl border bg-white dark:bg-gray-900 overflow-hidden">
            <div className="px-4 py-3 border-b dark:border-gray-700"><h3 className="text-sm font-semibold">Latest Signals</h3></div>
            <ul className="divide-y dark:divide-gray-800">
              {latest.length? latest.map(it=>(
                <li key={`latest-${it.id}`}>
                  <Link href={`/signals/${it.id}`} className="group flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <img src={pickThumb(it)} alt={`${it.pair} — ${it.type}`} className="w-[45px] h-[45px] rounded-md object-cover border dark:border-gray-700 shrink-0" loading="lazy"/>
                    <div className="min-w-0">
                      <div className="text-sm leading-snug line-clamp-2 group-hover:underline">{it.pair} — {it.type}</div>
                      {it?.date&&<div className="text-xs text-gray-500 mt-0.5">{it.date}</div>}
                    </div>
                  </Link>
                </li>
              )): <li className="px-4 py-3 text-xs text-gray-500">No recent signals.</li>}
>>>>>>> 310b096 (feat: sidebar/pages + link check config; chore: .gitignore; rm tracked sitemap)
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}


