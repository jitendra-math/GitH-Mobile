const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      // GitHub API — always fresh, cached as backup
      {
        urlPattern: /^https:\/\/api\.github\.com\/.*/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "github-api",
          expiration: {
            maxEntries: 64,
            maxAgeSeconds: 60 * 5, // 5 minutes
          },
          networkTimeoutSeconds: 10,
        },
      },
      // GitHub user avatars
      {
        urlPattern: /^https:\/\/avatars\.githubusercontent\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "github-avatars",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          },
        },
      },
      // Local images
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "images",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30,
          },
        },
      },
      // Fonts
      {
        urlPattern: /\.(?:woff|woff2|ttf|otf|eot)$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "fonts",
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
          },
        },
      },
    ],
  },
});

// ============================================
// Reusable header blocks
// ============================================
const CACHE_IMMUTABLE = {
  key: "Cache-Control",
  value: "public, max-age=31536000, immutable",
};

// Public assets that are safe to expose cross-origin (logo, screenshots,
// fonts, icons, OG images, etc.). These are meant to be consumed by
// external tools (e.g. canvas/video generators, social embeds).
const CORS_PUBLIC = {
  key: "Access-Control-Allow-Origin",
  value: "*",
};

const CROSS_ORIGIN_RESOURCE_POLICY = {
  key: "Cross-Origin-Resource-Policy",
  value: "cross-origin",
};

// ============================================
// List of static public asset paths that need CORS
// ============================================
const PUBLIC_ASSET_PATHS = [
  "/logo-:size.png",
  "/logo.png",
  "/hero-banner.png",
  "/og-image.png",
  "/favicon.ico",
  "/browserconfig.xml",
  "/manifest.json",
  "/humans.txt",
  "/screenshots/:path*",
  "/fonts/:path*",
  "/.well-known/:path*",
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // ============================================
  // Security Headers (SEO + Trust Signals)
  // ============================================
  async headers() {
    const publicAssetHeaders = [
      CACHE_IMMUTABLE,
      CORS_PUBLIC,
      CROSS_ORIGIN_RESOURCE_POLICY,
    ];

    return [
      // --------------------------------------------
      // Global headers (all routes)
      // --------------------------------------------
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },

      // --------------------------------------------
      // Public assets — CORS enabled + long cache
      // (logo, screenshots, fonts, icons, og-image)
      // --------------------------------------------
      ...PUBLIC_ASSET_PATHS.map((source) => ({
        source,
        headers: publicAssetHeaders,
      })),

      // --------------------------------------------
      // Service Worker — never cached, no CORS
      // --------------------------------------------
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
    ];
  },
};

module.exports = withPWA(nextConfig);