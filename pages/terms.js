import { NextSeo } from "next-seo";

/**
 * Terms – crypto-education focus, no trading-signal language.
 */
export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <NextSeo
        title="Terms & Conditions | FinNews247"
        description="Review the terms and conditions for using FinNews247. Understand your responsibilities and our disclaimer regarding our educational crypto content."
        canonical="https://www.finnews247.com/terms"
        openGraph={{
          title: "Terms & Conditions | FinNews247",
          description:
            "FinNews247 terms of service for accessing our educational coverage of crypto, digital assets and blockchain markets.",
          url: "https://www.finnews247.com/terms",
        }}
        additionalMetaTags={[
          {
            name: "keywords",
            content:
              "terms and conditions, finnews247 terms, crypto education disclaimer, user agreement",
          },
        ]}
      />

      <h1 className="text-3xl font-bold">Terms &amp; Conditions</h1>

      <p>
        These Terms &amp; Conditions (&quot;Terms&quot;) govern your access to
        and use of the FinNews247 website and related content (collectively, the
        &quot;Service&quot;). By accessing or using the Service, you agree to be
        bound by these Terms. If you do not agree with any part of the Terms,
        you should not use the Service.
      </p>

      <h2 className="text-2xl font-semibold mt-4">
        Educational &amp; Informational Purposes Only
      </h2>
      <p>
        All content provided on FinNews247, including news, analysis, reviews,
        guides, opinions and other materials, is for{" "}
        <strong>informational and educational purposes only</strong>. Nothing on
        this site constitutes financial, investment, legal or tax advice. We are
        not a registered investment adviser, broker-dealer, tax advisor or law
        firm.
      </p>
      <p className="mt-2">
        Any decisions you make about buying, selling, holding or using digital
        assets or related services are your sole responsibility. You should
        consult a qualified professional who understands your individual
        circumstances before making any financial decisions. Cryptoassets and
        other digital assets are highly volatile and carry significant risk,
        including the possible loss of principal. Past performance is not
        indicative of future results.
      </p>

      <h2 className="text-2xl font-semibold mt-4">
        No Trading Signals or Personalised Advice
      </h2>
      <p>
        FinNews247 does <strong>not</strong> provide trading signals, price
        targets, personalised portfolio recommendations or any kind of
        one-to-one investment advice. References to market behaviour, scenarios
        or case studies are descriptive and educational in nature only, and
        should not be treated as instructions or endorsements of any particular
        strategy or transaction.
      </p>

      <h2 className="text-2xl font-semibold mt-4">User Responsibilities</h2>
      <p>
        You agree to use the Service only for lawful purposes and in accordance
        with these Terms. Without limiting the generality of the foregoing, you
        agree that you will not:
      </p>
      <ul className="list-disc list-inside ml-4 space-y-1">
        <li>
          Use the Service in any way that violates applicable laws or
          regulations.
        </li>
        <li>
          Post or transmit any content that is unlawful, defamatory, harassing,
          hateful, fraudulent, infringing or otherwise objectionable.
        </li>
        <li>
          Attempt to gain unauthorised access to any portion of the Service, our
          servers or systems.
        </li>
        <li>
          Interfere with or disrupt the security or proper functioning of the
          Service.
        </li>
      </ul>
      <p className="mt-2">
        If the Service offers user accounts, you are responsible for maintaining
        the confidentiality of your login credentials and for all activities
        that occur under your account.
      </p>

      <h2 className="text-2xl font-semibold mt-4">Intellectual Property</h2>
      <p>
        All content on FinNews247, including text, graphics, logos, icons,
        images and compiled data, is the property of FinNews247 or its content
        suppliers and is protected by copyright and other intellectual property
        laws. You may not copy, reproduce, distribute, publicly display or
        create derivative works from our content without our explicit written
        permission, except as allowed by applicable law.
      </p>
      <p className="mt-2">
        You may share links to our articles and quote brief excerpts for
        commentary or news reporting purposes, provided that you include proper
        attribution and a link back to the original page and do not misrepresent
        our content or imply endorsement.
      </p>

      <h2 className="text-2xl font-semibold mt-4">Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, FinNews247 and its owners,
        contributors, employees and affiliates shall not be liable for any loss
        or damages arising from or related to your reliance on information
        contained on this site or your use of the Service. This includes,
        without limitation, any direct, indirect, incidental, special,
        consequential or punitive damages, or any loss of profits, revenues or
        data.
      </p>
      <p className="mt-2">
        Your sole and exclusive remedy for any dissatisfaction with the Service
        is to stop using it.
      </p>

      <h2 className="text-2xl font-semibold mt-4">External Links</h2>
      <p>
        Our Service may contain links to third-party websites or resources. We
        provide these links only as a convenience and are not responsible for
        the content, products, services or policies of those third parties. You
        acknowledge sole responsibility for and assume all risk arising from
        your use of any third-party websites or resources.
      </p>

      <h2 className="text-2xl font-semibold mt-4">
        Modifications and Termination
      </h2>
      <p>
        We reserve the right to modify, suspend or discontinue the Service (in
        whole or in part) at any time, with or without notice. We may also
        revise these Terms periodically. When we do, we will update the
        &quot;Last updated&quot; date associated with this page or provide other
        notice as required by law.
      </p>
      <p className="mt-2">
        Your continued use of the Service after changes are posted constitutes
        acceptance of the revised Terms. If you do not agree to the updated
        Terms, you must stop using the Service.
      </p>

      <h2 className="text-2xl font-semibold mt-4">Governing Law</h2>
      <p>
        These Terms shall be governed by and construed in accordance with the
        laws of the jurisdiction in which FinNews247 operates, without regard to
        its conflict of law principles. The specific choice of law and venue may
        depend on how the business is organised; you should consult with legal
        counsel to confirm the appropriate details for your situation.
      </p>

      <h2 className="text-2xl font-semibold mt-4">Contact</h2>
      <p>
        If you have any questions about these Terms, please contact us at{" "}
        <a
          href="mailto:legal@finnews247.com"
          className="text-sky-600 hover:underline"
        >
          legal@finnews247.com
        </a>
        .
      </p>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        These Terms &amp; Conditions are intended as a general framework and do
        not constitute legal advice. You should consult your own legal counsel
        to ensure that your use of the Service and your publication&apos;s
        policies comply with the laws and regulations applicable to you.
      </p>
    </div>
  );
}
