// components/BitmediaAd.js
import { useEffect, useRef } from "react";
import { BITMEDIA_CDN_HOSTS } from "./bitmediaUnits";

/**
 * Bitmedia ad renderer.
 *
 * Usage:
 *   <BitmediaAd unitId={BITMEDIA_UNITS.TOP} />
 */
export default function BitmediaAd({ unitId, className = "", style }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!unitId) return;
    const container = containerRef.current;
    if (!container) return;

    // Remove older scripts for this unit (important on Next.js route changes)
    document
      .querySelectorAll(`script[data-bm-unit="${unitId}"]`)
      .forEach((s) => s.remove());

    let hostIdx = 0;
    let disposed = false;

    const mount = () => {
      if (disposed) return;
      const s = document.createElement("script");
      s.async = true;
      s.dataset.bmUnit = unitId;
      s.src = `https://${BITMEDIA_CDN_HOSTS[hostIdx]}/js/${unitId}.js?v=${Date.now()}`;
      s.onerror = () => {
        s.remove();
        hostIdx += 1;
        if (hostIdx < BITMEDIA_CDN_HOSTS.length) mount();
      };
      container.appendChild(s);
      return s;
    };

    const scriptEl = mount();

    return () => {
      disposed = true;
      scriptEl?.remove();
    };
  }, [unitId]);

  return (
    <div ref={containerRef} className={className} style={style}>
      <ins
        className={unitId}
        style={{ display: "inline-block", width: "1px", height: "1px" }}
      />
    </div>
  );
}
