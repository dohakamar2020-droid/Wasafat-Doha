import type { MetadataRoute } from "next";
const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://wasafat-Doha.vercel.app";
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/kitchen"] }], sitemap: `${BASE}/sitemap.xml` };
}
