import { NextSeo } from "next-seo";

/**
 * Contact page – giữ đúng cấu trúc gốc, đã có canonical www.
 */
export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <NextSeo
        title="Contact FinNews247 | Crypto Trading Signals Support"
        description="Get in touch with FinNews247 for questions about crypto trading signals, advertising partnerships or editorial inquiries."
        canonical="https://www.finnews247.com/contact"
        openGraph={{
          title: "Contact FinNews247 | Crypto Trading Signals Support",
          description:
            "Reach the FinNews247 team for support, partnerships or editorial inquiries related to crypto trading signals and market news.",
          url: "https://www.finnews247.com/contact",
        }}
        additionalMetaTags={[
          {
            name: "keywords",
            content: "contact finnews247, crypto trading signals support, advertising inquiries, editorial",
          },
        ]}
      />
      <h1 className="text-3xl font-bold">Contact Us</h1>
      <p>
        We value feedback from our readers and partners. Whether you have
        questions about our <strong>crypto trading signals</strong>, want to
        explore advertising opportunities or have suggestions for new
        coverage, please reach out using the appropriate channel below.
      </p>
      <h2 className="text-2xl font-semibold mt-4">General Support</h2>
      <p>
        For questions about navigating the site, accessing signals or
        reporting technical issues, email our support team at{" "}
        <a href="mailto:support@finnews247.com" className="text-sky-600 hover:underline">
          support@finnews247.com
        </a>. We typically respond within 24–48 hours.
      </p>
      <h2 className="text-2xl font-semibold mt-4">Advertising & Partnerships</h2>
      <p>
        Interested in advertising on FinNews247 or forming a content
        partnership? Contact our business development team at{" "}
        <a href="mailto:ads@finnews247.com" className="text-sky-600 hover:underline">
          ads@finnews247.com
        </a>. Please include information about your project and marketing
        goals so we can tailor a proposal.
      </p>
      <h2 className="text-2xl font-semibold mt-4">Editorial Inquiries</h2>
      <p>
        If you have a tip, press release or would like to contribute a guest
        post, contact our editorial team at{" "}
        <a href="mailto:editor@finnews247.com" className="text-sky-600 hover:underline">
          editor@finnews247.com
        </a>. We welcome well‑researched articles on trading strategies,
        market analysis and blockchain technology.
      </p>
      <h2 className="text-2xl font-semibold mt-4">Response Times</h2>
      <p>
        Our team endeavours to reply to all inquiries promptly. Response
        times may vary depending on the volume of messages we receive, but
        we aim to address most emails within two business days. For urgent
        matters, please use “urgent” in your email subject line.
      </p>
    </div>
  );
}
