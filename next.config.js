/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // 25 redirect từ link cũ /signals/:id -> link mới /signals/:slug

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
    ];
  },
};

module.exports = nextConfig;
