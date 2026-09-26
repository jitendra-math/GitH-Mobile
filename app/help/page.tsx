import type { Metadata } from "next";
import HelpContent from "@/components/help/HelpContent";

// ============================================
// SEO METADATA
// ============================================
export const metadata: Metadata = {
  title: "Help & Documentation",
  description:
    "Complete guide to GitH Mobile — learn how to create a PAT, install the PWA, edit files, commit changes, roll back history, and troubleshoot common issues. Everything you need in one place.",
  keywords: [
    "GitH Mobile help",
    "GitHub mobile guide",
    "how to use GitH Mobile",
    "GitHub PAT guide",
    "GitHub PWA tutorial",
    "GitHub mobile documentation",
    "create GitHub token",
    "GitHub on phone help",
    "GitHub mobile troubleshooting",
    "GitHub mobile FAQ",
  ],
  alternates: {
    canonical: "/help",
  },
  openGraph: {
    type: "article",
    title: "Help & Documentation · GitH Mobile",
    description:
      "Complete guide to GitH Mobile — PAT creation, PWA install, file editing, commits, rollback, security, and troubleshooting.",
    url: "/help",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GitH Mobile Help & Documentation",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Help & Documentation · GitH Mobile",
    description:
      "Everything you need to master GitH Mobile — from setup to advanced workflows.",
    images: ["/og-image.png"],
  },
};

// ============================================
// HELP ROUTE
// ============================================
export default function HelpRoute() {
  return <HelpContent />;
}