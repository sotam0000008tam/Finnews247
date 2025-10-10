/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/fidelity-crypto', destination: '/crypto-exchanges', permanent: true },
      { source: '/fidelity-crypto/:slug*', destination: '/crypto-exchanges/:slug*', permanent: true },

      // các legacy khác nếu còn:
      { source: '/privacy-policy', destination: '/privacy', permanent: true },
      { source: '/exchanges', destination: '/crypto-exchanges', permanent: true },
      { source: '/crypto-tax/:slug*', destination: '/tax/:slug*', permanent: true },
      { source: '/crypto-insurance/:slug*', destination: '/insurance/:slug*', permanent: true },
      { source: '/news/:slug', destination: '/:slug', permanent: true },

      // ========= 25 redirect cũ: /signals/:id -> /signals/:slug =========
      { source: '/signals/1',  destination: '/signals/btc-long-250912',           permanent: true },
      { source: '/signals/2',  destination: '/signals/eth-short-250912',          permanent: true },
      { source: '/signals/3',  destination: '/signals/sol-long-250912',           permanent: true },
      { source: '/signals/4',  destination: '/signals/xrp-long-250912',           permanent: true },
      { source: '/signals/5',  destination: '/signals/doge-short-250912',         permanent: true },
      { source: '/signals/6',  destination: '/signals/towns-long-250915-0800',    permanent: true },
      { source: '/signals/7',  destination: '/signals/btc-buysetup-250916-1730',  permanent: true },
      { source: '/signals/8',  destination: '/signals/take-long-250916-2130',     permanent: true },
      { source: '/signals/9',  destination: '/signals/syn-long-250916-2330',      permanent: true },
      { source: '/signals/10', destination: '/signals/mubarak-long-250917-0130',  permanent: true },
      { source: '/signals/11', destination: '/signals/pumpbtc-long-250917-1830',  permanent: true },
      { source: '/signals/12', destination: '/signals/myx-long-250917-2309',      permanent: true },
      { source: '/signals/13', destination: '/signals/bb-long-250918-0236',       permanent: true },
      { source: '/signals/14', destination: '/signals/sui-buysetup-250918-0820',  permanent: true },
      { source: '/signals/15', destination: '/signals/broccoli714-long-250918-1450', permanent: true },
      { source: '/signals/16', destination: '/signals/moodeng-long-250918-2250',  permanent: true },
      { source: '/signals/17', destination: '/signals/eth-long-250919-0900',      permanent: true },
      { source: '/signals/18', destination: '/signals/ain-long-250919-0914',      permanent: true },
      { source: '/signals/19', destination: '/signals/doge-long-250923-0914',     permanent: true },
      { source: '/signals/20', destination: '/signals/btc-long-250923-1643',      permanent: true },
      { source: '/signals/21', destination: '/signals/chess-long-250924-1914',    permanent: true },
      { source: '/signals/22', destination: '/signals/aria-long-250924-1944',     permanent: true },
      { source: '/signals/23', destination: '/signals/skate-long-250924-2014',    permanent: true },
      { source: '/signals/24', destination: '/signals/aster-long-250926-0014',    permanent: true },
      { source: '/signals/25', destination: '/signals/mira-long-250926-1736',     permanent: true },

      // ========= Trading Signals News Update (bỏ /signals) =========
      { source: '/trading-signals-09-18-2025-latest-crypto-news-update', destination: '/trading-signals-sep18-2025-market-update',   permanent: true },
      { source: '/trading-signals-09-19-2025-latest-crypto-news-update', destination: '/trading-signals-sep19-2025-market-summary',   permanent: true },
      { source: '/trading-signals-09-23-2025-latest-crypto-news-update', destination: '/trading-signals-sep23-2025-crypto-news',      permanent: true },
      { source: '/trading-signals-09-25-2025-latest-crypto-news-update', destination: '/trading-signals-sep25-2025-crypto-market-report', permanent: true },

      // ========= các redirect lẻ =========
      { source: '/sec-coin/altcoin-analysis-31', destination: '/sec-coin/ethereum-altcoin-trends-sep24', permanent: true },
      { source: '/sec-coin/altcoin-analysis-32', destination: '/sec-coin/altcoin-market-pulse-sep25',   permanent: true },
      { source: '/sec-coin/altcoin-analysis-33', destination: '/sec-coin/crypto-highlights-sep26',      permanent: true },
      { source: '/sec-coin/Altcoin%20Analysis',  destination: '/altcoins',                               permanent: true },

      { source: '/insurance/smart-contract-insurance', destination: '/insurance/smart-contract-insurance-how-it-works', permanent: true },

      { source: '/fidelity-crypto/understanding-fidelity-s-new-crypto-trading-platform-for-2025',
        destination: '/fidelity-crypto/fidelity-crypto-platform-2025-features-outlook', permanent: true },

      { source: '/guides/trading-vs-investing-in-crypto-key-differences',
        destination: '/guides/how-to-evaluate-new-altcoins-before-investing', permanent: true },

      { source: '/guides/kraken-vs-kucoin-exchange-fee-features-showdown',
        destination: '/guides/how-to-diversify-your-crypto-portfolio', permanent: true },

      { source: '/insurance/custodial-risk-insurance', destination: '/insurance/custodial-risk-insurance-explained', permanent: true },

      { source: '/news/ecb-hints-policy-tightening-rising-inflation',
        destination: '/ecb-hints-at-policy-tightening-amid-rising-inflation', permanent: true },

      { source: '/news/meta-unveils-new-ar-headset',
        destination: '/meta-unveils-new-ar-headset-targeting-business-users', permanent: true },

      { source: '/trading-signals-2025-09-18-latest-crypto-news-update',
        destination: '/trading-signals-sep18-2025-market-update', permanent: true },

      { source: '/news/figure-ipo-raises-787m',
        destination: '/blockchain-lender-figure-raises-787-5-million-in-landmark-u-s-ipo', permanent: true },

      { source: '/news/gold-prices-climb-as-investors-seek-safety',
        destination: '/gold-prices-climb-as-investors-seek-safety', permanent: true },

      { source: '/news/eurozone-industrial-output-rebounds',
        destination: '/eurozone-industrial-output-rebounds-supported-by-exports', permanent: true },

      { source: '/news/asia-markets-close-mixed',
        destination: '/asia-pacific-markets-close-mixed-ahead-of-u-s-cpi-data', permanent: true },

      { source: '/news/china-reports-slower-export-growth-august',
        destination: '/china-reports-slower-export-growth-in-august', permanent: true },

      { source: '/news/apple-stock-hits-record-high',
        destination: '/apple-hits-record-high-on-ai-chip-hype', permanent: true },

      { source: '/news/oil-prices-hold-78',
        destination: '/oil-prices-hold-steady-at-78-amid-supply-balances', permanent: true },

      { source: '/news/apple-hits-record-market-cap',
        destination: '/apple-stock-hits-record-high-on-ai-integration-success', permanent: true },

      { source: '/economy', destination: '/market', permanent: true },
      { source: '/stocks',  destination: '/market', permanent: true },

      { source: '/news/nasdaq-hits-record-high-tech-rally-continues',
        destination: '/nasdaq-hits-record-high-as-tech-rally-continues', permanent: true },

      { source: '/insurance-for-nfts', destination: '/insurance/insurance-for-nfts', permanent: true },
    ];
  },

  // nén response (giữ nguyên hành vi mặc định, không động vào logic render)
  compress: true,

  // TTL cho ảnh tối ưu của Next Image
  images: {
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 ngày
  },

  // Header cache cho static & ảnh gốc
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' }],
      },
      // KHÔNG đặt header riêng cho '/_next/image' để không ghi đè minimumCacheTTL
    ];
  },
};

module.exports = nextConfig;
