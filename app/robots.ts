import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aurora.example.com";
  const origin = new URL(base).origin;
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/login"],
    },
    sitemap: `${origin}/sitemap.xml`,
  };
}
