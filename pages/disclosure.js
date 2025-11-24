// work/pages/disclosure.js
// Affiliate Disclosure page for FinNews247. This page is recommended
// by Mediavine to clearly inform readers about the use of affiliate
// links and sponsored content. It explains how FinNews247 may be
// compensated when users sign up through certain links, and assures
// readers that editorial integrity is maintained.

import { NextSeo } from "next-seo";

export default function DisclosurePage() {
  return (
    <div className="container mx-auto px-4 py-6 container-1600">
      <NextSeo
        title="Affiliate Disclosure | FinNews247"
        description="Learn about how FinNews247 may earn commissions through affiliate links and sponsored content."
        canonical="https://www.finnews247.com/disclosure"
        openGraph={{
          title: "Affiliate Disclosure | FinNews247",
          description:
            "Learn about how FinNews247 may earn commissions through affiliate links and sponsored content.",
          url: "https://www.finnews247.com/disclosure",
        }}
      />
      <h1 className="text-3xl font-bold mb-4">Affiliate Disclosure</h1>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        At FinNews247, we are committed to providing high-quality, unbiased
        content about financial markets, cryptocurrencies and related
        products. To help support the costs of running this website,
        some of the links to products and services on our site are
        affiliate links. This means we may receive a commission at no
        additional cost to you if you choose to click through and make a
        purchase or sign up.
      </p>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Our editorial opinions, analyses and reviews are always our own and
        are based on our research and experience. We only partner with
        companies that we believe provide value to our readers, and any
        compensation received does not influence our recommendations or
        rankings. Using affiliate links helps us keep FinNews247 free and
        allows us to continue producing the content you trust.
      </p>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        We appreciate your support and encourage you to reach out if you have
        any questions about our affiliate relationships or a product or
        service mentioned on this site.
      </p>
    </div>
  );
}