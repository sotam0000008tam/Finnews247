import { NextSeo } from "next-seo";

/**
 * Terms & Conditions page outlines the legal agreement between FinNews247
 * and its users. It clarifies that content is for informational purposes
 * only, describes user responsibilities, liability limitations and
 * intellectual property rights. This page is important for compliance
 * with advertising networks and to set expectations for readers.
 */
export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <NextSeo
        title="Terms & Conditions | FinNews247"
        description="Review the terms and conditions for using FinNews247. Understand your responsibilities and our disclaimer regarding crypto trading signals and content."
        openGraph={{
          title: "Terms & Conditions | FinNews247",
          description:
            "FinNews247 terms of service for accessing crypto trading signals, market insights and educational content.",
          url: "https://finnews247.com/terms",
        }}
        additionalMetaTags={[
          {
            name: "keywords",
            content: "terms and conditions, finnews247 terms, crypto trading signals disclaimer, user agreement",
          },
        ]}
      />
      <h1 className="text-3xl font-bold">Terms &amp; Conditions</h1>
      <p>
        These Terms &amp; Conditions ("Terms") govern your access to and
        use of the FinNews247 website and services (collectively, the
        "Service"). By accessing or using the Service, you agree to be
        bound by these Terms. If you do not agree with any part of the
        Terms, you should not use the Service.
      </p>
      <h2 className="text-2xl font-semibold mt-4">Informational Purposes Only</h2>
      <p>
        All content provided on FinNews247, including trading signals,
        analyses, reviews and opinions, is for informational and
        educational purposes only. Nothing on this site constitutes
        financial, investment or legal advice. We are not a registered
        investment advisor or broker. You should consult a qualified
        professional before making any financial decisions. Trading
        cryptocurrencies and other assets carries significant risk, and
        past performance is not indicative of future results.
      </p>
      <h2 className="text-2xl font-semibold mt-4">User Responsibilities</h2>
      <p>
        You agree to use the Service only for lawful purposes and in
        accordance with these Terms. You are responsible for any content
        you post or submit to the site and must ensure that it does not
        infringe the rights of others or violate any laws. You are also
        responsible for maintaining the confidentiality of any account
        credentials and for all activities that occur under your account.
      </p>
      <h2 className="text-2xl font-semibold mt-4">Intellectual Property</h2>
      <p>
        All content on FinNews247, including text, graphics, logos and
        compiled data, is the property of FinNews247 or its content
        suppliers and is protected by copyright laws. You may not copy,
        reproduce, distribute or create derivative works from our
        content without our explicit written permission. You may,
        however, share links to our articles provided you do not imply
        endorsement or modify the content in any way.
      </p>
      <h2 className="text-2xl font-semibold mt-4">Limitation of Liability</h2>
      <p>
        FinNews247 and its contributors shall not be liable for any loss
        or damages arising from your reliance on information contained on
        this site or your use of the Service. This includes, without
        limitation, any direct, indirect, incidental, punitive or
        consequential damages. Your sole and exclusive remedy for any
        dissatisfaction with the Service is to stop using it.
      </p>
      <h2 className="text-2xl font-semibold mt-4">External Links</h2>
      <p>
        Our Service may contain links to third‑party websites or
        resources. We provide these links only as a convenience and are
        not responsible for the content, products or services available
        from those sites. You acknowledge sole responsibility for and
        assume all risk arising from your use of any third‑party
        resources.
      </p>
      <h2 className="text-2xl font-semibold mt-4">Modifications and Termination</h2>
      <p>
        We reserve the right to modify or discontinue the Service or
        revise these Terms at any time. We will endeavour to provide
        notice of significant changes by updating the effective date of
        the Terms. Your continued use of the Service after changes are
        posted constitutes acceptance of the revised Terms.
      </p>
      <h2 className="text-2xl font-semibold mt-4">Governing Law</h2>
      <p>
        These Terms shall be governed by and construed in accordance
        with the laws of the jurisdiction in which FinNews247 operates,
        without regard to its conflict of law principles.
      </p>
      <h2 className="text-2xl font-semibold mt-4">Contact</h2>
      <p>
        If you have any questions about these Terms, please contact us at
        <a href="mailto:legal@finnews247.com" className="text-sky-600 hover:underline">legal@finnews247.com</a>.
      </p>
    </div>
  );
}