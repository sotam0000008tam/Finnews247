import { NextSeo } from "next-seo";

/**
 * Privacy Policy – giữ nguyên route /privacy-policy để không phá cấu trúc.
 */
export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <NextSeo
        title="Privacy Policy | FinNews247"
        description="Learn how FinNews247 collects, uses and protects data. Our privacy policy explains cookies, analytics and advertising practices for our crypto education site."
        canonical="https://www.finnews247.com/privacy-policy"
        openGraph={{
          title: "Privacy Policy | FinNews247",
          description:
            "FinNews247 privacy practices for users accessing our crypto education, market analysis and blockchain coverage. Understand how we collect, use and protect your data.",
          url: "https://www.finnews247.com/privacy-policy",
        }}
        additionalMetaTags={[
          {
            name: "keywords",
            content:
              "privacy policy, data collection, cookies, analytics, advertising, crypto website privacy",
          },
        ]}
      />

      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p>
        FinNews247 respects your privacy and is committed to handling your
        information in a responsible, brand-safe way. This policy explains what
        information we collect, how we use it, and the choices you have
        regarding your data. By using our site, you consent to the practices
        described below.
      </p>

      <h2 className="text-2xl font-semibold mt-4">Information We Collect</h2>
      <p>
        We collect information that you voluntarily provide to us, such as your
        email address when you subscribe to our newsletter or contact us by
        email. This may include your name, email address and the content of your
        message.
      </p>
      <p className="mt-2">
        We also collect non-personal data automatically via cookies and similar
        technologies. This may include your IP address, browser type, operating
        system, referring URLs, pages viewed and the dates/times of your visits.
        We use Google Analytics and other analytics tools to help us understand
        how our site is used and to improve your experience.
      </p>

      <h2 className="text-2xl font-semibold mt-4">What We Do Not Collect</h2>
      <p>
        Because FinNews247 focuses on educational coverage of crypto and digital
        assets, we <strong>do not</strong> request or store:
      </p>
      <ul className="list-disc list-inside ml-4 space-y-1">
        <li>Private keys, seed phrases or wallet recovery information.</li>
        <li>Exchange passwords or two-factor authentication codes.</li>
        <li>
          Sensitive financial information such as full payment card numbers
          entered on third-party sites.
        </li>
      </ul>
      <p className="mt-2">
        You should never share your private keys, seed phrases or exchange
        passwords with anyone, including us.
      </p>

      <h2 className="text-2xl font-semibold mt-4">How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul className="list-disc list-inside ml-4 space-y-1">
        <li>
          Provide and maintain our services, including publishing articles,
          guides and newsletters about crypto and digital assets.
        </li>
        <li>Analyse site usage to enhance performance and user experience.</li>
        <li>
          Communicate with you about updates, newsletters or promotional offers
          (where you have opted in).
        </li>
        <li>
          Display relevant advertisements through third-party ad networks (for
          example, Mediavine or similar partners) that may serve contextual or,
          where permitted, interest-based ads.
        </li>
        <li>Prevent fraudulent activity and help ensure the security of our site.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-4">Cookies and Tracking</h2>
      <p>
        Cookies are small files stored on your device that help us remember your
        preferences and understand how you interact with our site. We use both
        session and persistent cookies for purposes such as:
      </p>
      <ul className="list-disc list-inside ml-4 space-y-1">
        <li>Basic site functionality and preferences.</li>
        <li>Analytics and performance measurement.</li>
        <li>
          Advertising and frequency capping through third-party ad partners.
        </li>
      </ul>
      <p className="mt-2">
        You can control cookies through your browser settings; however,
        disabling certain cookies may affect some features of the site.
      </p>

      <h2 className="text-2xl font-semibold mt-4">Third-Party Services</h2>
      <p>
        We use third-party service providers, such as Google Analytics and
        advertising partners, to assist us in analysing traffic and serving ads.
        These partners may collect information about your visits to our site and
        other websites to provide aggregated analytics and, where applicable,
        targeted or interest-based advertisements.
      </p>
      <p className="mt-2">
        We do not sell your personal information to third parties for their own
        independent marketing purposes. Any data shared with service providers
        is used only to deliver services on our behalf and is subject to
        appropriate contractual safeguards where applicable.
      </p>

      <h2 className="text-2xl font-semibold mt-4">Data Security</h2>
      <p>
        We implement reasonable technical and organisational measures to protect
        your information against unauthorised access, alteration or disclosure.
        However, no method of transmission over the internet or electronic
        storage is completely secure, and we cannot guarantee absolute security.
      </p>

      <h2 className="text-2xl font-semibold mt-4">Your Choices</h2>
      <p>
        You can opt out of receiving newsletters or marketing emails by
        following the unsubscribe instructions included in those emails or by
        contacting us directly.
      </p>
      <p className="mt-2">
        You may also disable cookies in your browser settings. For more
        information about Google’s advertising practices and how to opt out of
        certain Google advertising features, visit{" "}
        <a
          href="https://policies.google.com/technologies/ads"
          className="text-sky-600 hover:underline"
        >
          Google Ads Settings
        </a>
        .
      </p>

      <h2 className="text-2xl font-semibold mt-4">Children’s Privacy</h2>
      <p>
        FinNews247 is intended for adults and is not directed to children under
        the age of 16. We do not knowingly collect personal information from
        children. If you believe that a child has provided us with personal
        information, please contact us so that we can delete it.
      </p>

      <h2 className="text-2xl font-semibold mt-4">Contact Us</h2>
      <p>
        If you have any questions about this privacy policy or wish to request
        access to, correction or deletion of your personal data, please contact
        us at{" "}
        <a
          href="mailto:privacy@finnews247.com"
          className="text-sky-600 hover:underline"
        >
          privacy@finnews247.com
        </a>
        .
      </p>
      <p>
        We may update this policy from time to time to reflect changes in our
        practices or legal requirements. The updated version will be posted on
        this page with a new effective date. Your continued use of the site
        after any changes are posted constitutes acceptance of the updated
        policy.
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        This Privacy Policy is provided for general informational purposes and
        does not constitute legal advice. You should consult your own legal
        counsel to ensure compliance with laws applicable to your specific
        circumstances.
      </p>
    </div>
  );
}
