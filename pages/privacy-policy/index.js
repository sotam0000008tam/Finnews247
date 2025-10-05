/** Page-level safety redirect for legacy /privacy-policy route */
export async function getServerSideProps() {
  return { redirect: { destination: '/privacy', permanent: true } };
}
export default function PrivacyPolicyRedirect(){ return null; }
