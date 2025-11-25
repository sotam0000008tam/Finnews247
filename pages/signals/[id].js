// pages/signals/[id].js
// Individual trading signal pages have been disabled for brand safety reasons.
// Redirect all traffic to the homepage.

export default function SignalRedirect() {
  return null;
}

export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
}
