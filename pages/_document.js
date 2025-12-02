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

        {/* Site verifications */}
        <meta
          name="ezoic-site-verification"
          content="X6ThJDF0csGSQJYlS2FqZcnD7hBSzm"
        />
        <meta
          name="coinzilla"
          content="03663c7dfaaa9339ce67204520a48640"
        />

        {/* Ezoic Privacy Scripts */}
        <script
          src="https://cmp.gatekeeperconsent.com/min.js"
          data-cfasync="false"
        />
        <script
          src="https://the.gatekeeperconsent.com/cmp.min.js"
          data-cfasync="false"
        />

        {/* Ezoic Header Script */}
        <script async src="//www.ezojs.com/ezoic/sa.min.js" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.ezstandalone = window.ezstandalone || {};
              ezstandalone.cmd = ezstandalone.cmd || [];
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
