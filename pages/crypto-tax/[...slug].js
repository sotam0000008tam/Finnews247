export async function getServerSideProps({ params }) {
  const tail = Array.isArray(params?.slug) ? params.slug.join('/') : '';
  return {
    redirect: { destination: tail ? `/tax/${tail}` : '/tax', permanent: true },
  };
}
export default function CryptoTaxRedirect() { return null; }
