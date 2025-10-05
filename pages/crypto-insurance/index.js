export async function getServerSideProps() {
  return { redirect: { destination: '/insurance', permanent: true } };
}
export default function CryptoInsuranceIndexRedirect(){ return null; }
