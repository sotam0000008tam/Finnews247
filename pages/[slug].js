// pages/[slug].js (chỉ còn GSSP redirect)
export async function getServerSideProps({ params }) {
  const { readCat } = await import("../lib/serverCat");
  const all = readCat("crypto-market");
  const found = all.some((p) => p.slug === params.slug);
  if (found) {
    return {
      redirect: {
        destination: `/crypto-market/${params.slug}`,
        permanent: true,
      },
    };
  }
  return { notFound: true };
}
export default function _() { return null; }
