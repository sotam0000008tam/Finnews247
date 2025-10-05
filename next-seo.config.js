/** next-seo default configuration */
const siteUrl = 'https://www.finnews247.com';

export default {
  titleTemplate: '%s | FinNews247',
  defaultTitle: 'FinNews247',
  description: 'Crypto news, analysis, and trading signals.',
  canonical: siteUrl,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    site_name: 'FinNews247',
  },
  twitter: {
    cardType: 'summary_large_image',
  },
};
