/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async redirects() {
    return [
      // Normalize legacy 'crypto-tax' -> 'tax'
      { source: '/crypto-tax', destination: '/tax', permanent: true },
      { source: '/crypto-tax/:slug*', destination: '/tax/:slug*', permanent: true },

      // Normalize legacy 'crypto-insurance' -> 'insurance'
      { source: '/crypto-insurance', destination: '/insurance', permanent: true },
      { source: '/crypto-insurance/:slug*', destination: '/insurance/:slug*', permanent: true },
    ];
  },
};

module.exports = nextConfig;
