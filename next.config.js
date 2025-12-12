/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: false,

  async redirects() {
    return [
      // ---- Monumetric hosted ads.txt ----
      {
        source: '/ads.txt',
        destination:
          'https://monu.delivery/adstxt/e/4/7835ef-697c-4270-b513-1b2b6975d566.txt',
        permanent: true,
      },

      // ---- Hợp nhất sitemap cũ → sitemap mới ----
      { source: '/sitemap-:n.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap-index.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/sitemap.xml.gz', destination: '/sitemap.xml', permanent: true },

      // (các redirect khác giữ nguyên)
      { source: '/fidelity-crypto', destination: '/crypto-exchanges', permanent: true },
      { source: '/fidelity-crypto/:slug*', destination: '/crypto-exchanges/:slug*', permanent: true },
      { source: '/privacy-policy', destination: '/privacy', permanent: true },
      { source: '/exchanges', destination: '/crypto-exchanges', permanent: true },
      { source: '/exchanges/:slug*', destination: '/crypto-exchanges/:slug*', permanent: true },
      { source: '/fidelity', destination: '/crypto-exchanges', permanent: true },
      { source: '/fidelity/:slug*', destination: '/crypto-exchanges/:slug*', permanent: true },
      { source: '/tax', destination: '/insurance', permanent: true },
      { source: '/tax/:slug*', destination: '/insurance/:slug*', permanent: true },
      { source: '/crypto-tax', destination: '/insurance', permanent: true },
      { source: '/crypto-tax/:slug*', destination: '/insurance/:slug*', permanent: true },
      { source: '/crypto-insurance/:slug*', destination: '/insurance/:slug*', permanent: true },
      { source: '/news/:slug*', destination: '/crypto-market/:slug*', permanent: true },
      { source: '/news', destination: '/crypto-market', permanent: true },
      { source: '/market', destination: '/crypto-market', permanent: true },
      { source: '/market/:slug*', destination: '/crypto-market/:slug*', permanent: true },
      { source: '/wallets/:slug*', destination: '/best-crypto-apps/:slug*', permanent: true },
      { source: '/reviews/:slug*', destination: '/guides/:slug*', permanent: true },
      { source: '/sec-coin', destination: '/altcoins', permanent: true },
      { source: '/sec-coin/:slug*', destination: '/altcoins/:slug*', permanent: true },
      { source: '/seccoin', destination: '/altcoins', permanent: true },
      { source: '/seccoin/:slug*', destination: '/altcoins/:slug*', permanent: true },
      { source: '/economy', destination: '/crypto-market', permanent: true },
      { source: '/economy/:slug*', destination: '/crypto-market/:slug*', permanent: true },
      { source: '/stocks', destination: '/crypto-market', permanent: true },
      { source: '/stocks/:slug*', destination: '/crypto-market/:slug*', permanent: true },
      { source: '/crypto', destination: '/crypto-market', permanent: true },
      { source: '/crypto/:slug*', destination: '/crypto-market/:slug*', permanent: true },
    ];
  },

  compress: true,

  images: {
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  async headers() {
    return [
      {
        source: '/sitemap.xml',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, s-maxage=600' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
