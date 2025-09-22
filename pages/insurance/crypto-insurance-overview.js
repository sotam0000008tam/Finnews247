// pages/insurance/crypto-insurance-overview.js
// Redirects the outdated path to the article "What Is Crypto Insurance?"
export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/insurance/what-is-crypto-insurance",
      permanent: true,
    },
  };
}

export default function RedirectPage() {
  return null;
}