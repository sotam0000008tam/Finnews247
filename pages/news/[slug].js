// pages/news/[slug].js
export default function NewsRedirect() {
  return null;
}

export async function getServerSideProps({ params }) {
  // Giữ một bản canonical duy nhất: /<slug>
  return {
    redirect: {
      destination: `/${params.slug}`,
      permanent: true, // 301
    },
  };
}
