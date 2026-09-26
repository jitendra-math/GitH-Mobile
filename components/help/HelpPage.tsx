"use client";

import { useState, useMemo } from "react";
import HelpHero from "./HelpHero";
import HelpTOC from "./HelpTOC";
import HelpSection from "./HelpSection";
import HelpFooter from "./HelpFooter";
import type { LucideIcon } from "lucide-react";

export interface HelpSectionData {
  id: string;
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  defaultOpen?: boolean;
  content: React.ReactNode;
}

interface HelpPageProps {
  sections: HelpSectionData[];
}

export default function HelpPage({ sections }: HelpPageProps) {
  const [query, setQuery] = useState("");
  const [isMobileTOCOpen, setIsMobileTOCOpen] = useState(false);

  const matches = (s: HelpSectionData) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      (s.subtitle?.toLowerCase().includes(q) ?? false) ||
      s.id.toLowerCase().includes(q)
    );
  };

  const matchCount = useMemo(
    () => sections.filter(matches).length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sections, query]
  );

  return (
    <div className="min-h-screen bg-[#F2F2F7]">
      <HelpHero
        query={query}
        setQuery={setQuery}
        matchCount={matchCount}
        totalCount={sections.length}
        onOpenTOC={() => setIsMobileTOCOpen(true)}
      />

      <div className="max-w-screen-md mx-auto px-4 pb-12 flex gap-6">
        {/* Desktop TOC */}
        <aside className="hidden md:block w-[200px] shrink-0">
          <HelpTOC sections={sections} query={query} />
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {matchCount === 0 && query.trim() ? (
            <div className="bg-white rounded-2xl py-12 px-4 text-center">
              <p className="text-[15px] text-black font-medium">
                No results for &quot;{query}&quot;
              </p>
              <p className="text-[13px] text-[#8E8E93] mt-1">
                Try a different keyword or clear your search.
              </p>
              <button
                onClick={() => setQuery("")}
                className="mt-4 text-[15px] text-[#007AFF] font-semibold active:opacity-60 transition-opacity"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {sections.map((s) => (
                <div key={s.id} className={matches(s) ? "" : "hidden"}>
                  <HelpSection
                    id={s.id}
                    icon={s.icon}
                    title={s.title}
                    subtitle={s.subtitle}
                    defaultOpen={s.defaultOpen}
                    forceOpen={!!query.trim() && matches(s)}
                  >
                    {s.content}
                  </HelpSection>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <HelpFooter />

      {/* Mobile TOC Drawer */}
      <HelpTOC
        sections={sections}
        query={query}
        isMobile
        isOpen={isMobileTOCOpen}
        onClose={() => setIsMobileTOCOpen(false)}
      />
    </div>
  );
}