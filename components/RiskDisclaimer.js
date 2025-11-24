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
      All information provided on FinNews247, including trading signals,
      analyses and reviews, is for informational and educational purposes
      only and does not constitute financial advice. Investing in
      cryptocurrencies or other financial instruments involves significant
      risk, including the potential loss of your entire investment. Always
      conduct your own research or consult with a qualified financial
      professional before making any investment decisions.
    </div>
  );
}