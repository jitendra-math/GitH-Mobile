import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// 1. Custom local font setup karo
const sfUiText = localFont({
  src: "./fonts/SFUIText-Regular.woff2", // Ensure karo ki path sahi ho
  variable: "--font-sf-ui", // Tailwind ke liye variable
  weight: "400",
  style: "normal",
  display: "swap",
});

// Setup viewport and theme color for mobile browsers
export const viewport: Viewport = {
  themeColor: "#F5F1EC",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// Setup manifest and apple-specific PWA tags
export const metadata: Metadata = {
  title: "GitHub Manager",
  description: "Manage your GitHub repositories using a PAT",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GH Manager",
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
      {/* 2. Variable aur font-sans dono lagao body par */}
      <body className={`${sfUiText.variable} font-sans bg-gray-50 text-gray-900 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
