// pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="vi">
      <Head>
        {/* ✅ Google AdSense mới */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5515217135736755"
          crossOrigin="anonymous"
        ></script>

        <meta
          name="google-adsense-account"
          content="ca-pub-5515217135736755"
        />

        {/* Các thẻ meta/SEO khác nếu bạn có */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
