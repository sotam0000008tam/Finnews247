export async function getServerSideProps({ params }) {
  const tail = Array.isArray(params?.slug) ? params.slug.join('/') : '';
  return {
    redirect: {
      destination: tail ? `/crypto-exchanges/${tail}` : '/crypto-exchanges',
      permanent: true,
    },
  };
}
export default function ExchangesRedirect(){ return null; }
