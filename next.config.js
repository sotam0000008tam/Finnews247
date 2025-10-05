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
    ];
  },
};

module.exports = nextConfig;
