// pages/economy/index.js

export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/", // đổi hướng về Home (hoặc trang bạn muốn)
      permanent: false,
    },
  };
}

export default function EconomyRedirect() {
  return null;
}
