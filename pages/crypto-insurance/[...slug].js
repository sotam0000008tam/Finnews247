export async function getServerSideProps({ params }) {
  const tail = Array.isArray(params?.slug) ? params.slug.join('/') : '';
  return {
    redirect: { destination: tail ? `/insurance/${tail}` : '/insurance', permanent: true },
  };
}
export default function CryptoInsuranceRedirect() { return null; }
