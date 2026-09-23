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
  title: "GitHub Manager",
  description: "Manage your GitHub repositories using a PAT",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GH Manager",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icon-512x512.png",
    apple: "/icon-512x512.png",
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