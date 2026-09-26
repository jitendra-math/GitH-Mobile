import type { Metadata } from "next";
import {
  Rocket,
  LayoutDashboard,
  Settings,
  FileCode2,
  CopyCheck,
  UploadCloud,
  Terminal,
  History,
  Shield,
  Wrench,
  HelpCircle,
  Lightbulb,
  BookOpen,
  Gauge,
} from "lucide-react";

import HelpPage from "@/components/help/HelpPage";
import type { HelpSectionData } from "@/components/help/HelpPage";

import SectionGettingStarted from "@/components/help/sections/SectionGettingStarted";
import SectionDashboard from "@/components/help/sections/SectionDashboard";
import SectionRepoManagement from "@/components/help/sections/SectionRepoManagement";
import SectionFileEditing from "@/components/help/sections/SectionFileEditing";
import SectionBulkOps from "@/components/help/sections/SectionBulkOps";
import SectionFileUpload from "@/components/help/sections/SectionFileUpload";
import SectionTerminal from "@/components/help/sections/SectionTerminal";
import SectionCommitHistory from "@/components/help/sections/SectionCommitHistory";
import SectionSecurity from "@/components/help/sections/SectionSecurity";
import SectionTroubleshooting from "@/components/help/sections/SectionTroubleshooting";
import SectionFAQ from "@/components/help/sections/SectionFAQ";
import SectionTips from "@/components/help/sections/SectionTips";
import SectionGlossary from "@/components/help/sections/SectionGlossary";
import SectionLimits from "@/components/help/sections/SectionLimits";

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
// SECTIONS
// ============================================
const sections: HelpSectionData[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    subtitle: "Create a PAT, install the PWA, and sign in",
    icon: Rocket,
    defaultOpen: true,
    content: <SectionGettingStarted />,
  },
  {
    id: "dashboard",
    title: "Dashboard",
    subtitle: "Browse, sort, and manage your repositories",
    icon: LayoutDashboard,
    content: <SectionDashboard />,
  },
  {
    id: "repo-management",
    title: "Repository Management",
    subtitle: "Rename, edit description, change visibility, delete",
    icon: Settings,
    content: <SectionRepoManagement />,
  },
  {
    id: "file-editing",
    title: "File Editing",
    subtitle: "Browse the tree, edit files, and use the code editor",
    icon: FileCode2,
    content: <SectionFileEditing />,
  },
  {
    id: "bulk-operations",
    title: "Bulk Operations",
    subtitle: "Copy or create multiple files at once",
    icon: CopyCheck,
    content: <SectionBulkOps />,
  },
  {
    id: "file-upload",
    title: "File Upload",
    subtitle: "Drag & drop or browse to add files",
    icon: UploadCloud,
    content: <SectionFileUpload />,
  },
  {
    id: "terminal",
    title: "Terminal",
    subtitle: "Run mkdir and mv commands with a real terminal",
    icon: Terminal,
    content: <SectionTerminal />,
  },
  {
    id: "commit-history",
    title: "Commit & History",
    subtitle: "Review the queue, commit, and roll back",
    icon: History,
    content: <SectionCommitHistory />,
  },
  {
    id: "security",
    title: "Security & Privacy",
    subtitle: "How your token and data are handled",
    icon: Shield,
    content: <SectionSecurity />,
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    subtitle: "Fix common errors and issues",
    icon: Wrench,
    content: <SectionTroubleshooting />,
  },
  {
    id: "faq",
    title: "FAQ",
    subtitle: "Quick answers to common questions",
    icon: HelpCircle,
    content: <SectionFAQ />,
  },
  {
    id: "tips",
    title: "Tips & Workflows",
    subtitle: "Power-user tricks and best practices",
    icon: Lightbulb,
    content: <SectionTips />,
  },
  {
    id: "glossary",
    title: "Glossary",
    subtitle: "GitHub and Git terms explained",
    icon: BookOpen,
    content: <SectionGlossary />,
  },
  {
    id: "limits",
    title: "Limits & Restrictions",
    subtitle: "API rate limits, file sizes, and quotas",
    icon: Gauge,
    content: <SectionLimits />,
  },
];

// ============================================
// HELP ROUTE
// ============================================
export default function HelpRoute() {
  return <HelpPage sections={sections} />;
}