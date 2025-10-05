export async function getServerSideProps() {
  return { redirect: { destination: '/crypto-exchanges', permanent: true } };
}
export default function ExchangesIndexRedirect(){ return null; }
