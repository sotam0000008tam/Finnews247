// pages/sec-coin/[slug].js
// Legacy: /sec-coin/[slug] → 301 về /altcoins/[slug]

export async function getServerSideProps({ params }) {
  const raw = params?.slug;
  const slug = Array.isArray(raw) ? raw.join("/") : raw;

  return {
    redirect: {
      destination: `/altcoins/${slug}`,
      permanent: true,
    },
  };
}

export default function SecCoinLegacyRedirect() {
  return null;
}
