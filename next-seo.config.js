// next-seo.config.js
const siteUrl = 'https://www.finnews247.com';

export default {
  titleTemplate: '%s | FinNews247',
  defaultTitle: 'FinNews247',
  description: 'Crypto market news, altcoin analysis, exchange and wallet reviews, and guides for investors and traders.',
  canonical: siteUrl,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    site_name: 'FinNews247',
    // images: [{ url: `${siteUrl}/logo.png`, width: 1200, height: 630 }],
  },
  twitter: {
    cardType: 'summary_large_image',
  },
};
