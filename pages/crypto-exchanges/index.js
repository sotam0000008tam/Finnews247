import { NextSeo } from 'next-seo';
export default function CryptoExchangesIndex(){
  return (
    <>
      <NextSeo
        title="Crypto Exchanges | FinNews247"
        description="Compare crypto exchanges: fees, security, liquidity, and features."
        canonical="https://www.finnews247.com/crypto-exchanges"
        openGraph={{
          title: "Crypto Exchanges | FinNews247",
          description: "Compare crypto exchanges: fees, security, liquidity, and features.",
          url: "https://www.finnews247.com/crypto-exchanges",
        }}
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Crypto Exchanges</h1>
        <p className="text-gray-700">This is the canonical exchanges hub at /crypto-exchanges.</p>
      </div>
    </>
  );
}
