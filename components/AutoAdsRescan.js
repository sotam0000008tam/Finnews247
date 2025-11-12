import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AutoAdsRescan() {
  const router = useRouter();
  useEffect(() => {
    const pushAds = () => {
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch(e) {}
      setTimeout(() => { try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch(e) {} }, 1200);
    };
    // initial + on route changes
    pushAds();
    const onDone = () => pushAds();
    router.events.on("routeChangeComplete", onDone);
    return () => router.events.off("routeChangeComplete", onDone);
  }, []);
  return null;
}
