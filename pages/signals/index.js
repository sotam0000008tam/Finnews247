// pages/signals/index.js
// Public trading signals listing has been disabled for brand safety reasons.
// Redirect all traffic to the homepage.

export default function SignalsRedirect() {
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
