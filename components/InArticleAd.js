// components/InArticleAd.js
// A simple in‑article ad container.  When this component is rendered
// it injects a Google AdSense unit into the page and requests the
// adsbygoogle API to display an ad.  You must supply a valid
// `data-ad-slot` ID (as provided by your AdSense account) when
// instantiating this component.  The default styling centres the
// ad and adds spacing around it so that it blends in with your
// content.
import { useEffect } from "react";

export default function InArticleAd({ adSlot }) {
  // Notify AdSense to render the ad once the component mounts.
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // ignore if adsbygoogle is not available (e.g. during SSR)
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", textAlign: "center", margin: "1.5rem 0" }}
      data-ad-client="ca-pub-5515217135736755"
      // Replace the value below with your own AdSense slot ID.  Without a
      // valid slot ID the ad may not render.
      data-ad-slot={adSlot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}