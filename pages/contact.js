import { NextSeo } from "next-seo";

/**
 * Contact page – brand-safe, crypto educational focus
 */
export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <NextSeo
        title="Contact FinNews247 | Crypto Education & Editorial Inquiries"
        description="Get in touch with FinNews247 for questions about our crypto education content, market analysis, partnerships or editorial inquiries."
        canonical="https://www.finnews247.com/contact"
        openGraph={{
          title: "Contact FinNews247 | Crypto Education & Editorial Inquiries",
          description:
            "Reach the FinNews247 team for support, partnerships or editorial inquiries related to our educational coverage of crypto, digital assets and blockchain markets.",
          url: "https://www.finnews247.com/contact",
        }}
        additionalMetaTags={[
          {
            name: "keywords",
            content:
              "contact finnews247, crypto education support, advertising inquiries, editorial inquiries, digital asset research",
          },
        ]}
      />

      <h1 className="text-3xl font-bold">Contact Us</h1>

      <p>
        We value feedback from our readers and partners. Whether you have
        questions about our{" "}
        <strong>crypto education and market analysis</strong>, want to explore
        brand-safe advertising opportunities, or have suggestions for new
        coverage, please reach out using the appropriate channel below.
        Please note that we cannot provide personalised investment or trading
        advice.
      </p>

      <h2 className="text-2xl font-semibold mt-4">General Support</h2>
      <p>
        For questions about navigating the site, accessing articles and guides,
        newsletter issues, or reporting technical problems, email our support
        team at{" "}
        <a
          href="mailto:support@finnews247.com"
          className="text-sky-600 hover:underline"
        >
          support@finnews247.com
        </a>
        . We typically respond within 24–48 hours.
      </p>

      <h2 className="text-2xl font-semibold mt-4">Advertising & Partnerships</h2>
      <p>
        Interested in advertising on FinNews247 or forming a content or research
        partnership? Contact our business development team at{" "}
        <a
          href="mailto:ads@finnews247.com"
          className="text-sky-600 hover:underline"
        >
          ads@finnews247.com
        </a>
        . Please include information about your organization, audience, and
        marketing goals so we can determine whether there is a good, brand-safe
        fit with our educational crypto coverage.
      </p>

      <h2 className="text-2xl font-semibold mt-4">Editorial Inquiries</h2>
      <p>
        If you have a news tip, press release, or would like to pitch an
        article, contact our editorial team at{" "}
        <a
          href="mailto:editor@finnews247.com"
          className="text-sky-600 hover:underline"
        >
          editor@finnews247.com
        </a>
        . We welcome well‑researched, neutral pieces on topics such as crypto
        market structure, regulation, institutional adoption, blockchain
        infrastructure, security and risk management. We do not publish
        trading signals, price targets, or promotional content disguised as
        analysis.
      </p>

      <h2 className="text-2xl font-semibold mt-4">Response Times</h2>
      <p>
        Our team endeavours to reply to all inquiries promptly. Response times
        may vary depending on the volume of messages we receive, but we aim to
        address most emails within two business days. For urgent operational or
        security matters, please use “URGENT” in your email subject line.
      </p>

      <h2 className="text-2xl font-semibold mt-4">Important Note</h2>
      <p>
        For your safety, please do not send us private keys, seed phrases,
        exchange passwords, or any other sensitive security information. We
        will never ask for this information, and you should never share it with
        anyone.
      </p>
    </div>
  );
}
