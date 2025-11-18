// pages/fidelity-crypto/[slug].js
// Legacy: /fidelity-crypto/[slug] → 301 về /crypto-exchanges/[slug]

export async function getServerSideProps({ params }) {
  const raw = params?.slug;
  const slug = Array.isArray(raw) ? raw.join("/") : raw;

  return {
    redirect: {
      destination: `/crypto-exchanges/${slug}`,
      permanent: true,
    },
  };
}

export default function FidelityCryptoLegacyRedirect() {
  return null;
}
