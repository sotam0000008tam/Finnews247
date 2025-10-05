/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async redirects() {
    return [
      // --- Canonicalize legacy branches ---
      // crypto-tax -> tax
      { source: '/crypto-tax', destination: '/tax', permanent: true },
      { source: '/crypto-tax/:slug*', destination: '/tax/:slug*', permanent: true },

      // crypto-insurance -> insurance
      { source: '/crypto-insurance', destination: '/insurance', permanent: true },
      { source: '/crypto-insurance/:slug*', destination: '/insurance/:slug*', permanent: true },

      // exchanges -> crypto-exchanges
      { source: '/exchanges', destination: '/crypto-exchanges', permanent: true },
      { source: '/exchanges/:slug*', destination: '/crypto-exchanges/:slug*', permanent: true },

      // privacy-policy -> privacy
      { source: '/privacy-policy', destination: '/privacy', permanent: true },
      { source: '/privacy-policy/:slug*', destination: '/privacy', permanent: true },
    ];
  },
};

module.exports = nextConfig;
