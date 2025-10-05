/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async redirects() {
    return [
      // ---- Privacy canonicalization ----
      { source: '/privacy-policy', destination: '/privacy', permanent: true },
      { source: '/privacy-policy/:path*', destination: '/privacy', permanent: true },

      // ---- Legacy branches kept for safety (won't hurt if not present) ----
      { source: '/crypto-tax', destination: '/tax', permanent: true },
      { source: '/crypto-tax/:slug*', destination: '/tax/:slug*', permanent: true },
      { source: '/crypto-insurance', destination: '/insurance', permanent: true },
      { source: '/crypto-insurance/:slug*', destination: '/insurance/:slug*', permanent: true },
      { source: '/exchanges', destination: '/crypto-exchanges', permanent: true },
      { source: '/exchanges/:slug*', destination: '/crypto-exchanges/:slug*', permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: '/admin/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }],
      },
    ];
  },
};

module.exports = nextConfig;
