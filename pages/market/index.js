import { useEffect } from "react";
import { useRouter } from "next/router";

export default function MarketRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/crypto-market");
  }, [router]);

  return null;
}
