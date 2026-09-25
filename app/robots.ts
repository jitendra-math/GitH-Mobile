import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://github.jssoriginals.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/privacy", "/terms"],
        disallow: [
          "/dashboard",
          "/dashboard/",
          "/dashboard/*",
          "/api/",
          "/_next/",
        ],
      },
      // Block aggressive AI scrapers (optional)
      {
        userAgent: [
          "GPTBot",
          "CCBot",
          "ChatGPT-User",
          "Google-Extended",
        ],
        disallow: ["/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}