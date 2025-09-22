// scripts/generate-news.js
const fs = require('fs')
const path = require('path')

const today = new Date()
const topics = [
  // CRYPTO (20 topics)
  "Bitcoin Price Dynamics and Institutional Flows",
  "Ethereum Network Upgrades and Staking Trends",
  "Altcoin Rotation: Where Retail Money Is Heading",
  "DeFi Lending: Risks and Opportunities",
  "Stablecoin Regulation and Market Impact",
  "Layer 2 Adoption and Scaling Narratives",
  "NFT Market Evolution and Institutional Interest",
  "On-chain Analytics Show Accumulation Patterns",
  "Crypto ETFs and Institutional Allocation",
  "Blockchain Infrastructure Investment Trends",
  "Tokenization of Real-World Assets",
  "Interoperability Protocols and Liquidity",
  "Derivatives and Crypto Options Activity",
  "Stablecoin Reserves and Transparency",
  "Privacy Coins and Regulatory Scrutiny",
  "Cross-border Payments Using Crypto Rails",
  "Custody Solutions for Institutional Clients",
  "DAO Governance and Regulatory Questions",
  "Crypto Mining, Energy Use and ESG",
  "Macro Correlations Between Bitcoin and Equities",
  // STOCKS (15)
  "Apple Earnings: Services Growth and Hardware Cycle",
  "Tesla Production Update and EV Demand",
  "Nvidia and the AI Hardware Boom",
  "Microsoft Cloud Strength and Productivity Tools",
  "Amazon's E-commerce Recovery and AWS Momentum",
  "Mega-cap Buybacks and Market Concentration",
  "Small-cap Rally: Where to Look for Value",
  "Retail Broker Flow and Option Activity",
  "Dividend Stocks and Income Strategies",
  "Index Rebalance Effects on Shares",
  "IPO Pipeline and Technology Listings",
  "Sector Rotation: Energy to Tech and Back",
  "Corporate Guidance and Margin Pressure",
  "Active vs Passive Flows in Q3",
  "ESG Investing Impact on Stock Selection",
  // ECONOMY (15)
  "U.S. Inflation Trends and Consumer Prices",
  "Central Bank Policy Divergence: Fed vs ECB",
  "China Growth Outlook and Property Market",
  "Eurozone Manufacturing Slump and Fiscal Response",
  "Labor Market Strength and Wage Growth",
  "Global Trade Dynamics and Supply Chain Shifts",
  "Emerging Market Debt and Currency Stress",
  "Commodity Prices and Inflation Pass-Through",
  "Housing Market Trends and Mortgage Rates",
  "Fiscal Stimulus and Long-Term Debt Considerations",
  "Retail Sales and Consumer Confidence Snapshot",
  "Business Investment and Capex Decisions",
  "Services Sector Strength Amid Manufacturing Weakness",
  "Energy Markets: Oil, Gas and Transition Risks",
  "Global Growth Forecast Revisions",
  // MARKET (10 general market topics to fill category)
  "Treasury Yields and Fixed Income Liquidity",
  "ETF Flows and Market Breadth",
  "FX Markets: Dollar Strength and Emerging Currencies",
  "Volatility Metrics and Options Skew",
  "Commodities Rebalancing and Strategic Reserves",
  "Cross-Asset Correlations in Risk-Off Moves",
  "Market Microstructure: Liquidity in Thin Markets",
  "Macro Hedge Strategies for Allocators",
  "Investor Sentiment and Positioning Surveys",
  "Global Fund Flows and Reallocation Trends"
]

// Helper to create ~600-word body by repeating professional-sounding paragraphs
function composeContent(title) {
  const paras = []
  paras.push(`${title}. Market participants are watching recent developments closely as the story evolves. While headlines capture short-term moves, deeper structural trends are shaping the medium-term outlook.`)
  paras.push(`Analysts emphasize that liquidity conditions, macro policy, and sector-specific fundamentals will play decisive roles in the coming quarters. Investors should weigh both geopolitical risks and domestic indicators when forming convictions.`)
  paras.push(`From a market-structure perspective, derivatives activity, ETF flows and on-chain metrics (for crypto) continue to be pivotal. This dynamic creates both opportunities for active managers and headwinds for passive allocations.`)
  paras.push(`Earnings and data flow remain a primary focus. Companies with resilient revenue streams and prudent cost management have tended to outperform peers. Meanwhile, cyclical exposures remain sensitive to changes in interest-rate expectations.`)
  paras.push(`Looking ahead, the calendar of economic releases and corporate updates is dense; any unexpected data could prompt rapid re-pricing across asset classes. Risk management and scenario planning are critical for participants.`)
  paras.push(`In sum, ${title.toLowerCase()} will likely remain a theme for investors. While short-term noise may create volatility, disciplined allocation frameworks can help capture longer-term returns while managing downside risk.`)

  // create ~6-8 paragraphs, then join
  let content = paras.map(p=>`<p>${p}</p>`).join('')
  // repeat with small variations to expand to ~600 words
  for (let i=0;i<4;i++){
    content += `<p>${paras[(i%paras.length)]} Additional context: market participants are monitoring flows and policy signals. Tactical adjustments may be warranted as new information arrives.</p>`
  }
  return content
}

const articles = []
let id = 1
// Generate 70 entries by iterating topics array (will generate exactly topics.length = 70)
for (let i=0;i<topics.length;i++){
  const t = topics[i]
  const cat = (i<20) ? "Crypto" : (i<35) ? "Stocks" : (i<50) ? "Economy" : (i<60) ? "Market" : "Market"
  const slug = t.toLowerCase().replace(/[^\w\s-]/g,'').replace(/\s+/g,'-')
  const imageKey = t.toLowerCase().split(/\s+/).slice(0,2).join('-').replace(/[^\w-]/g,'') + `.jpg`
  const date = new Date(); date.setDate(date.getDate()-i)
  const excerpt = t + " — key developments and market implications summarized."
  const content = composeContent(t)
  articles.push({
    id: id,
    slug: `${id}-${slug}`,
    title: t,
    date: date.toISOString().slice(0,10),
    author: "FinNews Staff",
    category: cat,
    image: `/images/${imageKey}`,
    excerpt,
    content
  })
  id++
}

const outPath = path.join(process.cwd(),'data')
if(!fs.existsSync(outPath)) fs.mkdirSync(outPath, {recursive:true})
fs.writeFileSync(path.join(outPath,'news.json'), JSON.stringify(articles, null, 2))
console.log('Generated data/news.json with', articles.length, 'articles')
