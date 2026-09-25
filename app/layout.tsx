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
};

export const metadata: Metadata = {
  title: "GitH Mobile",
  description:
    "An iOS-style GitHub manager for your phone — edit files, commit changes, roll back history, and manage repositories without ever opening a browser.",
  manifest: "/manifest.json",
  applicationName: "GitH Mobile",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GitH",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  icons: {
    icon: [
      { url: "/logo-192.png", sizes: "192x192", type: "image/png" },
      { url: "/logo-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/logo-192.png", sizes: "192x192", type: "image/png" }],
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sfUiText.variable} font-sans bg-[#F2F2F7] text-black min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  );
}