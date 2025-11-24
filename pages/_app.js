// pages/_app.js
import "../styles/globals.css";
import Layout from "../components/Layout";
import { DefaultSeo } from "next-seo";
import SEO from "../next-seo.config.js";
import Script from "next/script";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import AutoAdsRescan from "../components/AutoAdsRescan";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // GA4 page_view for SPA.  We only send GA4 events here; the AutoAdsRescan
  // component has been disabled and does not handle ad injection anymore.
  useEffect(() => {
    const handleRouteChange = (url) => {
      if (window.gtag) {
        window.gtag("config", "G-ZGX7X6B6GY", { page_path: url });
      }
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      {/* GA4 */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-ZGX7X6B6GY"
      />
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZGX7X6B6GY', { page_path: window.location.pathname });
          `,
        }}
      />

      {/* Google Search Console (nếu cần) */}
      <Head>
        <meta
          name="google-site-verification"
          content="Akkp3qaq0RfqlqI75Qw8nhIIiu21X7vMBIkV0yfahj0"
        />
      </Head>

      {/* SEO mặc định */}
      <DefaultSeo {...SEO} />

      {/* Placeholder for dynamic ad re‑scanning (currently disabled) */}
      <AutoAdsRescan />

      {/* Layout chung */}
      <Layout title="FinNews">
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
