import type { MetadataRoute } from "next";
import { getAllArticleSlugs } from "@/lib/articles/server";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aurora.example.com";
  const origin = new URL(base).origin;
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    { url: `${origin}/es`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${origin}/en`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${origin}/es/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${origin}/en/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
  ];

  const slugs = await getAllArticleSlugs();
  for (const slug of slugs) {
    entries.push({
      url: `${origin}/es/blog/${encodeURIComponent(slug)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
    entries.push({
      url: `${origin}/en/blog/${encodeURIComponent(slug)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  return entries;
}
