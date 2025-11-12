// components/AutoAdsRescan.js
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AutoAdsRescan() {
  const router = useRouter();

  useEffect(() => {
    const pushAds = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {}
      // Delay nhẹ để đảm bảo DOM nội dung đã render xong
      setTimeout(() => {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {}
      }, 1200);
    };

    // Kích hoạt ngay lần đầu vào app
    pushAds();

    // Mỗi lần đổi route trong Next.js (SPA)
    const onDone = () => pushAds();
    router.events.on("routeChangeComplete", onDone);

    // Cleanup
    return () => {
      router.events.off("routeChangeComplete", onDone);
    };
  }, [router.events]);

  return null;
}
