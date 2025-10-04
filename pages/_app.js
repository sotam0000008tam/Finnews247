// pages/_app.js
import "../styles/globals.css";
import Layout from "../components/Layout";
import { DefaultSeo } from "next-seo";
import SEO from "../next-seo.config";
import Script from "next/script";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // ✅ Route change tracking cho GA4
  useEffect(() => {
    const handleRouteChange = (url) => {
      if (window.gtag) {
        window.gtag("config", "G-ZGX7X6B6GY", {
          page_path: url,
        });
      }
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      {/* Google Analytics 4 */}
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
            gtag('config', 'G-ZGX7X6B6GY', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />

      {/* ✅ Google Search Console verification */}
      <Head>
        <meta
          name="google-site-verification"
          content="Akkp3qaq0RfqlqI75Qw8nhIIiu21X7vMBIkV0yfahj0"
        />
        {/*
          We intentionally do not set a global canonical URL here.  Each page
          defines its own canonical tag via the NextSeo component.  Adding
          a canonical link globally causes duplicate <link rel="canonical">
          tags which confuse search engines.  See individual pages for
          canonical definitions.
        */}
      </Head>

      {/* SEO mặc định toàn site */}
      <DefaultSeo {...SEO} />

      {/* Layout gốc */}
      <Layout title="FinNews">
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
