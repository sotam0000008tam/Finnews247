// pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="vi">
      <Head>
        {/* Viewport + hiển thị */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="robots" content="max-image-preview:large" />

        {/* Coinzilla verification (an toàn, có thể giữ) */}
        <meta
          name="coinzilla"
          content="03663c7dfaaa9339ce67204520a48640"
        />

        {/* Monumetric head code */}
        <script
          type="text/javascript"
          src="//monu.delivery/site/e/4/7835ef-697c-4270-b513-1b2b6975d566.js"
          data-cfasync="false"
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
