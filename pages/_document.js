// pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="vi">
      <Head>
        {/* Viewport + tối ưu hiển thị */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="robots" content="max-image-preview:large" />

        {/* Preconnect giúp tải AdSense nhanh hơn (không bắt buộc) */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" crossOrigin="" />
        <link rel="preconnect" href="https://tpc.googlesyndication.com" crossOrigin="" />

        {/* AdSense Auto Ads — chỉ chèn 1 lần trong toàn site */}
        <meta name="google-adsense-account" content="ca-pub-5515217135736755" />

        {/* Có thể thêm các meta khác tại đây nếu cần */}
      <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
<link rel="preconnect" href="https://googleads.g.doubleclick.net" crossOrigin="anonymous" />
<meta name="google-adsense-account" content="ca-pub-5515217135736755" />
<link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
<link rel="preconnect" href="https://googleads.g.doubleclick.net" crossOrigin="anonymous" />
<meta name="google-adsense-account" content="ca-pub-5515217135736755" />
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5515217135736755" crossOrigin="anonymous"></script>
</Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
