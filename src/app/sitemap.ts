import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXTAUTH_URL || "https://ownwebify.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const demos = [
    "cafe",
    "restaurant",
    "salon",
    "fitness",
    "ecommerce",
    "real-estate",
    "photography",
    "clinic",
  ];

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/hire`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/demos`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  const demoPages: MetadataRoute.Sitemap = demos.map((demo) => ({
    url: `${BASE_URL}/demos/${demo}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...demoPages];
}
