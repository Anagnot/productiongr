import type { MetadataRoute } from "next";
import { CHANNELS, PRODUCTS } from "@/lib/catalog";
import { SITE_URL } from "@/lib/seo";
import { LOCALES, localizedHref, type Locale } from "@/lib/i18n";
import { HREFLANG_MAP } from "@/lib/seo";

const ROUTES: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" },
  ...PRODUCTS.map((p) => ({
    path: `/services/${p.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  })),
  { path: "/channels", priority: 0.9, changeFrequency: "monthly" },
  ...CHANNELS.map((c) => ({
    path: `/channels/${c.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  })),
  { path: "/portfolio", priority: 0.9, changeFrequency: "weekly" },
  { path: "/portfolio/coca-cola-summer-endcap", priority: 0.6, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
  { path: "/quote", priority: 0.8, changeFrequency: "monthly" },
  { path: "/sitemap", priority: 0.3, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/cookies", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];
  for (const route of ROUTES) {
    for (const locale of LOCALES as readonly Locale[]) {
      const url = `${SITE_URL}${localizedHref(route.path, locale)}`;
      const languages: Record<string, string> = {};
      for (const alt of LOCALES as readonly Locale[]) {
        languages[HREFLANG_MAP[alt]] = `${SITE_URL}${localizedHref(route.path, alt)}`;
      }
      entries.push({
        url,
        lastModified,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: { languages },
      });
    }
  }
  return entries;
}
