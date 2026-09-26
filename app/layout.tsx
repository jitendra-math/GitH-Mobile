import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Local SF fallback font — used on browsers that don't have SF Pro.
// NOTE: Only regular weight is included. For best bold rendering on
// non-Apple devices, add SFUIText-Medium + SFUIText-Semibold woff2 files.
const sfUiText = localFont({
  src: "./fonts/SFUIText-Regular.woff2",
  variable: "--font-sf-ui",
  weight: "400",
  style: "normal",
  display: "swap",
});

// ============================================
// SITE CONSTANTS
// ============================================
const SITE_URL = "https://github.jssoriginals.com";
const SITE_NAME = "GitH Mobile";
const SITE_TITLE = "GitH Mobile — iOS-style GitHub manager for your phone";
const SITE_DESCRIPTION =
  "An iOS-style GitHub manager for your phone — edit files, commit changes, roll back history, and manage repositories without ever opening a browser. Free, open source, PWA-ready.";

// ============================================
// VIEWPORT
// ============================================
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F2F2F7" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  colorScheme: "light",
};

// ============================================
// METADATA — FULL SEO
// ============================================
export const metadata: Metadata = {
  // ----- Base -----
  metadataBase: new URL(SITE_URL),

  // ----- Title & Description -----
  title: {
    default: SITE_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,

  // ----- Application -----
  applicationName: SITE_NAME,
  generator: "Next.js",
  referrer: "origin-when-cross-origin",

  // ----- Keywords -----
  keywords: [
    "GitHub",
    "GitHub mobile",
    "GitHub manager",
    "GitHub client",
    "GitHub PWA",
    "edit GitHub files",
    "GitHub on phone",
    "manage repositories",
    "commit changes",
    "rollback GitHub",
    "iOS GitHub app",
    "GitHub Android app",
    "GitHub without browser",
    "open source GitHub manager",
    "GitH Mobile",
  ],

  // ----- Authors & Creator -----
  authors: [
    { name: "Jitendra Singh", url: "https://github.com/jitendra-math" },
  ],
  creator: "Jitendra Singh",
  publisher: "Jitendra Singh",

  // ----- Category -----
  category: "Developer Tools",
  classification: "Developer Tools, GitHub, Productivity",

  // ----- Canonical & Alternates -----
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
    },
  },

  // ----- Robots (default — override on specific pages) -----
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ----- Icons -----
  icons: {
    icon: [
      { url: "/logo-192.png", sizes: "192x192", type: "image/png" },
      { url: "/logo-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/logo-192.png", sizes: "192x192", type: "image/png" }],
    shortcut: ["/logo-192.png"],
  },

  // ----- PWA Manifest -----
  manifest: "/manifest.json",

  // ----- Apple Web App -----
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GitH",
    startupImage: ["/logo-512.png"],
  },

  // ----- Format Detection -----
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },

  // ----- Open Graph (WhatsApp, Facebook, LinkedIn, Telegram, etc.) -----
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GitH Mobile — iOS-style GitHub manager for your phone",
        type: "image/png",
      },
    ],
  },

  // ----- Other Meta Tags -----
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "GitH Mobile",
    "application-name": "GitH Mobile",
    "msapplication-TileColor": "#F2F2F7",
    "msapplication-config": "/browserconfig.xml",
    "theme-color": "#F2F2F7",
  },

  // ----- Verification (add if you have Google Search Console) -----
  // verification: {
  //   google: "your-google-site-verification-code",
  // },
};

// ============================================
// JSON-LD STRUCTURED DATA
// ============================================
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "GitH Mobile",
  alternateName: "GitH",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Android, Web, iOS",
  browserRequirements: "Requires JavaScript. Works best on Chrome.",
  softwareVersion: "0.1.0",
  releaseNotes: "Initial public release",
  datePublished: "2026-09-25",
  license: "https://opensource.org/licenses/MIT",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "Jitendra Singh",
    url: "https://github.com/jitendra-math",
  },
  publisher: {
    "@type": "Person",
    name: "Jitendra Singh",
  },
  screenshot: [
    `${SITE_URL}/screenshots/dashboard.jpg`,
    `${SITE_URL}/screenshots/repo-info.jpg`,
    `${SITE_URL}/screenshots/edit-modal.jpg`,
    `${SITE_URL}/screenshots/upload-files.jpg`,
  ],
  featureList: [
    "iOS-native design",
    "File editor with syntax highlighting",
    "Commit and rollback",
    "Bulk operations",
    "Built-in terminal",
    "PWA installable",
  ],
  softwareHelp: {
    "@type": "CreativeWork",
    url: "https://github.com/jitendra-math/GitH-Mobile",
  },
  codeRepository: "https://github.com/jitendra-math/GitH-Mobile",
};

// ============================================
// ROOT LAYOUT
// ============================================
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${sfUiText.variable} font-sans bg-[#F2F2F7] text-black min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  );
}