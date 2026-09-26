"use client";

import Link from "next/link";
import { ArrowLeft, Menu } from "lucide-react";
import HelpSearch from "./HelpSearch";

interface HelpHeroProps {
  query: string;
  setQuery: (q: string) => void;
  matchCount: number;
  totalCount: number;
  onOpenTOC: () => void;
}

export default function HelpHero({
  query,
  setQuery,
  matchCount,
  totalCount,
  onOpenTOC,
}: HelpHeroProps) {
  return (
    <header className="w-full bg-[#F2F2F7] border-b border-[#C6C6C8]/30">
      <div className="max-w-screen-md mx-auto px-4 pt-4 pb-4">
        {/* Top Row: Back + Contents (mobile) */}
        <div className="flex items-center justify-between mb-3">
          <Link
            href="/"
            className="flex items-center gap-1 text-[#007AFF] text-[16px] font-medium active:opacity-60 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2.4} />
            Home
          </Link>

          <button
            onClick={onOpenTOC}
            className="md:hidden flex items-center gap-1.5 text-[#007AFF] text-[15px] font-medium active:opacity-60 transition-opacity"
            aria-label="Open table of contents"
          >
            <Menu className="w-5 h-5" strokeWidth={2.4} />
            Contents
          </button>
        </div>

        {/* Title */}
        <h1 className="text-[28px] font-bold text-black tracking-tight leading-tight">
          Help &amp; Documentation
        </h1>
        <p className="text-[14px] text-[#8E8E93] mt-1 leading-snug">
          Everything you need to master GitH Mobile.
        </p>

        {/* Search */}
        <div className="mt-4">
          <HelpSearch
            query={query}
            setQuery={setQuery}
            matchCount={matchCount}
            totalCount={totalCount}
          />
        </div>
      </div>
    </header>
  );
}