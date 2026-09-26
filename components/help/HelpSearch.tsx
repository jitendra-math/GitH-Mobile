"use client";

import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

interface HelpSearchProps {
  query: string;
  setQuery: (q: string) => void;
  matchCount: number;
  totalCount: number;
}

export default function HelpSearch({
  query,
  setQuery,
  matchCount,
  totalCount,
}: HelpSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcuts: "/" to focus, Esc to blur+clear
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      if (e.key === "/") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const isSearching = query.trim().length > 0;

  return (
    <div>
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#8E8E93] pointer-events-none"
          strokeWidth={2.4}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setQuery("");
              inputRef.current?.blur();
            }
          }}
          placeholder="Search help…"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="search"
          className="w-full pl-10 pr-10 py-2.5 bg-white rounded-[10px] text-[15px] text-black placeholder:text-[#8E8E93] outline-none focus:ring-2 focus:ring-[#007AFF66] transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-black/[0.06] text-[#8E8E93] active:bg-black/10 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2.6} />
          </button>
        )}
      </div>

      {isSearching && (
        <p className="text-[12px] text-[#8E8E93] mt-2 px-1">
          {matchCount === 0
            ? "No results found"
            : `${matchCount} of ${totalCount} section${
                totalCount === 1 ? "" : "s"
              } shown`}
        </p>
      )}
    </div>
  );
}