// app/robots.ts
import type { MetadataRoute } from "next";
import { headers } from "next/headers";

function resolveBase(): string {
  const h = headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  const proto = h.get('x-forwarded-proto') ?? (host?.includes('localhost') ? 'http' : 'https');
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (host) return `${proto}://${host}`;
  return 'http://localhost:3000';
}

export default function robots(): MetadataRoute.Robots {
  const BASE = resolveBase();
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/admin", "/admin/*", "/api/*"] },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
