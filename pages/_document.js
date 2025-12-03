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

        {/* Site verifications khác (Coinzilla, v.v.) */}
        <meta
          name="coinzilla"
          content="03663c7dfaaa9339ce67204520a48640"
        />
        {/* Nếu sau này Monumetric / GAM có yêu cầu meta riêng thì thêm ở đây */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
