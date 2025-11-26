// work/pages/disclosure.js
// Affiliate & Editorial Disclosure page for FinNews247.
// Clearly explains how affiliate links and sponsored content work,
// and states our crypto-only niche and brand-safe editorial policy.

import { NextSeo } from "next-seo";

export default function DisclosurePage() {
  return (
    <div className="container mx-auto px-4 py-6 container-1600">
      <NextSeo
        title="Affiliate & Editorial Disclosure | FinNews247"
        description="Learn how FinNews247 uses affiliate links, how we handle sponsored content, and how our crypto coverage stays independent and brand-safe."
        canonical="https://www.finnews247.com/disclosure"
        openGraph={{
          title: "Affiliate & Editorial Disclosure | FinNews247",
          description:
            "FinNews247 discloses how it may earn commissions through affiliate links or sponsorships and outlines its independent, brand-safe editorial standards.",
          url: "https://www.finnews247.com/disclosure",
        }}
      />

      <h1 className="text-3xl font-bold mb-4">Affiliate &amp; Editorial Disclosure</h1>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        At <strong>FinNews247</strong>, we are committed to providing{" "}
        <strong>high-quality, educational coverage</strong> of cryptocurrencies,
        blockchain technology and related financial infrastructure. To help
        support the costs of running this website, some of the links to products
        and services on our site are <strong>affiliate links</strong>. This means
        we may receive a commission, at no additional cost to you, if you choose
        to click through and make a purchase or sign up for a service.
      </p>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Our editorial opinions, analyses and reviews are{" "}
        <strong>always our own</strong> and are based on our research and
        experience. We only partner with companies that we believe are relevant
        to our readers and that operate within appropriate legal and compliance
        frameworks. Any compensation received <strong>does not</strong> influence
        whether we cover a topic, how we evaluate a product, or the conclusions
        we share. Sponsored content, when present, is{" "}
        <strong>clearly labeled</strong> as such.
      </p>

      <h2 className="text-2xl font-semibold mb-2">
        Our Crypto Niche &amp; Brand-Safe Focus
      </h2>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        FinNews247 is a <strong>crypto-focused publication</strong>. Our articles
        cover digital assets, blockchain infrastructure, regulation, tax and
        compliance, security, and long-term market trends. At the same time, we
        are committed to maintaining a <strong>brand-safe environment</strong>{" "}
        for readers, partners and advertisers. As part of that commitment:
      </p>
      <ul className="mb-4 list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
        <li>
          We do <strong>not</strong> sell or distribute “trading signals”, price
          targets, or guaranteed-profit strategies.
        </li>
        <li>
          We avoid sensational language that encourages reckless speculation or
          excessive risk-taking.
        </li>
        <li>
          We consistently highlight <strong>risks, volatility and regulatory
          uncertainty</strong> when discussing crypto-related products or
          services.
        </li>
        <li>
          We decline partnerships that require us to publish undisclosed
          promotional content or to make investment promises.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mb-2">How We Work With Affiliates</h2>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        When we include affiliate links (for example, to exchanges, wallets or
        other crypto-related services), those links are added{" "}
        <strong>after</strong> our editorial team has produced and reviewed the
        content. Our writers are not compensated based on the performance of any
        specific affiliate partner. Affiliate relationships may influence{" "}
        <em>where</em> or <em>how</em> a product appears on the page, but they do
        not change our requirement for accuracy, risk disclosure and fair
        presentation.
      </p>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Using affiliate links helps us keep FinNews247 free to access and allows
        us to continue producing the educational content you rely on. You are
        never obligated to use these links, and we encourage you to compare
        multiple sources before choosing any provider.
      </p>

      <h2 className="text-2xl font-semibold mb-2">Questions &amp; Feedback</h2>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        We welcome questions about our affiliate relationships, sponsored
        content or editorial standards. If you would like more detail on how we
        make money or how we manage potential conflicts of interest, please
        contact us at{" "}
        <a
          href="mailto:editor@finnews247.com"
          className="text-sky-600 hover:underline"
        >
          editor@finnews247.com
        </a>
        .
      </p>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Thank you for supporting FinNews247 and for taking the time to
        understand how we operate. Your trust is central to our work, and we
        are committed to earning it on every page you read.
      </p>
    </div>
  );
}
