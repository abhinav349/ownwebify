import { MetadataRoute } from "next";

import { SITE_URL as BASE_URL } from "@/lib/site";

// Fixed dates, not `new Date()`: a build-time timestamp claims every page
// changed on every deploy, which trains crawlers to ignore the signal.
// Bump the relevant constant when that section's content actually changes.
const MARKETING_UPDATED = new Date("2026-08-02");
const DEMOS_UPDATED = new Date("2026-08-02");

const demos = [
  "cafe",
  "restaurant",
  "salon",
  "fitness",
  "ecommerce",
  "real-estate",
  "photography",
  "clinic",
  "hotel",
  "law-firm",
  "interior-design",
  "spa",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: MARKETING_UPDATED,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: MARKETING_UPDATED,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/demos`,
      lastModified: DEMOS_UPDATED,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: MARKETING_UPDATED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/hire`,
      lastModified: MARKETING_UPDATED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // /login, /forgot-password and /setup-account are deliberately absent:
    // they're noindex, and listing a noindex URL in the sitemap sends
    // crawlers contradictory signals.
  ];

  const demoPages: MetadataRoute.Sitemap = demos.map((demo) => ({
    url: `${BASE_URL}/demos/${demo}`,
    lastModified: DEMOS_UPDATED,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...demoPages];
}
