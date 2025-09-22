// pages/tax/reporting-crypto-staking-rewards.js
// Temporary redirect to the full slug for staking rewards article
export async function getServerSideProps() {
  return {
    redirect: {
      destination:
        "/tax/reporting-crypto-staking-rewards-and-yield-farming-income",
      permanent: true,
    },
  };
}

export default function RedirectPage() {
  return null;
}