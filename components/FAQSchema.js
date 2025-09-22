// components/FAQSchema.js
import Head from "next/head";

export default function FAQSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How to start crypto trading safely?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "To start trading crypto safely, choose a regulated exchange, enable 2FA, never invest more than you can afford to lose, and start with small positions."
        }
      },
      {
        "@type": "Question",
        "name": "What is the safest crypto wallet?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "The safest wallets are hardware wallets like Ledger Nano X or Trezor Model T. For daily use, MetaMask is popular but should not be used for large holdings."
        }
      },
      {
        "@type": "Question",
        "name": "Which exchanges have the lowest fees?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Binance and Kraken are known for competitive fees. Coinbase is beginner-friendly but has higher transaction costs."
        }
      },
      {
        "@type": "Question",
        "name": "What is crypto staking and how does it work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Staking involves locking your crypto in a network to support its security and operations, in return for earning rewards (similar to interest)."
        }
      },
      {
        "@type": "Question",
        "name": "Are crypto signals reliable?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Crypto signals can provide insights, but they are not always accurate. Use them as guidance and combine with your own research before trading."
        }
      }
    ]
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
}
