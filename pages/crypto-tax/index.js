export async function getServerSideProps() {
  return { redirect: { destination: '/tax', permanent: true } };
}
export default function CryptoTaxIndexRedirect(){ return null; }
