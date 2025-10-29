// pages/[slug].js
// Redirect từ /<slug> sang /crypto-market/<slug> nếu slug tồn tại trong crypto-market.
// Nếu không có thì trả 404.

export async function getServerSideProps({ params }) {
  const { readCat } = await import("../lib/serverCat");

  // Đọc danh sách bài trong chuyên mục crypto-market
  const all = readCat("crypto-market") || [];
  const found = Array.isArray(all) && all.some((p) => p?.slug === params.slug);

  if (found) {
    return {
      redirect: {
        destination: `/crypto-market/${params.slug}`,
        permanent: true,
      },
    };
  }

  // Không tìm thấy -> 404
  return { notFound: true };
}

// Component trống theo yêu cầu Pages Router
export default function Page() {
  return null;
}
