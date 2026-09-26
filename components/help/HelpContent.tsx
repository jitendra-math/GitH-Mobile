"use client";

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

import HelpPage from "./HelpPage";
import type { HelpSectionData } from "./HelpPage";

import SectionGettingStarted from "./sections/SectionGettingStarted";
import SectionDashboard from "./sections/SectionDashboard";
import SectionRepoManagement from "./sections/SectionRepoManagement";
import SectionFileEditing from "./sections/SectionFileEditing";
import SectionBulkOps from "./sections/SectionBulkOps";
import SectionFileUpload from "./sections/SectionFileUpload";
import SectionTerminal from "./sections/SectionTerminal";
import SectionCommitHistory from "./sections/SectionCommitHistory";
import SectionSecurity from "./sections/SectionSecurity";
import SectionTroubleshooting from "./sections/SectionTroubleshooting";
import SectionFAQ from "./sections/SectionFAQ";
import SectionTips from "./sections/SectionTips";
import SectionGlossary from "./sections/SectionGlossary";
import SectionLimits from "./sections/SectionLimits";

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

export default function HelpContent() {
  return <HelpPage sections={sections} />;
}