import { NextSeo } from "next-seo";

/**
 * Privacy Policy – giữ nguyên route /privacy-policy để không phá cấu trúc.
 */
export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <NextSeo
        title="Privacy Policy | FinNews247"
        description="Learn how FinNews247 collects and uses your data. Our privacy policy explains cookies, analytics and advertising practices to keep your information safe."
        canonical="https://www.finnews247.com/privacy-policy"
        openGraph={{
          title: "Privacy Policy | FinNews247",
          description:
            "FinNews247 privacy practices for users accessing crypto trading signals and market coverage. Understand how we collect, use and protect your data.",
          url: "https://www.finnews247.com/privacy-policy",
        }}
        additionalMetaTags={[
          {
            name: "keywords",
            content: "privacy policy, data collection, cookies, analytics, advertising",
          },
        ]}
      />
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p>
        FinNews247 respects your privacy and is committed to protecting your
        personal information. This policy explains what information we
        collect, how we use it and the choices you have regarding your data.
        By using our site, you consent to the practices described below.
      </p>
      <h2 className="text-2xl font-semibold mt-4">Information We Collect</h2>
      <p>
        We collect information that you voluntarily provide to us, such as
        your email address when you subscribe to our newsletter. We also
        collect non‑personal data automatically via cookies and similar
        technologies. This may include your IP address, browser type,
        operating system, referring URLs, pages viewed and the dates/times
        of your visits. We use Google Analytics and other analytics tools
        to help us understand how our site is used and to improve your
        experience.
      </p>
      <h2 className="text-2xl font-semibold mt-4">How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul className="list-disc list-inside ml-4 space-y-1">
        <li>Provide and personalise our services, including delivering trading signals and content.</li>
        <li>Analyse site usage to enhance performance and user experience.</li>
        <li>Communicate with you about updates, newsletters or promotional offers (with your consent).</li>
        <li>
          Display relevant advertisements through third‑party ad networks (for example,
          Mediavine) that may serve personalised or contextually relevant ads.
        </li>
        <li>Prevent fraudulent activity and ensure the security of our platform.</li>
      </ul>
      <h2 className="text-2xl font-semibold mt-4">Cookies and Tracking</h2>
      <p>
        Cookies are small files stored on your device that help us remember
        your preferences and understand how you interact with our site. We
        use both session and persistent cookies for authentication, analytics
        and advertising purposes. You can control cookies through your
        browser settings; however, disabling cookies may affect certain
        features of the site.
      </p>
      <h2 className="text-2xl font-semibold mt-4">Third‑Party Services</h2>
      <p>
        We use third‑party service providers, such as Google Analytics and
        advertising partners, to assist us in analysing traffic and serving
        ads. These partners may collect information about your visits to our
        site and other websites to provide targeted advertisements. We do
        not sell or share your personal information with third parties for
        their own marketing purposes.
      </p>
      <h2 className="text-2xl font-semibold mt-4">Data Security</h2>
      <p>
        We implement reasonable security measures to protect your
        information against unauthorised access, alteration or disclosure.
        However, please be aware that no method of transmission over the
        Internet or electronic storage is completely secure.
      </p>
      <h2 className="text-2xl font-semibold mt-4">Your Choices</h2>
      <p>
        You can opt out of receiving newsletters or marketing emails by
        following the unsubscribe instructions included in those emails. You
        may also disable cookies in your browser settings. For more
        information about Google’s advertising practices and how to opt out,
        visit{" "}
        <a href="https://policies.google.com/technologies/ads" className="text-sky-600 hover:underline">
          Google Ads Settings
        </a>.
      </p>
      <h2 className="text-2xl font-semibold mt-4">Contact Us</h2>
      <p>
        If you have any questions about this privacy policy or wish to
        request access to, correction or deletion of your personal data,
        please contact us at{" "}
        <a href="mailto:privacy@finnews247.com" className="text-sky-600 hover:underline">
          privacy@finnews247.com
        </a>.
      </p>
      <p>
        We may update this policy from time to time to reflect changes in
        our practices or legal requirements. The updated version will be
        posted on this page with a new effective date.
      </p>
    </div>
  );
}
