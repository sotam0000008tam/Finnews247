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

        {/* 
          Đặt thêm các thẻ <meta> hoặc <link> dùng chung cho toàn site tại đây.
        
        */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
