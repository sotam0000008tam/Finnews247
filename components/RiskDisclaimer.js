// work/components/RiskDisclaimer.js
// A reusable component to display a risk disclaimer on content and signal pages.
// This component is designed for Mediavine compliance: it reminds readers
// that FinNews247 does not provide financial advice and that investing in
// cryptocurrencies carries significant risk. The styling uses a subtle
// yellow background to draw attention without being intrusive. You can
// include this component wherever a disclaimer is needed.

export default function RiskDisclaimer() {
  return (
    <div className="p-4 my-4 rounded border border-yellow-200 bg-yellow-50 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-200 text-sm">
      <span className="font-bold">⚠ Risk Disclaimer:</span>{" "}
      All information provided on FinNews247, including market analysis, data, opinions and reviews, is for informational and educational purposes only and should not be considered financial, investment, legal or tax advice. The crypto and financial markets are highly volatile and you can lose some or all of your capital. Nothing on this site constitutes a recommendation to buy, sell or hold any asset, or to follow any particular strategy. Always conduct your own research and, where appropriate, consult a qualified professional before making investment decisions. FinNews247 and its contributors are not responsible for any losses or actions taken based on the information provided on this website.
    </div>
  );
}